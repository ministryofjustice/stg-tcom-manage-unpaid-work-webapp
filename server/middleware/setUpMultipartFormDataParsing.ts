import { Router, ErrorRequestHandler } from 'express'
import multer, { MulterError } from 'multer'
import fs from 'fs'
import path from 'path'

export default function setUpMultipartFormDataParsing(): Router {
  const router = Router({ mergeParams: true })
  const uploadsDir = path.join(__dirname, '..', '..', 'assets', 'uploads')
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true, mode: 0o755 })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error creating uploads directory: ${error.message}`)
  }

  const storage = multer.diskStorage({
    destination(req, file, cb) {
      if (!fs.existsSync(uploadsDir)) {
        return cb(new Error(`Uploads directory does not exist: ${uploadsDir}`), null)
      }
      cb(null, uploadsDir)
      return true
    },
    filename(req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const ext = path.extname(file.originalname)
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
      cb(null, filename)
    },
  })

  const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    cb(null, true)
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  })

  router.use(upload.single('attachment'))
  router.use(uploadedFileTooLargeHandler)

  return router
}

const uploadedFileTooLargeHandler: ErrorRequestHandler = (err: Error, req, res, next): void => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'The selected file must be smaller than 10MB' })
  }
  return next(err)
}
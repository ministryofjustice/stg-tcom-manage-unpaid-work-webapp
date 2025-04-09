import { Request, Response, NextFunction, Router, ErrorRequestHandler } from 'express'
import multer, { MulterError } from 'multer'
import flash from 'connect-flash'
import path from 'path'
import fs from 'fs'

interface FileUploadRequest extends Request {
  uploadDir?: string
}

export default function setUpMultipartFormDataParsing(allowMultiple = false): Router {
  const router = Router({ mergeParams: true })

  router.use(setUpSessionUploadsDir)

  const storage = multer.diskStorage({
    destination(req: FileUploadRequest, file, cb) {
      if (!fs.existsSync(req.uploadDir)) {
        return cb(new Error(`Uploads directory does not exist: ${req.uploadDir}`), null)
      }
      cb(null, req.uploadDir)
      return true
    },
    filename(req, file, cb) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
      const ext = path.extname(file.originalname)
      const filename = `${file.fieldname}-${uniqueSuffix}${ext}`
      cb(null, filename)
    },
  })

  const fileFilter = (req: FileUploadRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    cb(null, true)
  }

  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  })

  router.use(flash())

  if (allowMultiple) {
    router.use(upload.array('attachments', 3))
  } else {
    router.use(upload.single('attachment'))
  }

  router.use(uploadedFileTooLargeHandler)

  return router
}

const uploadedFileTooLargeHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (err instanceof MulterError && err.code === 'LIMIT_FILE_SIZE') {
    req.flash('error', 'The selected file must be smaller than 2MB')
    res.redirect(req.originalUrl)
    return
  }
  next(err)
}

const setUpSessionUploadsDir = (req: FileUploadRequest, res: Response, next: NextFunction): void => {
  if (!req.session.user_id) {
    req.flash('error', 'User ID is not defined in session')
    res.redirect(req.originalUrl)
    return
  }
  const uploadDir = path.join(__dirname, '..', '..', 'assets', 'uploads', req.session.user_id)
  try {
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true, mode: 0o755 })
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error creating uploads directory: ${error.message}`)
  }

  req.uploadDir = uploadDir
  next()
}

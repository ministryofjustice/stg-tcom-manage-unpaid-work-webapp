import { type RequestHandler, Router } from 'express'
import fs from 'fs'
import pathModule from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index')
  })

  // this is a route that is also defined in hmpps auth middleware so beware of future clashes when that gets included.
  get('/sign-out', async (req, res, next) => {
    const uploadDir = pathModule.join(__dirname, '..', '..', 'assets', 'uploads', req.session.user_id)
    if (fs.existsSync(uploadDir)) {
      await fs.promises.rmdir(uploadDir, { recursive: true })
    }
    req.session.destroy(() => res.redirect('/'))
  })

  return router
}

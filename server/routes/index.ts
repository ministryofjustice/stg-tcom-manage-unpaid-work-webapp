import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import popRoutes from './popRoutes'
import adminRoutes from './adminRoutes'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index')
  })

  router.use('/pop', popRoutes())

  // Auth routes
  router.use('/admin', adminRoutes())

  return router
}

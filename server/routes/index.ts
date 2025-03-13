import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

import adminRoutes from './adminRoutes'
import authRoutes from './authRoutes'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index')
  })

  // this is a route that is also defined in hmpps auth middleware so beware of future clashes when that gets included.
  get('/sign-out', async (req, res, next) => {
    req.session.destroy(() => res.redirect('/'))
  })

  // Auth routes
  router.use('/admin', adminRoutes())
  router.use('/auth', authRoutes())

  return router
}

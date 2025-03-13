import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { encryptPassword } from '../middleware/basicAuthentication'

export default function adminRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/password', async (req, res, next) => {
    const returnURL = req.query.returnURL || '/'
    const { error } = req.query
    res.render('pages/prototype-admin/password', { returnURL, error })
  })

  const password = process.env.POC_PASSWORD

  // Check authentication password
  post('/password', async (req, res, next) => {
    const submittedPassword = req.body.password
    const { returnURL } = req.body
    if (submittedPassword === password) {
      res.cookie('authentication', encryptPassword(password), {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: 'none', // Allows GET and POST requests from other domains
        httpOnly: true,
        secure: true,
      })
      res.redirect(returnURL)
    } else {
      res.redirect(`/admin/password?error=wrong-password&returnURL=${encodeURIComponent(returnURL)}`)
    }
  })

  return router
}

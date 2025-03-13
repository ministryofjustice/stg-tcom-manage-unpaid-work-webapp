import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function authRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/enter-email-address', async (req, res, next) => {
    res.render('pages/auth-login/enter-email-address')
  })

  post('/enter-email-address', async (req, res, next) => {
    const { emailAddress } = req.body
    res.redirect(`/auth/verify-security-code?email=${encodeURIComponent(emailAddress)}`)
  })

  get('/verify-security-code', async (req, res, next) => {
    const { email } = req.query
    res.render('pages/auth-login/verify-security-code', { email })
  })

  return router
}

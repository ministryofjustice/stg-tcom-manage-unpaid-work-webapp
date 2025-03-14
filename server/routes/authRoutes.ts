import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function authRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/enter-email-address', async (req, res, next) => {
    res.render('pages/one-login/enter-email-address')
  })

  post('/enter-email-address', async (req, res, next) => {
    const { emailAddress } = req.body
    res.redirect(`/one-login/verify-security-code?email=${encodeURIComponent(emailAddress)}`)
  })

  get('/verify-security-code', async (req, res, next) => {
    const { email } = req.query
    res.render('pages/one-login/verify-security-code', { email })
  })

  post('/verify-security-code', async (req, res, next) => {
    res.redirect('/one-login/create-password')
  })

  get('/create-password', async (req, res, next) => {
    res.render('pages/one-login/create-password')
  })

  post('/create-password', async (req, res, next) => {
    res.redirect('/one-login/get-security-code')
  })

  get('/get-security-code', async (req, res, next) => {
    res.render('pages/one-login/get-security-code')
  })
  post('/get-security-code', async (req, res, next) => {
    res.redirect('/one-login/enter-phone-number')
  })

  get('/enter-phone-number', async (req, res, next) => {
    res.render('pages/one-login/enter-phone-number')
  })

  get('/check-phone', async (req, res, next) => {
    res.render('pages/one-login/check-phone')
  })

  post('/check-phone', async (req, res, next) => {
    res.render('pages/one-login/account-created')
  })

  get('/account-created', async (req, res, next) => {
    res.render('pages/one-login/account-created')
  })

  get('/enter-password', async (req, res, next) => {
    res.render('pages/one-login/enter-password')
  })

  return router
}

import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function authRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/one-login/sign-in-or-create')
  })

  post('/sign-in-or-create', async (req, res, next) => {
    const { optionSelected } = req.body
    if (optionSelected === 'create') {
      res.redirect('/one-login/enter-email-address')
    } else {
      res.redirect('/one-login/enter-email-address-login')
    }
  })

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

  post('/enter-phone-number', async (req, res, next) => {
    res.redirect('/one-login/check-phone')
  })

  get('/check-phone', async (req, res, next) => {
    res.render('pages/one-login/check-phone')
  })

  post('/check-phone', async (req, res, next) => {
    res.redirect('/one-login/account-created')
  })

  get('/account-created', async (req, res, next) => {
    res.render('pages/one-login/account-created')
  })

  post('/account-created', async (req, res, next) => {
    res.redirect('/pop')
  })

  get('/enter-email-address-login', async (req, res, next) => {
    res.render('pages/one-login/enter-email-address-login')
  })

  post('/enter-email-address-login', async (req, res, next) => {
    res.redirect('/one-login/enter-password')
  })

  get('/enter-password', async (req, res, next) => {
    res.render('pages/one-login/enter-password')
  })
  post('/enter-password', async (req, res, next) => {
    res.redirect('/one-login/check-phone-login')
  })

  get('/check-phone-login', async (req, res, next) => {
    res.render('pages/one-login/check-phone-login')
  })

  post('/check-phone-login', async (req, res, next) => {
    res.redirect('/pop')
  })

  return router
}

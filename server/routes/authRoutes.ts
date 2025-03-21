import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function authRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    if (req.session.is_pop_login) {
      return res.redirect('/pop')
    }
    return res.render('pages/one-login/sign-in-or-create')
  })

  post('/sign-in-or-create', async (req, res, next) => {
    const { optionSelected } = req.body
    if (optionSelected === 'create') {
      return res.redirect('/one-login/enter-email-address')
    }
    return res.redirect('/one-login/enter-email-address-login')
  })

  get('/enter-email-address', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-email-address', { errorMessage })
  })

  post('/enter-email-address', async (req, res, next) => {
    const { email } = req.body
    if (!email.endsWith('@example.com')) {
      req.session.errorMessage = 'You must enter a valid email address with example.com domain'
      return res.redirect('/one-login/enter-email-address')
    }
    return res.redirect(`/one-login/verify-security-code?email=${encodeURIComponent(email)}`)
  })

  get('/verify-security-code', async (req, res, next) => {
    const { email } = req.query
    if (!email) {
      return res.redirect('/one-login/enter-email-address')
    }
    const { errorMessage } = req.session
    delete req.session.errorMessage
    return res.render('pages/one-login/verify-security-code', { email, errorMessage })
  })

  post('/verify-security-code', async (req, res, next) => {
    const { code } = req.body
    const email = req.query.email || req.body.email
    if (code !== process.env.VALID_OTP) {
      req.session.errorMessage = 'Invalid OTP code. Please try again.'
      const { errorMessage } = req.session
      delete req.session.errorMessage
      return res.render('pages/one-login/verify-security-code', { email, errorMessage })
    }
    return res.redirect('/one-login/create-password')
  })

  get('/create-password', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/create-password', { errorMessage })
  })

  post('/create-password', async (req, res, next) => {
    const { password, confirmPassword } = req.body
    if (password !== confirmPassword) {
      req.session.errorMessage = 'Passwords do not match. Please try again.'
      return res.redirect('/one-login/create-password')
    }
    if (password.length < 8) {
      req.session.errorMessage = 'Password must be at least 6 characters long. Please try again.'
      return res.redirect('/one-login/create-password')
    }
    return res.redirect('/one-login/enter-phone-number')
  })

  get('/enter-phone-number', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-phone-number', { errorMessage })
  })

  post('/enter-phone-number', async (req, res, next) => {
    const { phoneNumber, hasInternationalPhoneNumber, internationalPhoneNumber } = req.body
    let errorMessage = null

    if (hasInternationalPhoneNumber && !internationalPhoneNumber) {
      errorMessage = 'You must enter an international phone number.'
    } else if (!hasInternationalPhoneNumber && !phoneNumber) {
      errorMessage = 'You must enter a UK mobile phone number.'
    }

    if (errorMessage) {
      req.session.errorMessage = errorMessage
      return res.redirect('/one-login/enter-phone-number')
    }

    return res.redirect('/one-login/get-security-code')
  })

  get('/get-security-code', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/get-security-code', { errorMessage })
  })

  post('/get-security-code', async (req, res, next) => {
    const { 'choose-security-codes': chooseSecurityCodes } = req.body
    let errorMessage = null

    if (!chooseSecurityCodes) {
      errorMessage = 'You must choose a method to get code.'
    }

    if (errorMessage) {
      req.session.errorMessage = errorMessage
      return res.redirect('/one-login/get-security-code')
    }

    return res.redirect('/one-login/check-phone')
  })

  get('/check-phone', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/check-phone', { errorMessage })
  })

  post('/check-phone', async (req, res, next) => {
    const { otp } = req.body
    let errorMessage = null

    if (otp !== process.env.POP_LOGIN_OTP) {
      errorMessage = 'Invalid OTP code. Please try again.'
    }

    if (errorMessage) {
      req.session.errorMessage = errorMessage
      return res.redirect('/one-login/check-phone')
    }

    return res.redirect('/one-login/account-created')
  })

  get('/account-created', async (req, res, next) => {
    res.render('pages/one-login/account-created')
  })

  post('/account-created', async (req, res, next) => {
    req.session.is_pop_login = true
    return res.redirect('/pop')
  })

  get('/enter-email-address-login', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-email-address-login', { errorMessage })
  })

  post('/enter-email-address-login', async (req, res, next) => {
    const { email } = req.body
    if (!email.endsWith('@gov.uk')) {
      req.session.errorMessage = 'You must enter a valid email address with gov.uk domain'
      return res.redirect('/one-login/enter-email-address-login')
    }
    return res.redirect('/one-login/enter-password')
  })

  get('/enter-password', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/enter-password', { errorMessage })
  })
  post('/enter-password', async (req, res, next) => {
    const { password } = req.body

    if (password !== process.env.POP_PASSWORD) {
      req.session.errorMessage = 'Invalid password. Please try again.'
      return res.redirect('/one-login/enter-password')
    }
    return res.redirect('/one-login/check-phone-login')
  })

  get('/check-phone-login', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/one-login/check-phone-login', { errorMessage })
  })

  post('/check-phone-login', async (req, res, next) => {
    const { otp } = req.body
    if (otp !== process.env.POP_LOGIN_OTP) {
      req.session.errorMessage = 'Invalid OTP code. Please try again.'
      return res.redirect('/one-login/check-phone-login')
    }
    req.session.is_pop_login = true
    return res.redirect('/pop')
  })

  return router
}

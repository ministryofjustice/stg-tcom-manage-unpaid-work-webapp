import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import {
  renderSignInOrCreate,
  handleSignInOrCreate,
  renderEnterEmailAddress,
  handleEnterEmailAddress,
  renderVerifySecurityCode,
  handleVerifySecurityCode,
  renderCreatePassword,
  handleCreatePassword,
  renderEnterPhoneNumber,
  handleEnterPhoneNumber,
  renderGetSecurityCode,
  handleGetSecurityCode,
  renderCheckPhone,
  handleCheckPhone,
  renderAccountCreated,
  handleAccountCreated,
} from '../controllers/authController'

export default function authRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', renderSignInOrCreate)
  post('/sign-in-or-create', handleSignInOrCreate)
  get('/enter-email-address', renderEnterEmailAddress)
  post('/enter-email-address', handleEnterEmailAddress)
  get('/verify-security-code', renderVerifySecurityCode)
  post('/verify-security-code', handleVerifySecurityCode)
  get('/create-password', renderCreatePassword)
  post('/create-password', handleCreatePassword)
  get('/enter-phone-number', renderEnterPhoneNumber)
  post('/enter-phone-number', handleEnterPhoneNumber)
  get('/get-security-code', renderGetSecurityCode)
  post('/get-security-code', handleGetSecurityCode)
  get('/check-phone', renderCheckPhone)
  post('/check-phone', handleCheckPhone)
  get('/account-created', renderAccountCreated)
  post('/account-created', handleAccountCreated)
  get('/enter-email-address-login', renderEnterEmailAddress)
  post('/enter-email-address-login', handleEnterEmailAddress)
  get('/enter-password', renderEnterEmailAddress)
  post('/enter-password', handleEnterEmailAddress)
  get('/check-phone-login', renderCheckPhone)
  post('/check-phone-login', handleCheckPhone)

  return router
}

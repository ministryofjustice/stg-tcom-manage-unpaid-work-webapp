import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import {
  renderCases,
  renderVerifyPopPhoto,
  handleVerifyPopPhoto,
  renderVerifySuccess,
  renderVerifyReject,
} from '../controllers/staffController'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', renderCases)
  get('/verify-pop-photo', renderVerifyPopPhoto)
  post('/verify-pop-photo', handleVerifyPopPhoto)
  get('/verify-success', renderVerifySuccess)
  get('/verify-reject', renderVerifyReject)

  return router
}

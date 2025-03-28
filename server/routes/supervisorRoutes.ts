import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import {
  renderPlacements,
  renderViewPlacement,
  renderCheckIn,
  handleConfirmCheckIn,
  renderCheckOut,
  handleConfirmCheckOut,
  handleRemoveAttendee,
  handleMarkNoShow,
} from '../controllers/supervisorController'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', renderPlacements)
  get('/view-placement/:id', renderViewPlacement())
  get('/check-in/:placementId/:userId', renderCheckIn())
  post('/check-in/:placementId/:userId/confirm', handleConfirmCheckIn())
  get('/check-out/:placementId/:userId', renderCheckOut())
  post('/check-out/:placementId/:userId/confirm', handleConfirmCheckOut())
  get('/remove/:placementId/:userId', handleRemoveAttendee())
  get('/no-show/:placementId/:userId', handleMarkNoShow())

  return router
}

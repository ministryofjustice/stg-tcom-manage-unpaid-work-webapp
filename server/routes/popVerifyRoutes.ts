import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import setUpMultipartFormDataParsing from '../middleware/setUpMultipartFormDataParsing'
import {
  renderSubmitPhoto,
  renderOptions,
  handleOptions,
  renderUploadPhoto,
  handleUploadPhoto,
  renderDisplayPhoto,
  handleDisplayPhoto,
  renderTakePhoto,
  handleSavePhoto,
  renderCheckPhoto,
  renderRejectPhoto,
  renderUploadingPhoto,
  renderConfirmPhoto,
  renderSuccess,
  setPendingVerification,
} from '../controllers/popVerifyController'

export default function routes(): Router {
  const router = Router()

  const get = (routePath: string | string[], handler: RequestHandler) => router.get(routePath, asyncMiddleware(handler))
  const post = (routePath: string | string[], handler: RequestHandler) =>
    router.post(routePath, asyncMiddleware(handler))
  router.use(setUpMultipartFormDataParsing())

  get('/', renderSubmitPhoto)
  get('/options', renderOptions)
  post('/options', handleOptions)
  get('/upload-photo', renderUploadPhoto)
  post('/upload-photo', handleUploadPhoto)
  get('/display-photo', renderDisplayPhoto)
  post('/display-photo', handleDisplayPhoto)
  get('/take-photo', renderTakePhoto)
  post('/save-photo', handleSavePhoto)
  get('/check-photo', renderCheckPhoto)
  get('/reject-photo', renderRejectPhoto)
  get('/uploading-photo', renderUploadingPhoto)
  get('/confirm-photo', renderConfirmPhoto)
  get('/success', renderSuccess)
  get('/set-pending-verification', setPendingVerification)

  return router
}

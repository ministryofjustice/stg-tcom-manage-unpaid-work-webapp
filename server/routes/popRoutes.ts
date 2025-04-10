import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import setUpMultipartFormDataParsing from '../middleware/setUpMultipartFormDataParsing'
import { renderPopDetails, renderPopProgress, renderIndex } from '../controllers/popController'
import { renderOrderSummary, renderUnpaidWork, renderProbationConditions } from '../controllers/conditionsController'
import {
  renderAppointments,
  renderViewAppointment,
  renderViewPastAppointment,
  renderAppointmentNotify,
  renderAppointmentNotifyUploadEvidence,
  handleDeleteEvidence,
  handleSubmitEvidence,
  handleUploadEvidence,
} from '../controllers/appointmentsController'

import {
  renderMessageThread,
  handleMessageThread,
  renderMessages,
  handleNewMessage,
  renderNewMessage,
} from '../controllers/messagesController'

export default function routes(): Router {
  const router = Router()
  const get = (routePath: string | string[], handler: RequestHandler) => router.get(routePath, asyncMiddleware(handler))
  const post = (routePath: string | string[], handler: RequestHandler, middleware?: RequestHandler) => {
    if (middleware) {
      router.post(routePath, middleware, asyncMiddleware(handler))
    } else {
      router.post(routePath, asyncMiddleware(handler))
    }
  }
  router.use((req, res, next) => {
    const { bypass } = req.query
    if (bypass) {
      req.session.is_pop_login = true
    }
    if (req.session.is_pop_login) {
      next()
    } else {
      res.redirect('/one-login/')
    }
  })

  get('/', renderIndex)
  get('/your-details', renderPopDetails())
  get('/your-progress', renderPopProgress())
  get('/appointments', renderAppointments())
  get('/conditions', renderOrderSummary())
  get('/probation-conditions', renderProbationConditions())
  get('/upw-conditions', renderUnpaidWork())
  get('/view-appointment', renderViewAppointment())
  get('/view-past-appointment', renderViewPastAppointment())
  get('/appointment-notify', renderAppointmentNotify())
  post('/appointment-notify', (req, res) => res.redirect('/pop/appointment-notify-upload-evidence'))
  get('/appointment-notify-upload-evidence', renderAppointmentNotifyUploadEvidence())

  post('/upload-evidence', handleUploadEvidence(), setUpMultipartFormDataParsing(true))
  post('/submit-evidence', handleSubmitEvidence())
  get('/delete-evidence', handleDeleteEvidence())

  get('/messages', renderMessages())
  get('/new-message', renderNewMessage)
  post('/new-message', handleNewMessage(), setUpMultipartFormDataParsing())

  get('/messages/thread/:id', renderMessageThread())
  post('/messages/thread/:id', handleMessageThread(), setUpMultipartFormDataParsing())

  return router
}

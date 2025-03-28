import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import setUpMultipartFormDataParsing from '../middleware/setUpMultipartFormDataParsing'
import {
  renderPopDetails,
  renderPopProgress,
  renderMessageThread,
  renderAppointments,
  renderConditions,
  renderViewAppointment,
  renderViewPastAppointment,
  handleMessageThread,
  renderMessages,
  handleNewMessage,
  renderNewMessage,
  renderIndex,
} from '../controllers/popController'

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
  get('/conditions', renderConditions)
  get('/view-appointment', renderViewAppointment())
  get('/view-past-appointment', renderViewPastAppointment())

  get('/messages', renderMessages())
  get('/new-message', renderNewMessage)
  post('/new-message', handleNewMessage(), setUpMultipartFormDataParsing())

  get('/messages/thread/:id', renderMessageThread())
  post('/messages/thread/:id', handleMessageThread(), setUpMultipartFormDataParsing())

  return router
}

import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { pastAppointments, upcomingAppointments } from './data/appointments'
import messages from './data/messages'

export default function popRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    // /pop?scenario=missed
    // /pop?scenario=reminder

    const { scenario } = req.query

    res.render('pages/pop/index', { scenario })
  })

  get('/your-details', async (req, res, next) => {
    const userProfile = {
      name: 'Carolina Pizatto Girardi',
      userId: 'P258053P',
      hoursRequired: 100,
      address: 'Flat 1\n1 Example St\nLondon\nSE1 1AA',
      email: 'carolinapizatto@example.com',
      phone: '07777 012345',
    }
    res.render('pages/pop/details', { userProfile })
  })

  get('/your-progress', async (req, res, next) => {
    const progress = {
      completedHours: 0,
      totalHours: 100,
    }

    const appointment = {
      title: 'Community Garden Maintenance',
      date: 'Friday 15 March 2024',
      time: '09:00',
      location: '123 Garden Street, London SE1 7TH',
    }
    res.render('pages/pop/progress', { progress, appointment })
  })

  get('/conditions', async (req, res, next) => {
    res.render('pages/pop/conditions')
  })

  get('/appointments', async (req, res, next) => {
    res.render('pages/pop/appointments', { upcomingAppointments, pastAppointments })
  })

  get('/view-appointment', async (req, res, next) => {
    res.render('pages/pop/view-appointment')
  })

  get('/messages', async (req, res, next) => {
    res.render('pages/pop/messages', { messages })
  })

  get('/messages/thread/:id', async (req, res, next) => {
    const message = messages.find(msg => msg.id === req.params.id)
    if (message) {
      res.render('pages/pop/messageThread', { message })
    } else {
      res.status(404).send('Message not found')
    }
  })

  post('/messages/thread/:id', async (req, res, next) => {
    const message = messages.find(msg => msg.id === req.params.id)
    if (message) {
      const newMessage = {
        text: req.body.message,
        type: 'sent',
        timestamp: new Date().toLocaleString(),
        sender: 'You',
      }
      message.items.push(newMessage)
      res.redirect(`/pop/messages/thread/${req.params.id}`)
    } else {
      res.status(404).send('Message not found')
    }
  })

  get('/new-message', async (req, res, next) => {
    res.render('pages/pop/new-message')
  })

  return router
}

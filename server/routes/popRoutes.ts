import { type RequestHandler, Router } from 'express'
import path from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { pastAppointments, upcomingAppointments } from './data/appointments'
import messages from './data/messages'
import setUpMultipartFormDataParsing from '../middleware/setUpMultipartFormDataParsing'

export default function routes(): Router {
  const router = Router()
  const get = (routePath: string | string[], handler: RequestHandler) => router.get(routePath, asyncMiddleware(handler))
  const post = (routePath: string | string[], handler: RequestHandler) =>
    router.post(routePath, asyncMiddleware(handler))
  router.use(setUpMultipartFormDataParsing())

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
      res.render('pages/pop/messageThread', { message, error: req.flash('error') })
    } else {
      res.status(404).send('Message not found')
    }
  })

  post('/messages/thread/:id', async (req, res, next) => {
    const message = messages.find(msg => msg.id === req.params.id)
    if (message) {
      let messageText = req.body.message

      if (req.file) {
        try {
          const relativePath = `/assets/uploads/${req.session.user_id}/${path.basename(req.file.path)}`
          const attachmentLink = `<a href="${relativePath}" target="_blank">${req.file.originalname}</a>`
          messageText = messageText
            ? ` ${messageText}<br><br>Attachment: <br> ${attachmentLink}`
            : `Attachment: ${attachmentLink}`
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(`Error processing uploaded file: ${error.message}`)
        }
      }

      if (messageText || req.file) {
        const newMessage: Express.MessageItem = {
          html: messageText,
          type: 'sent',
          timestamp: new Date().toLocaleString(),
          sender: 'You',
        }
        message.items.push(newMessage as unknown as { html: string; type: string; timestamp: string; sender: string })
      }

      res.redirect(`/pop/messages/thread/${req.params.id}`)
    } else {
      res.status(404).send('Message not found')
    }
  })

  get('/new-message', async (req, res, next) => {
    res.render('pages/pop/new-message')
  })

  post('/new-message', async (req, res, next) => {
    res.redirect(`/pop/messages/thread/c8ab26a7-e4d3-4f78-82a2-98fec61e79e5`)
  })

  return router
}

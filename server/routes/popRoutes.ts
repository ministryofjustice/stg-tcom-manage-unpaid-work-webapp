import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function popRoutes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/pop/index')
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
    const pastAppointments = [
      {
        date: 'Thursday 20 Jan 2025',
        time: '10:00am',
        title: 'Probation appointment',
        location: '123 Garden Street, London SE1 7TH',
        contact: 'Karen Smith',
        contactLink: '/pop/new-message',
      },
      {
        date: 'Thursday 15 Jan 2025',
        time: '2:00pm',
        title: 'Probation appointment',
        location: 'National Probation Service, 235 Greenwich High Road, London SE10 8NB',
        contact: 'Julie Myers',
        contactLink: '',
      },
    ]

    const upcomingAppointments = [
      {
        date: 'Tuesday 18 March 2025',
        time: '10:00am',
        title: 'Community Garden Maintenance',
        location: '123 Garden Street, London SE1 7TH',
        contact: 'Karen Smith',
        contactLink: '',
        description:
          'Group session focused on weeding, planting seasonal vegetables, and general garden maintenance. Bring appropriate clothing for outdoor work, tools will be provided. Break times will be scheduled during the session.',
      },
      {
        date: 'Thursday 21 March 2025',
        time: '2:00pm',
        title: 'Probation appointment',
        location: 'National Probation Service, 235 Greenwich High Road, London SE10 8NB',
        contact: 'Julie Myers',
        contactLink: '',
        description:
          'Regular probation check-in to discuss progress, any issues faced, and upcoming milestones. Make sure to bring any requested documents or updates for the probation officer.',
      },
    ]

    res.render('pages/pop/appointments', { upcomingAppointments, pastAppointments })
  })

  get('/view-appointment', async (req, res, next) => {
    res.render('pages/pop/view-appointment')
  })

  get('/messages', async (req, res, next) => {
    const messages = [
      {
        subject: 'Missed appointment',
        date: '11 March 2024',
        description:
          'You failed to attend your scheduled probation appointment on 10 March 2024. This is a breach of your supervision requirements. Please contact your probation practitioner as soon as possible to discuss this matter.',
        id: '1',
        status: 'unread',
      },
      {
        subject: 'Message from your probation practitioner',
        date: '10 March 2024',
        description: 'Please contact me as soon as possible to discuss your progress.',
        id: '2',
        status: 'unread',
      },
      {
        subject: 'Documentation request from your probation practitioner',
        date: '10 March 2024',
        description:
          'Please provide documentation for your recent employment. This is required as part of your supervision conditions.',
        id: '3',
        status: 'unread',
      },
    ]

    res.render('pages/pop/messages', { messages })
  })

  get('/new-message', async (req, res, next) => {
    res.render('pages/pop/new-message')
  })

  return router
}

import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'
import { encryptPassword } from '../middleware/basicAuthentication'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index')
  })
  get('/pop', async (req, res, next) => {
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

    // const appointment = ""; // if no appointment

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

  // Render password page with a returnURL to redirect people to where they came from
  get('/admin/password', async (req, res, next) => {
    const returnURL = req.query.returnURL || '/'
    const { error } = req.query
    res.render('pages/prototype-admin/password', { returnURL, error })
  })

  const password = process.env.POC_PASSWORD

  // Check authentication password
  post('/admin/password', async (req, res, next) => {
    const submittedPassword = req.body.password
    const { returnURL } = req.body
    if (submittedPassword === password) {
      // see /middleware/basicAuthentication.js for explanation
      res.cookie('authentication', encryptPassword(password), {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        sameSite: 'none', // Allows GET and POST requests from other domains
        httpOnly: true,
        secure: true,
      })
      res.redirect(returnURL)
    } else {
      res.redirect(`/prototype-admin/password?error=wrong-password&returnURL=${encodeURIComponent(returnURL)}`)
    }
  })

  get('/appointments', async (req, res, next) => {
    const appointments = [
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
      {
        date: 'Thursday 27 Feb 2025',
        time: '2:00pm',
        title: 'Probation appointment',
        location: 'National Probation Service, Redfern Building, 30 Hanover Street, Manchester M4 4AH',
        contact: 'Julie Myers',
        contactLink: '',
        description:
          'Monthly probation meeting to review progress and discuss the next steps in rehabilitation. Consider if any assistance is needed from the probation team regarding employment or housing.',
      },
      {
        date: 'Thursday 27 Feb 2025',
        time: '2:00pm - 2:30pm',
        title: 'Community Garden Maintenance',
        location: '123 Garden Street, London SE1 7TH',
        contact: 'Karen Smith',
        contactLink: '',
        description:
          'Group session focused on weeding, planting seasonal vegetables, and general garden maintenance. Bring appropriate clothing for outdoor work, tools will be provided. Break times will be scheduled during the session.',
      },
      {
        date: 'Thursday 27 Feb 2025',
        time: '2:00pm - 2:30pm',
        title: 'Probation appointment',
        location: 'National Probation Service, Redfern Building, 30 Hanover Street, Manchester M4 4AH',
        contact: 'Julie Myers',
        contactLink: '/messages',
        description:
          'Monthly probation meeting to review progress and discuss the next steps in rehabilitation. Consider if any assistance is needed from the probation team regarding employment or housing.',
      },
    ]
    res.render('pages/pop/appointments', { appointments })
  })

  get('/view-appointment', async (req, res, next) => {
    res.render('pages/pop/view-appointment')
  })

  return router
}

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
    res.render('pages/pop/progress', { progress })
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

  return router
}

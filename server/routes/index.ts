import { type RequestHandler, Router } from 'express'

import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/index')
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
    res.render('pages/details', { userProfile })
  })

  get('/your-progress', async (req, res, next) => {
    const progress = {
      completedHours: 40,
      totalHours: 100,
    }
    res.render('pages/progress', { progress })
  })
  return router
}

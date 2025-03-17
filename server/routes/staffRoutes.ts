import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import placements from './data/staff-placements'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/staff/placements', { placements })
  })

  get('/view-placement', async (req, res, next) => {
    res.render('pages/staff/view-placement')
  })

  return router
}

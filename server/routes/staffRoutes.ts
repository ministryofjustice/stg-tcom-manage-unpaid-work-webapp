import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/staff/cases')
  })

  get('/verify-pop-photo', async (req, res, next) => {
    res.render('pages/staff/verify-pop-photo')
  })

  post('/verify-pop-photo', async (req, res, next) => {
    const { matchingPhoto } = req.body
    if (matchingPhoto === 'yes') {
      return res.redirect('/staff/verify-success')
    }
    if (matchingPhoto === 'no') {
      return res.redirect('/staff/verify-reject')
    }
    const errorMessage = 'An option must be selected below'
    return res.render('pages/staff/verify-pop-photo', { errorMessage })
  })

  get('/verify-success', async (req, res, next) => {
    res.render('pages/staff/verify-success')
  })

  get('/verify-reject', async (req, res, next) => {
    res.render('pages/staff/verify-reject')
  })

  return router
}

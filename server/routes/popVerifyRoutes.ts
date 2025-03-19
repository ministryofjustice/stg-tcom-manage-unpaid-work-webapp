import { type RequestHandler, Router } from 'express'
import path from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'
import setUpMultipartFormDataParsing from '../middleware/setUpMultipartFormDataParsing'

export default function routes(): Router {
  const router = Router()
  const get = (routePath: string | string[], handler: RequestHandler) => router.get(routePath, asyncMiddleware(handler))
  const post = (routePath: string | string[], handler: RequestHandler) =>
    router.post(routePath, asyncMiddleware(handler))
  router.use(setUpMultipartFormDataParsing())

  get('/', async (req, res, next) => {
    res.render('pages/pop-id/submit-photo')
  })

  get('/options', async (req, res, next) => {
    // re-showing previous choices on going back is a nice to have for a later iteration - use session stored values.
    res.render('pages/pop-id/options')
  })

  post('/options', async (req, res, next) => {
    const { option } = req.body
    req.session.idOption = option

    if (option === 'upload') {
      res.redirect(`/pop/verify/upload-photo`)
    }
    res.redirect(`/pop/verify/take-photo`)
  })

  get('/upload-photo', async (req, res, next) => {
    res.render('pages/pop-id/upload')
  })

  get('/take-photo', async (req, res, next) => {
    res.render('pages/pop-id/take-photo')
  })

  get('/confirm-photo', async (req, res, next) => {
    res.render('pages/pop-id/confirm-photo')
  })

  get('/reject-photo', async (req, res, next) => {
    res.render('pages/pop-id/reject-photo')
  })

  get('/success', async (req, res, next) => {
    res.render('pages/pop-id/success')
  })

  return router
}

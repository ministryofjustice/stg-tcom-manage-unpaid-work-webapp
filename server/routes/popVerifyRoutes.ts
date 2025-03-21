import { type RequestHandler, Router } from 'express'
import path from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'

export default function routes(): Router {
  const router = Router()
  const get = (routePath: string | string[], handler: RequestHandler) => router.get(routePath, asyncMiddleware(handler))
  const post = (routePath: string | string[], handler: RequestHandler) =>
    router.post(routePath, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/pop-id/submit-photo')
  })

  get('/options', async (req, res, next) => {
    // re-showing previous choices on going back is a nice to have for a later iteration - use session stored values.
    res.render('pages/pop-id/options', { selectedOption: req.session.idOption })
  })

  post('/options', async (req, res, next) => {
    const { option } = req.body
    req.session.idOption = option

    if (option === 'upload') {
      return res.redirect(`/pop/verify/upload-photo`)
    }
    return res.redirect(`/pop/verify/take-photo`)
  })

  get('/upload-photo', async (req, res, next) => {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/pop-id/upload-photo', { errorMessage })
  })

  post('/upload-photo', async (req, res, next) => {
    const { file } = req
    if (!file) {
      req.session.errorMessage = 'No file uploaded'
      return res.redirect('/pop/verify/upload-photo')
    }
    const relativePath = `/assets/uploads/${req.session.user_id}/${path.basename(file.path)}`

    req.session.verificationPhoto = relativePath
    return res.redirect('/pop/verify/display-photo')
  })

  get('/display-photo', async (req, res, next) => {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      return res.redirect(`/pop/verify/upload-photo`)
    }
    return res.render('pages/pop-id/display-photo', { verificationPhoto })
  })

  post('/display-photo', async (req, res, next) => {
    const { meetRules } = req.body
    if (meetRules === 'Adequate') {
      return res.redirect('/pop/verify/options')
    }
    return res.redirect('/pop/verify/checking-photo')
  })

  get('/take-photo', async (req, res, next) => {
    res.render('pages/pop-id/take-photo')
  })
  post('/take-photo', async (req, res, next) => {
    return res.redirect(`/pop/verify/confirm-photo`)
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

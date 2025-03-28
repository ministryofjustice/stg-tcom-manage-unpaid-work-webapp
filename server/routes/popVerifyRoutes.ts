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
      return res.redirect(`/pop/verify/options`)
    }
    return res.render('pages/pop-id/display-photo', { verificationPhoto })
  })

  post('/display-photo', async (req, res, next) => {
    const { meetRules } = req.body
    if (meetRules === 'WantAnotherOne') {
      return res.redirect('/pop/verify/options')
    }
    return res.redirect('/pop/verify/check-photo')
  })

  get('/take-photo', async (req, res, next) => {
    res.render('pages/pop-id/take-photo')
  })

  post('/save-photo', async (req, res, next) => {
    const { photo } = req.body
    if (photo) {
      req.session.verificationPhoto = photo
      res.json({ success: true })
    } else {
      res.status(400).json({ success: false, error: 'No photo' })
    }
  })

  get('/check-photo', async (req, res, next) => {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      return res.redirect(`/pop/verify/options`)
    }
    return res.render('pages/pop-id/check-photo', {
      autoRedirect: true,
      redirectUrl: '/pop/verify/reject-photo',
      redirectDelay: 2500,
      cspNonce: res.locals.cspNonce,
    })
  })

  get('/reject-photo', async (req, res, next) => {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      return res.redirect(`/pop/verify/options`)
    }
    return res.render('pages/pop-id/reject-photo', { verificationPhoto })
  })
  get('/uploading-photo', async (req, res, next) => {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      return res.redirect(`/pop/verify/options`)
    }
    return res.render('pages/pop-id/uploading-photo', {
      autoRedirect: true,
      redirectUrl: '/pop/verify/success',
      redirectDelay: 2500,
      cspNonce: res.locals.cspNonce,
    })
  })

  get('/confirm-photo', async (req, res, next) => {
    res.render('pages/pop-id/confirm-photo')
  })

  get('/success', async (req, res, next) => {
    res.render('pages/pop-id/success')
  })

  get('/set-pending-verification', async (req, res, next) => {
    req.session.popVerificationStatus = 'pending'
    req.session.is_pop_login = true
    res.redirect('/pop')
  })
  return router
}

import { RequestHandler } from 'express'
import path from 'path'

export const renderSubmitPhoto: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop-id/submit-photo')
  } catch (error) {
    next(error)
  }
}

export const renderOptions: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop-id/options', { selectedOption: req.session.idOption })
  } catch (error) {
    next(error)
  }
}

export const handleOptions: RequestHandler = async (req, res, next) => {
  try {
    const { option } = req.body
    req.session.idOption = option

    const redirectPath = option === 'upload' ? '/pop/verify/upload-photo' : '/pop/verify/take-photo'
    res.redirect(redirectPath)
  } catch (error) {
    next(error)
  }
}

export const renderUploadPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { errorMessage } = req.session
    delete req.session.errorMessage
    res.render('pages/pop-id/upload-photo', { errorMessage })
  } catch (error) {
    next(error)
  }
}

export const handleUploadPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { file } = req
    if (!file) {
      req.session.errorMessage = 'No file uploaded'
      res.redirect('/pop/verify/upload-photo')
    }
    const relativePath = `/assets/uploads/${req.session.user_id}/${path.basename(file.path)}`
    req.session.verificationPhoto = relativePath
    res.redirect('/pop/verify/display-photo')
  } catch (error) {
    next(error)
  }
}

export const renderDisplayPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      res.redirect(`/pop/verify/options`)
    } else {
      res.render('pages/pop-id/display-photo', { verificationPhoto })
    }
  } catch (error) {
    next(error)
  }
}

export const handleDisplayPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { meetRules } = req.body
    const redirectPath = meetRules === 'WantAnotherOne' ? '/pop/verify/options' : '/pop/verify/check-photo'
    res.redirect(redirectPath)
  } catch (error) {
    next(error)
  }
}

export const renderTakePhoto: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop-id/take-photo')
  } catch (error) {
    next(error)
  }
}

export const handleSavePhoto: RequestHandler = async (req, res, next) => {
  try {
    const { photo } = req.body
    if (photo) {
      req.session.verificationPhoto = photo
      res.json({ success: true })
    } else {
      res.status(400).json({ success: false, error: 'No photo' })
    }
  } catch (error) {
    next(error)
  }
}

export const renderCheckPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      res.redirect(`/pop/verify/options`)
    } else {
      res.render('pages/pop-id/check-photo', {
        autoRedirect: true,
        redirectUrl: '/pop/verify/reject-photo',
        redirectDelay: 2500,
        cspNonce: res.locals.cspNonce,
      })
    }
  } catch (error) {
    next(error)
  }
}

export const renderRejectPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      res.redirect(`/pop/verify/options`)
    } else {
      res.render('pages/pop-id/reject-photo', { verificationPhoto })
    }
  } catch (error) {
    next(error)
  }
}

export const renderUploadingPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { verificationPhoto } = req.session
    if (!verificationPhoto) {
      res.redirect(`/pop/verify/options`)
    } else {
      res.render('pages/pop-id/uploading-photo', {
        autoRedirect: true,
        redirectUrl: '/pop/verify/success',
        redirectDelay: 2500,
        cspNonce: res.locals.cspNonce,
      })
    }
  } catch (error) {
    next(error)
  }
}

export const renderConfirmPhoto: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop-id/confirm-photo')
  } catch (error) {
    next(error)
  }
}

export const renderSuccess: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop-id/success')
  } catch (error) {
    next(error)
  }
}

export const setPendingVerification: RequestHandler = async (req, res, next) => {
  try {
    req.session.popVerificationStatus = 'pending'
    req.session.is_pop_login = true
    res.redirect('/pop')
  } catch (error) {
    next(error)
  }
}

import { RequestHandler } from 'express'

export const renderCases: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/staff/cases')
  } catch (error) {
    next(error)
  }
}

export const renderVerifyPopPhoto: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/staff/verify-pop-photo')
  } catch (error) {
    next(error)
  }
}

export const handleVerifyPopPhoto: RequestHandler = async (req, res, next) => {
  try {
    const { matchingPhoto } = req.body
    if (matchingPhoto === 'yes') {
      res.redirect('/staff/verify-success')
    } else if (matchingPhoto === 'no') {
      res.redirect('/staff/verify-reject')
    } else {
      const errorMessage = 'An option must be selected below'
      res.render('pages/staff/verify-pop-photo', { errorMessage })
    }
  } catch (error) {
    next(error)
  }
}

export const renderVerifySuccess: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/staff/verify-success')
  } catch (error) {
    next(error)
  }
}

export const renderVerifyReject: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/staff/verify-reject')
  } catch (error) {
    next(error)
  }
}

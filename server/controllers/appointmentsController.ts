import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'

export const renderAppointments = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointments = await popService.getAppointments(userId)
      const submittedEvidence = req.query.submittedEvidence === 'true'
      res.render('pages/pop/appointments', { ...appointments, submittedEvidence })
    } catch (error) {
      next(error)
    }
  }
}

export const renderViewAppointment = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const appointmentId = '12345'
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointmentDetails = await popService.getAppointmentDetails(appointmentId, userId)
      res.render('pages/pop/view-appointment', { appointmentDetails })
    } catch (error) {
      next(error)
    }
  }
}

export const renderViewPastAppointment = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const appointmentId = '67890'
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointmentDetails = await popService.getAppointmentDetails(appointmentId, userId)
      res.render('pages/pop/view-past-appointment', { appointmentDetails })
    } catch (error) {
      next(error)
    }
  }
}

export const renderAppointmentCancel = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      res.render('pages/pop/appointment-cancel')
    } catch (error) {
      next(error)
    }
  }
}

export const renderAppointmentCancelUploadEvidence = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const uploadedEvidence = req.session.uploadedEvidence || []
      res.render('pages/pop/appointment-cancel-upload-evidence', { uploadedEvidence })
    } catch (error) {
      next(error)
    }
  }
}

export const handleDeleteEvidence = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const filename = typeof req.query.filename === 'string' ? req.query.filename : ''
      if (!filename) {
        res.redirect('/pop/appointment-cancel-upload-evidence')
      }
      await popService.deleteEvidence(req.session, filename)
      res.redirect('/pop/appointment-cancel-upload-evidence')
    } catch (error) {
      next(error)
    }
  }
}

export const handleSubmitEvidence = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      await popService.submitEvidence(req.session)
      res.redirect('/pop/appointments?submittedEvidence=true')
    } catch (error) {
      next(error)
    }
  }
}

export const handleUploadEvidence = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    const files = req.files as Express.Multer.File[]
    try {
      await popService.uploadEvidence(req.session, files)
      res.redirect('/pop/appointment-cancel-upload-evidence')
    } catch (error) {
      next(error)
    }
  }
}

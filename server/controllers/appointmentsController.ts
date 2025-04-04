import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'

export const renderAppointments = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointments = await popService.getAppointments(userId)
      res.render('pages/pop/appointments', appointments)
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

import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'

export const renderOrderSummary = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const unpaidWorkSummary = await popService.getUnpaidWorkSummary(userId)
      const unpaidWorkWarning = await popService.getUnpaidWorkWarning(userId)

      res.render('pages/pop/conditions', { unpaidWorkSummary, unpaidWorkWarning })
    } catch (error) {
      next(error)
    }
  }
}

export const renderUnpaidWork = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const unpaidWorkSummary = await popService.getUnpaidWorkSummary(userId)
      const unpaidWorkWarning = await popService.getUnpaidWorkWarning(userId)

      res.render('pages/pop/conditions', { unpaidWorkSummary, unpaidWorkWarning })
    } catch (error) {
      next(error)
    }
  }
}

export const renderProbationConditions = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const unpaidWorkSummary = await popService.getUnpaidWorkSummary(userId)
      const unpaidWorkWarning = await popService.getUnpaidWorkWarning(userId)

      res.render('pages/pop/conditions', { unpaidWorkSummary, unpaidWorkWarning })
    } catch (error) {
      next(error)
    }
  }
}

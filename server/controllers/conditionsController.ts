import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'

export const renderOrderSummary = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const orderSummary = await popService.getProbationConditionSummary(userId)
      orderSummary.requirements.forEach(r => {
        if (r.category === 'Unpaid work') {
          // eslint-disable-next-line no-param-reassign
          r.infoLink = '/pop/upw-conditions'
        } else {
          // eslint-disable-next-line no-param-reassign
          r.infoLink = '#'
        }
      })
      res.render('pages/pop/orderSummary', { orderSummary })
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
      const conditions = await popService.getUnpaidWorkConditions(userId)
      res.render('pages/pop/upwConditions', { unpaidWorkSummary, unpaidWorkWarning, conditions })
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
      const conditions = await popService.getProbationConditions(userId)

      res.render('pages/pop/probationConditions', { conditions })
    } catch (error) {
      next(error)
    }
  }
}

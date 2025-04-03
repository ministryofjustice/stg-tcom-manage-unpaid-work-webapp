import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'
import { AttendenceRecord } from '../services/PopService'

export type TableEntriesCollection = Array<
  Array<{ text: string | number; attributes?: object } | { html: string | number }>
>

export const renderIndex: RequestHandler = async (req, res, next) => {
  try {
    const { scenario } = req.query
    res.render('pages/pop/index', { scenario, session: req.session })
  } catch (error) {
    next(error)
  }
}

export const renderPopDetails = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userProfile = await popService.getUserDetails(req.session.user_id)
      res.render('pages/pop/details', { userProfile })
    } catch (error) {
      next(error)
    }
  }
}

export const renderPopProgress = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    // /pop/your-progress/?progress=zero (default)
    // /pop/your-progress/?progress=wip
    try {
      const { progress } = req.query
      let tempUserId = req.session.user_id || randomUUID()
      req.session.user_id = tempUserId // ensure this is always set

      let nextAppointment
      let previousAttendence: TableEntriesCollection | undefined
      let attendance: Array<AttendenceRecord> = []
      if (progress === 'wip') {
        // to simulate zero progress or in progress (wip) we will fake a prefix on the userId

        tempUserId = `wip_${tempUserId}`
        nextAppointment = await popService.getNextAppointment(tempUserId)
        attendance = await popService.getPreviousAttendence(tempUserId)
      }
      const progressData = await popService.getProgressDetails(tempUserId)
      const displayBreakdown: TableEntriesCollection = []
      progressData.breakdown.forEach(item => {
        if (item.title === 'Total') {
          displayBreakdown.push([
            { html: `<strong>${item.title}</strong>` },
            { html: `<strong>${item.required}</strong>` },
            { html: `<strong>${item.completed}</strong>` },
          ])
        } else {
          displayBreakdown.push([{ text: item.title }, { text: item.required }, { text: item.completed }])
        }
      })
      if (attendance.length > 0) {
        previousAttendence = []
        attendance.forEach(item => {
          previousAttendence.push([
            {
              text: item.date,
              attributes: {
                'data-sort-value': item.sortableDate,
              },
            },
            { text: item.status },
            { text: `${item.credits} ${item.unit}` },
            { html: `<strong>${item.performanceRating}</strong><br />${item.feedback}` },
          ])
        })
      }
      res.render('pages/pop/progress', { progressData, displayBreakdown, nextAppointment, previousAttendence })
    } catch (error) {
      next(error)
    }
  }
}

export const renderConditions: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop/conditions')
  } catch (error) {
    next(error)
  }
}

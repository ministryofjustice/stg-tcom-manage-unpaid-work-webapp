import { RequestHandler } from 'express'
import { getPlacements } from '../routes/data/supervisor-placements'
import { getSupervisorService } from '../services/serviceInjection'
import { SupervisorServiceInterface } from '../services/SupervisorServiceInterface'

export const renderPlacements: RequestHandler = async (req, res, next) => {
  try {
    req.session.placements = getPlacements()
    const { placements } = req.session
    res.render('pages/supervisor/placements', { placements })
  } catch (error) {
    next(error)
  }
}

export const renderViewPlacement = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.id)
      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const message = req.session.successMessage
        delete req.session.successMessage
        res.render('pages/supervisor/view-placement', { placement, message })
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const renderCheckIn = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          res.render('pages/supervisor/check-in', { placement, attendee })
        } else {
          res.redirect('/supervisor')
        }
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const handleConfirmCheckIn = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          attendee.status = 'Checked in'
          req.session.successMessage = `${attendee.name} has been checked in!`
          res.redirect(`/supervisor/view-placement/${placementId}`)
        } else {
          res.redirect('/supervisor')
        }
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const renderCheckOut = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          res.render('pages/supervisor/check-out', { placement, attendee })
        } else {
          res.redirect('/supervisor')
        }
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const handleConfirmCheckOut = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          attendee.status = 'Checked out'
          req.session.successMessage = `${attendee.name} has been checked out!`
          res.redirect(`/supervisor/view-placement/${placementId}`)
        } else {
          res.redirect('/supervisor')
        }
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const handleRemoveAttendee = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          attendee.isRemoved = true
          req.session.successMessage = `Attendee has been marked as removed!`
        }
        res.redirect(`/supervisor/view-placement/${placementId}`)
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const handleMarkNoShow = (service: SupervisorServiceInterface = getSupervisorService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const placementId = decodeURIComponent(req.params.placementId)
      const userId = decodeURIComponent(req.params.userId)

      const placement = service.findPlacement(req, placementId)

      if (placement) {
        const attendee = placement.attendees.find(a => a.userId === userId)
        if (attendee) {
          attendee.status = 'No show'
          req.session.successMessage = 'Status changed to No Show!'
          res.redirect(`/supervisor/view-placement/${placementId}`)
        } else {
          res.redirect('/supervisor')
        }
      } else {
        res.redirect('/supervisor')
      }
    } catch (error) {
      next(error)
    }
  }
}

import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import { Placement } from './data/supervisor-placements'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    res.render('pages/supervisor/placements', { placements })
  })

  get('/view-placement/:id', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    if (!placements) {
      res.redirect('/')
    }
    const placementId = decodeURIComponent(req.params.id)
    const placement = placements.find((p: Placement) => p.id === placementId)
    if (placement) {
      const message = req.session.successMessage
      delete req.session.successMessage
      res.render('pages/supervisor/view-placement', { placement, message })
    } else {
      res.redirect('/supervisor')
    }
  })

  get('/check-in/:placementId/:userId', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  post('/check-in/:placementId/:userId/confirm', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  get('/check-out/:placementId/:userId', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  post('/check-out/:placementId/:userId/confirm', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  get('/remove/:placementId/:userId', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  get('/no-show/:placementId/:userId', async (req, res, next) => {
    const placements: Placement[] = req.session.placements || []
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find((p: Placement) => p.id === placementId)
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
  })

  return router
}

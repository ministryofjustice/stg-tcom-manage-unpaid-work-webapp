import { type RequestHandler, Router } from 'express'
import asyncMiddleware from '../middleware/asyncMiddleware'
import placements from './data/supervisor-placements'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))
  const post = (path: string | string[], handler: RequestHandler) => router.post(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    res.render('pages/supervisor/placements', { placements })
  })

  get('/view-placement/:id', async (req, res, next) => {
    const placementId = decodeURIComponent(req.params.id)
    const placement = placements.find(p => p.id === placementId)
    if (placement) {
      const message = req.session.success
      delete req.session.success
      res.render('pages/supervisor/view-placement', { placement, message })
    } else {
      res.redirect('/supervisor')
    }
  })

  get('/check-in/:placementId/:userId', async (req, res, next) => {
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find(p => p.id === placementId)
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
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find(p => p.id === placementId)
    if (placement) {
      const attendee = placement.attendees.find(a => a.userId === userId)
      if (attendee) {
        attendee.status = 'Checked in'
        req.session.success = `${attendee.name} has been checked in!`
        res.redirect(`/supervisor/view-placement/${placementId}`)
      } else {
        res.redirect('/supervisor')
      }
    } else {
      res.redirect('/supervisor')
    }
  })

  get('/check-out/:placementId/:userId', async (req, res, next) => {
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find(p => p.id === placementId)
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
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find(p => p.id === placementId)
    if (placement) {
      const attendee = placement.attendees.find(a => a.userId === userId)
      if (attendee) {
        attendee.status = 'Checked out'
        req.session.success = `${attendee.name} has been checked out!`
        res.redirect(`/supervisor/view-placement/${placementId}`)
      } else {
        res.redirect('/supervisor')
      }
    } else {
      res.redirect('/supervisor')
    }
  })

  get('/remove/:placementId/:userId', async (req, res, next) => {
    const placementId = decodeURIComponent(req.params.placementId)
    const userId = decodeURIComponent(req.params.userId)
    const placement = placements.find(p => p.id === placementId)
    if (placement) {
      placement.attendees = placement.attendees.filter(a => a.userId !== userId)
      req.session.success = `Attendee has been removed!`
      res.redirect(`/supervisor/view-placement/${placementId}`)
    } else {
      res.redirect('/supervisor')
    }
  })

  return router
}

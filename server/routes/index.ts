import { type RequestHandler, Router } from 'express'
import fs from 'fs'
import pathModule from 'path'
import asyncMiddleware from '../middleware/asyncMiddleware'
import logger from '../../logger'
import { getPlacements } from './data/supervisor-placements'

export default function routes(): Router {
  const router = Router()
  const get = (path: string | string[], handler: RequestHandler) => router.get(path, asyncMiddleware(handler))

  get('/', async (req, res, next) => {
    const placements = getPlacements()
    req.session.placements = JSON.parse(JSON.stringify(placements))
    res.render('pages/index')
  })

  // this is a route that is also defined in hmpps auth middleware so beware of future clashes when that gets included.
  get('/sign-out', async (req, res, next) => {
    const uploadDir = pathModule.join(__dirname, '..', '..', 'assets', 'uploads', req.session.user_id)
    try {
      const dirExists = await fs.promises
        .access(uploadDir)
        .then(() => true)
        .catch(() => false)
      if (dirExists) {
        await fs.promises.rmdir(uploadDir, { recursive: true })
      }
    } catch (err) {
      logger.error(err, 'Unable to delete directory')
    }

    req.session.destroy(() => res.redirect('/'))
  })

  return router
}

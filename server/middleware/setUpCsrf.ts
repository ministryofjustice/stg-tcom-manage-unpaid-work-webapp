import { Router } from 'express'
import { csrfSync } from 'csrf-sync'

const testMode = process.env.NODE_ENV === 'test'

export default function setUpCsrf(): Router {
  const router = Router({ mergeParams: true })

  // CSRF protection
  if (!testMode) {
    const {
      csrfSynchronisedProtection, // This is the default CSRF protection middleware.
    } = csrfSync({
      // By default, csrf-sync uses x-csrf-token header, but we use the token in forms and send it in the request body, so change getTokenFromRequest so it grabs from there
      getTokenFromRequest: req => {
        /* eslint-disable no-underscore-dangle */
        if (req.body && req.body._csrf) {
          return req.body._csrf
        }
        if (req.headers && req.headers['x-csrf-token']) {
          return req.headers['x-csrf-token']
        }
        if (req.file && req.body && req.body._csrf) {
          return req.body._csrf
        }
        /* eslint-enable no-underscore-dangle */
        return null
      },
    })

    router.use((req, res, next) => {
      if (req.is('multipart/form-data')) {
        return next()
      }
      return csrfSynchronisedProtection(req, res, next)
    })
  }

  router.use((req, res, next) => {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken()
    }
    next()
  })

  return router
}

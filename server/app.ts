import express from 'express'
// import cookieParser from 'cookie-parser'
import createError from 'http-errors'

import nunjucksSetup from './utils/nunjucksSetup'
import errorHandler from './errorHandler'
import setUpCsrf from './middleware/setUpCsrf'
import setUpStaticResources from './middleware/setUpStaticResources'
import setUpWebRequestParsing from './middleware/setupRequestParsing'
import setUpWebSecurity from './middleware/setUpWebSecurity'
import setUpWebSession from './middleware/setUpWebSession'
// import { basicAuthentication } from './middleware/basicAuthentication'

import routes from './routes'

export default function createApp(): express.Application {
  const app = express()

  app.set('json spaces', 2)
  app.set('trust proxy', true)
  app.set('port', process.env.PORT || 3000)

  app.use(setUpWebSecurity())
  app.use(setUpWebSession())
  app.use(setUpWebRequestParsing())
  app.use(setUpStaticResources())
  nunjucksSetup(app)
  app.use(setUpCsrf())

  // temporarily disable poassword protection as cookies cannot be set on edge for non-localhost domains
  // app.use(cookieParser())
  // app.use(basicAuthentication())
  app.use(routes())

  app.use((req, res, next) => next(createError(404, 'Not found')))
  app.use(errorHandler(process.env.NODE_ENV === 'production'))

  return app
}

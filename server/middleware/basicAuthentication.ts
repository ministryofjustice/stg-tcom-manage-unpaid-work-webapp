import * as crypto from 'crypto'
import { NextFunction, type Request, type Response } from 'express'
import asyncMiddleware from './asyncMiddleware'
import logger from '../../logger'

// Local variables
const allowedPathsWhenUnauthenticated = ['/admin/password']

export function basicAuthentication() {
  if (!shouldUseAuth()) {
    return function doNothing(req: Request, res: Response, next: NextFunction) {
      next()
    }
  }

  if (!process.env.POC_PASSWORD) {
    return function showErrors(req: Request, res: Response, next: NextFunction) {
      showNoPasswordError(res)
    }
  }

  // password is encrypted because we store it in a cookie
  // we store the password to compare in case it is changed server-side
  // changing the password should require users to re-authenticate
  const password = encryptPassword(process.env.POC_PASSWORD)

  return asyncMiddleware((req, res, next) => {
    if (allowedPathsWhenUnauthenticated.includes(req.path)) {
      next()
    } else if (isAuthenticated(password, req)) {
      next()
    } else {
      sendUserToPasswordPage(req, res)
    }
  })
}

export function encryptPassword(password: string) {
  const hash = crypto.createHash('sha256')
  hash.update(password)
  return hash.digest('hex')
}

function shouldUseAuth() {
  const safeNodeEnv = process.env.NODE_ENV || 'not set'
  const isRunningInProduction = safeNodeEnv.toLowerCase() === 'production'
  return isRunningInProduction || true
}

function showNoPasswordError(res: Response) {
  return res.send(
    '<h1>Error:</h1><p>Password not set. <a href="https://govuk-prototype-kit.herokuapp.com/docs/publishing-on-heroku#6-set-a-password">See guidance for setting a password</a>.</p>',
  )
}

function sendUserToPasswordPage(req: Request, res: Response) {
  logger.info(`Not logged in, going to password input`)
  res.redirect('/admin/password')
}

function isAuthenticated(encryptedPassword: string, req: Request) {
  return req.cookies?.authentication === encryptedPassword
}

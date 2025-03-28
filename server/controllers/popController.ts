import { RequestHandler } from 'express'
import getPopService from '../services/serviceInjection'

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
    try {
      const progressData = await popService.getProgressDetails()
      res.render('pages/pop/progress', progressData)
    } catch (error) {
      next(error)
    }
  }
}

export const renderMessageThread = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const message = await popService.getMessageById(req.params.id)
      if (message) {
        res.render('pages/pop/messageThread', { message, error: req.flash('error') })
      } else {
        res.status(404).send('Message not found')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const handleMessageThread = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const messageId = req.params.id
      const messageText = req.body.message
      const fileData = req.file
      const userId = req.session.user_id

      const success = await popService.addMessageToThread(messageId, messageText, fileData, userId)
      if (success) {
        res.redirect(`/pop/messages/thread/${messageId}`)
      } else {
        res.status(404).send('Message not found')
      }
    } catch (error) {
      next(error)
    }
  }
}

export const renderAppointments = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const appointments = await popService.getAppointments()
      res.render('pages/pop/appointments', appointments)
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

export const renderViewAppointment: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop/view-appointment')
  } catch (error) {
    next(error)
  }
}

export const renderViewPastAppointment: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop/view-past-appointment')
  } catch (error) {
    next(error)
  }
}

export const renderMessages = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const messages = await popService.getAllMessages()
      res.render('pages/pop/messages', { messages })
    } catch (error) {
      next(error)
    }
  }
}

export const handleNewMessage = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const { subject, message: messageText } = req.body
      const fileData = req.file
      const userId = req.session.user_id

      if (subject && messageText) {
        const messageId = await popService.createNewMessage(subject, messageText, fileData, userId)
        res.redirect(`/pop/messages/thread/${messageId}`)
      } else {
        res.render('pages/pop/new-message', { message: 'Subject and message are required.' })
      }
    } catch (error) {
      next(error)
    }
  }
}

export const renderNewMessage: RequestHandler = async (req, res, next) => {
  try {
    res.render('pages/pop/new-message')
  } catch (error) {
    next(error)
  }
}

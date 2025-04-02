import { RequestHandler } from 'express'
import getPopService from '../services/serviceInjection'
import { Message } from '../routes/data/messages'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const renderMessageThread = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      // const userId = req.session.user_id || randomUUID()
      // req.session.user_id = userId // ensure this is always set
      // const messages = popService.getMessageById(req.params.id, userId)
      const { messages } = req.session
      const message = messages?.find((msg: Message) => msg.id === req.params.id)
      if (message) {
        res.render('pages/pop/messageThread', { message, error: req.session.errorMessage })
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

      const messages = req.session.messages || []
      const success = await popService.addMessageToThread(messageId, messageText, fileData, userId, messages)
      req.session.messages = messages
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

export const renderMessages = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      let { messages } = req.session
      if (!messages) {
        messages = await popService.getAllMessages()
        req.session.messages = messages
      }
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
      const recipient = 'mayberecipientuuidhere'

      if (subject && messageText) {
        const messages = req.session.messages || []
        const messageId = await popService.createNewMessage(subject, messageText, fileData, userId, recipient, messages)
        req.session.messages = messages

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

import { RequestHandler } from 'express'
import { randomUUID } from 'crypto'
import getPopService from '../services/serviceInjection'
import { Message } from '../routes/data/messages'
import { AttendenceRecord } from '../services/PopServiceInterface'

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
      let previousAttendence: Array<Array<{ text: string | number } | { html: string | number }>> | undefined
      let attendance: Array<AttendenceRecord> = []
      if (progress === 'wip') {
        // to simulate zero progress or in progress (wip) we will fake a prefix on the userId

        tempUserId = `wip_${tempUserId}`
        nextAppointment = await popService.getNextAppointment(tempUserId)
        attendance = await popService.getPreviousAttendence(tempUserId)
      }
      const progressData = await popService.getProgressDetails(tempUserId)
      const displayBreakdown: Array<Array<{ text: string | number }>> = []
      progressData.breakdown.forEach(item => {
        displayBreakdown.push([{ text: item.title }, { text: item.required }, { text: item.completed }])
      })
      if (attendance.length > 0) {
        previousAttendence = []
        attendance.forEach(item => {
          previousAttendence.push([
            { text: item.date },
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

export const renderAppointments = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointments = await popService.getAppointments(userId)
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

export const renderViewAppointment = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const appointmentId = '12345'
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointmentDetails = await popService.getAppointmentDetails(appointmentId, userId)
      res.render('pages/pop/view-appointment', { appointmentDetails })
    } catch (error) {
      next(error)
    }
  }
}

export const renderViewPastAppointment = (popService = getPopService()): RequestHandler => {
  return async (req, res, next) => {
    try {
      const appointmentId = '67890'
      const userId = req.session.user_id || randomUUID()
      req.session.user_id = userId // ensure this is always set
      const appointmentDetails = await popService.getAppointmentDetails(appointmentId, userId)
      res.render('pages/pop/view-past-appointment', { appointmentDetails })
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

import path from 'path'
import { randomUUID } from 'crypto'
import { PopServiceInterface } from './PopServiceInterface'
import messages, { Message } from '../routes/data/messages'
import { pastAppointments, upcomingAppointments } from '../routes/data/appointments'
import logger from '../../logger'

const PopService: PopServiceInterface = {
  async getUserDetails(userId: string) {
    return {
      name: 'Joe Bloggs',
      userId,
      hoursRequired: 100,
      address: 'Flat 1, 1 Example St, London, SE1 1AA',
      email: 'joe.bloggs@example.com',
      phone: '07777 012345',
    }
  },

  async getProgressDetails(userId) {
    return {
      userId,
      completedHours: 0,
      totalHours: 100,
      percentCompleted: (0 / 100) * 100,
      appointment: {
        title: 'Community Garden Maintenance',
        date: 'Friday 15 March 2024',
        time: '09:00',
        location: '123 Garden Street, London SE1 7TH',
      },
    }
  },

  async getMessageById(messageId: string, userId: string) {
    const message = messages.find(msg => msg.id === messageId)
    return message || null
  },

  async getAppointments(userId) {
    return { upcomingAppointments, pastAppointments, userId }
  },

  async addMessageToThread(
    messageId: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
    sessionMessages?: Message[], // passing session messages so we can update them might not be required in the real implementation
  ): Promise<boolean> {
    const message = sessionMessages?.find(msg => msg.id === messageId)
    if (!message) {
      return false
    }

    let updatedMessageText = messageText
    if (fileData && userId) {
      try {
        const relativePath = `/assets/uploads/${userId}/${path.basename(fileData.path)}`
        const attachmentLink = `<a href="${relativePath}" target="_blank">${fileData.originalname}</a>`
        updatedMessageText = messageText
          ? `${messageText}<br><br>Attachment: <br>${attachmentLink}`
          : `Attachment: ${attachmentLink}`
      } catch (error) {
        logger.error(`Error processing uploaded file: ${error.message}`)
      }
    }

    if (updatedMessageText || fileData) {
      const newMessageItem: Message['items'][0] = {
        html: updatedMessageText,
        type: 'sent',
        timestamp: new Date().toLocaleString(),
        sender: 'You',
      }
      message.items.push(newMessageItem)
    }

    return true
  },

  async getAllMessages() {
    return messages
  },

  async createNewMessage(
    subject: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
    recipient?: string,
    sessionMessages?: Message[], // passing session messages so we can update them might not be required in the real implementation
  ): Promise<string> {
    let updatedMessageText = messageText
    if (fileData && userId) {
      try {
        const relativePath = `/assets/uploads/${userId}/${path.basename(fileData.path)}`
        const attachmentLink = `<a href="${relativePath}" target="_blank">${fileData.originalname}</a>`
        updatedMessageText = messageText
          ? `${messageText}<br><br>Attachment: <br>${attachmentLink}`
          : `Attachment: ${attachmentLink}`
      } catch (error) {
        logger.error(`Error processing uploaded file: ${error.message}`)
      }
    }

    const newMessage: Message = {
      id: randomUUID(),
      subject,
      date: new Date().toLocaleDateString(),
      status: 'new',
      description: updatedMessageText,
      recipient,
      items: [
        {
          html: updatedMessageText,
          type: 'sent',
          timestamp: new Date().toLocaleString(),
          sender: 'You',
        },
      ],
    }

    if (sessionMessages) {
      sessionMessages.push(newMessage)
    }

    return newMessage.id
  },

  async getAppointmentDetails(appointmentId: string, userId: string) {
    return {
      id: appointmentId,
      title: 'Community Garden Maintenance',
      date: 'Friday 15 March 2024',
      time: '09:00',
      location: '123 Garden Street, London SE1 7TH',
      description: `This is a fake appointment for user ${userId}.`,
    }
  },
}

export default PopService

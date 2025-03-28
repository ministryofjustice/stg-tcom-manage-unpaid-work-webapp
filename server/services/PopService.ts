import path from 'path'
import { randomUUID } from 'crypto'
import { PopServiceInterface } from './PopServiceInterface'
import messages from '../routes/data/messages'
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

  async getProgressDetails() {
    return {
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

  async getMessageById(messageId: string) {
    const message = messages.find(msg => msg.id === messageId)
    return message || null
  },

  async getAppointments() {
    return { upcomingAppointments, pastAppointments }
  },

  async addMessageToThread(
    messageId: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
  ): Promise<boolean> {
    const message = messages.find(msg => msg.id === messageId)
    if (!message) {
      return false
    }

    let updatedMessageText = messageText // Use a new variable
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
      const newMessage = {
        html: updatedMessageText,
        type: 'sent',
        timestamp: new Date().toLocaleString(),
        sender: 'You',
      }
      message.items.push(newMessage as unknown as { html: string; type: string; timestamp: string; sender: string })
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

    const newMessage = {
      id: randomUUID(),
      subject,
      date: new Date().toLocaleDateString(),
      status: 'new',
      description: updatedMessageText,
      items: [
        {
          html: updatedMessageText,
          type: 'sent',
          timestamp: new Date().toLocaleString(),
          sender: 'You',
        },
      ],
    }
    messages.push(newMessage)
    return newMessage.id
  },
}

export default PopService

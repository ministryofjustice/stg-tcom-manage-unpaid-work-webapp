import path from 'path'
import { randomUUID } from 'crypto'
import { PopService, ProgressBreakdownItem } from './PopService'
import messages, { Message } from '../routes/data/messages'
import { pastAppointments, upcomingAppointments } from '../routes/data/appointments'
import logger from '../../logger'

const PrototypePopService: PopService = {
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
    // to simulate zero progress or in progress (wip) we will fake a prefix on the userId
    let breakdown: ProgressBreakdownItem[] = []
    let totalCompletedHours = 0
    const totalRequiredHours = 100
    if (userId.startsWith('wip_')) {
      totalCompletedHours = 50
      breakdown = [
        { title: 'In person', completed: 40, required: 70 },
        { title: 'Education, Training and Employment (ETE) programmes', completed: 10, required: 30 },
        { title: 'Total', completed: 50, required: 100 },
      ]
    } else {
      totalCompletedHours = 0
      breakdown = [
        { title: 'In person', completed: 0, required: 70 },
        { title: 'Education, Training and Employment (ETE) programmes', completed: 0, required: 30 },
        { title: 'Total', completed: 0, required: 100 },
      ]
    }
    return {
      userId,
      totalCompletedHours,
      totalHours: totalRequiredHours,
      percentCompleted: (totalCompletedHours / totalRequiredHours) * 100,
      breakdown,
      appointment: {
        title: 'Community Garden Maintenance',
        date: 'Friday 15 March 2024',
        time: '09:00',
        location: '123 Garden Street, London SE1 7TH',
      },
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPreviousAttendence(userId: string) {
    return [
      {
        date: '15 March 2025',
        sortableDate: '2025-03-15',
        status: 'Attended',
        credits: 7,
        unit: 'hours',
        performanceRating: 'Excellent',
        feedback: 'Great work on the skirting board.\nAppreciate you keeping the engery up even after 3pm.',
      },
      {
        date: '8 March 2025',
        sortableDate: '2025-03-08',
        status: 'Attended',
        credits: 7,
        unit: 'hours',
        performanceRating: 'Excellent',
        feedback: 'Fantastic job on organising the inventory today. Your attention to detail really shows!',
      },
      {
        date: '1 March 2025',
        sortableDate: '2025-03-01',
        status: 'Left earlier',
        credits: 2,
        unit: 'hours',
        performanceRating: 'Satisfactory',
        feedback: 'Your communication could be better. Try using less aggressive language with others.',
      },
      {
        date: '22 February 2025',
        sortableDate: '2025-02-22',
        status: 'Attended',
        credits: 7,
        unit: 'hours',
        performanceRating: 'Excellent',
        feedback: 'Great teamwork during the shift.',
      },
      {
        date: '13 February 2025',
        sortableDate: '2025-02-13',
        status: 'Did not attend',
        credits: 0,
        unit: 'hours',
        performanceRating: '',
        feedback: '',
      },
    ]
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getMessageById(messageId: string, userId: string) {
    const message = messages.find(msg => msg.id === messageId)
    return message || null
  },

  async getAppointments(userId) {
    return { upcomingAppointments, pastAppointments, userId }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getNextAppointment(userId) {
    return {
      date: 'Saturday 15 March 2025',
      time: '9am - 5pm',
      title: 'Community Garden Maintenance',
      location: '123 Garden Street, London SE1 7TH',
      contact: 'Karen Smith',
      contactLink: '',
      description:
        'Group session focused on weeding, planting seasonal vegetables, and Probation appointment garden maintenance. Bring appropriate clothing for outdoor work, tools will be provided. Break times will be scheduled during the session.',
      category: 'Unpaid Work',
      showOnMap: true,
    }
  },

  async addMessageToThread(
    messageId: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
    sessionMessages?: Message[],
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
    sessionMessages?: Message[],
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUnpaidWorkSummary(userId: string) {
    return {
      day: 'Saturdays',
      time: '9am - 5pm',
      frequency: 'Weekly',
      meetingPoint: '123 Garden Street, London SE1 7TH',
      workType: 'Group session',
      requirements:
        'Bring a packed lunch and wear appropriate clothing for outdoor work. Shorts, vests or skirts are not allowed. Tools will be provided. Break times will be scheduled during the session.',
      // ^ this might be a list of strings in the future
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUnpaidWorkWarning(userId: string) {
    return 'If you do not wear the right clothes or do not bring your packed lunch, you might be sent back home and your hours will not be credited.'
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUnpaidWorkConditions(userId: string) {
    return []
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProbationConditionSummary(userId: string) {
    return {
      orderType: 'Community order',
      startDate: '16 December 2024',
      requirementsCompletionDate: '15 December 2025',
      requirements: [{ category: 'Unpaid work', requirement: '100 hours' }],
    }
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getProbationConditions(userId: string) {
    return []
  },
}

export default PrototypePopService

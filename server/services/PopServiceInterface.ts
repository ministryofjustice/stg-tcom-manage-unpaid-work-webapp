import { Message } from '../routes/data/messages'

export interface PopServiceInterface {
  getUserDetails(userId: string): Promise<{
    name: string
    userId: string
    hoursRequired: number
    address: string
    email: string
    phone: string
  }>

  getProgressDetails(userId: string): Promise<{
    totalCompletedHours: number
    totalHours: number
    percentCompleted: number
    breakdown: Array<{ title: string; required: number; completed: number }>
    appointment: {
      title: string
      date: string
      time: string
      location: string
    }
  }>

  getMessageById(messageId: string, userId: string): Promise<Message | null>

  getAppointments(userId: string): Promise<{
    upcomingAppointments: Array<{ title: string; date: string; time: string }>
    pastAppointments: Array<{ title: string; date: string; time: string }>
  }>

  addMessageToThread(
    messageId: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
    sessionMessages?: Message[],
  ): Promise<boolean>

  getAllMessages(): Promise<Message[]>

  createNewMessage(
    subject: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
    recipient?: string,
    sessionMessages?: Message[],
  ): Promise<string>

  getAppointmentDetails(
    appointmentId: string,
    userId: string,
  ): Promise<{
    id: string
    title: string
    date: string
    time: string
    location: string
    description: string
  }>
}

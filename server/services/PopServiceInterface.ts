import { Message } from '../routes/data/messages'

export type ProgressBreakdownItem = { title: string; completed: number; required: number }
export type UserDetails = {
  name: string
  userId: string
  hoursRequired: number
  address: string
  email: string
  phone: string
}

export type ProgressDetails = {
  totalCompletedHours: number
  totalHours: number
  percentCompleted: number
  breakdown: Array<ProgressBreakdownItem>
  appointment: {
    title: string
    date: string
    time: string
    location: string
  }
}

export type AttendenceRecord = {
  date: string
  status: string // will be an enum in real system
  credits: number
  unit: string
  performanceRating: string // will be an enum in real system
  feedback: string // note format, expect possibility of multiple lines
}

export interface PopServiceInterface {
  getUserDetails(userId: string): Promise<UserDetails>

  getProgressDetails(userId: string): Promise<ProgressDetails>

  getPreviousAttendence(userId: string): Promise<Array<AttendenceRecord>>

  getAppointments(userId: string): Promise<{
    upcomingAppointments: Array<{ title: string; date: string; time: string }>
    pastAppointments: Array<{ title: string; date: string; time: string }>
  }>

  getNextAppointment(userId: string): Promise<{
    date: string
    time: string
    title: string
    location: string
    contact: string
    contactLink: string
    description: string
    category: string
    showOnMap: boolean
  }>

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

  getMessageById(messageId: string, userId: string): Promise<Message | null>

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
}

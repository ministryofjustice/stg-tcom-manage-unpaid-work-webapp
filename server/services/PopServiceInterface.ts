export interface PopServiceInterface {
  getUserDetails(userId: string): Promise<{
    name: string
    userId: string
    hoursRequired: number
    address: string
    email: string
    phone: string
  }>

  getProgressDetails(): Promise<{
    completedHours: number
    totalHours: number
    percentCompleted: number
    appointment: {
      title: string
      date: string
      time: string
      location: string
    }
  }>

  getMessageById(messageId: string): Promise<{
    id: string
    subject: string
    items: Array<{ html: string; type: string; timestamp: string; sender: string }>
  } | null>

  getAppointments(): Promise<{
    upcomingAppointments: Array<{ title: string; date: string; time: string }>
    pastAppointments: Array<{ title: string; date: string; time: string }>
  }>

  addMessageToThread(
    messageId: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
  ): Promise<boolean>

  getAllMessages(): Promise<
    Array<{
      id: string
      subject: string
      date: string
      status: string
      description: string
      items: Array<{ html: string; type: string; timestamp: string; sender: string }>
    }>
  >

  createNewMessage(
    subject: string,
    messageText: string,
    fileData?: { path: string; originalname: string },
    userId?: string,
  ): Promise<string>
}

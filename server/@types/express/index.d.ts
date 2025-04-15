import { Message } from '../../routes/data/messages'
import { Placement } from '../../routes/data/supervisor-placements'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
    user_id: string
    idOption: string
    successMessage: string
    errorMessage: string
    is_pop_login: boolean
    verificationPhoto: string
    popVerificationStatus: 'pending' | 'failed' | 'verified'
    placements: Placement[]
    messages: Message[]
    uploadedEvidence: Array<{ path: string; filename: string }>
    checkInVideoPath: string
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface Request {
      verified?: boolean
      id: string
      logout(done: (err: unknown) => void): void
    }

    interface MessageItem {
      html: string
      type: string
      timestamp: string
      sender: string
    }
  }
}

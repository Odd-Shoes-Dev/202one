import { SessionOptions } from 'iron-session'

export interface SessionData {
  isAdmin: boolean
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET ?? 'fallback-secret-change-in-production',
  cookieName: '202one-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
}

import { cookies } from 'next/headers'
import { signToken, verifyToken, type SessionPayload } from './jwt'

const COOKIE_NAME = 'session'
const SEVEN_DAYS = 60 * 60 * 24 * 7

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await signToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SEVEN_DAYS,
    path: '/'
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

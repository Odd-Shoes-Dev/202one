'use server'

import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function login(password: string) {
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, error: 'Incorrect password.' }
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.isAdmin = true
  await session.save()
  return { success: true }
}

export async function logout() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.destroy()
  redirect('/admin/login')
}

export async function requireAdmin() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isAdmin) redirect('/admin/login')
  return session
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { db } from '@/lib/adapters/db'

export async function POST(req: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const data = await req.json()
  const s = await db.createSession(data)
  return NextResponse.json({ success: true, session: s })
}

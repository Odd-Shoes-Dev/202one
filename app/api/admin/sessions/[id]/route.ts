import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { db } from '@/lib/adapters/db'

type Params = { params: Promise<{ id: string }> }

async function guard() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  return session.isAdmin
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const s = await db.updateSession(parseInt(id), data)
  return NextResponse.json({ success: true, session: s })
}

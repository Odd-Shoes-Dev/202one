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
  if (data.date) data.date = new Date(data.date)
  const event = await db.updateEvent(parseInt(id), data)
  return NextResponse.json({ success: true, event })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!await guard()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await db.deleteEvent(parseInt(id))
  return NextResponse.json({ success: true })
}

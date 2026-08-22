import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { db } from '@/lib/adapters/db'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ tier: string }> }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { tier } = await params
  const data = await req.json()
  const updated = await db.updatePricing(tier, data)
  return NextResponse.json({ success: true, pricing: updated })
}

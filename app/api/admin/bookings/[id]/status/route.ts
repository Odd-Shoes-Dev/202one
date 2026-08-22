import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'
import { bookingService } from '@/lib/services/booking.service'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  if (!session.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const { status, adminNotes } = await req.json()

  try {
    const booking = await bookingService[status === 'confirmed' ? 'confirm' : status === 'cancelled' ? 'cancel' : 'complete'](id, adminNotes)
    return NextResponse.json({ success: true, booking })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

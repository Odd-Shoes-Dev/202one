export type DemoSlot = {
  date: string
  start: number
  hours: number
  resource: 'studio' | 'services'
}

export type DemoReceipt = DemoSlot & {
  reference: string
  label: string
  method: string
  total: number
  paid: number
  items: { title: string; amount: number }[]
}

const storageKey = '202one-demo-bookings-v1'
const storageEvent = '202one-demo-bookings-changed'

export function studioToday(now = Date.now()) {
  return new Date(now + 3 * 60 * 60 * 1000).toISOString().slice(0, 10)
}

export function studioTime(hour: number) {
  return `${String(hour).padStart(2, '0')}:00`
}

export function availableSlot(slot: DemoSlot, reservations: DemoReceipt[], now = Date.now()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(slot.date) || !Number.isInteger(slot.start) || !Number.isInteger(slot.hours)) return false
  if (slot.start < 9 || slot.hours < 1 || slot.hours > 8 || slot.start + slot.hours > 19) return false
  const timestamp = Date.parse(`${slot.date}T${studioTime(slot.start)}:00+03:00`)
  if (!Number.isFinite(timestamp) || studioToday(timestamp) !== slot.date || timestamp <= now) return false

  return !reservations.some((other) => (
    other.resource === slot.resource && other.date === slot.date
    && slot.start < other.start + other.hours && other.start < slot.start + slot.hours
  ))
}

export function readReservations(snapshot: string): DemoReceipt[] {
  try {
    const records: unknown = JSON.parse(snapshot)
    if (!Array.isArray(records)) return []
    return records.filter((record): record is DemoReceipt => (
      record && typeof record.reference === 'string' && typeof record.date === 'string'
      && typeof record.start === 'number' && typeof record.hours === 'number'
      && (record.resource === 'studio' || record.resource === 'services')
      && typeof record.label === 'string' && typeof record.method === 'string'
      && typeof record.total === 'number' && typeof record.paid === 'number'
      && Array.isArray(record.items) && record.items.every((item: unknown) => (
        typeof item === 'object' && item !== null && 'title' in item && typeof item.title === 'string'
        && 'amount' in item && typeof item.amount === 'number'
      ))
    ))
  } catch {
    return []
  }
}

export function reservationSnapshot() {
  try { return window.localStorage.getItem(storageKey) ?? '[]' } catch { return '[]' }
}

export function subscribeToReservations(update: () => void) {
  window.addEventListener('storage', update)
  window.addEventListener(storageEvent, update)
  return () => {
    window.removeEventListener('storage', update)
    window.removeEventListener(storageEvent, update)
  }
}

export async function reserveDemoBooking(receipt: DemoReceipt) {
  const save = () => {
    const reservations = readReservations(reservationSnapshot())
    if (reservations.some((entry) => entry.reference === receipt.reference)) return true
    if (!availableSlot(receipt, reservations)) return false

    window.localStorage.setItem(storageKey, JSON.stringify([...reservations, receipt]))
    window.dispatchEvent(new Event(storageEvent))
    return true
  }

  return navigator.locks ? navigator.locks.request(storageKey, save) : save()
}

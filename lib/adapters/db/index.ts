import { neonDb } from './neon'
import type { DbAdapter } from './interface'

// Swap this import to switch database providers.
// The rest of the app only ever imports from here.
export const db: DbAdapter = neonDb

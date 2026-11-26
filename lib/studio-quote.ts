export const plans = {
  space: { title: 'Private studio space', description: 'A private room for rehearsals, practice, or student projects.', hourly: 35000 },
  session: { title: 'Recording session', description: 'Studio time with an engineer for vocals, instruments, or live sessions.', hourly: 60000 },
  production: { title: 'Production session', description: 'Studio and producer time to build, edit, or finish your project.', hourly: 100000 },
  services: { title: 'Creative services only', description: 'Book a creative service or event coverage without reserving a studio room.', hourly: 0 },
} as const

export const addons = {
  'visual-arts': { title: 'Visual arts & photography', price: 65000 },
  production: { title: 'Video production', price: 120000 },
  'post-production': { title: 'Video editing & colour', price: 65000 },
  'still-motion': { title: 'Graphic design', price: 45000 },
  'motion-graphics': { title: 'Motion graphics', price: 80000 },
  'sound-engineering': { title: 'Sound engineering', price: 55000 },
  'sound-design': { title: 'Sound design', price: 50000 },
  'music-production': { title: 'Music production', price: 95000 },
  'audio-production': { title: 'Audio production', price: 75000 },
  'event-videography': { title: 'Event videography', price: 150000 },
  'event-photography': { title: 'Event photography', price: 100000 },
} as const

export const demoDeposit = 10000
export const durationOptions = [1, 2, 3, 4, 5, 6, 7, 8]
export type StudioPlan = keyof typeof plans
export type StudioAddon = keyof typeof addons
export type QuoteOptions = { tier: StudioPlan; hours: number; extras: StudioAddon[] }
type QuoteQuery = { tier?: string | string[]; hours?: string | string[]; extras?: string | string[] }

export function readQuote({ tier, hours, extras }: QuoteQuery): QuoteOptions {
  const studioPlan = typeof tier === 'string' && Object.hasOwn(plans, tier) ? tier as StudioPlan : 'space'
  const duration = typeof hours === 'string' ? Number(hours) : 1
  const selected = typeof extras === 'string' ? extras.split(',') : []
  return {
    tier: studioPlan,
    hours: durationOptions.includes(duration) ? duration : 1,
    extras: [...new Set(selected)].filter((id): id is StudioAddon => Object.hasOwn(addons, id)),
  }
}

export function quoteLines({ tier, hours, extras }: QuoteOptions) {
  const plan = plans[tier]
  const studio = plan.hourly ? [{ title: `${plan.title} × ${hours} ${hours === 1 ? 'hour' : 'hours'}`, amount: plan.hourly * hours }] : []
  return studio.concat(extras.map((id) => ({ title: addons[id].title, amount: addons[id].price })))
}

export function bookingHref({ tier, hours, extras }: QuoteOptions) {
  return `/book?${new URLSearchParams({ tier, hours: String(hours), extras: extras.join(',') })}#booking-flow`
}

const formatter = new Intl.NumberFormat('en-UG', { maximumFractionDigits: 0 })
export function ugx(amount: number) {
  return `UGX ${formatter.format(amount)}`
}

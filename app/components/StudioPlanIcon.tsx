import { AudioLines, Clapperboard, DoorOpen, MicVocal, type LucideIcon } from 'lucide-react'
import type { StudioPlan } from '@/lib/studio-quote'

const planIcons = {
  space: DoorOpen,
  session: MicVocal,
  production: AudioLines,
  services: Clapperboard,
} satisfies Record<StudioPlan, LucideIcon>

export default function StudioPlanIcon({ plan }: { plan: StudioPlan }) {
  const Icon = planIcons[plan]
  return <Icon aria-hidden="true" />
}

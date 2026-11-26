import type { Metadata } from 'next'
import WorkCategory from '@/app/components/WorkCategory'
import { categories } from '@/lib/portfolio'

const slug = 'audio'
const { title, description } = categories[slug]

export const metadata: Metadata = { title: `${title} | 202One Studio`, description }

export default function AudioPage() {
  return <WorkCategory slug={slug} />
}

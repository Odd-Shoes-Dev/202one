import Link from 'next/link'
import type { Metadata } from 'next'
import SitePage from '@/app/components/SitePage'
import StudioCheckout from '@/app/components/StudioCheckout'
import styles from '@/app/components/Site.module.css'
import { flutterwaveConfig } from '@/lib/flutterwave'
import { readQuote } from '@/lib/studio-quote'

export const metadata: Metadata = { title: 'Book the Studio | 202One Studio' }

export default async function BookPage({
  searchParams,
}: { searchParams: Promise<{ tier?: string | string[]; hours?: string | string[]; extras?: string | string[] }> }) {
  const initial = readQuote(await searchParams)

  return (
    <SitePage
      title="Book the Studio"
      image="booking"
      description="Build your package, choose a time in Mbarara, and try the online checkout."
      actions={<Link href="#booking-flow" className={styles.primaryButton}>Start booking</Link>}
    >
      <StudioCheckout key={JSON.stringify(initial)} initial={initial} flutterwave={Boolean(flutterwaveConfig())} />
    </SitePage>
  )
}

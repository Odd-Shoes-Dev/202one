import Link from 'next/link'
import type { Metadata } from 'next'
import SitePage from '@/app/components/SitePage'
import StudioCheckout from '@/app/components/StudioCheckout'
import styles from '@/app/components/Site.module.css'
import { pesapalConfig } from '@/lib/pesapal'
import { readQuote } from '@/lib/studio-quote'

export const metadata: Metadata = { title: 'Book the Studio | 202One Studio' }

export default async function BookPage({
  searchParams,
}: { searchParams: Promise<{ tier?: string | string[]; hours?: string | string[]; extras?: string | string[] }> }) {
  const initial = readQuote(await searchParams)
  const paymentMode = pesapalConfig()?.environment

  return (
    <SitePage
      title="Book the Studio"
      image="booking"
      description="Build your package, choose a time in Mbarara, and pay for your booking online."
      actions={<Link href="#booking-flow" className={styles.primaryButton}>Start booking</Link>}
    >
      <StudioCheckout key={JSON.stringify(initial)} initial={initial} paymentMode={paymentMode} />
    </SitePage>
  )
}

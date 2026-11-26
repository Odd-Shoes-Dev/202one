import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import StudioCheckout from '@/app/components/StudioCheckout'
import styles from '@/app/components/Site.module.css'
import { readQuote } from '@/lib/studio-quote'

export const metadata: Metadata = {
  title: 'Build Your Price | 202One Studio',
  description: 'Build a custom package for studio time, creative services, and event coverage in Mbarara.',
}

export default function PricingPage() {
  return (
    <SitePage
      title="Build Your Price"
      image="pricing"
      description="Choose your studio time and the creative services you need. See the total before you book."
      actions={<Link href="#booking-flow" className={styles.primaryButton}>Build a package</Link>}
    >
      <StudioCheckout initial={readQuote({})} pricing />
    </SitePage>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import FeaturedSession from '@/app/components/FeaturedSession'
import SitePage from '@/app/components/SitePage'
import styles from '@/app/components/Site.module.css'
import { bookingHref } from '@/lib/studio-quote'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Live Sessions | 202One Studio',
  description: 'Live recordings from artists, worship teams and creatives in the 202One community.',
}

export default function LiveSessionsPage() {
  return (
    <SitePage title="Live Sessions" image="sessions" description="Intimate performances captured with live sound and multiple cameras.">
      <FeaturedSession />
      <section className={`${styles.container} ${styles.section} ${styles.copy}`}>
        <h2>202One Sessions</h2>
        <p>Our live recording series makes room for artists, worship teams and other creatives to share a performance in a stripped-back studio setting.</p>
        <p>Choose studio time and add video production or sound engineering to build your own live session package.</p>
        <Link href={bookingHref({ tier: 'session', hours: 1, extras: ['production'] })} className={styles.blueButton}>Customize a live session</Link>
      </section>
    </SitePage>
  )
}

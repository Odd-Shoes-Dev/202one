import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import WorkGrid from '@/app/components/WorkGrid'
import styles from '@/app/components/Site.module.css'
import { bookingHref } from '@/lib/studio-quote'

export const metadata: Metadata = {
  title: 'Creative Services | 202One Studio',
  description: 'Explore film, photography, graphics, sound and event production at 202One Studio in Mbarara.',
}

export default function WorkPage() {
  return (
    <SitePage
      title="Creative Services"
      image="work"
      description="Choose the services you need for film, photography, design, sound, or event production."
      actions={<Link href={bookingHref({ tier: 'services', hours: 1, extras: [] })} className={styles.primaryButton}>Build a creative package</Link>}
    >
      <section className={`${styles.section} ${styles.container}`} aria-labelledby="work-categories">
        <div className={styles.sectionHeading}><h2 id="work-categories">Browse creative services</h2></div>
        <WorkGrid />
      </section>
    </SitePage>
  )
}

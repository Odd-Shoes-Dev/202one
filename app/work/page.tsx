import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import WorkGrid from '@/app/components/WorkGrid'
import styles from '@/app/components/Site.module.css'

export const metadata: Metadata = {
  title: 'Sections | 202One Studio',
  description: 'Explore film, photography, graphics, sound and event production at 202One Studio in Mbarara.',
}

export default function WorkPage() {
  return (
    <SitePage
      title="The Sections"
      image="work"
      description="Choose the services you need for film, photography, design, sound, or event production."
      actions={<Link href="/pricing#booking-flow" className={styles.primaryButton}>Build your package</Link>}
    >
      <section className={`${styles.section} ${styles.container}`} aria-labelledby="work-categories">
        <div className={styles.sectionHeading}><h2 id="work-categories">Browse the studio sections</h2></div>
        <WorkGrid />
      </section>
    </SitePage>
  )
}

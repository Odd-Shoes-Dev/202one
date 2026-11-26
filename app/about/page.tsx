import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import styles from '@/app/components/Site.module.css'

export const metadata: Metadata = {
  title: 'About | 202One Studio',
  description: '202One Studio is a home for faith-driven creatives in Mbarara, Uganda.',
}

export default function AboutPage() {
  return (
    <SitePage title="About 202One" image="about" description="Raised here. Sent everywhere.">
      <section className={`${styles.container} ${styles.section} ${styles.copy}`}>
        <h2>A home for faith-driven creatives</h2>
        <p>202One exists to give creatives a place to develop their craft, make excellent work and send it into the world. We believe creativity is part of our calling.</p>
        <p>Our Mbarara studio brings artists, producers, engineers and storytellers together for rehearsal, recording, live sessions and collaborative work.</p>
        <Link href="/work" className={styles.blueButton}>Explore the sections</Link>
      </section>
    </SitePage>
  )
}

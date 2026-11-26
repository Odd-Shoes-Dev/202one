import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import styles from '@/app/components/Site.module.css'

export const metadata: Metadata = {
  title: 'Community | 202One Studio',
  description: 'Creative gatherings, listening sessions and masterclasses at 202One Studio in Mbarara.',
}

const gatherings = [
  'Open Studio Nights', 'Poet Nights', 'Movie Nights', 'Pre-Concert Shows',
  'Listening Sessions', 'Songwriting Nights', 'Masterclasses',
]

export default function CommunityPage() {
  return (
    <SitePage title="Community" image="community" description="A place for Mbarara’s artists, makers and storytellers to meet and learn together.">
      <section className={`${styles.container} ${styles.section} ${styles.copy}`}>
        <h2>What happens here</h2>
        <p>Our gatherings bring together musicians, producers, designers, filmmakers, worship teams and other creatives.</p>
        <ul className={styles.inlineList}>{gatherings.map((item) => <li key={item}>{item}</li>)}</ul>
        <Link href="/about" className={styles.textLink}>Learn about 202One</Link>
      </section>
    </SitePage>
  )
}

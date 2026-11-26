import type { Metadata } from 'next'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import WorkGrid from '@/app/components/WorkGrid'
import styles from '@/app/components/Site.module.css'
import { bookingHref, plans, type StudioPlan } from '@/lib/studio-quote'

export const metadata: Metadata = {
  title: 'The Studio | 202One Studio',
  description: 'Book private space, recording sessions, and creative services at 202One Studio in Mbarara, Uganda.',
}

const studioOptions: StudioPlan[] = ['space', 'session', 'production']
const equipment = ['Vocal booth', 'Recording console', 'Instrument backline', 'Multi-camera setup', 'Creative lighting rig', 'Lounge and community space']

export default function StudioPage() {
  return (
    <SitePage
      title="The Studio"
      image="rehearsal"
      description="Reserve a private room or book a team to help you record, film, design, and finish your project."
      actions={<Link href="/pricing#booking-flow" className={styles.primaryButton}>Build your studio package</Link>}
    >
      <section className={`${styles.container} ${styles.section}`} aria-labelledby="studio-services">
        <div className={styles.sectionHeading}><h2 id="studio-services">Book space or a session</h2></div>
        <div className={styles.infoGrid}>
          {studioOptions.map((tier) => (
            <article key={tier} className={styles.infoCard}>
              <h3>{plans[tier].title}</h3>
              <p>{plans[tier].description}</p>
              <Link href={bookingHref({ tier, hours: 1, extras: [] })} className={styles.textLink}>Customize this package</Link>
            </article>
          ))}
        </div>
      </section>
      <section className={`${styles.altSection} ${styles.section}`} aria-labelledby="studio-sections">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <div>
              <h2 id="studio-sections">Studio sections</h2>
              <p>Combine videography, photography, graphics, and audio in the same booking, or book a service on its own.</p>
            </div>
          </div>
          <WorkGrid />
        </div>
      </section>
      <section className={`${styles.container} ${styles.section} ${styles.copy}`} aria-labelledby="studio-equipment">
        <h2 id="studio-equipment">Inside the studio</h2>
        <ul className={styles.inlineList}>{equipment.map((item) => <li key={item}>{item}</li>)}</ul>
        <Link href="/contact" className={styles.textLink}>Plan a visit</Link>
      </section>
    </SitePage>
  )
}

import { ArrowRight, CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { bookingHref, plans, ugx } from '@/lib/studio-quote'
import FeaturedSession from './components/FeaturedSession'
import HomeIntro from './components/HomeIntro'
import SitePage from './components/SitePage'
import StudioLocation from './components/StudioLocation'
import StudioPlanIcon from './components/StudioPlanIcon'
import WorkGrid from './components/WorkGrid'
import styles from './components/Site.module.css'

export const revalidate = 300

const studioOptions = ['space', 'session', 'production'] as const

export default function Home() {
  return (
    <SitePage
      home
      title="Make it here."
      highlight="Finish it here."
      description="Book space to rehearse or record. Work with our team on film, photography, design, or event coverage."
      image="welcome"
      actions={<>
        <Link href="#studio-time" className={`${styles.primaryButton} ${styles.iconLabel}`}>
          <CalendarDays aria-hidden="true" /> Book studio time
        </Link>
        <Link href="/work" className={`${styles.outlineButton} ${styles.iconLabel}`}>
          Hire our creative team <ArrowRight aria-hidden="true" />
        </Link>
      </>}
    >
      <HomeIntro />
      <section className={`${styles.container} ${styles.section}`} id="studio-time" aria-labelledby="home-studio-rates">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-studio-rates">Book studio time</h2>
            <p>Choose a room for rehearsal or bring in an engineer or producer.</p>
          </div>
        </div>
        <div className={styles.infoGrid}>
          {studioOptions.map((tier) => (
            <article key={tier} className={styles.infoCard}>
              <h3 className={styles.iconLabel}>
                <StudioPlanIcon plan={tier} /> {plans[tier].title}
              </h3>
              <p>{plans[tier].description}</p>
              <p className={styles.rate}>{ugx(plans[tier].hourly)} / hour</p>
              <Link href={bookingHref({ tier, hours: 1, extras: [] })} className={styles.textLink}>
                Choose {plans[tier].title.toLowerCase()}
              </Link>
            </article>
          ))}
        </div>
      </section>
      <FeaturedSession home />
      <section id="work" className={`${styles.section} ${styles.container}`} aria-labelledby="home-work">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-work">Creative services</h2>
            <p>Find the right people and services for each part of your project.</p>
          </div>
          <Link href="/work" className={styles.textLink}>View all services</Link>
        </div>
        <WorkGrid />
      </section>
      <StudioLocation compact />
    </SitePage>
  )
}

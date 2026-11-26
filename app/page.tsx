import Link from 'next/link'
import HomeIntro from './components/HomeIntro'
import SitePage from './components/SitePage'
import StudioLocation from './components/StudioLocation'
import WorkGrid from './components/WorkGrid'
import styles from './components/Site.module.css'

const bookingSteps = [
  { title: 'Choose what you need', description: 'Start with a private room, an assisted session, or a creative service.', href: '/studio', link: 'Explore studio options' },
  { title: 'Build your price', description: 'Set your hours and add the film, design, audio, or event services you need.', href: '/pricing#booking-flow', link: 'Build a package' },
  { title: 'Book and pay online', description: 'Choose a time, review your total, and try the demo checkout.', href: '/book#booking-flow', link: 'Start booking' },
]

export default function Home() {
  return (
    <SitePage
      home
      title="Make it here."
      highlight="Finish it here."
      description="Book a private studio, record a session, or put together a full creative project in Mbarara. Choose the services you need and see your price before you book."
      image="studio"
      actions={<>
        <Link href="/pricing#booking-flow" className={styles.primaryButton}>Build your package</Link>
        <Link href="/work" className={styles.outlineButton}>Explore the sections</Link>
      </>}
    >
      <section className={`${styles.container} ${styles.section}`} aria-labelledby="how-booking-works">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="how-booking-works">From your first idea to your booking</h2>
            <p>For students, artists, and teams working on a rehearsal, a recording, or a full production.</p>
          </div>
        </div>
        <div className={styles.infoGrid}>
          {bookingSteps.map((item) => (
            <article key={item.title} className={styles.infoCard}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <Link href={item.href} className={styles.textLink}>{item.link}</Link>
            </article>
          ))}
        </div>
      </section>
      <HomeIntro />
      <section id="work" className={`${styles.section} ${styles.container}`} aria-labelledby="home-work">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="home-work">The sections</h2>
            <p>Find the right people and services for each part of your project.</p>
          </div>
          <Link href="/work" className={styles.textLink}>View all sections</Link>
        </div>
        <WorkGrid />
      </section>
      <StudioLocation compact />
    </SitePage>
  )
}

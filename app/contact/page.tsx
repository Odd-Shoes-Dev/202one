import type { Metadata } from 'next'
import Link from 'next/link'
import ContactForm from '@/app/components/ContactForm'
import SitePage from '@/app/components/SitePage'
import StudioLocation from '@/app/components/StudioLocation'
import styles from '@/app/components/Site.module.css'

export const metadata: Metadata = {
  title: 'Contact | 202One Studio',
  description: 'Contact 202One Studio or get directions to our studio in Mbarara, Uganda.',
}

export default function ContactPage() {
  const email = process.env.STUDIO_CONTACT_EMAIL
  const phone = process.env.STUDIO_CONTACT_PHONE

  return (
    <SitePage title="Contact" image="about" description="Talk to us about your project, check booking options, or find the studio in Mbarara.">
      <div className={`${styles.container} ${styles.section} ${styles.contactGrid}`}>
        <section className={styles.copy} aria-labelledby="contact-options">
          <h2 id="contact-options">Talk to 202One</h2>
          <p>Ask about private rooms, student sessions, production, or event coverage.</p>
          {email && <p><a href={`mailto:${email}`}>{email}</a></p>}
          {phone && <p><a href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a></p>}
          <Link href="/book#booking-flow" className={styles.blueButton}>Choose a studio package</Link>
          <p><a href="#location">Find the studio in Mbarara, Uganda</a></p>
        </section>
        <ContactForm />
      </div>
      <StudioLocation />
    </SitePage>
  )
}

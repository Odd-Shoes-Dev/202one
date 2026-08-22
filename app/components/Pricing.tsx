import styles from './Pricing.module.css'

const plans = [
  { name: 'SPACE', tagline: 'Come use the room.', desc: 'For rehearsals, songwriting, practice and self-directed sessions. Bring your own instruments or use ours.', amount: 'UGX 35,000', per: '/ hour', note: 'Tentative — subject to confirmation', cta: 'Book Space', featured: false },
  { name: 'SESSION', tagline: 'Come make the record.', desc: 'Studio time plus engineer and producer assistance. For recording vocals, instruments and full songs.', amount: 'UGX 60,000', per: '/ hour', note: 'Tentative — subject to confirmation', cta: 'Book a Session', featured: true },
  { name: 'PRODUCTION', tagline: 'Come finish the work.', desc: 'Full recording, editing, arrangement, vocal tuning and mixing. For complete, release-ready tracks.', amount: 'UGX 100,000', per: '/ hour', note: 'From — custom quote for full projects', cta: 'Talk to Us', featured: false },
]

export default function Pricing() {
  return (
    <section className={`${styles.section} ${styles.sectionPad}`} id="pricing">
      <div className={`${styles.wrap} reveal`}>
        <span className={styles.eyebrow}>BOOKING &amp; PRICING</span>
        <div className={styles.sectionHead}>
          <h2>Simple, straightforward booking.</h2>
          <p>Three ways to use the space. Rates below are a starting guide — every booking includes a short conversation about what you&apos;re making.</p>
        </div>
        <div className={styles.grid}>
          {plans.map(p => (
            <div key={p.name} className={`${styles.card} ${p.featured ? styles.featured : ''}`}>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.tagline}>{p.tagline}</div>
              <p className={styles.desc}>{p.desc}</p>
              <div className={styles.amount}>{p.amount} <span className={styles.per}>{p.per}</span></div>
              <div className={styles.note}>{p.note}</div>
              <div className={styles.book}>{p.cta}</div>
            </div>
          ))}
        </div>
        <div className={styles.feeNote}>
          <span><strong>Reserve your slot for UGX 10,000</strong> via mobile money or card. It&apos;s credited toward your total — pay the rest your way, when you arrive.</span>
        </div>
        <p className={styles.talkLink}>Need something different, or booking a full-day block? <a href="#book">Talk to us →</a></p>
      </div>
    </section>
  )
}

import styles from './About.module.css'

const pillars = [
  { word: 'Studio', desc: 'Record. Rehearse. Produce.' },
  { word: 'Sessions', desc: 'Watch. Listen. Experience.' },
  { word: 'Community', desc: 'Meet. Learn. Collaborate.' },
  { word: 'Mission', desc: 'Create. Equip. Send.' },
]

export default function About() {
  return (
    <section className={styles.section} id="about">
      <div className={`${styles.wrap} reveal`}>
        <span className={styles.eyebrow}>ABOUT 202ONE</span>
        <div className={styles.mission}>Raised here. <span className={styles.sent}>Sent everywhere.</span></div>
        <p>202One exists to give faith-driven creatives a place to develop their craft, make excellent work and send it into the world. We believe creativity is part of our calling — the studio is simply where that calling gets built, one session at a time.</p>
        <div className={styles.pillars}>
          {pillars.map(p => (
            <div key={p.word}>
              <div className={styles.pillarWord}>{p.word}</div>
              <div className={styles.pillarDesc}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

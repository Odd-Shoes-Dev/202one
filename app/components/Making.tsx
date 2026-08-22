import styles from './Making.module.css'

const cards = [
  { num: '01', title: 'Rehearse', tagline: 'Bring the band. Turn it up. Get ready.', desc: 'Dedicated rehearsal space for bands, worship teams, artists and musicians.', cta: 'BOOK REHEARSAL' },
  { num: '02', title: 'Record', tagline: 'Turn the idea into a record.', desc: 'Vocals, instruments, songwriting sessions, overdubs and full recording sessions.', cta: 'BOOK A RECORDING SESSION' },
  { num: '03', title: 'Live', tagline: "Don't just record it. Capture the moment.", desc: 'Multi-camera live sessions, worship recordings, acoustic performances and content.', cta: 'EXPLORE LIVE SESSIONS' },
  { num: '04', title: 'Produce', tagline: 'Build the sound around the song.', desc: 'Producer support, vocal editing, arrangement, mixing and post-production.', cta: 'WORK WITH A PRODUCER' },
]

export default function Making() {
  return (
    <section className={`${styles.making} ${styles.sectionPad}`} id="studio">
      <div className={`${styles.wrap} reveal`}>
        <span className={styles.eyebrow}>WHERE DO YOU START?</span>
        <div className={styles.sectionHead}>
          <h2>What are you making?</h2>
        </div>
      </div>
      <div className={`${styles.wrap} reveal`}>
        <div className={styles.grid}>
          {cards.map(c => (
            <div key={c.num} className={styles.card}>
              <div className={styles.top}>
                <div className={styles.num}>{c.num}</div>
              </div>
              <div>
                <div className={styles.title}>{c.title}</div>
                <div className={styles.tagline}>{c.tagline}</div>
                <p className={styles.desc}>{c.desc}</p>
                <div className={styles.cta}>{c.cta} <span className={styles.arrow}>→</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

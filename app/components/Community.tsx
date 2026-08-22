import styles from './Community.module.css'

const tags = ['Open Studio Nights', 'Poet Nights', 'Movie Nights', 'Pre-Concert Shows', 'Listening Sessions', 'Songwriting Nights', 'Masterclasses']

const events = [
  { date: 'THU · SEP 4', name: 'Poet Night', desc: 'Open mic for spoken word and poetry from the community. All welcome, all levels.' },
  { date: 'SAT · SEP 13', name: 'Listening Session', desc: 'New music from 202One artists, played loud, followed by open conversation.' },
  { date: 'FRI · SEP 26', name: 'Pre-Concert Show', desc: "An intimate warm-up set ahead of the weekend's main concert. Limited capacity." },
]

export default function Community() {
  return (
    <section className={`${styles.section} ${styles.sectionPad}`} id="community">
      <div className={`${styles.wrap} reveal`}>
        <span className={styles.eyebrow}>THE 202ONE COMMUNITY</span>
        <div className={styles.sectionHead}>
          <h2>Create with people who get it.</h2>
          <p>Artists, worship teams, producers, songwriters, engineers, filmmakers, designers, developers and storytellers — all working in the same room, on different nights, for different reasons.</p>
        </div>
        <div className={styles.tags}>
          {tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>
        <div className={styles.grid}>
          {events.map(e => (
            <div key={e.name} className={styles.card}>
              <div className={styles.date}>{e.date}</div>
              <div className={styles.name}>{e.name}</div>
              <p className={styles.desc}>{e.desc}</p>
              <div className={styles.free}>RSVP — FREE</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

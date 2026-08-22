import styles from './TheSpace.module.css'

const features = ['Vocal booth', 'Recording console', 'Full instrument backline', 'Multi-camera live setup', 'Creative lighting rig', 'Lounge & community space']

export default function TheSpace() {
  return (
    <section className={`${styles.section} ${styles.sectionPad}`}>
      <div className={`${styles.wrap} reveal`}>
        <div className={styles.grid}>
          <div className={styles.visual}>
            <span className={styles.visualLabel}>— studio photography —</span>
          </div>
          <div>
            <span className={styles.eyebrow}>THE SPACE</span>
            <h2 className={styles.h2}>Built for the work.</h2>
            <p className={styles.p}>Every corner of the room is set up to remove friction between an idea and a finished piece of work — whether that's a four-piece band running through a set or a solo vocalist tracking one more take.</p>
            <ul className={styles.features}>
              {features.map(f => <li key={f}>{f}</li>)}
            </ul>
            <a href="#book" className={styles.btn}>Explore the Studio →</a>
          </div>
        </div>
      </div>
    </section>
  )
}

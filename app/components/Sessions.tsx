import styles from './Sessions.module.css'

export default function Sessions() {
  return (
    <section className={`${styles.section} ${styles.sectionPad}`} id="sessions">
      <div className={`${styles.wrap} reveal`}>
        <span className={styles.eyebrow}>202ONE SESSIONS</span>
        <div className={styles.sectionHead}>
          <h2>One room. One song.<br />One moment.</h2>
          <p>Short-form live recordings featuring artists, worship teams and creatives from the 202One community. Beautiful cinematography. Minimal set. Real performances.</p>
        </div>
        <div className={styles.feature}>
          <div className={styles.video}>
            <div className={styles.playBtn}>
              <svg width="22" height="22" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="#D4A662"/></svg>
            </div>
          </div>
          <div className={styles.info}>
            <span className={styles.eyebrow}>LATEST SESSION</span>
            <h3>Steady</h3>
            <div className={styles.artist}>Naomi K. — Live at 202One</div>
            <p>A single take, one mic, the room lights low. Recorded live in the main studio as part of the ongoing 202One Sessions series.</p>
            <div className={styles.watch}>WATCH SESSION →</div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.grain} />
      <div className={styles.inner}>
        <div className={styles.eyebrow}>
          <span className={styles.line} />
          202ONE STUDIO · MBARARA
        </div>
        <h1 className={styles.h1}>Create<br /><em>here.</em></h1>
        <p className={styles.sub}>A professional creative space for artists, musicians, producers and storytellers — built inside a community that exists to create and send.</p>
        <div className={styles.verbs}>
          <span>Rehearse</span><span>Record</span><span>Produce</span><span>Perform</span>
        </div>
        <div className={styles.ctas}>
          <button className={styles.btnPrimary} onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}>Book the Studio →</button>
          <a href="#studio" className={styles.btnSecondary}>Explore the Space</a>
        </div>
      </div>
      <div className={styles.footline}>
        <span className={styles.loc}>202ONE — MBARARA, UGANDA</span>
        <span className={styles.mission}>RAISED HERE. SENT EVERYWHERE.</span>
      </div>
    </section>
  )
}

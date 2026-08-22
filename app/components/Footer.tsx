import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.wrap}>
        <div className={styles.grid}>
          <div>
            <div className={styles.logo}>202<span>One</span></div>
            <div className={styles.mission}>RAISED HERE. SENT EVERYWHERE.</div>
          </div>
          <div className={styles.cols}>
            <div className={styles.col}>
              <h4>STUDIO</h4>
              <a href="#studio">Rehearse</a>
              <a href="#studio">Record</a>
              <a href="#sessions">Live Sessions</a>
              <a href="#studio">Produce</a>
            </div>
            <div className={styles.col}>
              <h4>ABOUT</h4>
              <a href="#pricing">Pricing</a>
              <a href="#community">Community</a>
              <a href="#about">Our Mission</a>
            </div>
            <div className={styles.col}>
              <h4>VISIT</h4>
              <p>Kampala, Uganda</p>
              <a href="#book">Book the Space</a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <span>© 2026 202One Studio</span>
          <span>Reserve with mobile money. Pay the rest your way.</span>
        </div>
      </div>
    </footer>
  )
}

import styles from './FinalCta.module.css'

export default function FinalCta() {
  return (
    <section className={styles.section} id="book">
      <div className={`${styles.inner} reveal`}>
        <span className={styles.eyebrow}>WHAT ARE YOU MAKING?</span>
        <h2>Let&apos;s make it <em>here.</em></h2>
        <a href="#" className={styles.btn}>Book the Studio →</a>
      </div>
    </section>
  )
}

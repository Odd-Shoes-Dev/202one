import styles from './Experience.module.css'

export default function Experience() {
  return (
    <section className={styles.section}>
      <div className={`${styles.inner} reveal`}>
        <span className={styles.eyebrow}>MORE THAN A STUDIO</span>
        <h2>We&apos;re building a home for <em>faith-driven creatives.</em></h2>
        <p>202One isn&apos;t simply a place to hire equipment. It&apos;s a place where musicians, producers, artists, storytellers, engineers and builders meet, create, learn and collaborate. Come in for a two-hour rehearsal, leave having met a producer. A worship team can record a live session. A young artist can work alongside someone more experienced. A filmmaker can find a musician here.</p>
        <p className={styles.tag}>That&apos;s the community.</p>
      </div>
    </section>
  )
}

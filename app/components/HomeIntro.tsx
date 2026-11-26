import Image from 'next/image'
import Link from 'next/link'
import { studioImage } from './SitePage'
import styles from './HomeIntro.module.css'

export default function HomeIntro() {
  return (
    <section id="studio" className={styles.intro} aria-labelledby="home-studio">
      <div className={styles.copy}>
        <h2 id="home-studio">Make it seen.<br /><span>Make it heard.</span></h2>
        <p>Record a song, make a film, design a campaign or capture an event. Bring your idea to our creative studio in Mbarara.</p>
        <Link href="/studio" className={styles.link}>Explore the studio</Link>
      </div>
      <div className={styles.collage}>
        <div className={styles.performance}><Image src={studioImage('sessions')} alt="" fill unoptimized /></div>
        <div className={styles.film}><Image src={studioImage('film')} alt="" fill unoptimized /></div>
        <div className={styles.graphics}><Image src={studioImage('graphics')} alt="" fill unoptimized /></div>
      </div>
    </section>
  )
}

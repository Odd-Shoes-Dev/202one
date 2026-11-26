import Image from 'next/image'
import type { ReactNode } from 'react'
import Nav from './Nav'
import Footer from './Footer'
import FloatingActions from './FloatingActions'
import styles from './Site.module.css'

export type StudioImage = 'studio' | 'film' | 'graphics' | 'audio' | 'events' | 'sessions' | 'community' | 'booking' | 'work' | 'rehearsal' | 'pricing' | 'about'

export function studioImage(image: StudioImage) {
  return `/images/studio/${image}.webp`
}

interface SitePageProps {
  title: string
  highlight?: string
  description: string
  image: StudioImage
  home?: boolean
  actions?: ReactNode
  children: ReactNode
}

export default function SitePage({
  title, highlight, description, image, home, actions, children,
}: SitePageProps) {
  return (
    <div className={styles.site}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <section className={home ? `${styles.hero} ${styles.heroHome}` : styles.hero}>
          <Image className={styles.heroImage} src={studioImage(image)} alt="" fill preload unoptimized />
          <div className={styles.heroContent}>
            {home && <p className={styles.heroLocation}>202One Studio <span aria-hidden="true">·</span> Mbarara, Uganda</p>}
            <h1>
              {title}
              {highlight && <><br /><span className={styles.heroAccent}>{highlight}</span></>}
            </h1>
            <p className={styles.heroDescription}>{description}</p>
            {actions && <div className={styles.actions}>{actions}</div>}
          </div>
        </section>
        {children}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  )
}

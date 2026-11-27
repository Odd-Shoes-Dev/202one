import { Clapperboard, Headphones, MicVocal, Music } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import SitePage from '@/app/components/SitePage'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Community | 202One Studio',
  description: 'Creative gatherings, listening sessions and masterclasses at 202One Studio in Mbarara.',
}

const featuredGatherings = [
  {
    title: 'Open Studio Nights',
    description: 'Get close to the music and meet the people making it.',
    image: '/images/community/open-studio.webp',
    alt: 'A vocalist performs with an acoustic guitarist in front of a small audience',
  },
  {
    title: 'Songwriting Nights',
    description: 'Bring an idea and write with other musicians.',
    image: '/images/community/songwriting.webp',
    alt: 'Three musicians work on a song with a guitar and an open notebook',
  },
  {
    title: 'Masterclasses',
    description: 'Pick up practical skills from other creatives.',
    image: '/images/community/masterclass.webp',
    alt: 'A filmmaker shows two workshop participants how to use a video camera',
  },
]

const otherGatherings = [
  { title: 'Poet Nights', Icon: MicVocal },
  { title: 'Movie Nights', Icon: Clapperboard },
  { title: 'Pre-Concert Shows', Icon: Music },
  { title: 'Listening Sessions', Icon: Headphones },
]
const levels = [18, 34, 25, 54, 40, 77, 100, 61, 84, 47, 57, 32, 17]

export default function CommunityPage() {
  return (
    <SitePage title="Community" image="community" description="A place for Mbarara’s artists, makers and storytellers to meet and learn together.">
      <section id="what-happens-here" className={styles.section} aria-labelledby="community-gatherings">
        <header className={styles.heading}>
          <div>
            <h2 id="community-gatherings">What happens here</h2>
            <p>Our gatherings bring together musicians, producers, designers, filmmakers, worship teams and other creatives.</p>
          </div>
          <div className={styles.waveform} aria-hidden="true">
            {levels.map((level) => <span key={level} style={{ height: `${level}%` }} />)}
          </div>
        </header>

        <figure>
          <ul className={styles.gallery} aria-label="Featured gatherings">
            {featuredGatherings.map(({ title, description, image, alt }) => (
              <li className={styles.frame} key={title}>
                <Image src={image} alt={alt} fill unoptimized />
                <div className={styles.caption}>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>
          <figcaption className={styles.imageCredit}>Illustrative imagery</figcaption>
        </figure>

        <div className={styles.more}>
          <ul className={styles.gatherings} aria-label="More gatherings">
            {otherGatherings.map(({ title, Icon }) => (
              <li key={title}><Icon aria-hidden="true" /> {title}</li>
            ))}
          </ul>
          <Link href="/about" className={styles.aboutLink}>Learn about 202One</Link>
        </div>
      </section>
    </SitePage>
  )
}

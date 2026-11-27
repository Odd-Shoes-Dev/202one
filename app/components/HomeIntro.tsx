import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HomeIntro.module.css'

const scenes = [
  { title: 'Recording & production', image: 'recording', href: '/work/audio', alt: 'A vocalist wearing headphones sings into a studio microphone' },
  { title: 'Film & photography', image: 'film', href: '/work/videography-photography', alt: 'A cinematographer checks the monitor on a tripod-mounted camera' },
  { title: 'Design & motion', image: 'design', href: '/work/graphics', alt: 'A designer works on brightly coloured shapes in a motion graphics timeline' },
]

export default function HomeIntro() {
  return (
    <section id="studio" className={styles.intro} aria-labelledby="home-studio">
      <div className={styles.heading}>
        <h2 id="home-studio">Make it seen. <span>Make it heard.</span></h2>
        <Link href="/studio" className={styles.link}>
          Explore the studio <ArrowRight aria-hidden="true" />
        </Link>
      </div>
      <figure>
        <ul className={styles.gallery}>
          {scenes.map(({ title, image, href, alt }) => (
            <li className={styles.frame} key={image}>
              <Link href={href} className={styles.card} aria-label={title}>
                <Image src={`/images/home/${image}.webp`} alt={alt} fill unoptimized />
                <span className={styles.caption}>
                  <span>{title}</span>
                  <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <figcaption className={styles.imageCredit}>Illustrative imagery</figcaption>
      </figure>
    </section>
  )
}

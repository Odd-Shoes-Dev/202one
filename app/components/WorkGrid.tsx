import Image from 'next/image'
import Link from 'next/link'
import { categories, type CategorySlug } from '@/lib/portfolio'
import { studioImage } from './SitePage'
import styles from './Site.module.css'

export default function WorkGrid({ exclude }: { exclude?: CategorySlug }) {
  return (
    <div className={styles.workGrid}>
      {Object.entries(categories).filter(([slug]) => slug !== exclude).map(([slug, category]) => (
        <Link href={`/work/${slug}`} key={slug} className={styles.workCard}>
          <div className={styles.workImage}>
            <Image src={studioImage(category.image)} alt="" fill unoptimized />
          </div>
          <div className={styles.workCardContent}>
            <h3>{category.title}</h3>
            <p>{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

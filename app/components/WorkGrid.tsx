import { AudioLines, Camera, Clapperboard, Palette, type LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { categories, type CategorySlug } from '@/lib/portfolio'
import { studioImage } from './SitePage'
import styles from './Site.module.css'

const categoryIcons = {
  'videography-photography': Camera,
  graphics: Palette,
  audio: AudioLines,
  'audio-video-services': Clapperboard,
} satisfies Record<CategorySlug, LucideIcon>

export default function WorkGrid({ exclude }: { exclude?: CategorySlug }) {
  return (
    <div className={styles.workGrid}>
      {Object.entries(categories).filter(([slug]) => slug !== exclude).map(([slug, category]) => {
        const Icon = categoryIcons[slug as CategorySlug]

        return (
          <Link href={`/work/${slug}`} key={slug} className={styles.workCard}>
            <div className={styles.workImage}>
              <Image src={studioImage(category.image)} alt="" fill unoptimized />
            </div>
            <div className={styles.workCardContent}>
              <h3 className={styles.iconLabel}>
                <Icon aria-hidden="true" /> {category.title}
              </h3>
              <p>{category.description}</p>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

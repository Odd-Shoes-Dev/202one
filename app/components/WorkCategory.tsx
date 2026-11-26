import Image from 'next/image'
import Link from 'next/link'
import { categories, projects, type CategorySlug, type PortfolioProject } from '@/lib/portfolio'
import { bookingHref } from '@/lib/studio-quote'
import SitePage from './SitePage'
import WorkGrid from './WorkGrid'
import styles from './Site.module.css'

function Project({ project }: { project: PortfolioProject }) {
  const { media, title } = project
  return (
    <article className={styles.project}>
      <h3>{title}</h3>
      <p>{project.description}</p>
      {media.type === 'gallery' && (
        <div className={styles.gallery}>
          {media.images.map((image) => <Image key={image.src} {...image} alt={image.alt} sizes="(max-width: 640px) 100vw, 35vw" />)}
        </div>
      )}
      {media.type === 'video' && (
        <video controls playsInline preload="none" src={media.src} poster={media.poster} aria-label={title}>
          <track kind="captions" srcLang="en" label="English" src={media.captions} />
          <a href={media.src}>Open video</a>
        </video>
      )}
      {media.type === 'audio' && (
        <>
          <audio controls preload="none" src={media.src} aria-label={title}>
            <a href={media.src}>Open audio</a>
          </audio>
          {media.transcript && (
            <details>
              <summary>Transcript</summary>
              <p>{media.transcript}</p>
            </details>
          )}
        </>
      )}
    </article>
  )
}

export default function WorkCategory({ slug }: { slug: CategorySlug }) {
  const category = categories[slug]
  const sections = category.sections.map((section) => ({
    ...section,
    projects: projects.filter((project) => project.sections.includes(section.id)),
  }))

  return (
    <SitePage title={category.title} description={category.description} image={category.image}>
      <div className={styles.sectionNav}>
        <nav className={styles.container} aria-label="On this page">
          <Link className={styles.sectionBack} href="/work">All sections</Link>
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </nav>
      </div>
      <div className={`${styles.container} ${styles.section}`}>
        <div className={styles.sectionList}>
          {sections.map((section) => (
            <section className={styles.workSection} id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`}>{section.title}</h2>
              <div className={styles.sectionDetail}>
                <p>{section.description}</p>
                <Link className={styles.textLink} href={bookingHref({ tier: 'services', hours: 1, extras: [section.id] })}>
                  Customize {section.title}
                </Link>
                {section.projects.map((project) => <Project key={project.id} project={project} />)}
              </div>
            </section>
          ))}
        </div>
      </div>
      <section className={`${styles.altSection} ${styles.section}`} aria-labelledby="related-work">
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h2 id="related-work">Explore more sections</h2>
          </div>
          <WorkGrid exclude={slug} />
        </div>
      </section>
    </SitePage>
  )
}

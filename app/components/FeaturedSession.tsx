import Link from 'next/link'
import { db } from '@/lib/adapters/db'
import styles from './Site.module.css'

function videoEmbed(url: URL) {
  const host = url.hostname.replace(/^www\./, '')
  const [, route, videoId] = url.pathname.split('/')
  const youtubeId = host === 'youtu.be' ? route
    : host === 'youtube.com' || host === 'm.youtube.com'
      ? url.searchParams.get('v') ?? videoId
      : null

  if (youtubeId && /^[\w-]{11}$/.test(youtubeId)) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}`
  }

  const vimeoId = host === 'vimeo.com' ? route : host === 'player.vimeo.com' ? videoId : null
  if (vimeoId && /^\d+$/.test(vimeoId)) return `https://player.vimeo.com/video/${vimeoId}`
  return null
}

function parseVideo(url: string) {
  try {
    const video = new URL(url)
    return video.protocol === 'https:' ? video : null
  } catch {
    return null
  }
}

export default async function FeaturedSession({ home = false }: { home?: boolean }) {
  if (!process.env.DATABASE_URL) return null

  const session = await db.getFeaturedSession().catch(() => null)
  const video = session?.video_url ? parseVideo(session.video_url) : null
  if (!session || !video) return null

  const embed = videoEmbed(video)

  return (
    <section className={`${styles.altSection} ${styles.section}`} aria-labelledby="featured-session">
      <div className={`${styles.container} ${styles.featuredSession}`}>
        <div className={styles.copy}>
          <h2 id="featured-session">{session.title}</h2>
          <p><strong>{session.artist_name}</strong></p>
          <p>{session.description}</p>
          <a href={video.href} target="_blank" rel="noreferrer" className={styles.textLink}>Watch the session</a>
          {home && <Link href="/live-sessions" className={styles.textLink}>Explore Live Sessions</Link>}
        </div>
        {embed && (
          <iframe
            className={styles.sessionVideo}
            src={embed}
            title={`${session.title} · ${session.artist_name}`}
            loading="lazy"
            allow="encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </section>
  )
}

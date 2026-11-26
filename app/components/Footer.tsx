import Link from 'next/link'
import { categories } from '@/lib/portfolio'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.identity}>
            <Link href="/" className={styles.logo} aria-label="202One Studio home">202<span>One</span></Link>
            <p>Raised here. Sent everywhere.</p>
            <p>Mbarara, Uganda</p>
          </div>
          <nav className={styles.links} aria-label="Sections and studio links">
            <div>
              <h2>Sections</h2>
              {Object.entries(categories).map(([slug, category]) => (
                <Link key={slug} href={`/work/${slug}`}>{category.title}</Link>
              ))}
            </div>
            <div>
              <h2>Studio</h2>
              <Link href="/studio">The Space</Link>
              <Link href="/live-sessions">Live Sessions</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/book">Book the Studio</Link>
            </div>
            <div>
              <h2>202One</h2>
              <Link href="/about">About</Link>
              <Link href="/community">Community</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/contact#location">Find the studio</Link>
            </div>
          </nav>
        </div>
        <p className={styles.copyright}>© 202One Studio</p>
      </div>
    </footer>
  )
}

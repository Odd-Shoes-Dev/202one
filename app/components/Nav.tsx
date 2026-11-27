'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState } from 'react'
import styles from './Nav.module.css'

const links = [
  { href: '/', label: 'Home' },
  { href: '/work', label: 'Services' },
  { href: '/studio', label: 'Studio' },
  { href: '/live-sessions', label: 'Live Sessions' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Nav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        aria-label="Main navigation"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && menuOpen) {
            setMenuOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <Link href="/" className={styles.logo} aria-label="202One Studio home" onClick={() => setMenuOpen(false)}>
          202<span>One</span><small>STUDIO</small>
        </Link>
        <button
          ref={menuButton}
          type="button"
          className={styles.mobileToggle}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <div id="main-navigation" className={styles.navLinks} data-open={menuOpen}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              data-active={pathname === href || (href !== '/' && pathname.startsWith(href + '/'))}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link className={styles.navCta} href="/book" aria-current={pathname === '/book' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
            Book the Studio
          </Link>
        </div>
      </nav>
    </header>
  )
}

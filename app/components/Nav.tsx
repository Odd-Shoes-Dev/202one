'use client'

import { CalendarDays, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import styles from './Nav.module.css'
import site from './Site.module.css'

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
  const [hidden, setHidden] = useState(false)
  const header = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY)

    function handleScroll() {
      const scrollY = Math.max(0, window.scrollY)
      if (scrollY <= (header.current?.offsetHeight ?? 0)) {
        setHidden(false)
      } else if (Math.abs(scrollY - previousY) >= 6) {
        setHidden(scrollY > previousY)
      } else {
        return
      }
      previousY = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header ref={header} className={styles.header} data-hidden={hidden} data-menu-open={menuOpen}>
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
          className={`${styles.mobileToggle} ${site.iconLabel}`}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
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
          <Link className={`${styles.navCta} ${site.iconLabel}`} href="/book" aria-current={pathname === '/book' ? 'page' : undefined} onClick={() => setMenuOpen(false)}>
            <CalendarDays aria-hidden="true" /> Book the Studio
          </Link>
        </div>
      </nav>
    </header>
  )
}

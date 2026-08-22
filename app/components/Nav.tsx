'use client'

import { useState, useEffect } from 'react'
import styles from './Nav.module.css'
import BookingDrawer from './BookingDrawer'

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('202one-theme')
    if (saved === 'light') setTheme('light')
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('202one-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
      localStorage.setItem('202one-theme', 'dark')
    }
  }

  useEffect(() => {
    function onOpen() { setDrawerOpen(true) }
    window.addEventListener('open-booking', onOpen)
    return () => window.removeEventListener('open-booking', onOpen)
  }, [])

  function closeMenu() { setMenuOpen(false) }

  return (
    <>
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#" className={styles.logo}>202<span>One</span></a>
        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ''}`}>
          <li><a href="#studio" onClick={closeMenu}>Studio</a></li>
          <li><a href="#sessions" onClick={closeMenu}>Live Sessions</a></li>
          <li><a href="#pricing" onClick={closeMenu}>Pricing</a></li>
          <li><a href="#community" onClick={closeMenu}>Community</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
        </ul>
        <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? '☽' : '☀'}
        </button>
        <button className={styles.navCta} onClick={() => setDrawerOpen(true)}>Book the Space</button>
        <button
          className={styles.mobileToggle}
          aria-label="Menu"
          onClick={() => setMenuOpen(o => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>
    </header>
    <BookingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}

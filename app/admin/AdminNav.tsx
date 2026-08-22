'use client'

import { usePathname } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import styles from './admin.module.css'

const links = [
  { href: '/admin',          label: 'Dashboard' },
  { href: '/admin/bookings', label: 'Bookings'  },
  { href: '/admin/content',  label: 'Content'   },
  { href: '/admin/pricing',  label: 'Pricing'   },
]

export default function AdminNav() {
  const path = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>202<span>One</span></div>
      <div className={styles.sidebarMeta}>Admin</div>
      <nav className={styles.sidebarNav}>
        {links.map(l => (
          <a
            key={l.href}
            href={l.href}
            className={`${styles.sidebarLink} ${path === l.href ? styles.active : ''}`}
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className={styles.sidebarFooter}>
        <a href="/" className={styles.sidebarMuted}>← View site</a>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>Sign out</button>
        </form>
      </div>
    </aside>
  )
}

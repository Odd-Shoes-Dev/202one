'use client'

import { useEffect } from 'react'
import BookingForm from '@/app/book/BookingForm'
import styles from './BookingDrawer.module.css'

interface Props {
  open: boolean
  onClose: () => void
}

export default function BookingDrawer({ open, onClose }: Props) {
  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} aria-modal="true" role="dialog">
        <div className={styles.drawerHeader}>
          <div className={styles.drawerTitle}>
            <span className={styles.logo}>202<span>One</span></span>
            <span className={styles.titleSep}>·</span>
            <span className={styles.titleLabel}>Book the Space</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.drawerBody}>
          <BookingForm onSuccess={onClose} />
        </div>
      </aside>
    </>
  )
}

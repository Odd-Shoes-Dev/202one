import BookingForm from './BookingForm'
import styles from './page.module.css'
import Nav from '@/app/components/Nav'

export const metadata = { title: '202One — Book the Studio' }

export default function BookPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <span className={styles.eyebrow}><span className={styles.line} /> BOOK THE SPACE</span>
            <h1 className={styles.h1}>What are you<br /><em>making?</em></h1>
            <p className={styles.sub}>Fill in the details below. We'll confirm your slot and send payment instructions for the UGX 10,000 deposit.</p>
          </div>
        </div>
        <div className={styles.body}>
          <BookingForm />
        </div>
      </main>
    </>
  )
}

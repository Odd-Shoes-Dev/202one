import { requireAdmin } from '@/app/actions/auth'
import AdminNav from './AdminNav'
import styles from './admin.module.css'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className={styles.shell}>
      <AdminNav />
      <main className={styles.main}>{children}</main>
    </div>
  )
}

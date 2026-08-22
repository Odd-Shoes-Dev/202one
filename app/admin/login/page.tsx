import LoginForm from './LoginForm'
import styles from './login.module.css'

export const metadata = { title: '202One Admin — Login' }

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.logo}>202<span>One</span></div>
        <div className={styles.label}>Admin Access</div>
        <LoginForm />
      </div>
    </main>
  )
}

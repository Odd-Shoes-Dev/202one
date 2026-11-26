'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { login } from '@/app/actions/auth'
import styles from './login.module.css'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const result = await login(password)
    if (result.success) {
      router.push('/admin')
    } else {
      setError(result.error ?? 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="password"
        className={styles.input}
        placeholder="Admin password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        autoFocus
      />
      {error && <div className={styles.error}>{error}</div>}
      <button type="submit" className={styles.btn} disabled={loading || !password}>
        {loading ? 'Signing in...' : 'Sign in →'}
      </button>
    </form>
  )
}

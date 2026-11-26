'use client'

import { useState, type FormEvent } from 'react'
import styles from './ContactForm.module.css'

export default function ContactForm() {
  const [result, setResult] = useState('')

  function sendDemoEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const subject = data.get('subject')
    const message = data.get('message')
    if (typeof subject !== 'string' || typeof message !== 'string' || !message.trim()) {
      setResult('Enter a message to continue.')
      return
    }
    try {
      const entry = { subject, message: message.trim().slice(0, 2000), createdAt: new Date().toISOString() }
      window.localStorage.setItem('202one-demo-enquiry', JSON.stringify(entry))
      event.currentTarget.reset()
      setResult('Demo enquiry saved in this browser.')
    } catch {
      setResult('The demo enquiry could not be saved. Check that this browser allows site storage.')
    }
  }

  return (
    <form className={styles.form} onSubmit={sendDemoEnquiry}>
      <h3>Send a studio enquiry</h3>
      <p>Try the contact form with a sample message.</p>
      <label>
        <span>What can we help with?</span>
        <select name="subject">
          <option>Studio booking</option>
          <option>Student project</option>
          <option>Creative services</option>
          <option>Studio visit</option>
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" rows={5} required maxLength={2000} />
      </label>
      <button type="submit">Save demo enquiry</button>
      {result && <p role="status">{result}</p>}
    </form>
  )
}

'use client'

import { useEffect } from 'react'

export default function RevealObserver() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12 })

    els.forEach(el => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('in')
      } else {
        io.observe(el)
      }
    })

    return () => io.disconnect()
  }, [])

  return null
}

import type { Metadata } from 'next'
import { Fraunces, Space_Grotesk } from 'next/font/google'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  variable: '--font-fraunces',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '202One Studio | Mbarara Creative Studio',
  description: 'A creative studio for film, photography, graphics and sound in Mbarara, Uganda.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${fraunces.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('202one-theme');if(t==='light')document.documentElement.setAttribute('data-theme','light');})()`,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Galatea AI | Neural Interface',
  description: 'Advanced AI consciousness interface - Real-time conversation with Galatea AI',
  keywords: 'AI, artificial intelligence, neural interface, cyberpunk, Galatea',
  authors: [{ name: 'Galatea Systems' }],
  viewport: 'width=device-width, initial-scale=1',
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

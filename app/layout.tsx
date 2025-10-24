import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SYDE GSA - Systems Design Engineering Graduate Student Association',
  description: 'The Systems Design Engineering Graduate Student Association at the University of Waterloo',
  icons: {
    icon: '/SYDEGSALogo.png',
    apple: '/SYDEGSALogo.png',
  }
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

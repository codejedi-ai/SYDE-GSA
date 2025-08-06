import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ComicProvider } from "@/app/context/comic-context"
import { ComicHeaderWrapper } from "../components/comic/comic-header-wrapper"
import { ComicFooter } from "../components/comic/comic-footer"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Galatea 2.0 | A Cyberpunk Retelling",
  description: "A cyberpunk comic retelling of the Pygmalion myth",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="scan-line"></div>
        <ComicProvider>
          <ComicHeaderWrapper />
          {children}
          <ComicFooter />
        </ComicProvider>
      </body>
    </html>
  )
}

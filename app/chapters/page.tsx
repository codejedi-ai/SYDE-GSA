"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

interface Chapter {
  id: number
  title: string
  subtitle: string
  pages: number[]
  coverPage: number
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchChapters() {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/chapters`)
        if (!res.ok) {
          throw new Error("Failed to fetch chapters")
        }
        const data = await res.json()
        if (data.success) {
          setChapters(data.chapters as Chapter[])
        } else {
          setChapters([])
          console.error("API error fetching chapters:", data.error)
        }
      } catch (error) {
        setChapters([])
        console.error("Client-side error fetching chapters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChapters()
  }, [])
  return (
    <main className="min-h-screen flex flex-col">
      {/* Chapter Header */}
      <div className="w-full bg-cyber-darker border-y-4 border-cyber-blue/30 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-cyber mb-4 neon-text text-center">CHAPTERS</h1>
          <p className="text-xl text-cyber-blue text-center max-w-2xl mx-auto">
            The complete story of Galatea 2.0, a cyberpunk retelling of the Pygmalion myth
          </p>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="flex-grow container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-cyber-blue animate-pulse text-xl">Loading Chapters...</div>
          </div>
        ) : chapters.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">No chapters found or failed to load.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter) => (
              <Link key={chapter.id} href={`/comic/${chapter.coverPage}`} className="group">
                <div className="comic-panel h-full transition-all duration-300 group-hover:border-cyber-blue/80 group-hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]">
                  <div className="relative aspect-[3/4] w-full">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-cyber-dark/90 z-10"></div>
                    <Image
                      src={`/placeholder.svg?height=400&width=300&query=cyberpunk+comic+chapter+${chapter.id}`}
                      alt={`Cover for ${chapter.title}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <h2 className="text-2xl font-bold text-cyber-blue">{chapter.title}</h2>
                      <p className="text-gray-300 text-lg">{chapter.subtitle}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-cyber-pink text-lg font-bold">READ NOW</span>
                      <span className="text-sm text-gray-500">{chapter.pages.length} pages</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}          </div>
        )}
      </div>
    </main>
  )
}

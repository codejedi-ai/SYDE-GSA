"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ComicPageInfo {
  title: string
  pageNumber: number
}

export default function DebugPage() {
  const [pages, setPages] = useState<ComicPageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAllPages() {
      try {
        const response = await fetch("/api/comic")

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success) {
          const pagesInfo = data.pages.map((page: any, index: number) => ({
            title: page.title,
            pageNumber: index + 1,
          }))
          setPages(pagesInfo)
        } else {
          setError(data.error || "Failed to load comic pages")
        }
      } catch (error) {
        setError(`Error fetching pages: ${error instanceof Error ? error.message : String(error)}`)
      } finally {
        setLoading(false)
      }
    }

    fetchAllPages()
  }, [])
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-4xl font-cyber mb-8 neon-text text-center">Debug Page</h1>

        {loading ? (
          <div className="text-center">
            <p className="text-cyber-blue animate-pulse">Loading comic pages...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl mb-4 text-cyber-blue">Available Comic Pages</h2>
            <div className="bg-cyber-darker border border-cyber-blue/30 rounded-lg p-6">
              <ul className="space-y-2">
                {pages.map((page) => (
                  <li key={page.pageNumber} className="flex items-center justify-between">
                    <span>
                      Page {page.pageNumber}: <span className="text-cyber-blue">{page.title}</span>
                    </span>
                    <Link href={`/comic/${page.pageNumber}`}>
                      <Button variant="outline" size="sm" className="border-cyber-blue/50 hover:border-cyber-blue">
                        View
                      </Button>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>          </div>
        )}
      </div>
    </main>
  )
}

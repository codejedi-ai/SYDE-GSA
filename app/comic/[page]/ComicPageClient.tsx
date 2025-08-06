"use client"

import { useState, useEffect } from "react"
import { ComicReader } from "@/components/comic/comic-reader"
//import { ComicLoadingScreen } from "@/components/comic/comic-loading-screen"
import { comicPages } from "@/lib/.env"
import { useParams, notFound, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useComicContext } from "@/app/context/comic-context"

export default function ComicPageClient() {
  const params = useParams()
  const pageParam = params.page
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [pageNumber, setPageNumber] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(true)
  
  // Use comic context
  const { 
    currentPageNumber,
    setPageData,
    fetchPageData,
    totalPages,
    setCurrentPageNumber 
  } = useComicContext()

  useEffect(() => {
    if (!pageParam || Array.isArray(pageParam)) {
      notFound()
      return
    }

    // Set transitioning state when page param changes
    setIsTransitioning(true)

    const parsedPageNumber = Number.parseInt(pageParam)
    setPageNumber(parsedPageNumber)

    if (isNaN(parsedPageNumber)) {
      setError("Invalid page number")
      setIsTransitioning(false)
      return
    }

    if (parsedPageNumber < 1 || parsedPageNumber > comicPages.length) {
      setError(`Page ${parsedPageNumber} not found. Available pages: 1-${comicPages.length}`)
      setIsTransitioning(false)
      return
    }

    setError(null)

    // Update context with page data from static data
    const pageData = comicPages[parsedPageNumber - 1]
    const prevPage = parsedPageNumber > 1 ? parsedPageNumber - 1 : null
    const nextPage = parsedPageNumber < comicPages.length ? parsedPageNumber + 1 : null
    
    setPageData({
      page: pageData,
      pageNumber: parsedPageNumber,
      totalPages: comicPages.length,
      prevPage,
      nextPage
    })

    // We'll keep the transitioning state for a short time to ensure the loading screen is visible
    // This prevents flickering if the data loads very quickly
    const timer = setTimeout(() => {
      setIsTransitioning(false)
    }, 100) // Reduced from 800ms since we don't have artificial delays anymore

    return () => clearTimeout(timer)
  }, [pageParam, router, setPageData])// If there's an error, show an error message with options to go home or to first page
  if (error) {
    return (
      <main className="h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-3xl font-cyber mb-6 text-cyber-pink">Error Loading Comic</h1>
            <p className="text-xl mb-8">{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="bg-cyber-blue text-black hover:bg-cyber-light">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Button>
              </Link>
              <Link href="/comic/1">
                <Button variant="outline" className="border-cyber-blue/50 hover:border-cyber-blue">
                  Go to First Page
                </Button>
              </Link>            </div>
          </div>
        </div>
      </main>
    )
  }
  /*
  if (!pageNumber || isTransitioning) {
    return (
      <main className="h-screen flex flex-col">
        <div className="flex-grow">
          <ComicLoadingScreen pageNumber={pageNumber || 0} />
        </div>
      </main>
    )
  } */     return (
    <main className="h-screen">
      <ComicReader currentPageNumber={currentPageNumber} />
    </main>
  )
}

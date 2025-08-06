"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import type { ComicPage, ComicPanel } from "@/lib/comic-data"

// Types for the context
interface CoverData {
  title: string
  subtitle: string
  image: string
  tags: string[]
  synopsis: string[]
}

interface ComicContextType {
  // Current state
  currentPageNumber: number
  currentPanelIndex: number
  totalPages: number
  currentPage: ComicPage | null
  
  // Cover data
  coverData: CoverData | null
  isCoverLoading: boolean
  
  // Navigation state
  prevPageLink: string | null
  nextPageLink: string | null
  isLoading: boolean
  error: string | null
  
  // Computed values
  totalPanels: number
  currentPanel: ComicPanel | null
  
  // Actions
  setCurrentPageNumber: (pageNumber: number) => void
  setCurrentPanelIndex: (panelIndex: number) => void
  nextPanel: () => void
  prevPanel: () => void
  navigateToPage: (pageNumber: number) => void
  resetToFirstPanel: () => void
  
  // Page data management
  fetchPageData: (pageNumber: number) => Promise<void>
  fetchCoverData: () => Promise<void>
  setPageData: (data: {
    page: ComicPage
    pageNumber: number
    totalPages: number
    prevPage: number | null
    nextPage: number | null
  }) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

// Create the context
const ComicContext = createContext<ComicContextType | undefined>(undefined)

// Hook to use the context
export function useComicContext() {
  const context = useContext(ComicContext)
  if (context === undefined) {
    throw new Error("useComicContext must be used within a ComicProvider")
  }
  return context
}

// Provider component
interface ComicProviderProps {
  children: React.ReactNode
  initialPageNumber?: number
}

export function ComicProvider({ children, initialPageNumber = 1 }: ComicProviderProps) {
  // Core state
  const [currentPageNumber, setCurrentPageNumber] = useState(initialPageNumber)
  const [currentPanelIndex, setCurrentPanelIndex] = useState(0)
  const [currentPage, setCurrentPage] = useState<ComicPage | null>(null)
  const [totalPages, setTotalPages] = useState(0)
  
  // Cover data state
  const [coverData, setCoverData] = useState<CoverData | null>(null)
  const [isCoverLoading, setIsCoverLoading] = useState(false)
  
  // Navigation state
  const [prevPageLink, setPrevPageLink] = useState<string | null>(null)
  const [nextPageLink, setNextPageLink] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Computed values
  const totalPanels = currentPage?.panels?.length || 0
  const currentPanel = currentPage?.panels?.[currentPanelIndex] || null
  
  // Reset to first panel when page changes
  useEffect(() => {
    setCurrentPanelIndex(0)
  }, [currentPageNumber])
  
  // Fetch page data from API
  const fetchPageData = useCallback(async (pageNumber: number) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log(`Fetching page ${pageNumber}...`)
      const response = await fetch(`/api/comic/${pageNumber}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`Page ${pageNumber} data:`, data)
      
      if (data.success) {
        setCurrentPage(data.page)
        setCurrentPageNumber(data.pageNumber)
        setTotalPages(data.totalPages)
        setPrevPageLink(data.prevPage ? `/comic/${data.prevPage}` : null)
        setNextPageLink(data.nextPage ? `/comic/${data.nextPage}` : null)
        setCurrentPanelIndex(0) // Reset to first panel when changing pages
      } else {
        setCurrentPage(null)
        setError(data.error || "Failed to load page data")
        console.error("Failed to load page data:", data.error)
      }    } catch (error) {
      setCurrentPage(null)
      setError(`Error loading page: ${error instanceof Error ? error.message : String(error)}`)
      console.error("Failed to fetch comic page:", error)
    } finally {
      setIsLoading(false)
    }  }, [])
  
  // Fetch cover data from API
  const fetchCoverData = useCallback(async () => {
    if (coverData || isCoverLoading) {
      // Don't fetch if we already have cover data or are currently loading
      return
    }
    
    setIsCoverLoading(true)
    
    try {
      console.log("Fetching cover data...")
      const response = await fetch("/api/comic/cover")
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Cover data:", data)
      
      if (data.success) {
        setCoverData(data.cover)
      } else {
        console.error("Failed to load cover data:", data.error)
      }
    } catch (error) {
      console.error("Failed to fetch cover data:", error)
    } finally {
      setIsCoverLoading(false)
    }
  }, [coverData, isCoverLoading])
  
  // Set page data directly (for cases where data is already available)
  const setPageData = useCallback((data: {
    page: ComicPage
    pageNumber: number
    totalPages: number
    prevPage: number | null
    nextPage: number | null
  }) => {
    setCurrentPage(data.page)
    setCurrentPageNumber(data.pageNumber)
    setTotalPages(data.totalPages)
    setPrevPageLink(data.prevPage ? `/comic/${data.prevPage}` : null)
    setNextPageLink(data.nextPage ? `/comic/${data.nextPage}` : null)
    setCurrentPanelIndex(0)
  }, [])
  
  // Navigation functions
  const nextPanel = useCallback(() => {
    if (!currentPage) return
    
    if (currentPanelIndex < currentPage.panels.length - 1) {
      setCurrentPanelIndex(currentPanelIndex + 1)
    } else if (nextPageLink) {
      // Navigate to next page
      const nextPageNumber = currentPageNumber + 1
      navigateToPage(nextPageNumber)
    }
  }, [currentPage, currentPanelIndex, nextPageLink, currentPageNumber])
  
  const prevPanel = useCallback(() => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex(currentPanelIndex - 1)
    } else if (prevPageLink) {
      // Navigate to previous page and go to last panel
      const prevPageNumber = currentPageNumber - 1
      navigateToPage(prevPageNumber)
    }
  }, [currentPanelIndex, prevPageLink, currentPageNumber])
  
  const navigateToPage = useCallback((pageNumber: number) => {
    setCurrentPageNumber(pageNumber)
    setCurrentPanelIndex(0)
    fetchPageData(pageNumber)
  }, [fetchPageData])
  
  const resetToFirstPanel = useCallback(() => {
    setCurrentPanelIndex(0)
  }, [])
  
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])
  
  const setErrorState = useCallback((error: string | null) => {
    setError(error)
  }, [])
    // Context value
  const contextValue: ComicContextType = {
    // Current state
    currentPageNumber,
    currentPanelIndex,
    totalPages,
    currentPage,
    
    // Cover data
    coverData,
    isCoverLoading,
    
    // Navigation state
    prevPageLink,
    nextPageLink,
    isLoading,
    error,
    
    // Computed values
    totalPanels,
    currentPanel,
    
    // Actions
    setCurrentPageNumber,
    setCurrentPanelIndex,
    nextPanel,
    prevPanel,
    navigateToPage,
    resetToFirstPanel,
    
    // Page data management
    fetchPageData,
    fetchCoverData,
    setPageData,
    setLoading,
    setError: setErrorState,
  }
  
  return (
    <ComicContext.Provider value={contextValue}>
      {children}
    </ComicContext.Provider>
  )
}

// Optional: Export the context itself for advanced use cases
export { ComicContext }

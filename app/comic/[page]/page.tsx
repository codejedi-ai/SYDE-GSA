import { comicPages } from "@/lib/.env" // Keep for generateStaticParams
import ComicPageClient from "./ComicPageClient"

export function generateStaticParams() {
  return Array.from({ length: comicPages.length }, (_, i) => ({
    page: String(i + 1),
  }))
}

export default function ComicPage() {
  return <ComicPageClient />
}

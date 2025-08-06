import { ComicLoadingScreen } from "@/components/comic/comic-loading-screen"

export default function DebugLoadingPage() {
  return (
    <main className="h-screen">
      <ComicLoadingScreen pageNumber={1} />
    </main>
  )
}

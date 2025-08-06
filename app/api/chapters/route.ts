import { NextResponse } from "next/server"
import { comicPages } from "@/lib/comic-data"

// Group pages into chapters (4 pages per chapter)
function getChapters() {
  const chaptersData = []
  const pagesPerChapter = 4

  for (let i = 0; i < comicPages.length; i += pagesPerChapter) {
    const chapterPages = comicPages.slice(i, i + pagesPerChapter)
    const chapterNumber = Math.floor(i / pagesPerChapter) + 1

    chaptersData.push({
      id: chapterNumber,
      title: `Chapter ${chapterNumber}`,
      subtitle: chapterPages[0].title,
      pages: chapterPages.map((_, index) => i + index + 1),
      coverPage: i + 1,
    })
  }

  return chaptersData
}

export async function GET() {
  const chapters = getChapters()

  return NextResponse.json({
    success: true,
    chapters,
  })
}

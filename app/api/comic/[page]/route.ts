import { NextResponse } from "next/server"
import { comicPages } from "@/lib/.env"

export async function GET(request: Request, { params }: { params: { page: string } }) {
  const { page } = await params
  const pageNumber = Number.parseInt(page)
  console.log("Requested page number:", pageNumber)
  if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > comicPages.length) {
    return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 })
  }

  try {
    // Get the page data
    const page = comicPages[pageNumber - 1]

    // Create a serializable version of the page
    const serializablePage = {
      ...page,
      panels: page.panels.map((panel) => {
        // Create a new panel object without the content property if it exists
        const { content, ...serializablePanel } = panel

        // If there was content, convert it to a narration if possible
        if (content && !serializablePanel.narration) {
          serializablePanel.narration = "Special content panel"
        }

        return serializablePanel
      }),
    }

    return NextResponse.json({
      success: true,
      page: serializablePage,
      pageNumber,
      totalPages: comicPages.length,
      prevPage: pageNumber > 1 ? pageNumber - 1 : null,
      nextPage: pageNumber < comicPages.length ? pageNumber + 1 : null,
    })
  } catch (error) {
    console.error("Error processing page:", error)
    return NextResponse.json(
      {
        success: false,
        error: `Error processing page ${pageNumber}: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

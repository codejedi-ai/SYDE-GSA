import { NextResponse } from "next/server"
import { comicPages } from "@/lib/comic-data"

export async function GET() {
  return NextResponse.json({
    success: true,
    pages: comicPages,
    totalPages: comicPages.length,
  })
}

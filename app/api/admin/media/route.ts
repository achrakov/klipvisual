import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "fs/promises"
import { join } from "path"

export const runtime = "nodejs"

const MEDIA_PATH = join(process.cwd(), "app", "data", "media.json")

export async function GET() {
  try {
    const raw = await readFile(MEDIA_PATH, "utf-8")
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({})
  }
}

export async function PUT(req: NextRequest) {
  const data = await req.json()
  await writeFile(MEDIA_PATH, JSON.stringify(data, null, 2))
  return NextResponse.json({ ok: true })
}

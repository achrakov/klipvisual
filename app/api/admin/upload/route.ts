import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, extname } from "path"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get("file") as File | null
  const slug = form.get("slug") as string | null
  const section = form.get("section") as string | null

  if (!file || !slug || !section) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const ext = extname(file.name) || ".jpg"
  const filename = `${Date.now()}${ext}`
  const dir = join(process.cwd(), "public", "images", "projects", slug, section)

  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, filename), Buffer.from(await file.arrayBuffer()))

  return NextResponse.json({ path: `/images/projects/${slug}/${section}/${filename}` })
}

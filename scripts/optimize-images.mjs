/**
 * Batch image optimizer for KLIPVISUAL
 * Usage: node scripts/optimize-images.mjs <input-folder> [output-folder]
 *
 * - Converts to JPEG, quality 85
 * - Resizes: max 2000px on longest side (preserves aspect ratio)
 * - Skips already-processed files
 * - Outputs to ./optimized/ by default
 */

import sharp from "sharp"
import { readdir, mkdir } from "fs/promises"
import { join, extname, basename } from "path"
import { existsSync } from "fs"

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp", ".heic", ".heif"])
const MAX_SIZE = 2000
const QUALITY = 85

const inputDir = process.argv[2]
if (!inputDir) {
  console.error("Usage: node scripts/optimize-images.mjs <input-folder> [output-folder]")
  process.exit(1)
}

const outputDir = process.argv[3] ?? join(inputDir, "optimized")

if (!existsSync(inputDir)) {
  console.error(`Input folder not found: ${inputDir}`)
  process.exit(1)
}

await mkdir(outputDir, { recursive: true })

const files = (await readdir(inputDir)).filter(f =>
  SUPPORTED.has(extname(f).toLowerCase())
)

if (files.length === 0) {
  console.log("No supported images found in", inputDir)
  process.exit(0)
}

console.log(`\nFound ${files.length} image(s) → outputting to ${outputDir}\n`)

let done = 0
let skipped = 0

for (const file of files) {
  const name = basename(file, extname(file))
  const inputPath = join(inputDir, file)
  const outputPath = join(outputDir, `${name}.jpg`)

  if (existsSync(outputPath)) {
    console.log(`  ⟳  skipped  ${file}`)
    skipped++
    continue
  }

  try {
    const img = sharp(inputPath)
    const meta = await img.metadata()
    const w = meta.width ?? 0
    const h = meta.height ?? 0

    const resize = w > MAX_SIZE || h > MAX_SIZE
      ? w >= h
        ? { width: MAX_SIZE }
        : { height: MAX_SIZE }
      : null

    const pipeline = resize ? img.resize(resize) : img

    await pipeline
      .rotate()             // auto-rotate from EXIF
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(outputPath)

    console.log(`  ✓  ${file} → ${name}.jpg`)
    done++
  } catch (err) {
    console.error(`  ✗  ${file} — ${err.message}`)
  }
}

console.log(`\nDone: ${done} optimized, ${skipped} skipped.\nOutput: ${outputDir}\n`)

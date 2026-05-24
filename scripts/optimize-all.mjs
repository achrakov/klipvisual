/**
 * Batch optimizer for all KLIPVISUAL projects at once
 * Usage: node scripts/optimize-all.mjs "C:\Users\user\Desktop\Klip"
 *
 * Folder structure expected:
 *   Klip/
 *     ProjectName/
 *       High res/   ← reads from here
 *       Web ready/  ← outputs here (created if missing)
 */

import sharp from "sharp"
import { readdir, mkdir } from "fs/promises"
import { join, extname, basename } from "path"
import { existsSync } from "fs"

const SUPPORTED = new Set([".jpg", ".jpeg", ".png", ".webp", ".tiff", ".tif", ".bmp", ".heic", ".heif"])
const MAX_SIZE = 2000
const QUALITY = 85

const klipDir = process.argv[2]
if (!klipDir) {
  console.error("Usage: node scripts/optimize-all.mjs <path-to-Klip-folder>")
  console.error('Example: node scripts/optimize-all.mjs "C:\\Users\\user\\Desktop\\Klip"')
  process.exit(1)
}

if (!existsSync(klipDir)) {
  console.error(`Folder not found: ${klipDir}`)
  process.exit(1)
}

async function processImage(inputPath, outputPath) {
  const img = sharp(inputPath)
  const meta = await img.metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0

  const resize = w > MAX_SIZE || h > MAX_SIZE
    ? w >= h ? { width: MAX_SIZE } : { height: MAX_SIZE }
    : null

  const pipeline = resize ? img.resize(resize) : img

  await pipeline
    .rotate()
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(outputPath)
}

// Find all project folders inside Klip
const entries = await readdir(klipDir, { withFileTypes: true })
const projects = entries.filter(e => e.isDirectory())

if (projects.length === 0) {
  console.log("No project folders found inside", klipDir)
  process.exit(0)
}

let totalDone = 0
let totalSkipped = 0
let totalErrors = 0

for (const project of projects) {
  const projectPath = join(klipDir, project.name)
  const inputDir = join(projectPath, "High res")
  const outputDir = join(projectPath, "Web ready")

  if (!existsSync(inputDir)) {
    console.log(`\n  [${project.name}] — no "High res" folder, skipping`)
    continue
  }

  const files = (await readdir(inputDir)).filter(f =>
    SUPPORTED.has(extname(f).toLowerCase())
  )

  if (files.length === 0) {
    console.log(`\n  [${project.name}] — "High res" is empty, skipping`)
    continue
  }

  await mkdir(outputDir, { recursive: true })

  console.log(`\n┌─ ${project.name} (${files.length} image${files.length > 1 ? "s" : ""})`)

  let done = 0
  let skipped = 0

  for (const file of files) {
    const name = basename(file, extname(file))
    const inputPath = join(inputDir, file)
    const outputPath = join(outputDir, `${name}.jpg`)

    if (existsSync(outputPath)) {
      console.log(`│  ⟳  skipped  ${file}`)
      skipped++
      totalSkipped++
      continue
    }

    try {
      await processImage(inputPath, outputPath)
      console.log(`│  ✓  ${file} → ${name}.jpg`)
      done++
      totalDone++
    } catch (err) {
      console.error(`│  ✗  ${file} — ${err.message}`)
      totalErrors++
    }
  }

  console.log(`└─ done: ${done} optimized, ${skipped} skipped`)
}

console.log(`\n${"─".repeat(48)}`)
console.log(`All projects: ${totalDone} optimized, ${totalSkipped} skipped, ${totalErrors} errors`)
console.log(`${"─".repeat(48)}\n`)

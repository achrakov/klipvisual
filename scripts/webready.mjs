/**
 * Web-ready image optimizer
 *
 * Usage:
 *   node scripts/webready.mjs "C:\path\to\lebalcon"
 *
 * For every theme folder it finds:
 *   lebalcon/<Theme>/High Res/*.{jpg,jpeg,png,webp,tif,tiff}
 *     → lebalcon/<Theme>/Web Ready/<filename>.jpg  (max 1600px wide, 85% quality)
 */

import sharp from "sharp"
import { readdir, mkdir } from "fs/promises"
import { join, extname, basename } from "path"

const EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"])
const MAX_WIDTH = 1600
const QUALITY = 85

const root = process.argv[2]
if (!root) {
  console.error("Usage: node scripts/webready.mjs \"C:\\path\\to\\lebalcon\"")
  process.exit(1)
}

const themes = await readdir(root, { withFileTypes: true })

for (const theme of themes) {
  if (!theme.isDirectory()) continue

  const highResDir = join(root, theme.name, "High Res")
  const webReadyDir = join(root, theme.name, "Web Ready")

  let files
  try {
    files = await readdir(highResDir)
  } catch {
    console.warn(`  ⚠  No "High Res" folder found in: ${theme.name}`)
    continue
  }

  const images = files.filter(f => EXTS.has(extname(f).toLowerCase()))
  if (images.length === 0) {
    console.log(`  —  ${theme.name}: no images found`)
    continue
  }

  await mkdir(webReadyDir, { recursive: true })
  console.log(`\n📁 ${theme.name}  (${images.length} image${images.length > 1 ? "s" : ""})`)

  for (const file of images) {
    const src = join(highResDir, file)
    const outName = basename(file, extname(file)) + ".jpg"
    const dest = join(webReadyDir, outName)

    try {
      const meta = await sharp(src).metadata()
      const needsResize = (meta.width ?? 0) > MAX_WIDTH

      await sharp(src)
        .rotate()                          // auto-orient from EXIF
        .resize(needsResize ? { width: MAX_WIDTH } : undefined)
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(dest)

      const { size } = await import("fs").then(m => m.promises.stat(dest))
      const kb = Math.round(size / 1024)
      console.log(`  ✓  ${file}  →  ${outName}  (${kb} KB)`)
    } catch (err) {
      console.error(`  ✗  ${file}: ${err.message}`)
    }
  }
}

console.log("\n✅ Done — upload the files inside each \"Web Ready\" folder to the admin panel.")

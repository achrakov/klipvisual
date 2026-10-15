// Records a page scroll-through at TRUE speed (every frame keeps its real timestamp)
// for the video previews on /websites. Same setup as capture-site.cjs: run from a
// folder where puppeteer-core is installed. Then encode with ffmpeg:
//   ffmpeg -f concat -safe 0 -i <outDir>/list.txt -vf "fps=60,scale=1280:-2" -c:v libx264 -crf 29 -pix_fmt yuv420p -movflags +faststart -an desktop.mp4
//   (phone: scale=432:-2, -crf 28). The #fan / .row / .tile selectors are the Atelier
//   Nacre ones (card shuffle, hover targets); adjust them for another site.

const puppeteer = require("puppeteer-core")
const fs = require("fs")
const path = require("path")
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const DEV = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true },
}

;(async () => {
  const [url, outDir, dev] = process.argv.slice(2)
  const vp = DEV[dev]
  const frameDir = path.join(outDir, "frames")
  fs.rmSync(frameDir, { recursive: true, force: true })
  fs.mkdirSync(frameDir, { recursive: true })

  const browser = await puppeteer.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
    args: ["--hide-scrollbars"],
  })
  const page = await browser.newPage()
  await page.setViewport(vp)
  if (dev === "mobile") {
    await page.setUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1")
  }
  await page.goto(url, { waitUntil: "networkidle0" })
  await page.reload({ waitUntil: "networkidle0" }) // warm cache, intro replays on camera

  const frames = []
  const cdp = await page.createCDPSession()
  cdp.on("Page.screencastFrame", async (f) => {
    const file = path.join(frameDir, `f${String(frames.length).padStart(5, "0")}.jpg`)
    fs.writeFileSync(file, Buffer.from(f.data, "base64"))
    frames.push({ file, t: f.metadata.timestamp })
    try { await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }) } catch {}
  })
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 88, everyNthFrame: 1 })

  await sleep(2600) // hero: cards deal in
  const fan = await page.$("#fan")
  if (fan) {
    const b = await fan.boundingBox()
    if (b) {
      if (dev === "mobile") await page.tap("#fan")
      else {
        await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 12 })
        await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2)
      }
    }
  }
  await sleep(1600)

  // Scroll inside the page on every animation frame, with a gentle start and stop
  // (trapezoid speed: 0.8 s ramp, steady cruise, 0.8 s ramp), so no step is uneven.
  const speed = dev === "mobile" ? 520 : 380 // average px per second
  const max = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight)
  const total = (max / speed) * 1000
  // The page's own CSS smooth-scroll would ease every scrollTo; the recorder drives each frame itself.
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" })
  await page.evaluate((max, T) => {
    const r = Math.min(800, T / 3)
    const v = max / (T - r)
    const pos = (t) => t < r ? (v * t * t) / (2 * r)
      : t < T - r ? (v * r) / 2 + v * (t - r)
      : max - (v * (T - t) * (T - t)) / (2 * r)
    window.__recDone = false
    const t0 = performance.now()
    const tick = (now) => {
      const t = Math.min(T, now - t0)
      window.scrollTo(0, pos(t))
      if (t < T) requestAnimationFrame(tick)
      else window.__recDone = true
    }
    requestAnimationFrame(tick)
  }, max, total)
  // Meanwhile on desktop the mouse glides onto whatever service row or tile is mid-screen.
  while (!(await page.evaluate(() => window.__recDone))) {
    if (dev === "desktop") {
      const target = await page.evaluate(() => {
        const mid = window.innerHeight * 0.5
        const el = [...document.querySelectorAll(".row, .tile")].find((e) => {
          const r = e.getBoundingClientRect()
          return r.top < mid && r.bottom > mid
        })
        if (!el) return null
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width * 0.6, y: mid }
      })
      await page.mouse.move(target ? target.x : 720, target ? target.y : 450, { steps: 4 })
    }
    await sleep(120)
  }
  await sleep(2200)
  await cdp.send("Page.stopScreencast")
  await sleep(300)
  await browser.close()

  // ffmpeg concat list with each frame's real duration.
  const lines = []
  for (let i = 0; i < frames.length; i++) {
    const d = i + 1 < frames.length ? frames[i + 1].t - frames[i].t : 0.5
    lines.push(`file '${path.resolve(frames[i].file).replace(/\\/g, "/")}'`, `duration ${Math.max(0.001, d).toFixed(4)}`)
  }
  lines.push(`file '${path.resolve(frames[frames.length - 1].file).replace(/\\/g, "/")}'`)
  fs.writeFileSync(path.join(outDir, "list.txt"), lines.join("\n"))
  const span = frames[frames.length - 1].t - frames[0].t
  console.log(dev, frames.length, "frames over", span.toFixed(1), "s =", (frames.length / span).toFixed(1), "fps")
})().catch((e) => { console.error(e); process.exit(1) })

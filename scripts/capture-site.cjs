// Captures a site's pages full-length (desktop 1440 + phone 390) for the /websites preview.
// Not a project dependency: run it from a folder where puppeteer-core is installed
// (npm i puppeteer-core), e.g. a temp folder. Then convert to .webp with sharp and
// add the page heights to app/data/websites.ts. In Git Bash prefix with MSYS_NO_PATHCONV=1.
// Usage: node capture-site.cjs https://example.com/fr ./out <slug> "" /services /about

const puppeteer = require("puppeteer-core")
const fs = require("fs")
const path = require("path")

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe"
const MAX_SCREENS = 6
const DEVICES = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true },
}
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const [base, outDir, slug, ...paths] = process.argv.slice(2)
  fs.mkdirSync(outDir, { recursive: true })
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--hide-scrollbars", "--no-first-run"] })
  const manifest = []
  try {
    for (const p of paths) {
      const entry = { path: p || "/" }
      for (const [dev, vp] of Object.entries(DEVICES)) {
        const page = await browser.newPage()
        await page.setViewport(vp)
        if (dev === "mobile") await page.setUserAgent(MOBILE_UA)
        await page.goto(base + p, { waitUntil: "networkidle2", timeout: 60000 })
        await page.addStyleTag({ content: ".cursor-dot{display:none!important}" })
        // A home page with an intro gate: click through it.
        const clicked = await page.evaluate(() => {
          const b = [...document.querySelectorAll("button")].find((x) => /(enter|entrer)/i.test(x.textContent))
          if (b) { b.click(); return true }
          return false
        })
        await sleep(clicked ? 4000 : 2000)
        // Walk down the page so every in-view animation fires once.
        const total = await page.evaluate(() => document.documentElement.scrollHeight)
        for (let y = 0; y < total; y += Math.round(vp.height * 0.5)) {
          await page.evaluate((yy) => window.scrollTo(0, yy), y)
          await sleep(350)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await sleep(1800)
        const full = await page.evaluate(() => document.documentElement.scrollHeight)
        const h = Math.min(full, vp.height * MAX_SCREENS)
        const name = `${slug}-${(p || "home").replace(/^\//, "").replace(/\//g, "-") || "home"}-${dev}.png`
        await page.screenshot({ path: path.join(outDir, name), clip: { x: 0, y: 0, width: vp.width, height: h }, captureBeyondViewport: true })
        entry[dev] = { file: name, h }
        console.log(dev, p || "/", `${vp.width}x${h}`)
        await page.close()
      }
      manifest.push(entry)
    }
  } finally {
    await browser.close()
  }
  fs.writeFileSync(path.join(outDir, `${slug}-manifest.json`), JSON.stringify(manifest, null, 2))
}

main().catch((e) => { console.error(e); process.exit(1) })

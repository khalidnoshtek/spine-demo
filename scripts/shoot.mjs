// Drives the installed Chrome via puppeteer-core to exercise focus mode and
// capture screenshots that a static --screenshot can't (clicks, transitions).
import puppeteer from 'puppeteer-core'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = process.env.URL || 'http://localhost:5173/'
const OUT = '/tmp'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--hide-scrollbars'],
  defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
})
const page = await browser.newPage()
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message))

await page.goto(URL, { waitUntil: 'networkidle0' })
await sleep(1500) // let prototypes paint + float settle

// Grid state
await page.screenshot({ path: `${OUT}/t-grid.png` })

// Click the flagship (Halo) slot to open focus
const clicked = await page.evaluate(() => {
  const slots = [...document.querySelectorAll('main .grid > div')]
  // Halo is the first prototype in source order
  const halo = slots[0]
  if (!halo) return false
  const r = halo.getBoundingClientRect()
  halo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) }
})
await sleep(900) // spring settle
await page.screenshot({ path: `${OUT}/t-focus.png` })

// Count mounted iframes/videos (pre-warm check) and which iframe is interactive
const mediaInfo = await page.evaluate(() => {
  const iframes = [...document.querySelectorAll('iframe')]
  const videos = [...document.querySelectorAll('video')]
  return {
    iframes: iframes.length,
    videos: videos.length,
    iframeSrcs: iframes.map((f) => f.getAttribute('src')),
    interactive: iframes
      .filter((f) => getComputedStyle(f).pointerEvents !== 'none')
      .map((f) => f.getAttribute('src')),
  }
})

// Close via Escape, back to grid
await page.keyboard.press('Escape')
await sleep(900)
await page.screenshot({ path: `${OUT}/t-closed.png` })

// Now open the emulator tile (Vault) — should boot an iframe only now
const beforeVault = await page.evaluate(() => document.querySelectorAll('iframe').length)
await page.evaluate(() => {
  const slots = [...document.querySelectorAll('main .grid > div')]
  slots[6]?.dispatchEvent(new MouseEvent('click', { bubbles: true })) // vault is 7th
})
await sleep(1600)
const afterVault = await page.evaluate(() => document.querySelectorAll('iframe').length)
await page.screenshot({ path: `${OUT}/t-vault.png` })

console.log(JSON.stringify({ clicked, mediaInfo, beforeVault, afterVault, errors }, null, 2))
await browser.close()

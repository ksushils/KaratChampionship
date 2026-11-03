// Generates web-ready brand assets from the owner-supplied source images in scripts/assets.
// Run: node scripts/build-brand-assets.mjs
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'

const src = (f) => path.join('scripts/assets', f)
const out = (f) => path.join('public/brand', f)
fs.mkdirSync('public/brand', { recursive: true })

const dark = src('source-livery-side-aerial-dark.jpg')
const light = src('source-livery-presentation-light.jpg')

const jobs = [
  [dark, { left: 40, top: 362, width: 940, height: 300 }, 'car-aerial-dark.jpg'],
  [light, { left: 60, top: 250, width: 1900, height: 510 }, 'car-side-light.jpg'],
  [light, { left: 10, top: 775, width: 700, height: 490 }, 'car-front-light.jpg'],
  [light, { left: 730, top: 775, width: 525, height: 535 }, 'car-top-light.jpg'],
  [light, { left: 1270, top: 775, width: 720, height: 490 }, 'car-rear-light.jpg'],
]
for (const [file, region, name] of jobs) {
  await sharp(file).extract(region).jpeg({ quality: 88, mozjpeg: true }).toFile(out(name))
}
// Hero side view: soften the "SIDE POST VIEW" caption from the presentation board, keep the wordmark.
{
  const patch = await sharp(dark).extract({ left: 20, top: 48, width: 240, height: 6 }).resize(240, 32, { fit: 'fill' }).blur(3).toBuffer()
  const base = await sharp(dark).composite([{ input: patch, left: 20, top: 15 }]).toBuffer()
  await sharp(base).extract({ left: 0, top: 4, width: 1024, height: 331 }).jpeg({ quality: 88, mozjpeg: true }).toFile(out('car-side-dark.jpg'))
}
await sharp(src('source-livery-placements.jpg')).jpeg({ quality: 88, mozjpeg: true }).toFile(out('livery-placements.jpg'))
await sharp(light).resize(1600).jpeg({ quality: 86, mozjpeg: true }).toFile(out('livery-presentation.jpg'))
await sharp(dark).jpeg({ quality: 88, mozjpeg: true }).toFile(out('livery-side-aerial.jpg'))

// Transparent logo mark: derive alpha from luminance of the black-background master.
const { data, info } = await sharp(src('source-logo-k.jpg'))
  .extract({ left: 150, top: 160, width: 760, height: 720 })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })
for (let i = 0; i < data.length; i += 4) {
  const m = Math.max(data[i], data[i + 1], data[i + 2])
  const a = Math.min(255, Math.max(0, (m - 18) * 3))
  data[i + 3] = a
}
const logo = sharp(data, { raw: info })
await logo.clone().resize(400).png({ compressionLevel: 9 }).toFile(out('karat-k.png'))
await logo.clone().resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(out('karat-k-256.png'))
fs.mkdirSync('src/app', { recursive: true })
await sharp(src('source-logo-k.jpg')).extract({ left: 120, top: 120, width: 800, height: 800 }).resize(512).png().toFile('src/app/icon.png')
await sharp(src('source-logo-k.jpg')).extract({ left: 120, top: 120, width: 800, height: 800 }).resize(180).png().toFile('src/app/apple-icon.png')

// Social preview 1200x630
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#060b1a' } })
  .composite([
    { input: await sharp(dark).extract({ left: 0, top: 45, width: 1024, height: 290 }).resize(1200).toBuffer(), top: 150, left: 0 },
  ])
  .jpeg({ quality: 85 })
  .toFile(out('og-default.jpg'))
console.log('brand assets generated')

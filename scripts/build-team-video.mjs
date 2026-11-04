// Championship Team page background video, built from the owner-supplied aerial view (public/brand/car-aerial-dark.jpg).
// Concept: top-down "on track" shot — the car holds position while the circuit rushes past beneath it:
// scrolling tar seams, gold/blue kerbs, lane markings, speed streaks, a blue under-glow and a slight sway.
// Every moving layer travels a whole multiple of its repeat length per loop, so the loop is seamless.
// Requires ffmpeg on PATH.   node scripts/build-team-video.mjs [framesDir]
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const SRC = 'public/brand/car-aerial-dark.jpg'
const OUT = 'public/brand'
const FR = process.argv[2] || '.team-frames'
const W = 1920, H = 900, FPS = 25, SECONDS = 8, N = FPS * SECONDS
fs.rmSync(FR, { recursive: true, force: true })
fs.mkdirSync(FR, { recursive: true })

// ---- Car layer: scaled, gently feathered so the photo's grey surround melts into the asphalt.
const CAR_W = 1180
const meta = await sharp(SRC).metadata()
const CAR_H = Math.round(CAR_W * meta.height / meta.width)
const { data: px, info } = await sharp(SRC).resize(CAR_W, CAR_H, { kernel: 'lanczos3' }).sharpen({ sigma: 0.7 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const ramp = (u, f) => Math.min(1, Math.max(0, u / f))
const BG = [49, 51, 56]
for (let y = 0; y < info.height; y++) {
  const vy = Math.min(ramp(y / info.height, 0.05), ramp(1 - y / info.height, 0.05))
  for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4
    const d = Math.hypot(px[i] - BG[0], px[i + 1] - BG[1], px[i + 2] - BG[2])
    const key = Math.min(1, Math.max(0, (d - 10) / 22)) // grey surround → transparent, car stays
    const vx = Math.min(ramp(x / info.width, 0.03), ramp(1 - x / info.width, 0.03))
    const a = key * vx * vy
    px[i + 3] = Math.round(255 * a * a * (3 - 2 * a))
  }
}
const car = await sharp(px, { raw: info }).png().toBuffer()
const CAR_X = W - CAR_W - 90, CAR_Y0 = Math.round(H / 2 - CAR_H / 2)

// ---- Asphalt: smooth dark surface (texture-free keeps the file small; motion comes from kerbs, markings and streaks).
let seed = 7
const rnd = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
const asphalt = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16191e"/><stop offset="0.5" stop-color="#262a31"/><stop offset="1" stop-color="#16191e"/></linearGradient>
  <radialGradient id="k" cx="64%" cy="50%" r="40%"><stop offset="0" stop-color="#1e63e9" stop-opacity="0.12"/><stop offset="1" stop-color="#1e63e9" stop-opacity="0"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#a)"/><rect width="100%" height="100%" fill="url(#k)"/></svg>`)).png().toBuffer()

// ---- Speed streaks with integer "laps" per loop (seamless).
const streaks = Array.from({ length: 40 }, (_, i) => ({
  y: Math.round(rnd() * H),
  len: 180 + rnd() * 520,
  laps: 2 + (i % 4),
  phase: rnd() * W,
  op: 0.12 + rnd() * 0.28,
  w: rnd() < 0.2 ? 2 : 1,
  c: rnd() < 0.35 ? '#7fdcff' : rnd() < 0.5 ? '#f0d58c' : '#ffffff',
}))

const KERB = 120 // segment length; 1920 is a multiple of 2*KERB
const TRACK_LAPS = 3 // track scrolls 3×1920 px per loop (~720 px/s)

const seamY = Array.from({ length: 9 }, () => Math.round(H * 0.2 + rnd() * H * 0.6))
const seams = (t) => {
  let o = ''
  seamY.forEach((y, i) => {
    const x = ((i * 613 - t * TRACK_LAPS * W) % W + W) % W
    for (const X of [x, x - W]) o += `<rect x="${X}" y="${y}" width="${700 + (i % 3) * 300}" height="2" fill="#000" opacity="0.28"/>`
  })
  return o
}

function overlaySvg(t) {
  const off = (t * TRACK_LAPS * W) % (KERB * 2)
  const dashOff = (t * TRACK_LAPS * W) % 160
  const kerb = (y, h) => {
    let s = ''
    for (let x = -KERB * 2; x < W + KERB * 2; x += KERB * 2) {
      const X = x - off
      s += `<rect x="${X}" y="${y}" width="${KERB}" height="${h}" fill="#c39a45"/><rect x="${X + KERB}" y="${y}" width="${KERB}" height="${h}" fill="#1650c4"/>`
    }
    return s
  }
  let dashes = ''
  for (let x = -160; x < W + 160; x += 160) dashes += `<rect x="${x - dashOff}" y="${H * 0.155}" width="80" height="6" fill="#e8e3d7" opacity="0.35"/><rect x="${x - dashOff}" y="${H * 0.845 - 6}" width="80" height="6" fill="#e8e3d7" opacity="0.35"/>`
  let st = ''
  for (const s of streaks) {
    const x = ((s.phase - t * s.laps * W) % W + W) % W
    for (const X of [x, x - W, x + W])
      st += `<rect x="${X.toFixed(1)}" y="${s.y}" width="${s.len.toFixed(0)}" height="${s.w}" fill="url(#sg${s.c.slice(1)})" opacity="${s.op.toFixed(2)}"/>`
  }
  const grad = (c) => `<linearGradient id="sg${c.slice(1)}" x1="0" x2="1"><stop offset="0" stop-color="${c}" stop-opacity="0"/><stop offset="0.85" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></linearGradient>`
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>${grad('#7fdcff')}${grad('#f0d58c')}${grad('#ffffff')}
    <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0.75"/><stop offset="0.22" stop-color="#000" stop-opacity="0.05"/><stop offset="0.78" stop-color="#000" stop-opacity="0.05"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></linearGradient>
  </defs>
  ${kerb(H * 0.05, 34)}${kerb(H * 0.95 - 34, 34)}
  <rect x="0" y="${H * 0.05 + 34}" width="${W}" height="5" fill="#f4f1ea" opacity="0.55"/>
  <rect x="0" y="${H * 0.95 - 39}" width="${W}" height="5" fill="#f4f1ea" opacity="0.55"/>
  ${dashes}${seams(t)}${st}
  <rect width="100%" height="100%" fill="url(#shade)"/>
</svg>`)
}

function glowSvg(cy, pulse) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="gl" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#3cc8ff" stop-opacity="${(0.32 * pulse).toFixed(3)}"/><stop offset="0.6" stop-color="#1e63e9" stop-opacity="${(0.12 * pulse).toFixed(3)}"/><stop offset="1" stop-color="#1e63e9" stop-opacity="0"/></radialGradient></defs>
  <ellipse cx="${CAR_X + CAR_W / 2}" cy="${cy}" rx="${CAR_W * 0.62}" ry="${CAR_H * 0.85}" fill="url(#gl)"/></svg>`)
}

const sweep = (x) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="s" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.22"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
  <g transform="translate(${x} 0) skewX(-18)"><rect y="0" width="520" height="${H}" fill="url(#s)"/></g></svg>`)

const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="v" cx="62%" cy="50%" r="72%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.6"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#v)"/></svg>`)

for (let i = 0; i < N; i++) {
  const t = i / N
  const bg = asphalt
  // Sway: two whole cycles per loop; tiny high-frequency vibration.
  const sway = Math.sin(2 * Math.PI * t * 2) * 7 + Math.sin(2 * Math.PI * t * 40) * 0.8
  const drift = Math.sin(2 * Math.PI * t) * 10
  const cy = CAR_Y0 + sway
  const layers = [
    { input: overlaySvg(t) },
    { input: glowSvg(cy + CAR_H / 2, 0.85 + 0.15 * Math.sin(2 * Math.PI * t * 4)) },
    { input: car, left: Math.round(CAR_X + drift), top: Math.round(cy) },
  ]
  const s = (t - 0.2) / 0.35
  if (s >= 0 && s <= 1) layers.push({ input: sweep(CAR_X - 600 + s * (CAR_W + 1000)), blend: 'screen' })
  layers.push({ input: vignette })
  await sharp(bg).composite(layers).jpeg({ quality: 92 }).toFile(path.join(FR, `f${String(i).padStart(4, '0')}.jpg`))
}

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(FR, 'f%04d.jpg'), ...args], { stdio: 'inherit' })
ff(['-c:v', 'libx264', '-preset', 'slow', '-crf', '29', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an', path.join(OUT, 'team-track.mp4')])
ff(['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '41', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', path.join(OUT, 'team-track.webm')])
ff(['-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, 'team-track-1280.mp4')])
await sharp(path.join(FR, 'f0000.jpg')).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, 'team-track-poster.jpg'))
fs.rmSync(FR, { recursive: true, force: true })
console.log('team video built')

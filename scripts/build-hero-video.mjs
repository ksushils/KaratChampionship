// Builds the homepage background video from the owner-supplied car photo (public/brand/car-side-dark.jpg).
// Effects: slow push-in/drift (seamless ping-pong loop), a light sweep across the bodywork, gentle exposure breathing, vignette.
// Requires ffmpeg on PATH.   node scripts/build-hero-video.mjs [framesDir]
import sharp from 'sharp'
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const SRC = 'public/brand/car-side-dark.jpg'
const OUT = 'public/brand'
const FR = process.argv[2] || '.hero-frames'
const W = 1920, H = 900, FPS = 25, SECONDS = 10, N = FPS * SECONDS
fs.rmSync(FR, { recursive: true, force: true })
fs.mkdirSync(FR, { recursive: true })

// Stage: the whole car (scaled ~1.2x, kept sharp) on the right, set into a blurred extension of the photo's own studio background.
const CAR_W = 1240
const carH = Math.round(CAR_W * 331 / 1024)
const car = await sharp(SRC).resize(CAR_W, carH, { kernel: 'lanczos3' }).sharpen({ sigma: 0.7 }).toBuffer()
// Feathered alpha so the photo's edges dissolve into the stage (computed per pixel, no hard borders).
const { data: px, info } = await sharp(car).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
const fx = 0.1, fy = 0.3
const ramp = (u, f) => Math.min(1, Math.max(0, u / f))
for (let y = 0; y < info.height; y++) {
  const vy = Math.min(ramp(y / info.height, fy), ramp(1 - y / info.height, 0.12))
  for (let x = 0; x < info.width; x++) {
    const vx = Math.min(ramp(x / info.width, fx), ramp(1 - x / info.width, 0.09))
    const a = vx * vy
    px[(y * info.width + x) * 4 + 3] = Math.round(255 * a * a * (3 - 2 * a)) // smoothstep
  }
}
const carMasked = await sharp(px, { raw: info }).png().toBuffer()
// Studio backdrop using the photo's own tones: dark wall, faint blue key light, reflective floor.
const backdrop = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1016"/><stop offset="0.65" stop-color="#1b2128"/><stop offset="0.72" stop-color="#20262c"/><stop offset="1" stop-color="#0a0d11"/></linearGradient>
    <radialGradient id="key" cx="66%" cy="58%" r="45%"><stop offset="0" stop-color="#1e63e9" stop-opacity="0.22"/><stop offset="1" stop-color="#1e63e9" stop-opacity="0"/></radialGradient>
    <radialGradient id="gold" cx="62%" cy="80%" r="30%"><stop offset="0" stop-color="#dcb35c" stop-opacity="0.08"/><stop offset="1" stop-color="#dcb35c" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#wall)"/><rect width="100%" height="100%" fill="url(#key)"/><rect width="100%" height="100%" fill="url(#gold)"/>
</svg>`)).png().toBuffer()
const CAR_X = W - CAR_W - 40, CAR_Y = Math.round(H * 0.52 - carH * 0.5)
const stage = await sharp(backdrop).composite([{ input: carMasked, left: CAR_X, top: CAR_Y }]).png().toBuffer()
const HEAD = 1.08
const bigW = Math.round(W * HEAD), bigH = Math.round(H * HEAD)
const big = await sharp(stage).resize(bigW, bigH, { kernel: 'lanczos3' }).toBuffer()

const vignette = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="v" cx="68%" cy="52%" r="70%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="0.55"/></radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#v)"/></svg>`)

const sweep = (x) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="0.35" stop-color="#bfe9ff" stop-opacity="0.12"/>
    <stop offset="0.5" stop-color="#ffffff" stop-opacity="0.28"/>
    <stop offset="0.65" stop-color="#ffe7a8" stop-opacity="0.12"/>
    <stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient></defs>
  <g transform="translate(${x} 0) skewX(-22)"><rect x="0" y="-40" width="640" height="${H + 80}" fill="url(#g)"/></g></svg>`)

const ease = (t) => 0.5 - 0.5 * Math.cos(2 * Math.PI * t) // 0→1→0, seamless at loop point
for (let i = 0; i < N; i++) {
  const t = i / N
  const e = ease(t)
  const scale = 1 + 0.05 * e // push in then back out
  const cw = Math.round(W / scale * HEAD / HEAD), ch = Math.round(H / scale)
  // Crop window in "big" coordinates, drifting slightly right/up as we push in.
  const k = bigW / W
  const wBig = Math.round(cw * k), hBig = Math.round(ch * k)
  const cx = (bigW - wBig) / 2 + (bigW - wBig) * 0.18 * (e - 0.5)
  const cy = (bigH - hBig) / 2 - (bigH - hBig) * 0.12 * (e - 0.5)
  const left = Math.max(0, Math.min(bigW - wBig, Math.round(cx)))
  const top = Math.max(0, Math.min(bigH - hBig, Math.round(cy)))
  const layers = [{ input: vignette }]
  // Light sweep travels across the car between 12% and 52% of the loop.
  const s = (t - 0.12) / 0.4
  if (s >= 0 && s <= 1) layers.unshift({ input: sweep(CAR_X - 500 + s * (CAR_W + 900)), blend: 'screen' })
  const breath = 1 + 0.045 * Math.sin(2 * Math.PI * t * 2) // subtle exposure breathing
  await sharp(big)
    .extract({ left, top, width: wBig, height: hBig })
    .resize(W, H, { kernel: 'lanczos3' })
    .modulate({ brightness: breath })
    .composite(layers)
    .jpeg({ quality: 92 })
    .toFile(path.join(FR, `f${String(i).padStart(4, '0')}.jpg`))
}

const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-framerate', String(FPS), '-i', path.join(FR, 'f%04d.jpg'), ...args], { stdio: 'inherit' })
// Desktop
ff(['-c:v', 'libx264', '-preset', 'slow', '-crf', '27', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an', path.join(OUT, 'hero-car.mp4')])
ff(['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-pix_fmt', 'yuv420p', '-an', path.join(OUT, 'hero-car.webm')])
// Mobile (lighter)
ff(['-vf', 'scale=1280:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', path.join(OUT, 'hero-car-1280.mp4')])
// Poster = first frame
await sharp(path.join(FR, 'f0000.jpg')).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, 'hero-car-poster.jpg'))
fs.rmSync(FR, { recursive: true, force: true })
console.log('hero video built')

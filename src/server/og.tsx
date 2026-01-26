import { initWasm, Resvg } from '@resvg/resvg-wasm'
import type { SatoriOptions } from 'satori'
import satori from 'satori'

const WIDTH = 1200
const HEIGHT = 630

let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null =
  null

function loadFonts() {
  if (fontsPromise) {
    return fontsPromise
  }

  fontsPromise = Promise.all([
    fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/figtree@latest/latin-400-normal.woff'
    ).then((r) => r.arrayBuffer()),
    fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/figtree@latest/latin-700-normal.woff'
    ).then((r) => r.arrayBuffer()),
  ]).then(([regular, bold]) => ({ regular, bold }))

  return fontsPromise
}

function getSatoriOptions(fonts: {
  regular: ArrayBuffer
  bold: ArrayBuffer
}): SatoriOptions {
  return {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: 'Figtree', data: fonts.regular, weight: 400, style: 'normal' },
      { name: 'Figtree', data: fonts.bold, weight: 700, style: 'normal' },
    ],
  }
}

let wasmReady: Promise<void> | null = null

function ensureWasm(): Promise<void> {
  if (wasmReady) {
    return wasmReady
  }

  wasmReady = fetch('https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm')
    .then((res) => res.arrayBuffer())
    .then((buf) => initWasm(buf))
  return wasmReady
}

async function svgToPng(svg: string): Promise<Uint8Array> {
  await ensureWasm()
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

// Theme-matched hex values (dark mode, oklch → hex)
const colors = {
  bg: '#09090b', // zinc-950 (--background)
  fg: '#fafafa', // zinc-50 (--foreground)
  muted: '#a1a1aa', // zinc-400 (--muted-foreground)
  subtle: '#3f3f46', // zinc-700
  track: '#27272a', // zinc-800 (--secondary)
  success: '#10b981', // emerald-500 (--success)
  warning: '#f59e0b', // amber-500 (--warning)
  destructive: '#ef4444', // red-500 (--destructive)
} as const

function vibeColor(score: number): string {
  if (score >= 67) {
    return colors.success
  }
  if (score >= 34) {
    return colors.warning
  }
  return colors.destructive
}

function vibeLabel(score: number): string {
  if (score >= 80) {
    return "Chef's Kiss"
  }
  if (score >= 60) {
    return 'Solid Pick'
  }
  if (score >= 40) {
    return 'Meh'
  }
  if (score >= 20) {
    return 'Yikes'
  }
  return 'Dead on Arrival'
}

function createGaugeSvg(score: number, color: string): string {
  const cx = 180
  const cy = 165
  const r = 140
  const sw = 20

  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`

  let progressMarkup = ''
  if (score > 0) {
    const angle = (score / 100) * Math.PI
    const endX = cx + r * Math.cos(Math.PI - angle)
    const endY = cy - r * Math.sin(Math.PI - angle)
    const largeArc = score > 50 ? 1 : 0
    progressMarkup = `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${endX.toFixed(1)} ${endY.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`
  }

  return `<svg width="360" height="195" viewBox="0 0 360 195" xmlns="http://www.w3.org/2000/svg"><path d="${bgPath}" fill="none" stroke="${colors.track}" stroke-width="${sw}" stroke-linecap="round"/>${progressMarkup}</svg>`
}

function OgShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: colors.bg,
        fontFamily: 'Figtree',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: 180,
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.14) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: 140,
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function Divider() {
  return (
    <div
      style={{
        width: 64,
        height: 2,
        backgroundColor: colors.track,
        marginTop: 24,
        marginBottom: 24,
        borderRadius: 1,
      }}
    />
  )
}

export async function generateRootOgImage(): Promise<Uint8Array> {
  const fonts = await loadFonts()

  const element = (
    <OgShell>
      <div
        style={{
          fontSize: 88,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: '-0.03em',
        }}
      >
        onomast.app
      </div>
      <Divider />
      <div
        style={{
          fontSize: 40,
          fontWeight: 400,
          color: colors.muted,
        }}
      >
        Vibe Check Your Company Name
      </div>
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 28,
          fontSize: 24,
          color: colors.muted,
        }}
      >
        <span>domains</span>
        <span style={{ color: colors.subtle }}>·</span>
        <span>social</span>
        <span style={{ color: colors.subtle }}>·</span>
        <span>packages</span>
        <span style={{ color: colors.subtle }}>·</span>
        <span>vibes</span>
      </div>
    </OgShell>
  )

  const svg = await satori(element, getSatoriOptions(fonts))
  return await svgToPng(svg)
}

export interface VibeData {
  positivity: number
  reason: string
}

export async function generateNameOgImage(
  name: string,
  vibe?: VibeData
): Promise<Uint8Array> {
  const fonts = await loadFonts()

  let nameFontSize = 96
  if (name.length > 16) {
    nameFontSize = 78
  }
  if (name.length > 24) {
    nameFontSize = 64
  }
  if (name.length > 32) {
    nameFontSize = 52
  }

  const element = vibe ? (
    <OgShell>
      <div
        style={{
          fontSize: nameFontSize,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: '-0.03em',
        }}
      >
        {name}
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: 360,
          height: 195,
          marginTop: 20,
        }}
      >
        <img
          alt="Vibe score gauge"
          height={195}
          src={`data:image/svg+xml,${encodeURIComponent(createGaugeSvg(vibe.positivity, vibeColor(vibe.positivity)))}`}
          width={360}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 360,
            height: 195,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: colors.fg,
            }}
          >
            {vibe.positivity}
          </span>
          <span style={{ fontSize: 22, color: colors.muted }}>
            {vibeLabel(vibe.positivity)}
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: 24,
          color: colors.muted,
          marginTop: 20,
          maxWidth: 800,
          textAlign: 'center',
        }}
      >
        {vibe.reason.length > 100
          ? `${vibe.reason.slice(0, 97)}...`
          : vibe.reason}
      </div>

      <div
        style={{
          fontSize: 26,
          color: colors.subtle,
          marginTop: 20,
        }}
      >
        onomast.app
      </div>
    </OgShell>
  ) : (
    <OgShell>
      <div
        style={{
          fontSize: nameFontSize,
          fontWeight: 700,
          color: colors.fg,
          letterSpacing: '-0.03em',
        }}
      >
        {name}
      </div>
      <Divider />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 22,
          color: colors.muted,
        }}
      >
        <span>onomast.app</span>
        <span style={{ color: colors.subtle }}>·</span>
        <span>Vibe Check</span>
      </div>
    </OgShell>
  )

  const svg = await satori(element, getSatoriOptions(fonts))
  return await svgToPng(svg)
}

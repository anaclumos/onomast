import satori, { type SatoriOptions } from 'satori'
import { Resvg } from '@resvg/resvg-js'

const WIDTH = 1200
const HEIGHT = 630

let fontsPromise: Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> | null =
  null

function loadFonts() {
  if (fontsPromise) return fontsPromise

  fontsPromise = Promise.all([
    fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/figtree@latest/latin-400-normal.woff',
    ).then((r) => r.arrayBuffer()),
    fetch(
      'https://cdn.jsdelivr.net/fontsource/fonts/figtree@latest/latin-700-normal.woff',
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

function svgToPng(svg: string): Uint8Array {
  const resvg = new Resvg(svg)
  const pngData = resvg.render()
  return pngData.asPng()
}

function vibeColor(score: number): string {
  if (score >= 67) return '#4ade80'
  if (score >= 34) return '#facc15'
  return '#f87171'
}

function vibeLabel(score: number): string {
  if (score >= 80) return "Chef's Kiss"
  if (score >= 60) return 'Solid Pick'
  if (score >= 40) return 'Meh'
  if (score >= 20) return 'Yikes'
  return 'Dead on Arrival'
}

function createGaugeSvg(score: number, color: string): string {
  const cx = 120
  const cy = 110
  const r = 90
  const sw = 14

  const bgPath = `M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`

  let progressMarkup = ''
  if (score > 0) {
    const angle = (score / 100) * Math.PI
    const endX = cx + r * Math.cos(Math.PI - angle)
    const endY = cy - r * Math.sin(Math.PI - angle)
    const largeArc = score > 50 ? 1 : 0
    progressMarkup = `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${endX.toFixed(1)} ${endY.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"/>`
  }

  return `<svg width="240" height="130" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><path d="${bgPath}" fill="none" stroke="#3c3b48" stroke-width="${sw}" stroke-linecap="round"/>${progressMarkup}</svg>`
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
        backgroundColor: '#1c1b22',
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
            'radial-gradient(circle, rgba(130, 100, 230, 0.14) 0%, transparent 70%)',
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
            'radial-gradient(circle, rgba(90, 140, 230, 0.10) 0%, transparent 70%)',
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
        backgroundColor: '#3c3b48',
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
          fontSize: 56,
          fontWeight: 700,
          color: '#fbfbfb',
          letterSpacing: '-0.03em',
        }}
      >
        onomast.app
      </div>
      <Divider />
      <div
        style={{
          fontSize: 26,
          fontWeight: 400,
          color: 'rgba(251, 251, 251, 0.72)',
        }}
      >
        Vibe Check Your Company Name
      </div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginTop: 20,
          fontSize: 16,
          color: '#7c7c8a',
        }}
      >
        <span>domains</span>
        <span style={{ color: '#4c4b58' }}>·</span>
        <span>social</span>
        <span style={{ color: '#4c4b58' }}>·</span>
        <span>packages</span>
        <span style={{ color: '#4c4b58' }}>·</span>
        <span>vibes</span>
      </div>
    </OgShell>
  )

  const svg = await satori(element, getSatoriOptions(fonts))
  return svgToPng(svg)
}

export type VibeData = {
  positivity: number
  reason: string
}

export async function generateNameOgImage(
  name: string,
  vibe?: VibeData,
): Promise<Uint8Array> {
  const fonts = await loadFonts()

  let nameFontSize = 64
  if (name.length > 16) nameFontSize = 52
  if (name.length > 24) nameFontSize = 42
  if (name.length > 32) nameFontSize = 34

  const element = vibe ? (
    <OgShell>
      <div
        style={{
          fontSize: nameFontSize,
          fontWeight: 700,
          color: '#fbfbfb',
          letterSpacing: '-0.03em',
        }}
      >
        {name}
      </div>

      <div
        style={{
          display: 'flex',
          position: 'relative',
          width: 240,
          height: 130,
          marginTop: 16,
        }}
      >
        <img
          src={`data:image/svg+xml,${encodeURIComponent(createGaugeSvg(vibe.positivity, vibeColor(vibe.positivity)))}`}
          width={240}
          height={130}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 240,
            height: 130,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 10,
          }}
        >
          <span
            style={{
              fontSize: 44,
              fontWeight: 700,
              color: '#fbfbfb',
            }}
          >
            {vibe.positivity}
          </span>
          <span style={{ fontSize: 14, color: '#7c7c8a' }}>
            {vibeLabel(vibe.positivity)}
          </span>
        </div>
      </div>

      <div
        style={{
          fontSize: 16,
          color: '#7c7c8a',
          marginTop: 16,
          maxWidth: 600,
          textAlign: 'center',
        }}
      >
        {vibe.reason.length > 80
          ? vibe.reason.slice(0, 77) + '...'
          : vibe.reason}
      </div>

      <div
        style={{
          fontSize: 18,
          color: '#4c4b58',
          marginTop: 16,
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
          color: '#fbfbfb',
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
          color: '#7c7c8a',
        }}
      >
        <span>onomast.app</span>
        <span style={{ color: '#4c4b58' }}>·</span>
        <span>Vibe Check</span>
      </div>
    </OgShell>
  )

  const svg = await satori(element, getSatoriOptions(fonts))
  return svgToPng(svg)
}

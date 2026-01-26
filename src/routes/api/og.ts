import { createFileRoute } from '@tanstack/react-router'
import { generateRootOgImage, generateNameOgImage } from '@/server/og'
import { checkWordVibe } from '@/server/vibe-check'
import type { VibeData } from '@/server/og'

const vibeCache = new Map<string, VibeData>()

async function fetchVibe(name: string): Promise<VibeData | undefined> {
  const cached = vibeCache.get(name)
  if (cached) return cached

  try {
    const result = await Promise.race([
      checkWordVibe({ data: { name, description: '' } }),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 8000)),
    ])

    if (result) {
      const data: VibeData = {
        positivity: result.positivity,
        reason: result.reason,
      }
      vibeCache.set(name, data)
      return data
    }
  } catch {
    return undefined
  }

  return undefined
}

const PNG_HEADERS = {
  'Content-Type': 'image/png',
  'Cache-Control': 'public, max-age=86400, s-maxage=604800',
} as const

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url)
        const name = url.searchParams.get('name')

        if (!name) {
          const png = await generateRootOgImage()
          return new Response(png, { headers: PNG_HEADERS })
        }

        const vibe = await fetchVibe(name)
        const png = await generateNameOgImage(name, vibe)
        return new Response(png, { headers: PNG_HEADERS })
      },
    },
  },
})

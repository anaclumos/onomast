import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { SocialCheck, SocialPlatform } from '@/lib/types'

const socialInput = z.object({
  platform: z.enum(['instagram', 'twitter', 'tiktok', 'youtube', 'facebook']),
  handle: z.string().min(1).max(100),
})

const PLATFORM_URLS: Record<SocialPlatform, (handle: string) => string> = {
  instagram: (h) => `https://www.instagram.com/${h}/`,
  twitter: (h) => `https://x.com/${h}`,
  tiktok: (h) => `https://www.tiktok.com/@${h}`,
  youtube: (h) => `https://www.youtube.com/@${h}`,
  facebook: (h) => `https://www.facebook.com/${h}`,
}

export const checkSocialHandle = createServerFn({ method: 'GET' })
  .inputValidator(socialInput)
  .handler(async ({ data }): Promise<SocialCheck> => {
    const profileUrl = PLATFORM_URLS[data.platform](data.handle)

    try {
      const res = await fetch(profileUrl, {
        method: 'HEAD',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        headers: {
          'User-Agent':
            'Mozilla/5.0 (compatible; Onomast/1.0; +https://onomast.app)',
        },
      })

      // 404 = profile doesn't exist
      if (res.status === 404) {
        return {
          platform: data.platform,
          handle: data.handle,
          profileUrl,
          status: 'available',
        }
      }

      // 200 or 3xx redirects = profile exists (Instagram/Twitter redirect to login or profile)
      if (res.status === 200 || (res.status >= 300 && res.status < 400)) {
        return {
          platform: data.platform,
          handle: data.handle,
          profileUrl,
          status: 'taken',
        }
      }

      return {
        platform: data.platform,
        handle: data.handle,
        profileUrl,
        status: 'unknown',
      }
    } catch {
      return {
        platform: data.platform,
        handle: data.handle,
        profileUrl,
        status: 'unknown',
      }
    }
  })

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { DomainCheck } from '@/lib/types'

const domainInput = z.object({
  name: z.string().min(1).max(63),
  tld: z.string().min(1).max(10),
})

export const checkDomain = createServerFn({ method: 'GET' })
  .inputValidator(domainInput)
  .handler(async ({ data }): Promise<DomainCheck> => {
    const domain = `${data.name}.${data.tld}`
    try {
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`,
        { signal: AbortSignal.timeout(8000) },
      )

      if (!res.ok) {
        return { tld: data.tld, domain, status: 'unknown' }
      }

      const json: { Status: number; Answer?: { data: string }[] } =
        await res.json()

      // Status 3 = NXDOMAIN (domain does not exist)
      if (json.Status === 3) {
        return { tld: data.tld, domain, status: 'available' }
      }

      // Status 0 with answers = domain resolves
      if (json.Status === 0 && json.Answer && json.Answer.length > 0) {
        return { tld: data.tld, domain, status: 'taken' }
      }

      // Status 0 but no answers (registered but no A record) — treat as taken
      if (json.Status === 0) {
        return { tld: data.tld, domain, status: 'taken' }
      }

      return { tld: data.tld, domain, status: 'unknown' }
    } catch {
      return { tld: data.tld, domain, status: 'unknown' }
    }
  })

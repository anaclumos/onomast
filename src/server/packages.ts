import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { PackageCheck } from '@/lib/types'

const nameInput = z.object({ name: z.string().min(1).max(100) })

export const checkNpm = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<PackageCheck> => {
    try {
      const res = await fetch(
        `https://registry.npmjs.org/${encodeURIComponent(data.name)}`,
        { signal: AbortSignal.timeout(8000) },
      )
      return {
        registry: 'npm',
        name: data.name,
        status: res.status === 404 ? 'available' : 'taken',
        url: `https://www.npmjs.com/package/${data.name}`,
      }
    } catch {
      return {
        registry: 'npm',
        name: data.name,
        status: 'unknown',
        url: `https://www.npmjs.com/package/${data.name}`,
      }
    }
  })

export const checkCrates = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<PackageCheck> => {
    try {
      const res = await fetch(
        `https://crates.io/api/v1/crates/${encodeURIComponent(data.name)}`,
        {
          signal: AbortSignal.timeout(8000),
          headers: { 'User-Agent': 'Onomast/1.0 (name-checker)' },
        },
      )
      return {
        registry: 'crates',
        name: data.name,
        status: res.status === 404 ? 'available' : 'taken',
        url: `https://crates.io/crates/${data.name}`,
      }
    } catch {
      return {
        registry: 'crates',
        name: data.name,
        status: 'unknown',
        url: `https://crates.io/crates/${data.name}`,
      }
    }
  })

export const checkGolang = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<PackageCheck> => {
    try {
      const res = await fetch(
        `https://proxy.golang.org/github.com/${encodeURIComponent(data.name)}/@v/list`,
        { signal: AbortSignal.timeout(8000) },
      )
      return {
        registry: 'go',
        name: data.name,
        status:
          res.status === 404 || res.status === 410 ? 'available' : 'taken',
        url: `https://pkg.go.dev/github.com/${data.name}`,
      }
    } catch {
      return {
        registry: 'go',
        name: data.name,
        status: 'unknown',
        url: `https://pkg.go.dev/github.com/${data.name}`,
      }
    }
  })

export const checkHomebrew = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<PackageCheck> => {
    try {
      const res = await fetch(
        `https://formulae.brew.sh/api/formula/${encodeURIComponent(data.name)}.json`,
        { signal: AbortSignal.timeout(8000) },
      )
      return {
        registry: 'homebrew',
        name: data.name,
        status: res.status === 404 ? 'available' : 'taken',
        url: `https://formulae.brew.sh/formula/${data.name}`,
      }
    } catch {
      return {
        registry: 'homebrew',
        name: data.name,
        status: 'unknown',
        url: `https://formulae.brew.sh/formula/${data.name}`,
      }
    }
  })

export const checkApt = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<PackageCheck> => {
    try {
      const res = await fetch(
        `https://sources.debian.org/api/search/${encodeURIComponent(data.name)}/`,
        { signal: AbortSignal.timeout(8000) },
      )
      if (!res.ok) {
        return {
          registry: 'apt',
          name: data.name,
          status: 'unknown',
          url: `https://packages.debian.org/search?keywords=${data.name}`,
        }
      }
      const json = await res.json()
      const hasExact =
        json.results?.exact !== null && json.results?.exact !== undefined
      return {
        registry: 'apt',
        name: data.name,
        status: hasExact ? 'taken' : 'available',
        url: `https://packages.debian.org/search?keywords=${data.name}`,
      }
    } catch {
      return {
        registry: 'apt',
        name: data.name,
        status: 'unknown',
        url: `https://packages.debian.org/search?keywords=${data.name}`,
      }
    }
  })

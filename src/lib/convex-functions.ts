import { makeFunctionReference } from 'convex/server'
import type { VibeCheckResult } from '@/lib/types'

export interface SavedSearch {
  _id: string
  name: string
  description?: string
  region?: string
  language?: string
  latinName?: string
}

export interface LeaderboardEntry {
  normalizedName: string
  name: string
  saves: number
  lastSavedAt: number
}

export const listSavedSearchesFn = makeFunctionReference<
  'query',
  Record<string, never>,
  SavedSearch[]
>('savedsearches:listForCurrentUser')

export const saveSearchFn = makeFunctionReference<
  'mutation',
  {
    name: string
    description?: string
    region?: string
    language?: string
    latinName?: string
  },
  string
>('savedsearches:save')

export const getVibeCheckByHashFn = makeFunctionReference<
  'query',
  { inputHash: string },
  VibeCheckResult | null
>('vibechecks:getByInputHash')

export const upsertVibeCheckFn = makeFunctionReference<
  'mutation',
  {
    inputHash: string
    name: string
    description?: string
    region?: string
    language?: string
    locale: string
    positivity: number
    vibe: 'positive' | 'neutral' | 'negative'
    reason: string
    whyGood: string
    whyBad: string
    redditTake: string
    similarCompanies: string[]
    model?: string
    promptVersion: number
  },
  string
>('vibechecks:upsert')

export const leaderboardTopNamesFn = makeFunctionReference<
  'query',
  { limit?: number },
  LeaderboardEntry[]
>('leaderboard:topNames')

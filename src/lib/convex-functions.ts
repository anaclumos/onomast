import { makeFunctionReference } from 'convex/server'

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

export const leaderboardTopNamesFn = makeFunctionReference<
  'query',
  { limit?: number },
  LeaderboardEntry[]
>('leaderboard:topNames')

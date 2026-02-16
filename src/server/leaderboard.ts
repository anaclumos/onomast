import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { savedSearches } from '@/db/schema'

export interface LeaderboardEntry {
  normalizedName: string
  name: string
  saves: number
  lastSavedAt: number
}

export const getTopNames = createServerFn({ method: 'GET' }).handler(
  async (limit?: number): Promise<LeaderboardEntry[]> => {
    const constrainedLimit = Math.max(1, Math.min(limit ?? 50, 100))
    const allSearches = await db.select().from(savedSearches)
    const nameMap = new Map<string, LeaderboardEntry>()

    for (const search of allSearches) {
      const existing = nameMap.get(search.normalizedName)
      const updatedAtTime = search.updatedAt.getTime()

      if (!existing) {
        nameMap.set(search.normalizedName, {
          normalizedName: search.normalizedName,
          name: search.name,
          saves: 1,
          lastSavedAt: updatedAtTime,
        })
        continue
      }

      existing.saves += 1
      if (updatedAtTime > existing.lastSavedAt) {
        existing.lastSavedAt = updatedAtTime
        existing.name = search.name
      }
    }

    return Array.from(nameMap.values())
      .sort((a, b) => {
        if (b.saves !== a.saves) {
          return b.saves - a.saves
        }
        return b.lastSavedAt - a.lastSavedAt
      })
      .slice(0, constrainedLimit)
  }
)

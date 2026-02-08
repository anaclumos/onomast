import { queryGeneric } from 'convex/server'
import { v } from 'convex/values'

interface LeaderboardRow {
  normalizedName: string
  name: string
  saves: number
  lastSavedAt: number
}

export const topNames = queryGeneric({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(args.limit ?? 50, 100))

    const rows = await ctx.db.query('savedSearches').collect()

    const byName = new Map<string, LeaderboardRow>()

    for (const row of rows) {
      const existing = byName.get(row.normalizedName)
      if (!existing) {
        byName.set(row.normalizedName, {
          normalizedName: row.normalizedName,
          name: row.name,
          saves: 1,
          lastSavedAt: row.updatedAt,
        })
        continue
      }

      existing.saves += 1
      if (row.updatedAt > existing.lastSavedAt) {
        existing.lastSavedAt = row.updatedAt
        existing.name = row.name
      }
    }

    return [...byName.values()]
      .sort((a, b) => {
        if (b.saves !== a.saves) {
          return b.saves - a.saves
        }
        return b.lastSavedAt - a.lastSavedAt
      })
      .slice(0, limit)
  },
})

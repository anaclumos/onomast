import { mutationGeneric, queryGeneric, type UserIdentity } from 'convex/server'
import { ConvexError, v } from 'convex/values'

function assertSignedIn(identity: UserIdentity | null): UserIdentity {
  if (!identity) {
    throw new ConvexError('Not authenticated')
  }
  return identity
}

export const listForCurrentUser = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const identity = assertSignedIn(await ctx.auth.getUserIdentity())
    const rows = await ctx.db
      .query('savedSearches')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()

    return rows.sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 20)
  },
})

export const save = mutationGeneric({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    region: v.optional(v.string()),
    language: v.optional(v.string()),
    latinName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = assertSignedIn(await ctx.auth.getUserIdentity())
    const normalizedName = args.name.trim().toLowerCase()
    if (!normalizedName) {
      throw new ConvexError('Name is required')
    }

    const now = Date.now()
    const existingCandidates = await ctx.db
      .query('savedSearches')
      .withIndex('by_user', (q) => q.eq('userId', identity.subject))
      .collect()
    const existing = existingCandidates.find(
      (candidate) => candidate.normalizedName === normalizedName
    )

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        description: args.description,
        region: args.region,
        language: args.language,
        latinName: args.latinName,
        updatedAt: now,
      })
      return existing._id
    }

    return await ctx.db.insert('savedSearches', {
      userId: identity.subject,
      normalizedName,
      name: args.name,
      description: args.description,
      region: args.region,
      language: args.language,
      latinName: args.latinName,
      createdAt: now,
      updatedAt: now,
    })
  },
})

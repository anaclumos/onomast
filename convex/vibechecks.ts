import { mutationGeneric, queryGeneric } from 'convex/server'
import { v } from 'convex/values'

export const getByInputHash = queryGeneric({
  args: { inputHash: v.string() },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query('vibeChecks')
      .withIndex('by_input_hash', (q) => q.eq('inputHash', args.inputHash))
      .first()

    if (!row) {
      return null
    }

    return {
      positivity: row.positivity,
      vibe: row.vibe,
      reason: row.reason,
      whyGood: row.whyGood,
      whyBad: row.whyBad,
      redditTake: row.redditTake,
      similarCompanies: row.similarCompanies,
    }
  },
})

export const upsert = mutationGeneric({
  args: {
    inputHash: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    region: v.optional(v.string()),
    language: v.optional(v.string()),
    locale: v.string(),
    positivity: v.number(),
    vibe: v.union(
      v.literal('positive'),
      v.literal('neutral'),
      v.literal('negative')
    ),
    reason: v.string(),
    whyGood: v.string(),
    whyBad: v.string(),
    redditTake: v.string(),
    similarCompanies: v.array(v.string()),
    model: v.optional(v.string()),
    promptVersion: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const existing = await ctx.db
      .query('vibeChecks')
      .withIndex('by_input_hash', (q) => q.eq('inputHash', args.inputHash))
      .first()

    const base = {
      inputHash: args.inputHash,
      name: args.name,
      description: args.description,
      region: args.region,
      language: args.language,
      locale: args.locale,
      positivity: args.positivity,
      vibe: args.vibe,
      reason: args.reason,
      whyGood: args.whyGood,
      whyBad: args.whyBad,
      redditTake: args.redditTake,
      similarCompanies: args.similarCompanies,
      model: args.model,
      promptVersion: args.promptVersion,
    }

    if (existing) {
      await ctx.db.patch(existing._id, { ...base, updatedAt: now })
      return existing._id
    }

    return await ctx.db.insert('vibeChecks', {
      ...base,
      createdAt: now,
      updatedAt: now,
    })
  },
})

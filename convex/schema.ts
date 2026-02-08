import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  savedSearches: defineTable({
    userId: v.string(),
    normalizedName: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    region: v.optional(v.string()),
    language: v.optional(v.string()),
    latinName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index('by_user', ['userId'])
    .index('by_user_and_name', ['userId', 'normalizedName']),

  vibeChecks: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index('by_input_hash', ['inputHash']),
})

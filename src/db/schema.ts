import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const vibeChecks = pgTable(
  'vibe_checks',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    inputHash: text('input_hash').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    region: text('region'),
    language: text('language'),
    locale: text('locale').notNull(),
    positivity: integer('positivity').notNull(),
    vibe: text('vibe').$type<'positive' | 'neutral' | 'negative'>().notNull(),
    reason: text('reason').notNull(),
    whyGood: text('why_good').notNull(),
    whyBad: text('why_bad').notNull(),
    redditTake: text('reddit_take').notNull(),
    similarCompanies: text('similar_companies').array().notNull(),
    model: text('model'),
    promptVersion: integer('prompt_version').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => [uniqueIndex('vibe_checks_input_hash_idx').on(table.inputHash)]
)

import { createServerFn } from '@tanstack/react-start'
import { generateObject } from 'ai'
import { gateway } from '@ai-sdk/gateway'
import { z } from 'zod'
import type { VibeCheckResult } from '@/lib/types'

const vibeSchema = z.object({
  positivity: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'Positivity score from 0 to 100 as a name for a product/company/project',
    ),
  vibe: z.enum(['positive', 'neutral', 'negative']),
  whyGood: z
    .string()
    .describe('Why this is a good name. Be direct. 1-2 sentences.'),
  whyBad: z
    .string()
    .describe('Why this is a bad name. Be brutally honest. 1-2 sentences.'),
  redditTake: z
    .string()
    .describe(
      'What an average Redditor would say about this name in a comment. Snarky, opinionated, maybe a pun. Write it as a direct quote.',
    ),
  similarCompanies: z
    .array(z.string())
    .describe(
      'Real existing companies or products with similar-sounding names. 1-5 entries. Empty array if none.',
    ),
})

export const checkWordVibe = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional().default(''),
    }),
  )
  .handler(async ({ data }): Promise<VibeCheckResult> => {
    try {
      const result = await generateObject({
        model: gateway('openai/gpt-5.2'),
        schema: vibeSchema,
        prompt: `Analyze "${data.name}" as a product/company/project name.${data.description ? `\nThe company/product is described as: "${data.description}". Factor this context into your analysis.` : ''} Be direct and opinionated.

1. Rate positivity 0-100.
2. Why is it a GOOD name? Be specific.
3. Why is it a BAD name? Be brutally honest.
4. Write a snarky Reddit comment reacting to this name. Sound like a real Redditor — opinionated, funny, maybe a pun.
5. List real existing companies or products that sound similar to "${data.name}". Only include real ones.

No corporate speak. No fluff. Say it like you mean it.`,
      })

      return result.object
    } catch {
      return {
        positivity: 50,
        vibe: 'neutral',
        whyGood: 'AI service unavailable.',
        whyBad: 'AI service unavailable.',
        redditTake: 'AI service unavailable.',
        similarCompanies: [],
      }
    }
  })

import { gateway } from '@ai-sdk/gateway'
import { createServerFn } from '@tanstack/react-start'
import { generateObject } from 'ai'
import { z } from 'zod'
import type {
  OwnedAssets,
  VibeAvailabilitySnapshot,
  VibeCheckResult,
} from '@/lib/types'

const vibeSchema = z.object({
  positivity: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'Overall viability score from 0 to 100 as a name for a product/company/project'
    ),
  vibe: z.enum(['positive', 'neutral', 'negative']),
  reason: z
    .string()
    .describe(
      'A simple one-sentence explanation of why this name got this score. Plain language, no fluff.'
    ),
  whyGood: z
    .string()
    .describe('Why this is a good name. Be direct. 1-2 sentences.'),
  whyBad: z
    .string()
    .describe('Why this is a bad name. Be brutally honest. 1-2 sentences.'),
  redditTake: z
    .string()
    .describe(
      'What an average Redditor would say about this name in a comment. Snarky, opinionated, maybe a pun. Write it as a direct quote.'
    ),
  similarCompanies: z
    .array(z.string())
    .describe(
      'Real existing companies or products with similar-sounding names. 1-5 entries. Empty array if none.'
    ),
})

const availabilityStatusSchema = z.enum([
  'available',
  'taken',
  'unknown',
  'error',
])
const tldSchema = z.enum(['com', 'dev', 'app', 'net', 'org', 'ai'])
const socialPlatformSchema = z.enum([
  'instagram',
  'twitter',
  'tiktok',
  'youtube',
  'facebook',
])
const packageRegistrySchema = z.enum(['npm', 'crates', 'go', 'homebrew', 'apt'])

const vibeAvailabilitySchema = z
  .object({
    domains: z
      .array(z.object({ tld: tldSchema, status: availabilityStatusSchema }))
      .default([]),
    social: z
      .array(
        z.object({
          platform: socialPlatformSchema,
          status: availabilityStatusSchema,
        })
      )
      .default([]),
    packages: z
      .array(
        z.object({
          registry: packageRegistrySchema,
          status: availabilityStatusSchema,
        })
      )
      .default([]),
    githubUser: z
      .object({
        status: availabilityStatusSchema,
        type: z.enum(['User', 'Org']).optional(),
      })
      .optional(),
  })
  .default(() => ({ domains: [], social: [], packages: [] }))

const ownedAssetsSchema = z
  .object({
    domains: z.array(tldSchema).default([]),
    social: z.array(socialPlatformSchema).default([]),
    packages: z.array(packageRegistrySchema).default([]),
    githubUser: z.boolean().default(false),
  })
  .default(() => ({ domains: [], social: [], packages: [], githubUser: false }))

const vibeContextSchema = z
  .object({
    handleName: z.string().max(100).default(''),
    availability: vibeAvailabilitySchema,
    owned: ownedAssetsSchema,
  })
  .default(() => ({
    handleName: '',
    availability: { domains: [], social: [], packages: [] },
    owned: { domains: [], social: [], packages: [], githubUser: false },
  }))

type VibeContext = z.infer<typeof vibeContextSchema>

const localeToLanguage: Record<string, string> = {
  en: 'English',
  ko: 'Korean',
  ja: 'Japanese',
  'zh-Hans': 'Simplified Chinese',
  'zh-Hant': 'Traditional Chinese',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  pt: 'Portuguese',
}

const MODEL_ID = 'openai/gpt-5.2' as const

function canonicalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

const AI_UNAVAILABLE_RESULT: VibeCheckResult = {
  positivity: 50,
  vibe: 'neutral',
  reason: 'AI service unavailable.',
  whyGood: 'AI service unavailable.',
  whyBad: 'AI service unavailable.',
  redditTake: 'AI service unavailable.',
  similarCompanies: [],
}

function getLanguageInstruction(locale: string): string {
  if (locale === 'en') {
    return ''
  }

  const localeLanguage = localeToLanguage[locale] || 'English'
  return `\n\nIMPORTANT: Respond in ${localeLanguage} language.`
}

function buildOwnedSummary(owned: OwnedAssets): string {
  const domains = owned.domains.length
    ? owned.domains.map((tld) => `.${tld}`).join(', ')
    : 'none'
  const social = owned.social.length ? owned.social.join(', ') : 'none'
  const packages = owned.packages.length ? owned.packages.join(', ') : 'none'
  const github = owned.githubUser ? 'owned' : 'not owned'

  return `domains: ${domains} | social: ${social} | packages: ${packages} | github: ${github}`
}

function buildAvailabilitySummaryLines(
  availability: VibeAvailabilitySnapshot
): string[] {
  const domains = availability.domains.length
    ? `Domains: ${availability.domains
        .map((d) => `.${d.tld}=${d.status}`)
        .join(', ')}`
    : ''

  const social = availability.social.length
    ? `Social: ${availability.social
        .map((s) => `${s.platform}=${s.status}`)
        .join(', ')}`
    : ''

  const packages = availability.packages.length
    ? `Packages: ${availability.packages
        .map((p) => `${p.registry}=${p.status}`)
        .join(', ')}`
    : ''

  const github = availability.githubUser
    ? `GitHub: ${availability.githubUser.status}${
        availability.githubUser.type ? ` (${availability.githubUser.type})` : ''
      }`
    : ''

  return [domains, social, packages, github].filter(Boolean)
}

function buildVibePrompt(args: {
  name: string
  description: string
  region: string
  language: string
  effectiveHandle: string
  availabilitySummaryLines: string[]
  ownedSummary: string
  languageInstruction: string
}): string {
  return `Analyze "${args.name}" as a product/company/project name. Be direct and opinionated.${args.description ? `\n\nThe product/company is described as: "${args.description}".` : ''}${args.region ? `\nTarget market region: ${args.region}. Consider cultural associations, local competitors, and regional naming conventions.` : ''}${args.language ? `\nTarget audience language: ${args.language}. Consider how it sounds/reads, pronunciation difficulty, and unintended meanings in ${args.language}.` : ''}

Practical availability signals are provided for the handle "${args.effectiveHandle}" (domains/social/packages/github). DO NOT guess availability beyond these signals. If a signal is "unknown", treat it as uncertainty, not a fact.
User may mark assets as already owned. If something is "taken" but the user owns it, do NOT penalize it for availability.

Availability signals:
${args.availabilitySummaryLines.length ? args.availabilitySummaryLines.map((l) => `- ${l}`).join('\n') : '- (not provided)'}
User already owns:
- ${args.ownedSummary}

Scoring rubric (holistic):
1) Creativity & distinctiveness: does it feel fresh, ownable, not generic?
2) Brand clarity: does it suggest the right vibe/category without being limiting?
3) Memorability & sound: pronounceable, spellable, looks good written, passes the "heard it once" test.
4) Risk: confusingly similar to existing brands, trademark-ish risk, bad connotations.
5) Practicality: availability/portability across domains/social/packages/github for "${args.effectiveHandle}" (respect "owned").

Output requirements:
1. Rate positivity 0-100 (overall viability given the above).
2. reason: ONE sentence, plain language, no fluff. Mention the 1-2 biggest factors (including availability if it mattered).
3. whyGood: 1-2 sentences, specific.
4. whyBad: 1-2 sentences, brutally honest (call out conflicts with similar brands and availability problems when relevant).
5. redditTake: snarky Reddit comment reacting to this name. Sound like a real Redditor — opinionated, funny, maybe a pun.${args.language && args.language !== 'English' ? ` Write it in ${args.language}.` : ''}
6. similarCompanies: list 1-5 REAL existing companies/products that a reasonable person might confuse with "${args.name}" (similar sound/spelling/vibe). Only include ones you're confident are real.${args.region ? ` Prefer ones relevant to ${args.region}.` : ''}

No corporate speak. No fluff. Say it like you mean it.${args.languageInstruction}`
}
async function generateVibeCheck(args: {
  name: string
  description: string
  region: string
  language: string
  locale: string
  context: VibeContext
}): Promise<VibeCheckResult> {
  const languageInstruction = getLanguageInstruction(args.locale)

  const handleName = canonicalize(args.context.handleName || '')
  const effectiveHandle = handleName || args.name

  const availability: VibeAvailabilitySnapshot = {
    domains: args.context.availability.domains,
    social: args.context.availability.social,
    packages: args.context.availability.packages,
    githubUser: args.context.availability.githubUser,
  }

  const owned: OwnedAssets = {
    domains: args.context.owned.domains,
    social: args.context.owned.social,
    packages: args.context.owned.packages,
    githubUser: args.context.owned.githubUser,
  }

  const availabilitySummaryLines = buildAvailabilitySummaryLines(availability)
  const ownedSummary = buildOwnedSummary(owned)

  const result = await generateObject({
    model: gateway(MODEL_ID),
    schema: vibeSchema,
    prompt: buildVibePrompt({
      availabilitySummaryLines,
      description: args.description,
      effectiveHandle,
      language: args.language,
      languageInstruction,
      name: args.name,
      ownedSummary,
      region: args.region,
    }),
  })
  return result.object
}

export const checkWordVibe = createServerFn({ method: 'GET' })
  .inputValidator(
    z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional().default(''),
      region: z.string().max(100).optional().default(''),
      language: z.string().max(100).optional().default(''),
      locale: z.string().optional().default('en'),
      context: vibeContextSchema,
    })
  )
  .handler(async ({ data }): Promise<VibeCheckResult> => {
    try {
      return await generateVibeCheck({
        name: data.name,
        description: data.description,
        region: data.region,
        language: data.language,
        locale: data.locale,
        context: data.context,
      })
    } catch {
      return AI_UNAVAILABLE_RESULT
    }
  })

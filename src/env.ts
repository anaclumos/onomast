import { z } from 'zod'

export const clientEnvSchema = z.object({})

export type ClientEnv = z.infer<typeof clientEnvSchema>

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  AI_GATEWAY_API_KEY: z.string().optional(),
  DATABASE_URL: z.string().min(1),
  BETTER_AUTH_SECRET: z.string().min(1),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

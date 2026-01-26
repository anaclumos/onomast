import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  AI_GATEWAY_API_KEY: z.string().optional(),
})

export const env = envSchema.parse(process.env)

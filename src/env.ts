import { z } from 'zod'

export const clientEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  VITE_CONVEX_URL: z.string().url(),
})

export type ClientEnv = z.infer<typeof clientEnvSchema>

export const convexEnvSchema = z.object({
  VITE_CONVEX_URL: z.string().url(),
})

export type ConvexEnv = z.infer<typeof convexEnvSchema>

export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  AI_GATEWAY_API_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().min(1),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

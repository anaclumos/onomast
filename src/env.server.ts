import type { ServerEnv } from '@/env'
import { serverEnvSchema } from '@/env'

export type { ServerEnv } from '@/env'

export function getServerEnv(): ServerEnv {
  return serverEnvSchema.parse(process.env)
}

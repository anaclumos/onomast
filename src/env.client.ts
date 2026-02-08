import { clientEnvSchema } from '@/env'

export type { ClientEnv } from '@/env'

export const clientEnv = clientEnvSchema.parse(import.meta.env)

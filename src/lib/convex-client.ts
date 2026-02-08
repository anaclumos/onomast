import { ConvexReactClient } from 'convex/react'
import { clientEnv } from '@/env.client'

export const convex = new ConvexReactClient(clientEnv.VITE_CONVEX_URL)

import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '@/db'
import { savedSearches } from '@/db/schema'
import { auth } from '@/lib/auth'

export interface SavedSearch {
  id: string
  name: string
  description: string | null
  region: string | null
  language: string | null
  latinName: string | null
}

const saveSearchInput = z.object({
  normalizedName: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  region: z.string().optional(),
  language: z.string().optional(),
  latinName: z.string().optional(),
})

export const listSavedSearches = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const searches = await db
      .select()
      .from(savedSearches)
      .where(eq(savedSearches.userId, session.user.id))
      .orderBy(desc(savedSearches.updatedAt))
      .limit(20)

    return searches
  }
)

export const saveSearch = createServerFn({ method: 'POST' })
  .inputValidator(saveSearchInput)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const existing = await db
      .select()
      .from(savedSearches)
      .where(
        and(
          eq(savedSearches.userId, session.user.id),
          eq(savedSearches.normalizedName, data.normalizedName)
        )
      )
      .limit(1)

    if (existing[0]) {
      await db
        .update(savedSearches)
        .set({
          name: data.name,
          description: data.description ?? null,
          region: data.region ?? null,
          language: data.language ?? null,
          latinName: data.latinName ?? null,
          updatedAt: new Date(),
        })
        .where(eq(savedSearches.id, existing[0].id))
    } else {
      await db.insert(savedSearches).values({
        userId: session.user.id,
        normalizedName: data.normalizedName,
        name: data.name,
        description: data.description ?? null,
        region: data.region ?? null,
        language: data.language ?? null,
        latinName: data.latinName ?? null,
      })
    }

    return { success: true }
  })

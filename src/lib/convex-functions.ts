import { makeFunctionReference } from 'convex/server'

export interface SavedSearch {
  _id: string
  name: string
  description?: string
  region?: string
  language?: string
  latinName?: string
}

export const listSavedSearchesFn = makeFunctionReference<
  'query',
  Record<string, never>,
  SavedSearch[]
>('savedsearches:listForCurrentUser')

export const saveSearchFn = makeFunctionReference<
  'mutation',
  {
    name: string
    description?: string
    region?: string
    language?: string
    latinName?: string
  },
  string
>('savedsearches:save')

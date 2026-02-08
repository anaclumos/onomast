import { SignedIn, SignedOut, useAuth } from '@clerk/tanstack-react-start'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery } from 'convex/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  listSavedSearchesFn,
  type SavedSearch,
  saveSearchFn,
} from '@/lib/convex-functions'

interface SearchState {
  name: string
  description: string
  region: string
  language: string
  latinName: string
}

function toRouteSearch(search: SavedSearch) {
  return {
    description: search.description || undefined,
    region: search.region || undefined,
    language: search.language || undefined,
    latinName: search.latinName || undefined,
  }
}

export function SavedSearchesPanel({
  currentSearch,
}: {
  currentSearch: SearchState
}) {
  const { isLoaded, isSignedIn } = useAuth()
  const shouldLoadSearches = isLoaded && !!isSignedIn
  const savedSearches = useQuery(
    listSavedSearchesFn,
    shouldLoadSearches ? {} : 'skip'
  )
  const saveSearch = useMutation(saveSearchFn)
  const [isSaving, setIsSaving] = useState(false)
  const [statusText, setStatusText] = useState<string | null>(null)

  const handleSave = async () => {
    setIsSaving(true)
    setStatusText(null)
    try {
      await saveSearch({
        name: currentSearch.name,
        description: currentSearch.description || undefined,
        region: currentSearch.region || undefined,
        language: currentSearch.language || undefined,
        latinName: currentSearch.latinName || undefined,
      })
      setStatusText('Saved.')
    } catch {
      setStatusText('Save failed. Try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <SignedOut>
        <div className="rounded-lg border bg-card px-3 py-2 text-muted-foreground text-sm">
          Sign in to save searches.
        </div>
      </SignedOut>
      <SignedIn>
        <section className="rounded-lg border bg-card px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-medium text-sm">Saved searches</h2>
            <Button
              disabled={isSaving}
              onClick={handleSave}
              size="sm"
              variant="secondary"
            >
              {isSaving ? 'Saving...' : 'Save current'}
            </Button>
          </div>

          {statusText ? (
            <p className="mt-2 text-muted-foreground text-xs">{statusText}</p>
          ) : null}

          {savedSearches === undefined ? (
            <p className="mt-2 text-muted-foreground text-xs">Loading...</p>
          ) : null}

          {savedSearches && savedSearches.length === 0 ? (
            <p className="mt-2 text-muted-foreground text-xs">
              No saved searches yet.
            </p>
          ) : null}

          {savedSearches && savedSearches.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {savedSearches.map((search) => (
                <Link
                  className="rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted"
                  key={search._id}
                  params={{ name: search.name }}
                  search={toRouteSearch(search)}
                  to="/$name"
                >
                  {search.name}
                </Link>
              ))}
            </div>
          ) : null}
        </section>
      </SignedIn>
    </>
  )
}

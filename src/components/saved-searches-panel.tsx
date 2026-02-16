import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import {
  listSavedSearches,
  type SavedSearch,
  saveSearch,
} from '@/server/saved-searches'

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
  const { data: session, isPending } = authClient.useSession()
  const queryClient = useQueryClient()

  const { data: searches, isLoading } = useQuery({
    queryKey: ['saved-searches'],
    queryFn: () => listSavedSearches(),
    enabled: !!session,
  })

  const saveMutation = useMutation({
    mutationFn: (data: {
      normalizedName: string
      name: string
      description?: string
      region?: string
      language?: string
      latinName?: string
    }) => saveSearch({ data }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['saved-searches'] }),
  })

  const handleSave = () => {
    saveMutation.mutate({
      normalizedName: currentSearch.name.toLowerCase(),
      name: currentSearch.name,
      description: currentSearch.description || undefined,
      region: currentSearch.region || undefined,
      language: currentSearch.language || undefined,
      latinName: currentSearch.latinName || undefined,
    })
  }

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <div className="rounded-lg border bg-card px-3 py-2 text-muted-foreground text-sm">
        Sign in to save searches.
      </div>
    )
  }

  return (
    <section className="rounded-lg border bg-card px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-medium text-sm">Saved searches</h2>
        <Button
          disabled={saveMutation.isPending}
          onClick={handleSave}
          size="sm"
          variant="secondary"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save current'}
        </Button>
      </div>

      {saveMutation.isSuccess ? (
        <p className="mt-2 text-muted-foreground text-xs">Saved.</p>
      ) : null}

      {saveMutation.isError ? (
        <p className="mt-2 text-muted-foreground text-xs">
          Save failed. Try again.
        </p>
      ) : null}

      {isLoading ? (
        <p className="mt-2 text-muted-foreground text-xs">Loading...</p>
      ) : null}

      {searches && searches.length === 0 ? (
        <p className="mt-2 text-muted-foreground text-xs">
          No saved searches yet.
        </p>
      ) : null}

      {searches && searches.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {searches.map((search) => (
            <Link
              className="rounded-md border px-2 py-1 text-xs transition-colors hover:bg-muted"
              key={search.id}
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
  )
}

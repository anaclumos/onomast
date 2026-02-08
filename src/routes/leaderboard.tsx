import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { AuthControls } from '@/components/auth-controls'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SearchForm } from '@/components/search-form'
import { leaderboardTopNamesFn } from '@/lib/convex-functions'

export const Route = createFileRoute('/leaderboard')({
  head: () => ({
    meta: [{ title: 'Leaderboard — onomast.app' }],
  }),
  component: LeaderboardPage,
})

function formatDate(timestamp: number) {
  try {
    return new Date(timestamp).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

function LeaderboardPage() {
  const navigate = useNavigate()
  const entries = useQuery(leaderboardTopNamesFn, { limit: 50 })

  const handleSearch = (
    newName: string,
    newDescription: string,
    newRegion: string,
    newLanguage: string,
    newLatinName: string
  ) => {
    navigate({
      to: '/$name',
      params: { name: newName },
      search: {
        description: newDescription || undefined,
        region: newRegion || undefined,
        language: newLanguage || undefined,
        latinName: newLatinName || undefined,
      },
    })
  }

  let list: React.ReactNode
  if (entries === undefined) {
    list = (
      <div className="px-3 py-6 text-muted-foreground text-sm">Loading...</div>
    )
  } else if (entries.length === 0) {
    list = (
      <div className="px-3 py-6 text-muted-foreground text-sm">
        No data yet.
      </div>
    )
  } else {
    list = (
      <ol className="divide-y">
        {entries.map((entry, idx) => (
          <li
            className="grid grid-cols-12 items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-muted/40"
            key={entry.normalizedName}
          >
            <div className="col-span-2 font-mono text-muted-foreground text-xs">
              {idx + 1}
            </div>
            <div className="col-span-7">
              <Link
                className="font-medium hover:underline"
                params={{ name: entry.name }}
                search={{}}
                to="/$name"
              >
                {entry.name}
              </Link>
              <p className="mt-0.5 text-muted-foreground text-xs">
                Last saved {formatDate(entry.lastSavedAt)}
              </p>
            </div>
            <div className="col-span-3 text-right font-medium">
              {entry.saves.toLocaleString()}
            </div>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <Link className="font-semibold text-sm tracking-tight" to="/">
            onomast.app
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-muted-foreground text-sm">leaderboard</span>
        </div>
        <div className="flex items-center gap-2">
          <AuthControls />
          <LanguageSwitcher />
          <SearchForm onSearch={handleSearch} />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-6">
        <section className="mx-auto w-full max-w-3xl">
          <div className="mb-4 flex flex-col gap-1">
            <h1 className="font-semibold text-lg tracking-tight">
              Most saved names
            </h1>
            <p className="text-muted-foreground text-sm">
              Ranked by how many users saved a name.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card">
            <div className="grid grid-cols-12 gap-2 border-b px-3 py-2 text-muted-foreground text-xs">
              <div className="col-span-2">Rank</div>
              <div className="col-span-7">Name</div>
              <div className="col-span-3 text-right">Saves</div>
            </div>
            {list}
          </div>
        </section>
      </main>
    </div>
  )
}

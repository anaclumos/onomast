import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { SearchForm } from '@/components/search-form'
import { ResultsDashboard } from '@/components/results-dashboard'

const searchSchema = z.object({
  description: z.string().optional().default(''),
})

export const Route = createFileRoute('/$name')({
  validateSearch: searchSchema,
  head: ({ params }) => ({
    meta: [
      { title: `${params.name} — onomast.app` },
      { property: 'og:title', content: `${params.name} — onomast.app` },
      {
        property: 'og:description',
        content: `Vibe check for ${params.name} — domain availability, social handles, package registries & more`,
      },
      {
        property: 'og:image',
        content: `/api/og?name=${encodeURIComponent(params.name)}`,
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: `${params.name} — onomast.app`,
      },
      {
        name: 'twitter:description',
        content: `Vibe check for ${params.name} — domain availability, social handles, package registries & more`,
      },
      {
        name: 'twitter:image',
        content: `/api/og?name=${encodeURIComponent(params.name)}`,
      },
    ],
  }),
  component: NamePage,
})

function NamePage() {
  const { name } = Route.useParams()
  const { description } = Route.useSearch()
  const navigate = useNavigate()

  const handleSearch = (newName: string, newDescription: string) => {
    navigate({
      to: '/$name',
      params: { name: newName },
      search: { description: newDescription || undefined },
    })
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            <span className="text-primary">ono</span>mast
          </Link>
          <span className="text-sm text-muted-foreground">/</span>
          <span className="text-sm text-muted-foreground">{name}</span>
        </div>
        <SearchForm
          key={name + description}
          defaultName={name}
          defaultDescription={description}
          onSearch={handleSearch}
        />
      </header>
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        <ResultsDashboard name={name} description={description} />
      </main>
    </div>
  )
}

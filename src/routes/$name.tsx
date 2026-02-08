import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { AuthControls } from '@/components/auth-controls'
import { LanguageSwitcher } from '@/components/language-switcher'
import { ResultsDashboard } from '@/components/results-dashboard'
import { SavedSearchesPanel } from '@/components/saved-searches-panel'
import { SearchForm } from '@/components/search-form'

const searchSchema = z.object({
  description: z.string().optional(),
  region: z.string().optional(),
  language: z.string().optional(),
  latinName: z.string().optional(),
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
        content: `https://www.onomast.app/api/og?name=${encodeURIComponent(params.name)}`,
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
        content: `https://www.onomast.app/api/og?name=${encodeURIComponent(params.name)}`,
      },
    ],
  }),
  component: NamePage,
})

function NamePage() {
  const { name } = Route.useParams()
  const { description, region, language, latinName } = Route.useSearch()
  const navigate = useNavigate()

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

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <Link className="font-semibold text-sm tracking-tight" to="/">
            onomast.app
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-muted-foreground text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <AuthControls />
          <LanguageSwitcher />
          <SearchForm
            defaultDescription={description}
            defaultLanguage={language}
            defaultLatinName={latinName}
            defaultName={name}
            defaultRegion={region}
            key={
              name +
              (description ?? '') +
              (region ?? '') +
              (language ?? '') +
              (latinName ?? '')
            }
            onSearch={handleSearch}
            showDescription={!!(description || region || language)}
          />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        <SavedSearchesPanel
          currentSearch={{
            name,
            description: description ?? '',
            region: region ?? '',
            language: language ?? '',
            latinName: latinName ?? '',
          }}
        />
        <ResultsDashboard
          description={description ?? ''}
          language={language ?? ''}
          latinName={latinName ?? ''}
          name={name}
          region={region ?? ''}
        />
      </main>
    </div>
  )
}

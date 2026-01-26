import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { SearchForm } from '@/components/search-form'
import { ResultsDashboard } from '@/components/results-dashboard'
import { ThemeToggle } from '@/components/theme-toggle'

const searchSchema = z.object({
  description: z.string().optional().default(''),
})

export const Route = createFileRoute('/$name')({
  validateSearch: searchSchema,
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
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            onomast.app
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
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        <ResultsDashboard name={name} description={description} />
      </main>
    </div>
  )
}

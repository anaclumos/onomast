import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod/v4'
import { SearchForm } from '@/components/search-form'
import { ResultsDashboard } from '@/components/results-dashboard'
import { ThemeToggle } from '@/components/theme-toggle'

const searchSchema = z.object({
  name: z.string().optional().default(''),
  description: z.string().optional().default(''),
})

export const Route = createFileRoute('/')({
  validateSearch: searchSchema,
  component: HomePage,
})

function HomePage() {
  const { name, description } = Route.useSearch()
  const navigate = useNavigate()

  const handleSearch = (newName: string, newDescription: string) => {
    navigate({
      search: { name: newName, description: newDescription || undefined },
    })
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center gap-3 border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-1.5">
          <h1 className="text-sm font-semibold tracking-tight">Onomast</h1>
          {name && (
            <>
              <span className="text-sm text-muted-foreground">/</span>
              <span className="text-sm text-muted-foreground">{name}</span>
            </>
          )}
        </div>
        <SearchForm
          key={name + description}
          defaultName={name}
          defaultDescription={description}
          onSearch={handleSearch}
        />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        {!name && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Vibe Check Your Company Name
            </h2>
            <p className="text-sm text-muted-foreground">
              Search domains, social handles, package registries, and more
            </p>
          </div>
        )}
        <ResultsDashboard name={name} description={description} />
      </main>
    </div>
  )
}

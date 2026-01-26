import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SearchForm } from '@/components/search-form'
import { ThemeToggle } from '@/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
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
          <h1 className="text-sm font-semibold tracking-tight">onomast.app</h1>
        </div>
        <SearchForm onSearch={handleSearch} />
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 px-4 py-6">
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-2xl font-bold tracking-tight">
            Vibe Check Your Company Name
          </h2>
          <p className="text-sm text-muted-foreground">
            Search domains, social handles, package registries, and more
          </p>
        </div>
      </main>
    </div>
  )
}

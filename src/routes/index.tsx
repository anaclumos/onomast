import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { SearchForm } from '@/components/search-form'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  Globe02Icon,
  UserGroupIcon,
  PackageIcon,
  GithubIcon,
  SparklesIcon,
  Book02Icon,
  BalanceScaleIcon,
  Building03Icon,
  Search01Icon,
  CommandIcon,
} from '@hugeicons/core-free-icons'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const features = [
  {
    icon: Globe02Icon,
    title: 'Domains',
    description: '.com, .io, .dev, .app, .org, and more',
  },
  {
    icon: UserGroupIcon,
    title: 'Social Handles',
    description: 'Instagram, X, TikTok, YouTube, Facebook',
  },
  {
    icon: PackageIcon,
    title: 'Package Registries',
    description: 'npm, Crates.io, Go, Homebrew, Debian',
  },
  {
    icon: GithubIcon,
    title: 'GitHub',
    description: 'Username and repository availability',
  },
  {
    icon: SparklesIcon,
    title: 'AI Vibe Check',
    description: 'AI-powered name rating with pros and cons',
  },
  {
    icon: Book02Icon,
    title: 'Dictionary',
    description: 'Real definitions and Urban Dictionary entries',
  },
  {
    icon: Building03Icon,
    title: 'Similar Companies',
    description: 'Existing companies with similar names',
  },
  {
    icon: BalanceScaleIcon,
    title: 'Trademarks',
    description: 'USPTO trademark and business registry search',
  },
] as const

function HomePage() {
  const navigate = useNavigate()

  const handleSearch = (newName: string, newDescription: string) => {
    navigate({
      to: '/$name',
      params: { name: newName },
      search: { description: newDescription || undefined },
    })
  }

  const openSearch = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      }),
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="text-sm font-semibold tracking-tight">onomast.app</h1>
        <SearchForm onSearch={handleSearch} />
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-primary">
              Name intelligence platform
            </p>
            <h2 className="max-w-xl text-5xl font-bold tracking-tighter">
              Vibe check your
              <br />
              <span className="text-primary">next company name</span>
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Check domain availability, social handles, package registries,
              trademarks, and get an AI-powered name analysis — all in one
              search.
            </p>
          </div>

          <button
            type="button"
            onClick={openSearch}
            className="group flex w-full max-w-sm items-center gap-3 rounded-xl border border-input bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
          >
            <HugeiconsIcon
              icon={Search01Icon}
              strokeWidth={2}
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
            />
            <span className="transition-colors group-hover:text-foreground">
              Search a company name...
            </span>
            <kbd className="ml-auto flex shrink-0 items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
              <HugeiconsIcon
                icon={CommandIcon}
                strokeWidth={2}
                className="size-3"
              />
              K
            </kbd>
          </button>
        </section>

        {/* Features */}
        <section className="border-t px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Everything checked in one search
            </p>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col gap-2 bg-background p-5 transition-colors hover:bg-muted/40"
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      icon={feature.icon}
                      strokeWidth={2}
                      className="size-4 text-primary"
                    />
                  </div>
                  <span className="text-sm font-medium">{feature.title}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {feature.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t px-4 py-6">
          <div className="flex flex-col items-center gap-1">
            <p className="text-center text-xs text-muted-foreground">
              Built for founders, developers, and the name-obsessed.
            </p>
            <a
              href="https://github.com/anaclumos/onomast"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
            >
              Open source on GitHub
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}

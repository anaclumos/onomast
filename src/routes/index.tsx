import {
  BalanceScaleIcon,
  Book02Icon,
  Building03Icon,
  CommandIcon,
  GithubIcon,
  Globe02Icon,
  PackageIcon,
  Search01Icon,
  SparklesIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SearchForm } from '@/components/search-form'
import { useTranslation } from '@/i18n/context'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const getFeatures = (t: ReturnType<typeof useTranslation>['t']) => [
  {
    icon: Globe02Icon,
    title: t('features.domains'),
    description: t('features.domainsDescription'),
  },
  {
    icon: UserGroupIcon,
    title: t('features.socialHandles'),
    description: t('features.socialHandlesDescription'),
  },
  {
    icon: PackageIcon,
    title: t('features.packageRegistries'),
    description: t('features.packageRegistriesDescription'),
  },
  {
    icon: GithubIcon,
    title: t('features.github'),
    description: t('features.githubDescription'),
  },
  {
    icon: SparklesIcon,
    title: t('features.aiVibeCheck'),
    description: t('features.aiVibeCheckDescription'),
  },
  {
    icon: Book02Icon,
    title: t('features.dictionary'),
    description: t('features.dictionaryDescription'),
  },
  {
    icon: Building03Icon,
    title: t('features.similarCompanies'),
    description: t('features.similarCompaniesDescription'),
  },
  {
    icon: BalanceScaleIcon,
    title: t('features.trademarks'),
    description: t('features.trademarksDescription'),
  },
]

function HomePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const features = getFeatures(t)

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

  const openSearch = () => {
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        metaKey: true,
        bubbles: true,
      })
    )
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="flex items-center justify-between border-b px-4 py-2">
        <h1 className="font-semibold text-sm tracking-tight">onomast.app</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <SearchForm onSearch={handleSearch} />
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="flex flex-1 flex-col items-center justify-center gap-8 px-4 py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <p className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 font-medium text-primary text-xs uppercase tracking-widest">
              {t('home.badge')}
            </p>
            <h2 className="max-w-xl font-bold text-5xl tracking-tighter">
              {t('home.heading')}
              <br />
              <span className="text-primary">{t('home.headingHighlight')}</span>
            </h2>
            <p className="max-w-md text-muted-foreground text-sm">
              {t('home.subheading')}
            </p>
          </div>

          <button
            className="group flex w-full max-w-sm items-center gap-3 rounded-xl border border-input bg-card px-4 py-3 text-muted-foreground text-sm shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
            onClick={openSearch}
            type="button"
          >
            <HugeiconsIcon
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
              icon={Search01Icon}
              strokeWidth={2}
            />
            <span className="transition-colors group-hover:text-foreground">
              {t('home.searchPlaceholder')}
            </span>
            <kbd className="ml-auto flex shrink-0 items-center gap-0.5 rounded-md border bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
              <HugeiconsIcon
                className="size-3"
                icon={CommandIcon}
                strokeWidth={2}
              />
              K
            </kbd>
          </button>
        </section>

        {/* Features */}
        <section className="border-t px-4 py-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-10 text-center font-medium text-muted-foreground text-xs uppercase tracking-widest">
              {t('home.featuresHeading')}
            </p>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 md:grid-cols-4">
              {features.map((feature) => (
                <div
                  className="flex flex-col gap-2 bg-background p-5 transition-colors hover:bg-muted/40"
                  key={feature.title}
                >
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                    <HugeiconsIcon
                      className="size-4 text-primary"
                      icon={feature.icon}
                      strokeWidth={2}
                    />
                  </div>
                  <span className="font-medium text-sm">{feature.title}</span>
                  <span className="text-muted-foreground text-xs leading-relaxed">
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
            <p className="text-center text-muted-foreground text-xs">
              {t('home.footer')}
            </p>
            <a
              className="text-muted-foreground/60 text-xs transition-colors hover:text-muted-foreground"
              href="https://github.com/anaclumos/onomast"
              rel="noopener noreferrer"
              target="_blank"
            >
              {t('home.footerGithub')}
            </a>
          </div>
        </footer>
      </main>
    </div>
  )
}

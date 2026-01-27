import { DictionarySection } from '@/components/sections/dictionary-section'
import { DomainsSection } from '@/components/sections/domains-section'
import { ExternalLinksSection } from '@/components/sections/external-links-section'
import { GitHubSection } from '@/components/sections/github-section'
import { PackagesSection } from '@/components/sections/packages-section'
import { RedditTakeSection } from '@/components/sections/reddit-take-section'
import { SimilarCompaniesSection } from '@/components/sections/similar-companies-section'
import { SocialSection } from '@/components/sections/social-section'
import { UrbanDictionarySection } from '@/components/sections/urban-dictionary-section'
import {
  VibeGaugeWidget,
  VibeProConsWidget,
} from '@/components/sections/vibe-check-section'
import { WidgetCard } from '@/components/widget-card'
import { useNameCheck } from '@/hooks/use-name-check'
import { useTranslation } from '@/i18n/context'

export function ResultsDashboard({
  name,
  description,
  region,
  language,
  latinName,
}: {
  name: string
  description: string
  region: string
  language: string
  latinName: string
}) {
  const { locale } = useTranslation()
  const results = useNameCheck(
    name,
    description,
    region,
    language,
    locale,
    latinName
  )

  if (!name) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <WidgetCard>
        <VibeGaugeWidget vibeCheck={results.vibeCheck} />
      </WidgetCard>
      <WidgetCard>
        <VibeProConsWidget vibeCheck={results.vibeCheck} />
      </WidgetCard>
      <WidgetCard>
        <RedditTakeSection vibeCheck={results.vibeCheck} />
      </WidgetCard>
      <WidgetCard>
        <SimilarCompaniesSection vibeCheck={results.vibeCheck} />
      </WidgetCard>
      <WidgetCard>
        <DictionarySection dictionary={results.dictionary} />
      </WidgetCard>
      <WidgetCard>
        <UrbanDictionarySection urbanDictionary={results.urbanDictionary} />
      </WidgetCard>
      <WidgetCard>
        <DomainsSection domains={results.domains} name={results.handleName} />
      </WidgetCard>
      <WidgetCard>
        <SocialSection name={results.handleName} social={results.social} />
      </WidgetCard>
      <WidgetCard>
        <PackagesSection
          name={results.handleName}
          packages={results.packages}
        />
      </WidgetCard>
      <WidgetCard>
        <GitHubSection
          githubRepos={results.githubRepos}
          githubUser={results.githubUser}
          name={results.handleName}
        />
      </WidgetCard>
      <WidgetCard>
        <ExternalLinksSection name={results.handleName} />
      </WidgetCard>
    </div>
  )
}

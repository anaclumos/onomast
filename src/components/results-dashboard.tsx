import { useNameCheck } from '@/hooks/use-name-check'
import { WidgetCard } from '@/components/widget-card'
import { DictionarySection } from '@/components/sections/dictionary-section'
import { UrbanDictionarySection } from '@/components/sections/urban-dictionary-section'
import { DomainsSection } from '@/components/sections/domains-section'
import { SocialSection } from '@/components/sections/social-section'
import { PackagesSection } from '@/components/sections/packages-section'
import { GitHubSection } from '@/components/sections/github-section'
import { ExternalLinksSection } from '@/components/sections/external-links-section'
import {
  VibeGaugeWidget,
  VibeProConsWidget,
} from '@/components/sections/vibe-check-section'
import { RedditTakeSection } from '@/components/sections/reddit-take-section'
import { SimilarCompaniesSection } from '@/components/sections/similar-companies-section'

export function ResultsDashboard({
  name,
  description,
}: {
  name: string
  description: string
}) {
  const results = useNameCheck(name, description)

  if (!name) return null

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
        <DomainsSection name={name} domains={results.domains} />
      </WidgetCard>
      <WidgetCard>
        <SocialSection name={name} social={results.social} />
      </WidgetCard>
      <WidgetCard>
        <PackagesSection name={name} packages={results.packages} />
      </WidgetCard>
      <WidgetCard>
        <GitHubSection
          name={name}
          githubUser={results.githubUser}
          githubRepos={results.githubRepos}
        />
      </WidgetCard>
      <WidgetCard>
        <ExternalLinksSection name={name} />
      </WidgetCard>
    </div>
  )
}

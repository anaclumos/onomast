import {
  QuoteDownIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/i18n/context'
import type { UrbanDictionaryResult } from '@/lib/types'

export function UrbanDictionarySection({
  urbanDictionary,
}: {
  urbanDictionary: UseQueryResult<UrbanDictionaryResult>
}) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={QuoteDownIcon}
            strokeWidth={2}
          />
          {t('sections.urbanDictionary')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <UrbanDictionaryContent urbanDictionary={urbanDictionary} />
      </CardContent>
    </Card>
  )
}

function UrbanDictionaryContent({
  urbanDictionary,
}: {
  urbanDictionary: UseQueryResult<UrbanDictionaryResult>
}) {
  const { t } = useTranslation()

  if (urbanDictionary.isLoading) {
    return <SectionSkeleton rows={3} />
  }

  if (!urbanDictionary.data?.found) {
    return (
      <p className="text-muted-foreground text-xs">{t('urban.noEntries')}</p>
    )
  }

  return (
    <>
      {urbanDictionary.data.entries.map((entry) => (
        <div
          className="flex flex-col gap-1.5 border-muted-foreground/20 border-l-2 pl-3"
          key={entry.permalink}
        >
          <p className="text-xs leading-relaxed">{entry.definition}</p>
          {entry.example && (
            <p className="text-muted-foreground text-xs italic leading-relaxed">
              &ldquo;{entry.example}&rdquo;
            </p>
          )}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <HugeiconsIcon
                className="size-3"
                icon={ThumbsUpIcon}
                strokeWidth={2}
              />
              {entry.thumbs_up}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground text-xs">
              <HugeiconsIcon
                className="size-3"
                icon={ThumbsDownIcon}
                strokeWidth={2}
              />
              {entry.thumbs_down}
            </span>
            <span className="text-muted-foreground text-xs">
              &mdash; {entry.author}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}

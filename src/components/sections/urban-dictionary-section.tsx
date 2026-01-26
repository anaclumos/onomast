import {
  QuoteDownIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { UrbanDictionaryResult } from '@/lib/types'

export function UrbanDictionarySection({
  urbanDictionary,
}: {
  urbanDictionary: UseQueryResult<UrbanDictionaryResult>
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={QuoteDownIcon}
            strokeWidth={2}
          />
          Urban Dictionary
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {urbanDictionary.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : urbanDictionary.data?.found ? (
          urbanDictionary.data.entries.map((entry) => (
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
          ))
        ) : (
          <p className="text-muted-foreground text-xs">
            No entries found. This word is too pure for the internet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

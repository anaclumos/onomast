import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { UrbanDictionaryResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { ThumbsUpIcon, ThumbsDownIcon } from '@hugeicons/core-free-icons'

export function UrbanDictionarySection({
  urbanDictionary,
}: {
  urbanDictionary: UseQueryResult<UrbanDictionaryResult>
}) {
  return (
    <Card size="sm" className="overflow-hidden">
      <div className="bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-bold tracking-tight">
          Urban Dictionary
        </span>
      </div>

      <CardContent className="flex flex-col gap-3 pt-2">
        {urbanDictionary.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : urbanDictionary.data?.found ? (
          urbanDictionary.data.entries.map((entry) => (
            <div
              key={entry.permalink}
              className="flex flex-col gap-1.5 border-l-2 border-muted-foreground/20 pl-3"
            >
              <p className="text-xs leading-relaxed">{entry.definition}</p>
              {entry.example && (
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  &ldquo;{entry.example}&rdquo;
                </p>
              )}
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={ThumbsUpIcon}
                    strokeWidth={2}
                    className="size-3"
                  />
                  {entry.thumbs_up}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <HugeiconsIcon
                    icon={ThumbsDownIcon}
                    strokeWidth={2}
                    className="size-3"
                  />
                  {entry.thumbs_down}
                </span>
                <span className="text-xs text-muted-foreground">
                  &mdash; {entry.author}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">
            No entries found. This word is too pure for the internet.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

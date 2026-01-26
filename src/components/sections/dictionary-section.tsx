import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { DictionaryResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon } from '@hugeicons/core-free-icons'

export function DictionarySection({
  dictionary,
}: {
  dictionary: UseQueryResult<DictionaryResult>
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon icon={Book02Icon} strokeWidth={2} className="size-4" />
          Word Meaning
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {dictionary.isLoading ? (
          <SectionSkeleton rows={4} />
        ) : dictionary.data?.found ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold">
                {dictionary.data.word}
              </span>
              {dictionary.data.phonetic && (
                <span className="text-xs text-muted-foreground">
                  {dictionary.data.phonetic}
                </span>
              )}
            </div>
            {dictionary.data.meanings.map((meaning) => (
              <div key={meaning.partOfSpeech} className="flex flex-col gap-1.5">
                <span className="text-xs font-medium italic text-muted-foreground">
                  {meaning.partOfSpeech}
                </span>
                <ol className="flex flex-col gap-1 pl-4">
                  {meaning.definitions.map((def) => (
                    <li key={def.definition} className="list-decimal text-xs">
                      <span>{def.definition}</span>
                      {def.example && (
                        <p className="mt-0.5 italic text-muted-foreground">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
                {meaning.synonyms.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {meaning.synonyms.slice(0, 5).map((syn) => (
                      <Badge key={syn} variant="outline">
                        {syn}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            No dictionary definition found.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

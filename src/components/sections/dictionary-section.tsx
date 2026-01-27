import { Book02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/i18n/context'
import type { DictionaryResult } from '@/lib/types'

export function DictionarySection({
  dictionary,
}: {
  dictionary: UseQueryResult<DictionaryResult>
}) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon className="size-4" icon={Book02Icon} strokeWidth={2} />
          {t('sections.wordMeaning')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <DictionaryContent dictionary={dictionary} />
      </CardContent>
    </Card>
  )
}

function DictionaryContent({
  dictionary,
}: {
  dictionary: UseQueryResult<DictionaryResult>
}): ReactNode {
  const { t } = useTranslation()

  if (dictionary.isLoading) {
    return <SectionSkeleton rows={4} />
  }

  if (!dictionary.data?.found) {
    return (
      <p className="text-muted-foreground text-xs">
        {t('dictionary.noDefinition')}
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2">
        <span className="font-semibold text-sm">{dictionary.data.word}</span>
        {dictionary.data.phonetic && (
          <span className="text-muted-foreground text-xs">
            {dictionary.data.phonetic}
          </span>
        )}
      </div>
      {dictionary.data.meanings.map((meaning) => (
        <div className="flex flex-col gap-1.5" key={meaning.partOfSpeech}>
          <span className="font-medium text-muted-foreground text-xs italic">
            {meaning.partOfSpeech}
          </span>
          <ol className="flex flex-col gap-1 pl-4">
            {meaning.definitions.map((def) => (
              <li className="list-decimal text-xs" key={def.definition}>
                <span>{def.definition}</span>
                {def.example && (
                  <p className="mt-0.5 text-muted-foreground italic">
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
  )
}

import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { VibeCheckResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { Building03Icon } from '@hugeicons/core-free-icons'

export function SimilarCompaniesSection({
  vibeCheck,
}: {
  vibeCheck: UseQueryResult<VibeCheckResult>
}) {
  if (
    !vibeCheck.isLoading &&
    vibeCheck.data &&
    vibeCheck.data.similarCompanies.length === 0
  ) {
    return null
  }

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Building03Icon}
            strokeWidth={2}
            className="size-4"
          />
          Name Neighborhood
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={2} />
        ) : vibeCheck.data ? (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              Companies that live on the same block:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vibeCheck.data.similarCompanies.map((name) => (
                <span
                  key={name}
                  className="rounded-full border bg-muted/50 px-2.5 py-1 text-xs font-medium"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Couldn&apos;t scout the neighborhood.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

import { Building03Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VibeCheckResult } from '@/lib/types'

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
            className="size-4"
            icon={Building03Icon}
            strokeWidth={2}
          />
          Name Neighborhood
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={2} />
        ) : vibeCheck.data ? (
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground text-xs">
              Companies that live on the same block:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {vibeCheck.data.similarCompanies.map((name) => (
                <span
                  className="rounded-full border bg-muted/50 px-2.5 py-1 font-medium text-xs"
                  key={name}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            Couldn&apos;t scout the neighborhood.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

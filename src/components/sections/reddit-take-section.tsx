import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { VibeCheckResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Comment01Icon,
  Megaphone01Icon,
} from '@hugeicons/core-free-icons'

export function RedditTakeSection({
  vibeCheck,
}: {
  vibeCheck: UseQueryResult<VibeCheckResult>
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Megaphone01Icon}
            strokeWidth={2}
            className="size-4"
          />
          Reddit Take
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vibeCheck.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : vibeCheck.data ? (
          <RedditComment take={vibeCheck.data.redditTake} />
        ) : (
          <p className="text-xs text-muted-foreground">
            Reddit hivemind is offline.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function RedditComment({ take }: { take: string }) {
  const fakeUpvotes = Math.floor(Math.random() * 200) + 42

  return (
    <div className="flex gap-2">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <HugeiconsIcon
          icon={ArrowUp01Icon}
          strokeWidth={2}
          className="size-3.5 text-muted-foreground"
        />
        <span className="text-xs font-bold tabular-nums">{fakeUpvotes}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          strokeWidth={2}
          className="size-3.5 text-muted-foreground"
        />
      </div>

      {/* Comment body */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium">u/onomast</span>
          <span className="text-xs text-muted-foreground">&middot; 2h</span>
        </div>
        <p className="text-xs leading-relaxed">{take}</p>
        <div className="flex items-center gap-3 text-muted-foreground">
          <button
            type="button"
            className="flex items-center gap-1 text-xs hover:text-foreground"
          >
            <HugeiconsIcon
              icon={Comment01Icon}
              strokeWidth={2}
              className="size-3"
            />
            Reply
          </button>
          <span className="text-xs">Share</span>
          <span className="text-xs">Report</span>
        </div>
      </div>
    </div>
  )
}

import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { VibeCheckResult } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  ArrowUp01Icon,
  ArrowDown01Icon,
  Comment01Icon,
} from '@hugeicons/core-free-icons'

export function RedditTakeSection({
  vibeCheck,
}: {
  vibeCheck: UseQueryResult<VibeCheckResult>
}) {
  return (
    <Card size="sm" className="overflow-hidden">
      {/* Subreddit header bar */}
      <div className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5">
        <span className="text-xs font-bold">r/namenerds</span>
        <span className="text-xs text-muted-foreground">&middot;</span>
        <span className="text-xs text-muted-foreground">just now</span>
      </div>

      <CardContent className="pt-2">
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
          <span className="text-xs font-medium">u/definitely_not_ai</span>
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

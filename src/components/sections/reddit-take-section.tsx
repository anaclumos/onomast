import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  Comment01Icon,
  Megaphone01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { SectionSkeleton } from '@/components/section-skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { VibeCheckResult } from '@/lib/types'

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
            className="size-4"
            icon={Megaphone01Icon}
            strokeWidth={2}
          />
          Reddit Take
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RedditTakeContent vibeCheck={vibeCheck} />
      </CardContent>
    </Card>
  )
}

function RedditTakeContent({
  vibeCheck,
}: {
  vibeCheck: UseQueryResult<VibeCheckResult>
}) {
  if (vibeCheck.isLoading) {
    return <SectionSkeleton rows={3} />
  }

  if (!vibeCheck.data) {
    return (
      <p className="text-muted-foreground text-xs">
        Reddit hivemind is offline.
      </p>
    )
  }

  return <RedditComment take={vibeCheck.data.redditTake} />
}

function RedditComment({ take }: { take: string }) {
  const fakeUpvotes = Math.floor(Math.random() * 200) + 42

  return (
    <div className="flex gap-2">
      {/* Vote column */}
      <div className="flex flex-col items-center gap-0.5 pt-0.5">
        <HugeiconsIcon
          className="size-3.5 text-muted-foreground"
          icon={ArrowUp01Icon}
          strokeWidth={2}
        />
        <span className="font-bold text-xs tabular-nums">{fakeUpvotes}</span>
        <HugeiconsIcon
          className="size-3.5 text-muted-foreground"
          icon={ArrowDown01Icon}
          strokeWidth={2}
        />
      </div>

      {/* Comment body */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-xs">u/onomast</span>
          <span className="text-muted-foreground text-xs">&middot; 2h</span>
        </div>
        <p className="text-xs leading-relaxed">{take}</p>
        <div className="flex items-center gap-3 text-muted-foreground">
          <button
            className="flex items-center gap-1 text-xs hover:text-foreground"
            type="button"
          >
            <HugeiconsIcon
              className="size-3"
              icon={Comment01Icon}
              strokeWidth={2}
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

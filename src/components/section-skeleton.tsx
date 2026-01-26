import { cn } from '@/lib/utils'

const WIDTHS = ['w-full', 'w-3/4', 'w-1/2'] as const

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  const items: React.ReactElement[] = []
  for (let i = 0; i < rows; i++) {
    items.push(
      <div
        className={cn(
          'h-4 animate-pulse rounded-md bg-muted',
          WIDTHS[i % WIDTHS.length]
        )}
        key={`skeleton-${i}`}
      />
    )
  }

  return <div className="flex flex-col gap-2">{items}</div>
}

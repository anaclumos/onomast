import { cn } from '@/lib/utils'

const WIDTHS = ['w-full', 'w-3/4', 'w-1/2'] as const

export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }, (_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 animate-pulse rounded-md bg-muted',
            WIDTHS[i % WIDTHS.length],
          )}
        />
      ))}
    </div>
  )
}

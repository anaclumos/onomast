import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/i18n/context'
import type { AvailabilityStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<
  AvailabilityStatus,
  {
    className: string
    variant: 'default' | 'destructive' | 'outline'
  }
> = {
  available: {
    className: 'bg-success text-success-foreground',
    variant: 'default',
  },
  taken: {
    className: 'bg-destructive text-white',
    variant: 'destructive',
  },
  unknown: {
    className: 'bg-warning text-warning-foreground',
    variant: 'default',
  },
  error: {
    className: 'bg-destructive text-white',
    variant: 'destructive',
  },
}

const STATUS_ROW_BG: Record<AvailabilityStatus, string> = {
  available: 'border-success/30 bg-success/5',
  taken: 'border-destructive/30 bg-destructive/5',
  unknown: 'border-warning/50 bg-warning/5',
  error: 'border-destructive/30 bg-destructive/5',
}

export function statusRowClassName(status?: AvailabilityStatus) {
  return status ? STATUS_ROW_BG[status] : ''
}

export function StatusIndicator({
  status,
  showLabel = true,
  className,
}: {
  status: AvailabilityStatus
  showLabel?: boolean
  className?: string
}) {
  const { t } = useTranslation()
  const config = STATUS_CONFIG[status]
  const statusSymbol = status === 'available' ? '✓' : '✗'

  return (
    <Badge className={cn(config.className, className)} variant={config.variant}>
      {showLabel ? t(`status.${status}`) : statusSymbol}
    </Badge>
  )
}

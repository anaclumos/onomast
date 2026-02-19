import { Globe02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/i18n/context'
import type { DomainCheck, TLD } from '@/lib/types'
import { TLDS } from '@/lib/types'
import { cn } from '@/lib/utils'

export function DomainsSection({
  name,
  domains,
  owned,
  onToggleOwned,
}: {
  name: string
  domains: UseQueryResult<DomainCheck>[]
  owned: TLD[]
  onToggleOwned: (tld: TLD) => void
}) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={Globe02Icon}
            strokeWidth={2}
          />
          {t('sections.domains')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {domains.map((query, i) => {
          const tld = TLDS[i]
          return (
            <DomainRow
              data={query.data}
              isLoading={query.isLoading}
              key={tld}
              name={name}
              onToggleOwned={onToggleOwned}
              owned={owned.includes(tld)}
              tld={tld}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

function DomainRow({
  name,
  tld,
  isLoading,
  data,
  owned,
  onToggleOwned,
}: {
  name: string
  tld: TLD
  isLoading: boolean
  data?: DomainCheck
  owned: boolean
  onToggleOwned: (tld: TLD) => void
}) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const domain = `${name}.${tld}`
  const isTaken = data?.status === 'taken'
  const status = data?.status
  const showOwnedToggle = owned || status !== 'available'

  const rowClassName = cn(
    'flex items-center justify-between gap-2 rounded-md border p-2',
    statusRowClassName(data?.status),
    isTaken && 'transition-colors hover:bg-muted/50'
  )

  const left = (
    <div className="flex min-w-0 flex-1 items-center gap-2">
      <span className="font-mono text-xs">
        <span className="text-muted-foreground">{name}</span>
        <span className="font-medium">.{tld}</span>
      </span>
      {isTaken && data?.registrar && (
        <span className="truncate text-muted-foreground text-xs">
          {data.registrar}
        </span>
      )}
    </div>
  )

  return (
    <div className={rowClassName}>
      {isTaken ? (
        <a
          className="min-w-0 flex-1"
          href={`https://${domain}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          {left}
        </a>
      ) : (
        left
      )}
      <div className="flex items-center gap-2">
        {showOwnedToggle && (
          <Button
            aria-pressed={owned}
            className="pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              onToggleOwned(tld)
            }}
            size="xs"
            variant={owned ? 'secondary' : 'outline'}
          >
            {owned ? t('ownership.owned') : t('ownership.markOwned')}
          </Button>
        )}
        {data && <StatusIndicator status={data.status} />}
      </div>
    </div>
  )
}

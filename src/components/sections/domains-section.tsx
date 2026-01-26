import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import type { DomainCheck } from '@/lib/types'
import { TLDS } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { Globe02Icon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

export function DomainsSection({
  name,
  domains,
}: {
  name: string
  domains: UseQueryResult<DomainCheck>[]
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={Globe02Icon}
            strokeWidth={2}
            className="size-4"
          />
          Domains
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {domains.map((query, i) => {
          const tld = TLDS[i]
          return (
            <DomainRow
              key={tld}
              name={name}
              tld={tld}
              isLoading={query.isLoading}
              data={query.data}
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
}: {
  name: string
  tld: string
  isLoading: boolean
  data?: DomainCheck
}) {
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

  const rowClassName = cn(
    'flex items-center justify-between gap-2 rounded-md border p-2',
    statusRowClassName(data?.status),
    isTaken && 'transition-colors hover:bg-muted/50',
  )

  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs">
          <span className="text-muted-foreground">{name}</span>
          <span className="font-medium">.{tld}</span>
        </span>
        {isTaken && data.registrar && (
          <span className="truncate text-xs text-muted-foreground">
            {data.registrar}
          </span>
        )}
      </div>
      {data && <StatusIndicator status={data.status} />}
    </>
  )

  if (isTaken) {
    return (
      <a
        href={`https://${domain}`}
        target="_blank"
        rel="noopener noreferrer"
        className={rowClassName}
      >
        {content}
      </a>
    )
  }

  return <div className={rowClassName}>{content}</div>
}

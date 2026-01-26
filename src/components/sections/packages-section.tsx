import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import type { PackageCheck, PackageRegistry } from '@/lib/types'
import { PACKAGE_REGISTRIES } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'

const REGISTRY_DISPLAY: Record<PackageRegistry, string> = {
  npm: 'npm',
  crates: 'crates.io',
  go: 'Go',
  homebrew: 'Homebrew',
  apt: 'apt',
}

export function PackagesSection({
  name,
  packages,
}: {
  name: string
  packages: UseQueryResult<PackageCheck>[]
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={PackageIcon}
            strokeWidth={2}
            className="size-4"
          />
          Package Registries
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {packages.map((query, i) => {
          const registry = PACKAGE_REGISTRIES[i]
          return (
            <PackageRow
              key={registry}
              registry={registry}
              name={name}
              isLoading={query.isLoading}
              data={query.data}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}

function PackageRow({
  registry,
  name,
  isLoading,
  data,
}: {
  registry: PackageRegistry
  name: string
  isLoading: boolean
  data?: PackageCheck
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-md border p-2',
        statusRowClassName(data?.status),
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium">
          {REGISTRY_DISPLAY[registry]}
        </span>
        <span className="font-mono text-xs text-muted-foreground">{name}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {data && <StatusIndicator status={data.status} />}
        {data?.status === 'taken' && data.url && (
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary underline-offset-2 hover:underline"
          >
            View
          </a>
        )}
      </div>
    </div>
  )
}

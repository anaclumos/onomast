import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/i18n/context'
import type { PackageCheck, PackageRegistry } from '@/lib/types'
import { PACKAGE_REGISTRIES } from '@/lib/types'
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
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={PackageIcon}
            strokeWidth={2}
          />
          {t('sections.packageRegistries')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {packages.map((query, i) => {
          const registry = PACKAGE_REGISTRIES[i]
          return (
            <PackageRow
              data={query.data}
              isLoading={query.isLoading}
              key={registry}
              name={name}
              registry={registry}
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
        statusRowClassName(data?.status)
      )}
    >
      <div className="flex items-center gap-2">
        <span className="font-medium text-xs">
          {REGISTRY_DISPLAY[registry]}
        </span>
        <span className="font-mono text-muted-foreground text-xs">{name}</span>
      </div>
      {data && <StatusIndicator status={data.status} />}
    </div>
  )
}

import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Button } from '@/components/ui/button'
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
  owned,
  onToggleOwned,
}: {
  name: string
  packages: UseQueryResult<PackageCheck>[]
  owned: PackageRegistry[]
  onToggleOwned: (registry: PackageRegistry) => void
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
              onToggleOwned={onToggleOwned}
              owned={owned.includes(registry)}
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
  owned,
  onToggleOwned,
}: {
  registry: PackageRegistry
  name: string
  isLoading: boolean
  data?: PackageCheck
  owned: boolean
  onToggleOwned: (registry: PackageRegistry) => void
}) {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-md border p-2">
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const status = data?.status
  const showOwnedToggle = owned || status !== 'available'

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
      <div className="flex items-center gap-2">
        {showOwnedToggle && (
          <Button
            aria-pressed={owned}
            className="pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              onToggleOwned(registry)
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

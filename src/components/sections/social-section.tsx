import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useTranslation } from '@/i18n/context'
import type { SocialCheck, SocialPlatform } from '@/lib/types'
import { SOCIAL_PLATFORMS } from '@/lib/types'
import { cn } from '@/lib/utils'

const PLATFORM_DISPLAY: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  tiktok: 'TikTok',
  youtube: 'YouTube',
  facebook: 'Facebook',
}

export function SocialSection({
  name,
  social,
  owned,
  onToggleOwned,
}: {
  name: string
  social: UseQueryResult<SocialCheck>[]
  owned: SocialPlatform[]
  onToggleOwned: (platform: SocialPlatform) => void
}) {
  const { t } = useTranslation()

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={UserGroupIcon}
            strokeWidth={2}
          />
          {t('sections.socialMedia')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {social.map((query, i) => {
          const platform = SOCIAL_PLATFORMS[i]
          return (
            <SocialRow
              data={query.data}
              isLoading={query.isLoading}
              key={platform}
              name={name}
              onToggleOwned={onToggleOwned}
              owned={owned.includes(platform)}
              platform={platform}
            />
          )
        })}
        <p className="mt-1 text-muted-foreground text-xs">
          {t('social.disclaimer')}
        </p>
      </CardContent>
    </Card>
  )
}

function SocialRow({
  platform,
  name,
  isLoading,
  data,
  owned,
  onToggleOwned,
}: {
  platform: SocialPlatform
  name: string
  isLoading: boolean
  data?: SocialCheck
  owned: boolean
  onToggleOwned: (platform: SocialPlatform) => void
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

  const profileUrl =
    data?.profileUrl ??
    `https://${platform === 'twitter' ? 'x.com' : `${platform}.com`}/${name}`

  const status = data?.status
  const showOwnedToggle = owned || status !== 'available'

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50',
        statusRowClassName(data?.status)
      )}
    >
      <a
        className="flex min-w-0 flex-1 items-center gap-1.5"
        href={profileUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <span className="shrink-0 font-medium text-xs">
          {PLATFORM_DISPLAY[platform]}
        </span>
        <span className="truncate text-muted-foreground text-xs">@{name}</span>
      </a>
      <div className="flex items-center gap-2">
        {showOwnedToggle && (
          <Button
            aria-pressed={owned}
            className="pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation()
              onToggleOwned(platform)
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

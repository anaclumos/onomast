import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { cn } from '@/lib/utils'
import type { SocialCheck, SocialPlatform } from '@/lib/types'
import { SOCIAL_PLATFORMS } from '@/lib/types'
import { HugeiconsIcon } from '@hugeicons/react'
import { UserGroupIcon } from '@hugeicons/core-free-icons'

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
}: {
  name: string
  social: UseQueryResult<SocialCheck>[]
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            icon={UserGroupIcon}
            strokeWidth={2}
            className="size-4"
          />
          Social Media
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {social.map((query, i) => {
          const platform = SOCIAL_PLATFORMS[i]
          return (
            <SocialRow
              key={platform}
              platform={platform}
              name={name}
              isLoading={query.isLoading}
              data={query.data}
            />
          )
        })}
        <p className="mt-1 text-xs text-muted-foreground">
          Results may be inaccurate. Click to verify.
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
}: {
  platform: SocialPlatform
  name: string
  isLoading: boolean
  data?: SocialCheck
}) {
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
    `https://${platform === 'twitter' ? 'x.com' : platform + '.com'}/${name}`

  return (
    <a
      href={profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center justify-between gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50',
        statusRowClassName(data?.status),
      )}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium">
          {PLATFORM_DISPLAY[platform]}
        </span>
        <span className="text-xs text-muted-foreground">@{name}</span>
      </div>
      {data && <StatusIndicator status={data.status} />}
    </a>
  )
}

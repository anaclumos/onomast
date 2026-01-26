import { UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
}: {
  name: string
  social: UseQueryResult<SocialCheck>[]
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon
            className="size-4"
            icon={UserGroupIcon}
            strokeWidth={2}
          />
          Social Media
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
              platform={platform}
            />
          )
        })}
        <p className="mt-1 text-muted-foreground text-xs">
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
    `https://${platform === 'twitter' ? 'x.com' : `${platform}.com`}/${name}`

  return (
    <a
      className={cn(
        'flex items-center justify-between gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50',
        statusRowClassName(data?.status)
      )}
      href={profileUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex items-center gap-1.5">
        <span className="font-medium text-xs">
          {PLATFORM_DISPLAY[platform]}
        </span>
        <span className="text-muted-foreground text-xs">@{name}</span>
      </div>
      {data && <StatusIndicator status={data.status} />}
    </a>
  )
}

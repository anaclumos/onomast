import { GithubIcon, StarIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { UseQueryResult } from '@tanstack/react-query'
import { SectionSkeleton } from '@/components/section-skeleton'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { GitHubReposResult, GitHubUserCheck } from '@/lib/types'
import { cn } from '@/lib/utils'

export function GitHubSection({
  name,
  githubUser,
  githubRepos,
}: {
  name: string
  githubUser: UseQueryResult<GitHubUserCheck>
  githubRepos: UseQueryResult<GitHubReposResult>
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <HugeiconsIcon className="size-4" icon={GithubIcon} strokeWidth={2} />
          GitHub
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {githubUser.isLoading ? (
          <SectionSkeleton rows={2} />
        ) : (
          <div
            className={cn(
              'flex items-center justify-between gap-3 rounded-md border p-2',
              statusRowClassName(githubUser.data?.status)
            )}
          >
            <div className="flex items-center gap-2.5">
              {githubUser.data?.status === 'taken' &&
                githubUser.data.avatarUrl && (
                  <img
                    alt={githubUser.data.login ?? name}
                    className="size-8 rounded-full"
                    src={githubUser.data.avatarUrl}
                  />
                )}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-medium font-mono text-xs">{name}</span>
                  {githubUser.data?.type && (
                    <Badge variant="outline">{githubUser.data.type}</Badge>
                  )}
                </div>
                {githubUser.data?.status === 'taken' && (
                  <div className="flex gap-3 text-muted-foreground text-xs">
                    {githubUser.data.publicRepos !== undefined && (
                      <span>{githubUser.data.publicRepos} repos</span>
                    )}
                    {githubUser.data.followers !== undefined && (
                      <span>{githubUser.data.followers} followers</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {githubUser.data && (
              <StatusIndicator status={githubUser.data.status} />
            )}
          </div>
        )}

        {githubRepos.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : githubRepos.data && githubRepos.data.repos.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            <span className="font-medium text-muted-foreground text-xs">
              Related repos
            </span>
            {githubRepos.data.repos.slice(0, 3).map((repo) => (
              <a
                className="flex items-center justify-between gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50"
                href={repo.htmlUrl}
                key={repo.fullName}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-medium font-mono text-xs">
                    {repo.fullName}
                  </span>
                  {repo.description && (
                    <p className="truncate text-muted-foreground text-xs">
                      {repo.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {repo.language && (
                    <span className="text-muted-foreground text-xs">
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-muted-foreground text-xs">
                    <HugeiconsIcon
                      className="size-3"
                      icon={StarIcon}
                      strokeWidth={2}
                    />
                    {repo.stars.toLocaleString()}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

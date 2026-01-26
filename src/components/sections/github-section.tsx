import type { UseQueryResult } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  StatusIndicator,
  statusRowClassName,
} from '@/components/status-indicator'
import { SectionSkeleton } from '@/components/section-skeleton'
import type { GitHubUserCheck, GitHubReposResult } from '@/lib/types'
import { cn } from '@/lib/utils'
import { HugeiconsIcon } from '@hugeicons/react'
import { GithubIcon, StarIcon } from '@hugeicons/core-free-icons'

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
          <HugeiconsIcon icon={GithubIcon} strokeWidth={2} className="size-4" />
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
              statusRowClassName(githubUser.data?.status),
            )}
          >
            <div className="flex items-center gap-2.5">
              {githubUser.data?.status === 'taken' &&
                githubUser.data.avatarUrl && (
                  <img
                    src={githubUser.data.avatarUrl}
                    alt={githubUser.data.login ?? name}
                    className="size-8 rounded-full"
                  />
                )}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium">
                    github.com/{name}
                  </span>
                  {githubUser.data?.type && (
                    <Badge variant="outline">{githubUser.data.type}</Badge>
                  )}
                </div>
                {githubUser.data?.status === 'taken' && (
                  <div className="flex gap-3 text-xs text-muted-foreground">
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
            <span className="text-xs font-medium text-muted-foreground">
              Related repos
            </span>
            {githubRepos.data.repos.slice(0, 3).map((repo) => (
              <a
                key={repo.fullName}
                href={repo.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 rounded-md border p-2 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="truncate font-mono text-xs font-medium">
                    {repo.fullName}
                  </span>
                  {repo.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {repo.description}
                    </p>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {repo.language && (
                    <span className="text-xs text-muted-foreground">
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <HugeiconsIcon
                      icon={StarIcon}
                      strokeWidth={2}
                      className="size-3"
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

import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { GitHubReposResult, GitHubUserCheck } from '@/lib/types'

interface GitHubUserApiResponse {
  type: 'User' | 'Org'
  login: string
  avatar_url: string
  html_url: string
  bio: string
  public_repos: number
  followers: number
}

interface GitHubRepoApiItem {
  name: string
  full_name: string
  description?: string
  stargazers_count: number
  forks_count: number
  html_url: string
  language?: string
}

interface GitHubSearchApiResponse {
  total_count?: number
  items?: GitHubRepoApiItem[]
}

const nameInput = z.object({ name: z.string().min(1).max(100) })

export const checkGitHubUser = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<GitHubUserCheck> => {
    try {
      const res = await fetch(
        `https://api.github.com/users/${encodeURIComponent(data.name)}`,
        {
          signal: AbortSignal.timeout(8000),
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Onomast/1.0',
          },
        }
      )

      if (res.status === 404) {
        return { name: data.name, status: 'available' }
      }

      if (res.status === 403) {
        return { name: data.name, status: 'unknown' }
      }

      if (!res.ok) {
        return { name: data.name, status: 'unknown' }
      }

      const json: GitHubUserApiResponse = await res.json()
      return {
        name: data.name,
        status: 'taken',
        type: json.type,
        login: json.login,
        avatarUrl: json.avatar_url,
        htmlUrl: json.html_url,
        bio: json.bio,
        publicRepos: json.public_repos,
        followers: json.followers,
      }
    } catch {
      return { name: data.name, status: 'unknown' }
    }
  })

export const searchGitHubRepos = createServerFn({ method: 'GET' })
  .inputValidator(nameInput)
  .handler(async ({ data }): Promise<GitHubReposResult> => {
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(data.name)}+in:name&sort=stars&order=desc&per_page=5`,
        {
          signal: AbortSignal.timeout(8000),
          headers: {
            Accept: 'application/vnd.github.v3+json',
            'User-Agent': 'Onomast/1.0',
          },
        }
      )

      if (!res.ok) {
        return { totalCount: 0, repos: [] }
      }

      const json: GitHubSearchApiResponse = await res.json()
      return {
        totalCount: json.total_count || 0,

        repos: (json.items || []).slice(0, 5).map((item) => ({
          name: item.name,
          fullName: item.full_name,
          description: item.description,
          stars: item.stargazers_count,
          forks: item.forks_count,
          htmlUrl: item.html_url,
          language: item.language,
        })),
      }
    } catch {
      return { totalCount: 0, repos: [] }
    }
  })

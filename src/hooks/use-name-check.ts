import { useQuery } from '@tanstack/react-query'
import { checkDictionary, checkUrbanDictionary } from '@/server/dictionary'
import { checkDomain } from '@/server/domains'
import { checkSocialHandle } from '@/server/social'
import {
  checkNpm,
  checkCrates,
  checkGolang,
  checkHomebrew,
  checkApt,
} from '@/server/packages'
import { checkGitHubUser, searchGitHubRepos } from '@/server/github'
import { checkWordVibe } from '@/server/vibe-check'

/**
 * Orchestrator hook: fires all name checks in parallel via independent useQuery calls.
 * Hook count is always 25 (stable across renders):
 *   2 dictionary + 6 domain + 5 social + 5 package + 2 github
 */
export function useNameCheck(name: string, description: string = '') {
  const enabled = name.length > 0

  const dictionary = useQuery({
    queryKey: ['dictionary', name],
    queryFn: () => checkDictionary({ data: { word: name } }),
    enabled,
  })

  const urbanDictionary = useQuery({
    queryKey: ['urban-dictionary', name],
    queryFn: () => checkUrbanDictionary({ data: { word: name } }),
    enabled,
  })

  const domainCom = useQuery({
    queryKey: ['domain', name, 'com'],
    queryFn: () => checkDomain({ data: { name, tld: 'com' } }),
    enabled,
  })
  const domainDev = useQuery({
    queryKey: ['domain', name, 'dev'],
    queryFn: () => checkDomain({ data: { name, tld: 'dev' } }),
    enabled,
  })
  const domainApp = useQuery({
    queryKey: ['domain', name, 'app'],
    queryFn: () => checkDomain({ data: { name, tld: 'app' } }),
    enabled,
  })
  const domainNet = useQuery({
    queryKey: ['domain', name, 'net'],
    queryFn: () => checkDomain({ data: { name, tld: 'net' } }),
    enabled,
  })
  const domainOrg = useQuery({
    queryKey: ['domain', name, 'org'],
    queryFn: () => checkDomain({ data: { name, tld: 'org' } }),
    enabled,
  })
  const domainAi = useQuery({
    queryKey: ['domain', name, 'ai'],
    queryFn: () => checkDomain({ data: { name, tld: 'ai' } }),
    enabled,
  })

  const socialInstagram = useQuery({
    queryKey: ['social', name, 'instagram'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'instagram', handle: name } }),
    enabled,
  })
  const socialTwitter = useQuery({
    queryKey: ['social', name, 'twitter'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'twitter', handle: name } }),
    enabled,
  })
  const socialTiktok = useQuery({
    queryKey: ['social', name, 'tiktok'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'tiktok', handle: name } }),
    enabled,
  })
  const socialYoutube = useQuery({
    queryKey: ['social', name, 'youtube'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'youtube', handle: name } }),
    enabled,
  })
  const socialFacebook = useQuery({
    queryKey: ['social', name, 'facebook'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'facebook', handle: name } }),
    enabled,
  })

  const pkgNpm = useQuery({
    queryKey: ['package', name, 'npm'],
    queryFn: () => checkNpm({ data: { name } }),
    enabled,
  })
  const pkgCrates = useQuery({
    queryKey: ['package', name, 'crates'],
    queryFn: () => checkCrates({ data: { name } }),
    enabled,
  })
  const pkgGo = useQuery({
    queryKey: ['package', name, 'go'],
    queryFn: () => checkGolang({ data: { name } }),
    enabled,
  })
  const pkgHomebrew = useQuery({
    queryKey: ['package', name, 'homebrew'],
    queryFn: () => checkHomebrew({ data: { name } }),
    enabled,
  })
  const pkgApt = useQuery({
    queryKey: ['package', name, 'apt'],
    queryFn: () => checkApt({ data: { name } }),
    enabled,
  })

  const githubUser = useQuery({
    queryKey: ['github-user', name],
    queryFn: () => checkGitHubUser({ data: { name } }),
    enabled,
  })
  const githubRepos = useQuery({
    queryKey: ['github-repos', name],
    queryFn: () => searchGitHubRepos({ data: { name } }),
    enabled,
  })

  const vibeCheck = useQuery({
    queryKey: ['vibe-check', name, description],
    queryFn: () => checkWordVibe({ data: { name, description } }),
    enabled,
  })

  return {
    dictionary,
    urbanDictionary,
    domains: [domainCom, domainDev, domainApp, domainNet, domainOrg, domainAi],
    social: [
      socialInstagram,
      socialTwitter,
      socialTiktok,
      socialYoutube,
      socialFacebook,
    ],
    packages: [pkgNpm, pkgCrates, pkgGo, pkgHomebrew, pkgApt],
    githubUser,
    githubRepos,
    vibeCheck,
  }
}

import { useQuery } from '@tanstack/react-query'
import { checkDictionary, checkUrbanDictionary } from '@/server/dictionary'
import { checkDomain } from '@/server/domains'
import { checkGitHubUser, searchGitHubRepos } from '@/server/github'
import {
  checkApt,
  checkCrates,
  checkGolang,
  checkHomebrew,
  checkNpm,
} from '@/server/packages'
import { checkSocialHandle } from '@/server/social'
import { checkWordVibe } from '@/server/vibe-check'

/**
 * Orchestrator hook: fires all name checks in parallel via independent useQuery calls.
 * Hook count is always 25 (stable across renders):
 *   2 dictionary + 6 domain + 5 social + 5 package + 2 github
 */
export function useNameCheck(
  name: string,
  description = '',
  region = '',
  language = '',
  locale = 'en',
  latinName = ''
) {
  const enabled = name.length > 0
  const handleName = latinName || name

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
    queryKey: ['domain', handleName, 'com'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'com' } }),
    enabled,
  })
  const domainDev = useQuery({
    queryKey: ['domain', handleName, 'dev'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'dev' } }),
    enabled,
  })
  const domainApp = useQuery({
    queryKey: ['domain', handleName, 'app'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'app' } }),
    enabled,
  })
  const domainNet = useQuery({
    queryKey: ['domain', handleName, 'net'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'net' } }),
    enabled,
  })
  const domainOrg = useQuery({
    queryKey: ['domain', handleName, 'org'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'org' } }),
    enabled,
  })
  const domainAi = useQuery({
    queryKey: ['domain', handleName, 'ai'],
    queryFn: () => checkDomain({ data: { name: handleName, tld: 'ai' } }),
    enabled,
  })

  const socialInstagram = useQuery({
    queryKey: ['social', handleName, 'instagram'],
    queryFn: () =>
      checkSocialHandle({
        data: { platform: 'instagram', handle: handleName },
      }),
    enabled,
  })
  const socialTwitter = useQuery({
    queryKey: ['social', handleName, 'twitter'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'twitter', handle: handleName } }),
    enabled,
  })
  const socialTiktok = useQuery({
    queryKey: ['social', handleName, 'tiktok'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'tiktok', handle: handleName } }),
    enabled,
  })
  const socialYoutube = useQuery({
    queryKey: ['social', handleName, 'youtube'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'youtube', handle: handleName } }),
    enabled,
  })
  const socialFacebook = useQuery({
    queryKey: ['social', handleName, 'facebook'],
    queryFn: () =>
      checkSocialHandle({ data: { platform: 'facebook', handle: handleName } }),
    enabled,
  })

  const pkgNpm = useQuery({
    queryKey: ['package', handleName, 'npm'],
    queryFn: () => checkNpm({ data: { name: handleName } }),
    enabled,
  })
  const pkgCrates = useQuery({
    queryKey: ['package', handleName, 'crates'],
    queryFn: () => checkCrates({ data: { name: handleName } }),
    enabled,
  })
  const pkgGo = useQuery({
    queryKey: ['package', handleName, 'go'],
    queryFn: () => checkGolang({ data: { name: handleName } }),
    enabled,
  })
  const pkgHomebrew = useQuery({
    queryKey: ['package', handleName, 'homebrew'],
    queryFn: () => checkHomebrew({ data: { name: handleName } }),
    enabled,
  })
  const pkgApt = useQuery({
    queryKey: ['package', handleName, 'apt'],
    queryFn: () => checkApt({ data: { name: handleName } }),
    enabled,
  })

  const githubUser = useQuery({
    queryKey: ['github-user', handleName],
    queryFn: () => checkGitHubUser({ data: { name: handleName } }),
    enabled,
  })
  const githubRepos = useQuery({
    queryKey: ['github-repos', handleName],
    queryFn: () => searchGitHubRepos({ data: { name: handleName } }),
    enabled,
  })

  const vibeCheck = useQuery({
    queryKey: ['vibe-check', name, description, region, language, locale],
    queryFn: () =>
      checkWordVibe({ data: { name, description, region, language, locale } }),
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
    handleName,
  }
}

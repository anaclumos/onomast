import { useQuery } from '@tanstack/react-query'
import type {
  AvailabilityStatus,
  OwnedAssets,
  VibeAvailabilitySnapshot,
} from '@/lib/types'
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

function statusOrUnknown(status?: AvailabilityStatus): AvailabilityStatus {
  return status ?? 'unknown'
}

function resolveHandleName(name: string, latinName: string): string {
  return latinName || name
}

function normalizeOwnedAssets(owned?: OwnedAssets): OwnedAssets {
  return {
    domains: [...(owned?.domains ?? [])].sort(),
    social: [...(owned?.social ?? [])].sort(),
    packages: [...(owned?.packages ?? [])].sort(),
    githubUser: Boolean(owned?.githubUser),
  }
}

function useDictionaryChecks(name: string, enabled: boolean) {
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

  return { dictionary, urbanDictionary }
}

function useDomainChecks(handleName: string, enabled: boolean) {
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

  const domains = [
    domainCom,
    domainDev,
    domainApp,
    domainNet,
    domainOrg,
    domainAi,
  ]

  return {
    domainAi,
    domainApp,
    domainCom,
    domainDev,
    domainNet,
    domainOrg,
    domains,
  }
}

function useSocialChecks(handleName: string, enabled: boolean) {
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

  const social = [
    socialInstagram,
    socialTwitter,
    socialTiktok,
    socialYoutube,
    socialFacebook,
  ]

  return {
    social,
    socialFacebook,
    socialInstagram,
    socialTiktok,
    socialTwitter,
    socialYoutube,
  }
}

function usePackageChecks(handleName: string, enabled: boolean) {
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

  const packages = [pkgNpm, pkgCrates, pkgGo, pkgHomebrew, pkgApt]

  return { packages, pkgApt, pkgCrates, pkgGo, pkgHomebrew, pkgNpm }
}

function useGitHubChecks(handleName: string, enabled: boolean) {
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

  return { githubRepos, githubUser }
}

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
  latinName = '',
  owned?: OwnedAssets
) {
  const enabled = name.length > 0
  const handleName = resolveHandleName(name, latinName)
  const ownedNormalized = normalizeOwnedAssets(owned)

  const { dictionary, urbanDictionary } = useDictionaryChecks(name, enabled)
  const {
    domainAi,
    domainApp,
    domainCom,
    domainDev,
    domainNet,
    domainOrg,
    domains,
  } = useDomainChecks(handleName, enabled)
  const {
    social,
    socialFacebook,
    socialInstagram,
    socialTiktok,
    socialTwitter,
    socialYoutube,
  } = useSocialChecks(handleName, enabled)
  const { packages, pkgApt, pkgCrates, pkgGo, pkgHomebrew, pkgNpm } =
    usePackageChecks(handleName, enabled)
  const { githubRepos, githubUser } = useGitHubChecks(handleName, enabled)

  const availability: VibeAvailabilitySnapshot = {
    domains: [
      { tld: 'com', status: statusOrUnknown(domainCom.data?.status) },
      { tld: 'dev', status: statusOrUnknown(domainDev.data?.status) },
      { tld: 'app', status: statusOrUnknown(domainApp.data?.status) },
      { tld: 'net', status: statusOrUnknown(domainNet.data?.status) },
      { tld: 'org', status: statusOrUnknown(domainOrg.data?.status) },
      { tld: 'ai', status: statusOrUnknown(domainAi.data?.status) },
    ],
    social: [
      {
        platform: 'instagram',
        status: statusOrUnknown(socialInstagram.data?.status),
      },
      {
        platform: 'twitter',
        status: statusOrUnknown(socialTwitter.data?.status),
      },
      {
        platform: 'tiktok',
        status: statusOrUnknown(socialTiktok.data?.status),
      },
      {
        platform: 'youtube',
        status: statusOrUnknown(socialYoutube.data?.status),
      },
      {
        platform: 'facebook',
        status: statusOrUnknown(socialFacebook.data?.status),
      },
    ],
    packages: [
      { registry: 'npm', status: statusOrUnknown(pkgNpm.data?.status) },
      { registry: 'crates', status: statusOrUnknown(pkgCrates.data?.status) },
      { registry: 'go', status: statusOrUnknown(pkgGo.data?.status) },
      {
        registry: 'homebrew',
        status: statusOrUnknown(pkgHomebrew.data?.status),
      },
      { registry: 'apt', status: statusOrUnknown(pkgApt.data?.status) },
    ],
    githubUser: {
      status: statusOrUnknown(githubUser.data?.status),
      type: githubUser.data?.type,
    },
  }

  const availabilityReady = [
    ...domains,
    ...social,
    ...packages,
    githubUser,
  ].every((q) => !q.isLoading)

  const vibeCheck = useQuery({
    queryKey: [
      'vibe-check',
      name,
      description,
      region,
      language,
      locale,
      handleName,
      availability,
      ownedNormalized,
    ],
    queryFn: () =>
      checkWordVibe({
        data: {
          name,
          description,
          region,
          language,
          locale,
          context: {
            handleName,
            availability,
            owned: ownedNormalized,
          },
        },
      }),
    enabled: enabled && availabilityReady,
  })

  return {
    dictionary,
    urbanDictionary,
    domains,
    social,
    packages,
    githubUser,
    githubRepos,
    vibeCheck,
    handleName,
  }
}

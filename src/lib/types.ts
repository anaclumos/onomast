export type AvailabilityStatus = 'available' | 'taken' | 'unknown' | 'error'

export type DictionaryPhonetic = { text?: string; audio?: string }
export type DictionaryDefinition = {
  definition: string
  example?: string
  synonyms: string[]
  antonyms: string[]
}
export type DictionaryMeaning = {
  partOfSpeech: string
  definitions: DictionaryDefinition[]
  synonyms: string[]
  antonyms: string[]
}
export type DictionaryResult = {
  found: boolean
  word: string
  phonetic?: string
  phonetics: DictionaryPhonetic[]
  meanings: DictionaryMeaning[]
  sourceUrl?: string
}
export type UrbanDictionaryEntry = {
  word: string
  definition: string
  example: string
  thumbs_up: number
  thumbs_down: number
  author: string
  permalink: string
}
export type UrbanDictionaryResult = {
  found: boolean
  entries: UrbanDictionaryEntry[]
}

export const TLDS = ['com', 'dev', 'app', 'net', 'org', 'ai'] as const
export type TLD = (typeof TLDS)[number]
export type DomainCheck = {
  tld: string
  domain: string
  status: AvailabilityStatus
  registrar?: string
  createdDate?: string
  expiryDate?: string
}

export type SocialPlatform =
  | 'instagram'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'facebook'
export const SOCIAL_PLATFORMS: readonly SocialPlatform[] = [
  'instagram',
  'twitter',
  'tiktok',
  'youtube',
  'facebook',
] as const
export type SocialCheck = {
  platform: SocialPlatform
  handle: string
  profileUrl: string
  status: AvailabilityStatus
}

export type PackageRegistry = 'npm' | 'crates' | 'go' | 'homebrew' | 'apt'
export const PACKAGE_REGISTRIES: readonly PackageRegistry[] = [
  'npm',
  'crates',
  'go',
  'homebrew',
  'apt',
] as const
export type PackageCheck = {
  registry: PackageRegistry
  name: string
  status: AvailabilityStatus
  url: string
}

export type GitHubUserCheck = {
  name: string
  status: AvailabilityStatus
  type?: 'User' | 'Organization'
  login?: string
  avatarUrl?: string
  htmlUrl?: string
  bio?: string
  publicRepos?: number
  followers?: number
}
export type GitHubRepo = {
  name: string
  fullName: string
  description?: string
  stars: number
  forks: number
  htmlUrl: string
  language?: string
}
export type GitHubReposResult = { totalCount: number; repos: GitHubRepo[] }

export type VibeCheckResult = {
  positivity: number
  vibe: 'positive' | 'neutral' | 'negative'
  whyGood: string
  whyBad: string
  redditTake: string
  similarCompanies: string[]
}

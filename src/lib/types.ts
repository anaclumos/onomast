export type AvailabilityStatus = 'available' | 'taken' | 'unknown' | 'error'

export interface DictionaryPhonetic {
  text?: string
  audio?: string
}
export interface DictionaryDefinition {
  definition: string
  example?: string
  synonyms: string[]
  antonyms: string[]
}
export interface DictionaryMeaning {
  partOfSpeech: string
  definitions: DictionaryDefinition[]
  synonyms: string[]
  antonyms: string[]
}
export interface DictionaryResult {
  found: boolean
  word: string
  phonetic?: string
  phonetics: DictionaryPhonetic[]
  meanings: DictionaryMeaning[]
  sourceUrl?: string
}
export interface UrbanDictionaryEntry {
  word: string
  definition: string
  example: string
  thumbs_up: number
  thumbs_down: number
  author: string
  permalink: string
}
export interface UrbanDictionaryResult {
  found: boolean
  entries: UrbanDictionaryEntry[]
}

export const TLDS = ['com', 'dev', 'app', 'net', 'org', 'ai'] as const
export type TLD = (typeof TLDS)[number]
export interface DomainCheck {
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
export interface SocialCheck {
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
export interface PackageCheck {
  registry: PackageRegistry
  name: string
  status: AvailabilityStatus
  url: string
}

export interface GitHubUserCheck {
  name: string
  status: AvailabilityStatus
  type?: 'User' | 'Org'
  login?: string
  avatarUrl?: string
  htmlUrl?: string
  bio?: string
  publicRepos?: number
  followers?: number
}
export interface GitHubRepo {
  name: string
  fullName: string
  description?: string
  stars: number
  forks: number
  htmlUrl: string
  language?: string
}
export interface GitHubReposResult {
  totalCount: number
  repos: GitHubRepo[]
}

export interface VibeCheckResult {
  positivity: number
  vibe: 'positive' | 'neutral' | 'negative'
  reason: string
  whyGood: string
  whyBad: string
  redditTake: string
  similarCompanies: string[]
}

export interface VibeAvailabilitySnapshot {
  domains: Array<{ tld: TLD; status: AvailabilityStatus }>
  social: Array<{ platform: SocialPlatform; status: AvailabilityStatus }>
  packages: Array<{ registry: PackageRegistry; status: AvailabilityStatus }>
  githubUser?: { status: AvailabilityStatus; type?: 'User' | 'Org' }
}

export interface OwnedAssets {
  domains: TLD[]
  social: SocialPlatform[]
  packages: PackageRegistry[]
  githubUser: boolean
}

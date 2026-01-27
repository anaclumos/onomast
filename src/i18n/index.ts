import de from './locales/de.json'
import en from './locales/en.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import ja from './locales/ja.json'
import ko from './locales/ko.json'
import pt from './locales/pt.json'
import zhHans from './locales/zh-Hans.json'
import zhHant from './locales/zh-Hant.json'

export const SUPPORTED_LOCALES = [
  'en',
  'ko',
  'ja',
  'zh-Hans',
  'zh-Hant',
  'es',
  'fr',
  'de',
  'pt',
] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  ja: '日本語',
  'zh-Hans': '简体中文',
  'zh-Hant': '繁體中文',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
}

type Messages = typeof en

const messages: Record<Locale, Messages> = {
  en,
  ko,
  ja,
  'zh-Hans': zhHans,
  'zh-Hant': zhHant,
  es,
  fr,
  de,
  pt,
}

function getNestedValue(obj: unknown, path: string): string | undefined {
  const keys = path.split('.')
  let current: unknown = obj
  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }
  return typeof current === 'string' ? current : undefined
}

export function getTranslation(locale: Locale) {
  const msgs = messages[locale] ?? messages[DEFAULT_LOCALE]
  const fallback = messages[DEFAULT_LOCALE]

  return function t(key: string, params?: Record<string, string>): string {
    let value =
      getNestedValue(msgs, key) ?? getNestedValue(fallback, key) ?? key

    if (params) {
      value = value.replace(
        /\{(\w+)\}/g,
        (_, k: string) => params[k] ?? `{${k}}`
      )
    }

    return value
  }
}

export function isLocale(value: string): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale)
}

const ZH_HANS_REGIONS = new Set(['cn', 'sg', 'my', 'hans'])
const ZH_HANT_REGIONS = new Set(['tw', 'hk', 'mo', 'hant'])

function resolveChineseVariant(subtag: string): Locale {
  if (ZH_HANT_REGIONS.has(subtag)) {
    return 'zh-Hant'
  }
  if (ZH_HANS_REGIONS.has(subtag)) {
    return 'zh-Hans'
  }
  return 'zh-Hans'
}

// RFC 7231 Accept-Language content negotiation
export function parseAcceptLanguage(header: string): Locale {
  if (!header) {
    return DEFAULT_LOCALE
  }

  const languages = header
    .split(',')
    .map((part) => {
      const [lang, ...rest] = part.trim().split(';')
      const qPart = rest.find((r) => r.trim().startsWith('q='))
      const q = qPart ? Number.parseFloat(qPart.trim().slice(2)) : 1
      const segments = lang.trim().toLowerCase().split('-')
      return { primary: segments[0], subtag: segments[1], q }
    })
    .filter((l) => !Number.isNaN(l.q))
    .sort((a, b) => b.q - a.q)

  for (const { primary, subtag } of languages) {
    if (primary === 'zh' && subtag) {
      return resolveChineseVariant(subtag)
    }
    if (primary === 'zh') {
      return 'zh-Hans'
    }
    if (isLocale(primary)) {
      return primary
    }
  }

  return DEFAULT_LOCALE
}

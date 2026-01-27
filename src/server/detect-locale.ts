import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { type Locale, parseAcceptLanguage, SUPPORTED_LOCALES } from '@/i18n'

const LOCALE_COOKIE_RE = /locale=(\w+)/

export const detectLocale = createServerFn({ method: 'GET' }).handler(
  (): Locale => {
    const request = getRequest()
    const cookieHeader = request?.headers?.get('cookie') ?? ''

    const localeMatch = cookieHeader.match(LOCALE_COOKIE_RE)
    if (localeMatch) {
      const cookieLocale = localeMatch[1]
      if (SUPPORTED_LOCALES.includes(cookieLocale as Locale)) {
        return cookieLocale as Locale
      }
    }

    const acceptLanguage = request?.headers?.get('accept-language') ?? ''
    return parseAcceptLanguage(acceptLanguage)
  }
)

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_LOCALE, getTranslation, type Locale } from '.'

interface I18nContextValue {
  locale: Locale
  t: (key: string, params?: Record<string, string>) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

function setCookie(name: string, value: string) {
  Object.assign(document, {
    cookie: `${name}=${value};path=/;max-age=31536000;samesite=lax`,
  })
}

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)
  const t = useMemo(() => getTranslation(locale), [locale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    setCookie('locale', newLocale)
    document.documentElement.lang = newLocale
  }, [])

  const value = useMemo(
    () => ({ locale, t, setLocale }),
    [locale, t, setLocale]
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE as Locale,
      t: getTranslation(DEFAULT_LOCALE),
      setLocale: (_locale: Locale) => undefined,
    }
  }
  return ctx
}

import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { Analytics } from '@vercel/analytics/react'
import { EscapeInAppBrowser } from 'eiab/react'

import { I18nProvider } from '@/i18n/context'
import { detectLocale } from '@/server/detect-locale'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  beforeLoad: async () => {
    const locale = await detectLocale()
    return { locale }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'onomast.app — Vibe Check Your Company Name' },
      {
        property: 'og:title',
        content: 'onomast.app — Vibe Check Your Company Name',
      },
      {
        property: 'og:description',
        content: 'Search domains, social handles, package registries, and more',
      },
      { property: 'og:image', content: 'https://www.onomast.app/api/og' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'onomast.app — Vibe Check Your Company Name',
      },
      {
        name: 'twitter:description',
        content: 'Search domains, social handles, package registries, and more',
      },
      { name: 'twitter:image', content: 'https://www.onomast.app/api/og' },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      {
        src: 'https://cdn.visitors.now/v.js',
        'data-token': '2dfba872-3677-4979-afe0-356b42f2fb8f',
      },
    ],
  }),

  component: RootComponent,
  shellComponent: RootDocument,
})

function RootComponent() {
  const { locale } = Route.useRouteContext()

  return (
    <I18nProvider initialLocale={locale}>
      <Outlet />
    </I18nProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <EscapeInAppBrowser />
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Analytics />
        <Scripts />
      </body>
    </html>
  )
}

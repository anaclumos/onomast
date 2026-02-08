import type { AuthConfig } from 'convex/server'

const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN

if (!clerkJwtIssuerDomain) {
  throw new Error('Missing CLERK_JWT_ISSUER_DOMAIN')
}

export default {
  providers: [
    {
      domain: clerkJwtIssuerDomain,
      applicationID: 'convex',
    },
  ],
} satisfies AuthConfig

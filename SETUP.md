# Setup (Clerk + Convex + Vercel)

This repo uses:

- Auth: Clerk
- Backend: Convex
- Package manager: Bun

## Requirements

- Bun
- Vercel CLI (`vercel`)
- Access to:
  - Vercel project `onomast`
  - Convex project `onomast` (dev + prod deployments)
  - Clerk apps (dev + prod)

## Local development

1. Install deps:

```bash
bun install
```

2. Pull Vercel env vars for local dev (writes `.env.local`):

```bash
vercel link
vercel env pull .env.local --environment development -y
```

3. Ensure Convex dev deployment is configured (writes/updates `.env.local`):

```bash
CONVEX_DEPLOYMENT=dev:precious-okapi-897 bunx convex dev --once --typecheck disable
```

4. Run Convex (watch mode) and the app:

```bash
# terminal A
bun run convex:dev

# terminal B
bun run dev
```

## Clerk setup

Convex uses Clerk session tokens via a JWT template named `convex`.

In **each** Clerk app (dev and prod):

1. Create a JWT template named `convex`.
2. Set the token "aud" (application ID / audience) to `convex`.

## Convex setup

Deployments for this repo:

- Dev (cloud): `precious-okapi-897`
- Prod: `acoustic-partridge-377`

Convex must know which Clerk issuer to trust. Set `CLERK_JWT_ISSUER_DOMAIN`:

```bash
# Dev
CONVEX_DEPLOYMENT=dev:precious-okapi-897 bunx convex env set \
  CLERK_JWT_ISSUER_DOMAIN https://fleet-prawn-75.clerk.accounts.dev

# Prod
CONVEX_DEPLOYMENT=dev:precious-okapi-897 bunx convex env set --prod \
  CLERK_JWT_ISSUER_DOMAIN https://clerk.onomast.app
```

Verify:

```bash
bunx convex env list
bunx convex env list --prod
```

## Production deploy

1. Deploy Convex functions/schema to prod:

```bash
bunx convex deploy -y --typecheck disable --codegen disable
```

2. Deploy the web app to Vercel:

```bash
vercel deploy --prod
```

## Environment variables

Environment variables are validated with Zod. The schema is the source of truth:

- `src/env.ts`

Runtime parsing happens in:

- Client: `src/env.client.ts`
- Server: `src/env.server.ts`

Required:

- `VITE_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `VITE_CONVEX_URL`

Optional:

- `AI_GATEWAY_API_KEY`

## Notes / gotchas

- Convex module filenames in `convex/` cannot contain hyphens (`-`).

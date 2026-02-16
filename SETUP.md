# Setup (Better Auth + Drizzle + Planetscale)

This repo uses:

- Auth: Better Auth (self-hosted, cookie-based)
- Database: Drizzle ORM + Planetscale Postgres
- Package manager: Bun

## Requirements

- Bun
- Vercel CLI (`vercel`)
- Planetscale CLI (`pscale`) - optional, for local database management
- Access to:
  - Vercel project `onomast`
  - Planetscale database `onomast` (dev + prod branches)

## Local development

1. Install deps:

```bash
bun install
```

2. Create `.env.local` with required variables:

```bash
DATABASE_URL="postgresql://user:password@host/database"
BETTER_AUTH_SECRET="your-secret-key-here"
```

To get `DATABASE_URL` from Planetscale:

```bash
pscale connect onomast dev --port 3306
# Then use: DATABASE_URL="mysql://root@127.0.0.1:3306/onomast"
```

Or use Planetscale's connection string directly (recommended for production).

3. Generate and apply database migrations:

```bash
bunx drizzle-kit generate
bunx drizzle-kit push
```

4. Run the app:

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

## Database schema management

### Generate migrations

After modifying `src/db/schema.ts`, generate migration files:

```bash
bun run db:generate
```

This creates migration files in `drizzle/` directory.

### Apply migrations

Push migrations to your database:

```bash
bun run db:push
```

### View database in studio

Open Drizzle Studio to inspect your database:

```bash
bun run db:studio
```

### Run migrations programmatically

For production deployments, migrations can be run via:

```bash
bunx drizzle-kit migrate
```

## Authentication setup

Better Auth is configured in `src/lib/auth.ts` with:

- Email/password authentication
- Session management via HTTP-only cookies
- User table in Drizzle schema

No additional setup required beyond environment variables.

## Production deploy

1. Ensure database migrations are applied to production branch:

```bash
# Switch to prod branch in Planetscale
pscale branch switch onomast prod

# Apply migrations
bunx drizzle-kit push --env production
```

2. Deploy the web app to Vercel:

```bash
vercel deploy --prod
```

Vercel will automatically:
- Install dependencies (`bun install`)
- Build the app (`NITRO_PRESET=vercel bun run build`)
- Deploy to production

## Environment variables

Environment variables are validated with Zod. The schema is the source of truth:

- `src/env.ts`

Runtime parsing happens in:

- Client: `src/env.client.ts`
- Server: `src/env.server.ts`

Required:

- `DATABASE_URL` - Planetscale connection string
- `BETTER_AUTH_SECRET` - Secret key for session signing (generate with `openssl rand -base64 32`)

Optional:

- `AI_GATEWAY_API_KEY` - For AI features

## Notes / gotchas

- `DATABASE_URL` must be a valid PostgreSQL connection string
- `BETTER_AUTH_SECRET` should be a strong random string (minimum 32 characters)
- Migrations are applied automatically on `bun run db:push`
- Database schema is the source of truth (defined in `src/db/schema.ts`)
- Better Auth uses HTTP-only cookies for session management (no client-side tokens)

# Architectural Decisions

_This file tracks architectural choices and rationale._

---

## Task 3: Drizzle Schema Design (2026-02-17)

### DB column naming: snake_case
All Postgres columns use snake_case (e.g., `user_id`, `created_at`, `input_hash`).
Drizzle JS property names use camelCase. This is standard Drizzle convention and
Better Auth maps by JS property name, not DB column name.

### Better Auth tables: no defaultNow on timestamps
Better Auth manages its own timestamp values. Only app tables (savedSearches, vibeChecks)
use `.defaultNow()` on createdAt/updatedAt.

### verification.createdAt/updatedAt are nullable
Unlike other Better Auth tables, verification timestamps are nullable. This matches
observed Better Auth behavior where verification tokens may not always have these set.

### vibeChecks.inputHash: uniqueIndex (not just index)
Convex schema only has a regular index on inputHash, but the upsert pattern in
vibechecks.ts treats it as effectively unique (lookup + insert-or-update).
Made it a uniqueIndex to enforce this at the DB level.

### vibeChecks.vibe: text with $type narrowing
Used `text().$type<'positive' | 'neutral' | 'negative'>()` instead of a pgEnum.
Simpler, no migration needed for enum changes, and type safety is at the Drizzle/TS level.

### savedSearches.userId FK with cascade delete
When a user is deleted, their saved searches are automatically cleaned up.
Matches the ownership model from Convex where searches are always scoped to a user.

### IDs: text with crypto.randomUUID()
All tables use `text('id').primaryKey().$defaultFn(() => crypto.randomUUID())`.
This matches Better Auth's default behavior and avoids needing pgcrypto extension.

## Task 6: Better Auth Server Config (2026-02-17)

### Direct process.env for auth config (not env.ts)
`auth.ts` uses `process.env.BETTER_AUTH_SECRET` directly instead of importing from
env.ts. This avoids circular dependency: db → auth → env → (potential side effects).
Same pattern as `src/db/index.ts` using `process.env.DATABASE_URL ?? ''`.

### baseURL with BETTER_AUTH_URL fallback
Uses `process.env.BETTER_AUTH_URL || 'http://localhost:3000'`. BETTER_AUTH_URL is not
in serverEnvSchema because it's optional — Better Auth can auto-detect from request
headers in production. The env var is only needed for edge cases (e.g., proxy setups).

### Session config: 7d expiry, 1d update, 5min cookie cache
- 7-day session expiry: reasonable default for non-sensitive app
- 1-day updateAge: session token refreshed once per day (reduces DB writes)
- 5-minute cookieCache: avoids hitting DB on every request, acceptable staleness

### tanstackStartCookies() MUST be last plugin
Per Better Auth docs, the TanStack Start cookies plugin must be the last plugin in
the array. It intercepts cookie operations for SSR compatibility. Other plugins added
later must go BEFORE this one.

### No social auth providers
Deliberately omitted Google/GitHub/etc. social providers. The app only needs
email+password auth. Social providers can be added later as a separate task.

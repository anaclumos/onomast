# Migration: Clerk + Convex → Better Auth + Drizzle + Planetscale Postgres

## TL;DR

> **Quick Summary**: Migrate onomast.app from Clerk (auth) + Convex (database) to Better Auth + Drizzle ORM + Planetscale Postgres, preserving all existing functionality including saved searches, vibe check caching, leaderboard, and i18n.
>
> **Deliverables**:
> - Better Auth integration with email/password and session management
> - Drizzle ORM schema for all tables (auth + app)
> - All Convex server functions replaced with Drizzle-based TanStack Start server functions
> - All Clerk UI components replaced with Better Auth client hooks
> - Clean removal of all Convex and Clerk dependencies
>
> **Estimated Effort**: Medium-Large
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: T1 (packages) → T3 (schema) → T5 (auth config) → T9 (root layout) → T12 (saved-searches) → T16 (cleanup)

---

## Context

### Original Request
"Read all files and I want to move to Better Auth + Drizzle + Planetscale Postgres. ULW. Make all changes."

### Interview Summary
**Key Decisions**:
- Full migration from Clerk+Convex to Better Auth+Drizzle+Planetscale Postgres
- Preserve all existing features (saved searches, vibe check caching, leaderboard, i18n)
- Keep TanStack Start + React 19 + Vite + Nitro + Vercel deployment

**Research Findings**:
- Better Auth has official TanStack Start integration via `tanstackStartCookies` plugin (import from `better-auth/tanstack-start`)
- API route mounted at `/api/auth/$` using TanStack Router catch-all syntax
- Client uses `createAuthClient` from `better-auth/react` with `useSession` hook
- Drizzle adapter: `drizzleAdapter(db, { provider: "pg" })`
- Auth middleware: `auth.api.getSession({ headers })` in TanStack Start middleware/server fns
- Protected routes use `beforeLoad` with redirect pattern
- Real-world references: Reactive Resume, Electric SQL starter, zerobyte all use this exact stack
- `tanstackStartCookies()` MUST be last plugin in array
- `start.ts` does NOT need auth middleware — Better Auth works through its own API route
- `__root.tsx` does NOT need a provider wrapper — Better Auth uses cookie-based sessions

### Metis Review
**Addressed**:
- Planetscale Postgres connection: use `postgres` package with `prepare: false` or `@neondatabase/serverless`
- Better Auth schema tables (user, session, account, verification) co-located with app tables
- Array column (`similarCompanies`) maps to `text('similar_companies').array()` in Drizzle
- Convex reactive queries (leaderboard, saved searches) replaced with TanStack Start server fns + React Query

---

## Work Objectives

### Core Objective
Replace Clerk authentication and Convex database with Better Auth + Drizzle ORM + Planetscale Postgres while preserving all existing features and UX.

### Concrete Deliverables
- `src/lib/auth.ts` — Better Auth server config
- `src/lib/auth-client.ts` — Better Auth React client
- `src/routes/api/auth/$.ts` — Auth API handler
- `src/db/schema.ts` — Drizzle schema (auth + app tables)
- `src/db/index.ts` — Database connection
- `drizzle.config.ts` — Drizzle Kit config
- `src/server/saved-searches.ts` — Drizzle-based server functions
- `src/server/leaderboard.ts` — Drizzle-based server function
- Updated: `src/server/vibe-check.ts`, `src/start.ts`, `src/routes/__root.tsx`, `src/components/auth-controls.tsx`, `src/components/saved-searches-panel.tsx`, `src/routes/leaderboard.tsx`, `src/env.ts`, `src/env.client.ts`, `src/env.server.ts`, `vercel.json`, `SETUP.md`
- Deleted: `convex/` directory, `src/lib/convex-client.ts`, `src/lib/convex-functions.ts`

### Definition of Done
- [ ] `bun run build` succeeds with zero errors
- [ ] Auth flow works: sign up, sign in, sign out, session persistence
- [ ] Saved searches: save, list, navigate all functional
- [ ] Vibe check caching reads/writes to Postgres
- [ ] Leaderboard aggregation works from Postgres
- [ ] No Clerk or Convex imports anywhere in the codebase
- [ ] All env vars validated by Zod schemas

### Must Have
- Email/password authentication via Better Auth
- Session-based auth with cookie management
- All Convex data operations migrated to Drizzle queries
- Drizzle migration files generated
- Server-side session validation in protected server functions

### Must NOT Have (Guardrails)
- Do NOT add social auth providers (Google/GitHub) — not in current app, out of scope
- Do NOT add email verification flow — not in current app
- Do NOT change any UI styling, layout, or component structure beyond auth-related changes
- Do NOT modify i18n system, search form, or any section components (domains, social, packages, etc.)
- Do NOT add new features — this is a migration, not an enhancement
- Do NOT use `vh`, `h-screen`, `vw`, or arbitrary Tailwind values (per AGENTS.md)
- Do NOT use `setState` inside `useEffect` (per AGENTS.md)
- Do NOT create auth pages (login/signup) — replace Clerk's modal approach with Better Auth equivalent

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (vitest)
- **Automated tests**: Tests-after for critical paths
- **Framework**: vitest

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

| Deliverable Type | Verification Tool | Method |
|------------------|-------------------|--------|
| Build | Bash | `bun run build` |
| Schema | Bash | `npx drizzle-kit generate` succeeds |
| Server functions | Bash (curl) | Call server functions, assert responses |
| Auth flow | Playwright | Navigate, sign up, sign in, sign out |
| Components | Bash | `bun run build` + no TS errors |

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — packages + foundation):
├── Task 1: Update packages (remove Clerk/Convex, add Better Auth/Drizzle) [quick]
├── Task 2: Update env schemas (src/env.ts, env.client.ts, env.server.ts) [quick]
├── Task 3: Create Drizzle schema (src/db/schema.ts) [unspecified-high]
├── Task 4: Create database connection (src/db/index.ts) [quick]
├── Task 5: Create drizzle.config.ts [quick]

Wave 2 (After Wave 1 — auth infra + server functions):
├── Task 6: Create Better Auth server config (src/lib/auth.ts) [unspecified-high]
├── Task 7: Create Better Auth client (src/lib/auth-client.ts) [quick]
├── Task 8: Create auth API route (src/routes/api/auth/$.ts) [quick]
├── Task 9: Rewrite src/start.ts [quick]
├── Task 10: Create saved-searches server functions (src/server/saved-searches.ts) [unspecified-high]
├── Task 11: Create leaderboard server function (src/server/leaderboard.ts) [quick]
├── Task 12: Rewrite vibe-check.ts (replace ConvexHttpClient) [unspecified-high]

Wave 3 (After Wave 2 — UI migration):
├── Task 13: Rewrite __root.tsx (remove Clerk/Convex providers) [unspecified-high]
├── Task 14: Rewrite auth-controls.tsx (Better Auth hooks) [quick]
├── Task 15: Rewrite saved-searches-panel.tsx (server fns + React Query) [unspecified-high]
├── Task 16: Rewrite leaderboard.tsx (server fns + React Query) [unspecified-high]

Wave 4 (After Wave 3 — cleanup + verify):
├── Task 17: Delete Convex files + convex-client.ts + convex-functions.ts [quick]
├── Task 18: Update vercel.json + SETUP.md [quick]
├── Task 19: Build verification + fix any remaining issues [deep]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
├── Task F4: Scope fidelity check (deep)

Critical Path: T1 → T3 → T6 → T13 → T15 → T17 → T19 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 5 (Wave 1 & Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|------------|--------|------|
| 1 | — | 2-12 | 1 |
| 2 | — | 6, 7 | 1 |
| 3 | — | 6, 10, 11, 12 | 1 |
| 4 | — | 6, 10, 11, 12 | 1 |
| 5 | — | — | 1 |
| 6 | 2, 3, 4 | 8, 10, 12, 13 | 2 |
| 7 | 2 | 13, 14, 15, 16 | 2 |
| 8 | 6 | 13 | 2 |
| 9 | 1 | 13 | 2 |
| 10 | 3, 4, 6 | 15 | 2 |
| 11 | 3, 4 | 16 | 2 |
| 12 | 3, 4 | 19 | 2 |
| 13 | 6, 7, 8, 9 | 14, 15, 16 | 3 |
| 14 | 7, 13 | 19 | 3 |
| 15 | 7, 10, 13 | 19 | 3 |
| 16 | 7, 11, 13 | 19 | 3 |
| 17 | 13, 14, 15, 16 | 19 | 4 |
| 18 | 1 | 19 | 4 |
| 19 | 17, 18 | F1-F4 | 4 |

### Agent Dispatch Summary

| Wave | # Parallel | Tasks → Agent Category |
|------|------------|----------------------|
| 1 | **5** | T1 → `quick`, T2 → `quick`, T3 → `unspecified-high`, T4 → `quick`, T5 → `quick` |
| 2 | **7** | T6 → `unspecified-high`, T7 → `quick`, T8 → `quick`, T9 → `quick`, T10 → `unspecified-high`, T11 → `quick`, T12 → `unspecified-high` |
| 3 | **4** | T13 → `unspecified-high`, T14 → `quick`, T15 → `unspecified-high`, T16 → `unspecified-high` |
| 4 | **3** | T17 → `quick`, T18 → `quick`, T19 → `deep` |
| FINAL | **4** | F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep` |

---

## TODOs

- [ ] 1. Update packages — remove Clerk/Convex, add Better Auth/Drizzle/Postgres

  **What to do**:
  - Run: `bun remove @clerk/tanstack-react-start convex`
  - Run: `bun add better-auth drizzle-orm postgres`
  - Run: `bun add -d drizzle-kit`
  - Verify `package.json` no longer contains any `clerk` or `convex` references in dependencies
  - Do NOT touch any source files yet — just package changes

  **Must NOT do**:
  - Do not modify source files in this task
  - Do not run `bun install` separately (bun add does it)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4, 5)
  - **Blocks**: Tasks 2-12
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `package.json:1-70` — Current deps to modify. Remove lines 21 (`@clerk/tanstack-react-start`), 39 (`convex`). Add `better-auth`, `drizzle-orm`, `postgres` to dependencies. Add `drizzle-kit` to devDependencies.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Package removal and addition succeeds
    Tool: Bash
    Preconditions: Current package.json has clerk and convex
    Steps:
      1. Run `bun remove @clerk/tanstack-react-start convex`
      2. Run `bun add better-auth drizzle-orm postgres`
      3. Run `bun add -d drizzle-kit`
      4. Run `grep -c "clerk\|convex" package.json` — expect 0
      5. Run `grep -c "better-auth" package.json` — expect 1
      6. Run `grep -c "drizzle-orm" package.json` — expect 1
    Expected Result: All packages installed, no clerk/convex in deps
    Failure Indicators: bun add fails, or clerk/convex still present
    Evidence: .sisyphus/evidence/task-1-packages.txt
  ```

  **Commit**: YES (groups with 2, 3, 4, 5)
  - Message: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
  - Files: `package.json`, `bun.lock`

---

- [ ] 2. Update environment variable schemas

  **What to do**:
  - Rewrite `src/env.ts`:
    - `clientEnvSchema`: Remove `VITE_CLERK_PUBLISHABLE_KEY` and `VITE_CONVEX_URL`. Add nothing (Better Auth client doesn't need VITE_ env vars — it uses the current origin).
    - Remove `convexEnvSchema` entirely.
    - `serverEnvSchema`: Remove `CLERK_SECRET_KEY`. Add `DATABASE_URL: z.string().min(1)` and `BETTER_AUTH_SECRET: z.string().min(1)`. Keep `NODE_ENV` and `AI_GATEWAY_API_KEY`.
  - Update `src/env.client.ts`: The clientEnvSchema may now be empty or only contain non-auth vars. If empty, export a no-op parse or remove the file and update imports.
  - Update `src/env.server.ts`: Keep `getServerEnv()` pattern, it now returns `DATABASE_URL` and `BETTER_AUTH_SECRET`.

  **Must NOT do**:
  - Do not add social auth env vars (GOOGLE_CLIENT_ID, etc.)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4, 5)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/env.ts:1-25` — Current schema structure. Keep the Zod pattern. Replace Clerk/Convex vars with Better Auth/Drizzle vars.
  - `src/env.client.ts:1-6` — Current client env parsing. May become minimal or removed.
  - `src/env.server.ts:1-9` — Current server env parsing. Keep the `getServerEnv()` pattern.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Env schemas compile without errors
    Tool: Bash
    Preconditions: Files updated
    Steps:
      1. Run `bunx tsc --noEmit src/env.ts` (or full project check later)
      2. Verify no references to CLERK or CONVEX in src/env*.ts
      3. Verify DATABASE_URL and BETTER_AUTH_SECRET are in serverEnvSchema
    Expected Result: TypeScript compiles, correct vars present
    Failure Indicators: TS errors, missing vars
    Evidence: .sisyphus/evidence/task-2-env-schemas.txt
  ```

  **Commit**: YES (groups with 1, 3, 4, 5)
  - Message: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
  - Files: `src/env.ts`, `src/env.client.ts`, `src/env.server.ts`

---

- [ ] 3. Create Drizzle schema (src/db/schema.ts)

  **What to do**:
  - Create `src/db/schema.ts` with all tables:
    - **Better Auth tables** (user, session, account, verification) — follow Better Auth's expected schema exactly
    - **App tables** (savedSearches, vibeChecks) — translated from Convex schema
  - Use `pgTable` from `drizzle-orm/pg-core`
  - Column type mapping from Convex:
    - `v.string()` → `text()` or `varchar()`
    - `v.optional(v.string())` → `text().optional()` (nullable)
    - `v.number()` → `integer()` for positivity/promptVersion, `timestamp()` for dates
    - `v.union(v.literal(...))` → `text().$type<'positive' | 'neutral' | 'negative'>()`
    - `v.array(v.string())` → `text().array()`
    - Convex `_id` (auto) → `text('id').primaryKey()` with `crypto.randomUUID()` default or `$defaultFn(() => crypto.randomUUID())`
  - Indexes:
    - `savedSearches`: index on `userId`, unique index on `(userId, normalizedName)`
    - `vibeChecks`: unique index on `inputHash`
  - `savedSearches.userId` should reference `user.id` with `onDelete: 'cascade'`
  - Timestamps: Use `timestamp('created_at').defaultNow().notNull()` pattern

  **Must NOT do**:
  - Do not add tables that don't exist in current schema
  - Do not add relations definitions (not needed for this app's query patterns)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4, 5)
  - **Blocks**: Tasks 6, 10, 11, 12
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `convex/schema.ts:1-43` — Current Convex schema. This is the source of truth for app tables. Translate each `defineTable({...})` to `pgTable('name', {...})`.
  - `convex/savedsearches.ts:1-73` — Shows which fields are used in queries (userId lookups, normalizedName matching). Ensures indexes are correct.
  - `convex/vibechecks.ts:1-87` — Shows inputHash lookup pattern. Ensure index exists.

  **External References**:
  - Better Auth required schema: user (id, name, email, emailVerified, image, createdAt, updatedAt), session (id, expiresAt, token, createdAt, updatedAt, ipAddress, userAgent, userId), account (id, accountId, providerId, userId, accessToken, refreshToken, idToken, accessTokenExpiresAt, refreshTokenExpiresAt, scope, password, createdAt, updatedAt), verification (id, identifier, value, expiresAt, createdAt, updatedAt)
  - Drizzle pgTable docs: `import { pgTable, text, integer, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core'`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Schema file has all required tables
    Tool: Bash
    Preconditions: src/db/schema.ts created
    Steps:
      1. Verify file exports: user, session, account, verification, savedSearches, vibeChecks
      2. Verify savedSearches has columns: id, userId, normalizedName, name, description, region, language, latinName, createdAt, updatedAt
      3. Verify vibeChecks has columns: id, inputHash, name, description, region, language, locale, positivity, vibe, reason, whyGood, whyBad, redditTake, similarCompanies, model, promptVersion, createdAt, updatedAt
      4. Verify similarCompanies uses `.array()` type
      5. Verify indexes exist on userId and inputHash
    Expected Result: All tables, columns, and indexes present
    Failure Indicators: Missing table/column/index, wrong types
    Evidence: .sisyphus/evidence/task-3-schema.txt
  ```

  **Commit**: YES (groups with 1, 2, 4, 5)
  - Message: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
  - Files: `src/db/schema.ts`

---

- [ ] 4. Create database connection (src/db/index.ts)

  **What to do**:
  - Create `src/db/index.ts`:
    ```typescript
    import { drizzle } from 'drizzle-orm/postgres-js'
    import postgres from 'postgres'
    import * as schema from './schema'

    const client = postgres(process.env.DATABASE_URL!, { prepare: false })
    export const db = drizzle(client, { schema })
    ```
  - Use `postgres` package (not `pg` Pool) — simpler, better for serverless
  - `prepare: false` is required for Planetscale Postgres compatibility
  - Import `process.env.DATABASE_URL` directly (validated by env.server.ts at app startup)

  **Must NOT do**:
  - Do not import from env.server.ts here (circular dependency risk — db is used by auth which may be used before env validation)

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 5)
  - **Blocks**: Tasks 6, 10, 11, 12
  - **Blocked By**: None

  **References**:

  **External References**:
  - Drizzle postgres-js setup: `import { drizzle } from 'drizzle-orm/postgres-js'` + `import postgres from 'postgres'`
  - Planetscale requires `prepare: false` in postgres() options

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: DB connection file exports db instance
    Tool: Bash
    Preconditions: src/db/index.ts created
    Steps:
      1. Verify file imports from 'drizzle-orm/postgres-js' and 'postgres'
      2. Verify file imports schema from './schema'
      3. Verify `prepare: false` is set in postgres options
      4. Verify file exports `db`
    Expected Result: File compiles and exports db
    Failure Indicators: Missing imports, missing prepare:false
    Evidence: .sisyphus/evidence/task-4-db-connection.txt
  ```

  **Commit**: YES (groups with 1, 2, 3, 5)
  - Message: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
  - Files: `src/db/index.ts`

---

- [ ] 5. Create drizzle.config.ts

  **What to do**:
  - Create `drizzle.config.ts` at project root:
    ```typescript
    import { defineConfig } from 'drizzle-kit'

    export default defineConfig({
      schema: './src/db/schema.ts',
      out: './drizzle',
      dialect: 'postgresql',
      dbCredentials: {
        url: process.env.DATABASE_URL!,
      },
    })
    ```
  - Add `drizzle/` to `.gitignore` (migration output directory)

  **Must NOT do**:
  - Do not run migrations in this task — just create the config

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3, 4)
  - **Blocks**: None directly (used by developers manually)
  - **Blocked By**: None

  **References**:

  **External References**:
  - Drizzle Kit config: `defineConfig` from `drizzle-kit` with dialect, schema, out, dbCredentials

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Drizzle config file is valid
    Tool: Bash
    Preconditions: drizzle.config.ts created
    Steps:
      1. Verify file exists at project root
      2. Verify schema points to './src/db/schema.ts'
      3. Verify dialect is 'postgresql'
      4. Verify 'drizzle' is in .gitignore
    Expected Result: Config file valid, gitignore updated
    Failure Indicators: Wrong paths, missing from gitignore
    Evidence: .sisyphus/evidence/task-5-drizzle-config.txt
  ```

  **Commit**: YES (groups with 1, 2, 3, 4)
  - Message: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
  - Files: `drizzle.config.ts`, `.gitignore`

---

- [ ] 6. Create Better Auth server config (src/lib/auth.ts)

  **What to do**:
  - Create `src/lib/auth.ts`:
    ```typescript
    import { betterAuth } from 'better-auth'
    import { drizzleAdapter } from 'better-auth/adapters/drizzle'
    import { tanstackStartCookies } from 'better-auth/tanstack-start'
    import { db } from '@/db'
    import * as schema from '@/db/schema'

    export const auth = betterAuth({
      database: drizzleAdapter(db, {
        provider: 'pg',
        schema,
      }),
      baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
      secret: process.env.BETTER_AUTH_SECRET,
      emailAndPassword: {
        enabled: true,
      },
      session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // 1 day
        cookieCache: {
          enabled: true,
          maxAge: 5 * 60, // 5 minutes
        },
      },
      plugins: [tanstackStartCookies()], // MUST be last
    })
    ```
  - `tanstackStartCookies()` MUST be the last plugin in the array
  - Email/password auth enabled (replacing Clerk's modal-based auth)
  - No social providers (not in current app)

  **Must NOT do**:
  - Do not add social auth providers
  - Do not add email verification
  - Do not add 2FA or other plugins

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 7, 8, 9, 10, 11, 12)
  - **Blocks**: Tasks 8, 10, 12, 13
  - **Blocked By**: Tasks 2, 3, 4

  **References**:

  **Pattern References**:
  - `src/start.ts:1-9` — Shows current auth middleware pattern (Clerk). This is being replaced.
  - `src/routes/__root.tsx:1-12` — Shows current ClerkProvider+ConvexProviderWithClerk pattern being replaced.

  **External References**:
  - Better Auth TanStack Start docs: `tanstackStartCookies` from `better-auth/tanstack-start`
  - Drizzle adapter: `drizzleAdapter(db, { provider: "pg", schema })` from `better-auth/adapters/drizzle`
  - Real-world example: Electric SQL starter at `src/lib/auth.ts`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth config exports valid auth instance
    Tool: Bash
    Preconditions: src/lib/auth.ts created, db and schema exist
    Steps:
      1. Verify file imports betterAuth, drizzleAdapter, tanstackStartCookies
      2. Verify tanstackStartCookies() is last in plugins array
      3. Verify emailAndPassword.enabled is true
      4. Verify no socialProviders configuration
      5. TypeScript compiles without errors
    Expected Result: Valid auth configuration
    Failure Indicators: Missing imports, plugin order wrong
    Evidence: .sisyphus/evidence/task-6-auth-config.txt
  ```

  **Commit**: YES (groups with 7, 8, 9)
  - Message: `feat: add better auth server and client configuration`
  - Files: `src/lib/auth.ts`

---

- [ ] 7. Create Better Auth React client (src/lib/auth-client.ts)

  **What to do**:
  - Create `src/lib/auth-client.ts`:
    ```typescript
    import { createAuthClient } from 'better-auth/react'

    export const authClient = createAuthClient({
      baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
    })
    ```
  - Use `window.location.origin` for browser, `undefined` for SSR
  - Export `authClient` as the main export — components use `authClient.useSession()`, `authClient.signIn.email()`, `authClient.signOut()`, etc.

  **Must NOT do**:
  - Do not add plugins to the client config

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 8, 9, 10, 11, 12)
  - **Blocks**: Tasks 13, 14, 15, 16
  - **Blocked By**: Task 2

  **References**:

  **External References**:
  - Better Auth React client: `createAuthClient` from `better-auth/react`
  - Electric SQL example: `src/lib/auth-client.ts`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth client exports valid client instance
    Tool: Bash
    Steps:
      1. Verify file imports createAuthClient from 'better-auth/react'
      2. Verify file exports authClient
      3. Verify baseURL uses window.location.origin with SSR guard
    Expected Result: Valid client configuration
    Evidence: .sisyphus/evidence/task-7-auth-client.txt
  ```

  **Commit**: YES (groups with 6, 8, 9)
  - Message: `feat: add better auth server and client configuration`
  - Files: `src/lib/auth-client.ts`

---

- [ ] 8. Create auth API route (src/routes/api/auth/$.ts)

  **What to do**:
  - Create directory `src/routes/api/auth/`
  - Create `src/routes/api/auth/$.ts`:
    ```typescript
    import { createFileRoute } from '@tanstack/react-router'
    import { auth } from '@/lib/auth'

    export const Route = createFileRoute('/api/auth/$')({
      server: {
        handlers: {
          GET: async ({ request }: { request: Request }) => {
            return await auth.handler(request)
          },
          POST: async ({ request }: { request: Request }) => {
            return await auth.handler(request)
          },
        },
      },
    })
    ```
  - The `$` filename is TanStack Router's catch-all syntax
  - Both GET and POST delegate to `auth.handler(request)`

  **Must NOT do**:
  - Do not add middleware or extra logic to this route

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 9, 10, 11, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 6

  **References**:

  **Pattern References**:
  - `src/routes/api/og.ts:40-58` — Existing API route pattern in TanStack Start. Follow same `createFileRoute` + `server.handlers` pattern.

  **External References**:
  - Better Auth TanStack Start docs: Mount handler at `/api/auth/$`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth route file exists with correct structure
    Tool: Bash
    Steps:
      1. Verify file exists at src/routes/api/auth/$.ts
      2. Verify it imports auth from '@/lib/auth'
      3. Verify it has GET and POST handlers calling auth.handler(request)
    Expected Result: Route file properly delegates to auth.handler
    Evidence: .sisyphus/evidence/task-8-auth-route.txt
  ```

  **Commit**: YES (groups with 6, 7, 9)
  - Message: `feat: add better auth server and client configuration`
  - Files: `src/routes/api/auth/$.ts`

---

- [ ] 9. Rewrite src/start.ts — remove Clerk middleware

  **What to do**:
  - Remove `clerkMiddleware` import and usage
  - The file should become minimal — Better Auth doesn't need middleware in start.ts:
    ```typescript
    import { createStart } from '@tanstack/react-start'

    export const startInstance = createStart(() => {
      return {}
    })
    ```
  - Better Auth handles auth through its own API route, not through request middleware

  **Must NOT do**:
  - Do not add Better Auth middleware here — it's not needed

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 10, 11, 12)
  - **Blocks**: Task 13
  - **Blocked By**: Task 1 (clerk package must be removed)

  **References**:

  **Pattern References**:
  - `src/start.ts:1-9` — Current file. Remove lines 1 (`clerkMiddleware` import) and 6 (`requestMiddleware: [clerkMiddleware()]`).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: start.ts has no Clerk references
    Tool: Bash
    Steps:
      1. Verify no 'clerk' imports in src/start.ts
      2. Verify file still exports startInstance via createStart
    Expected Result: Clean start.ts without Clerk
    Evidence: .sisyphus/evidence/task-9-start.txt
  ```

  **Commit**: YES (groups with 6, 7, 8)
  - Message: `feat: add better auth server and client configuration`
  - Files: `src/start.ts`

---

- [ ] 10. Create saved-searches server functions (src/server/saved-searches.ts)

  **What to do**:
  - Create `src/server/saved-searches.ts` with two server functions:
  - **`listSavedSearches`**: `createServerFn({ method: 'GET' })` — gets session via `auth.api.getSession({ headers })`, queries `savedSearches` table where `userId = session.user.id`, orders by `updatedAt` desc, limits to 20.
  - **`saveSearch`**: `createServerFn({ method: 'POST' })` — gets session, validates input with Zod, checks for existing entry by `(userId, normalizedName)`, upserts (update if exists, insert if not).
  - Use `getRequestHeaders` from `@tanstack/react-start/server` to get headers for session validation
  - Use `eq`, `and` from `drizzle-orm` for where clauses
  - For insert, generate ID with `crypto.randomUUID()`
  - Return types should match the current `SavedSearch` interface from `convex-functions.ts`

  **Must NOT do**:
  - Do not use ConvexHttpClient
  - Do not import from convex packages

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9, 11, 12)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 3, 4, 6

  **References**:

  **Pattern References**:
  - `convex/savedsearches.ts:1-73` — Current Convex implementation. Translate the logic 1:1:
    - `listForCurrentUser` → Drizzle select with userId filter, sort, limit
    - `save` → Drizzle upsert (check existing, patch or insert)
  - `src/lib/convex-functions.ts:4-36` — TypeScript interfaces (`SavedSearch`) and function signatures. Keep the same return shape.
  - `src/server/social.ts:1-69` — Example of `createServerFn` pattern in the codebase. Follow same style.

  **API/Type References**:
  - `src/lib/types.ts` — Does not define SavedSearch (it's in convex-functions.ts). The new server function should export the `SavedSearch` type.

  **External References**:
  - Better Auth server-side session: `auth.api.getSession({ headers })` returns `{ user, session } | null`
  - Drizzle queries: `db.select().from(table).where(eq(col, val))`, `db.insert(table).values({...})`, `db.update(table).set({...}).where(...)`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Server functions compile and have correct signatures
    Tool: Bash
    Steps:
      1. Verify file exports listSavedSearches and saveSearch
      2. Verify listSavedSearches uses auth.api.getSession for auth
      3. Verify saveSearch validates input with Zod
      4. Verify both use Drizzle db queries (not Convex)
      5. TypeScript compiles without errors
    Expected Result: Two server functions with auth + Drizzle queries
    Failure Indicators: Missing auth check, Convex imports
    Evidence: .sisyphus/evidence/task-10-saved-searches.txt

  Scenario: Unauthenticated request returns error
    Tool: Bash
    Steps:
      1. Verify listSavedSearches throws/returns error when no session
      2. Verify saveSearch throws/returns error when no session
    Expected Result: Auth-gated functions reject unauthenticated requests
    Evidence: .sisyphus/evidence/task-10-saved-searches-unauth.txt
  ```

  **Commit**: YES (groups with 11, 12)
  - Message: `feat: add drizzle-based server functions for saved searches, leaderboard, and vibe checks`
  - Files: `src/server/saved-searches.ts`

---

- [ ] 11. Create leaderboard server function (src/server/leaderboard.ts)

  **What to do**:
  - Create `src/server/leaderboard.ts` with one server function:
  - **`getTopNames`**: `createServerFn({ method: 'GET' })` — no auth required. Takes optional `limit` param (default 50, max 100). Queries `savedSearches` table, groups by `normalizedName`, counts saves per name, returns sorted by save count desc.
  - The aggregation logic from `convex/leaderboard.ts` must be replicated:
    - Collect all savedSearches
    - Group by normalizedName
    - Count saves per name, track latest display name and lastSavedAt
    - Sort by saves desc, then lastSavedAt desc
    - Limit results
  - Since Drizzle supports SQL aggregation, use `db.select({ normalizedName, name: sql, saves: count(), lastSavedAt: max() }).from(savedSearches).groupBy(...)` if possible, OR do in-memory aggregation like Convex does (simpler for matching behavior).
  - Export `LeaderboardEntry` type matching current interface.

  **Must NOT do**:
  - Do not require authentication for this endpoint

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9, 10, 12)
  - **Blocks**: Task 16
  - **Blocked By**: Tasks 3, 4

  **References**:

  **Pattern References**:
  - `convex/leaderboard.ts:1-51` — Current implementation. The in-memory aggregation (Map, sort, slice) can be kept as-is, just replace `ctx.db.query('savedSearches').collect()` with `db.select().from(savedSearches)`.
  - `src/lib/convex-functions.ts:13-18` — `LeaderboardEntry` interface. Keep the same shape.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Leaderboard function compiles
    Tool: Bash
    Steps:
      1. Verify file exports getTopNames server function
      2. Verify it does NOT require authentication
      3. Verify it queries savedSearches table via Drizzle
      4. Verify it returns LeaderboardEntry[] shape
    Expected Result: Working leaderboard query function
    Evidence: .sisyphus/evidence/task-11-leaderboard.txt
  ```

  **Commit**: YES (groups with 10, 12)
  - Message: `feat: add drizzle-based server functions for saved searches, leaderboard, and vibe checks`
  - Files: `src/server/leaderboard.ts`

---

- [ ] 12. Rewrite vibe-check.ts — replace ConvexHttpClient with Drizzle

  **What to do**:
  - In `src/server/vibe-check.ts`:
    - Remove all Convex imports: `ConvexHttpClient` from `convex/browser`, `convexEnvSchema` from `@/env`, `getVibeCheckByHashFn`/`upsertVibeCheckFn` from `@/lib/convex-functions`
    - Import `db` from `@/db` and `vibeChecks` from `@/db/schema`
    - Import `eq` from `drizzle-orm`
    - Replace `getConvexClient()` singleton with direct `db` usage
    - Replace `getCachedVibeCheck(inputHash)`:
      ```typescript
      const row = await db.select().from(vibeChecks).where(eq(vibeChecks.inputHash, inputHash)).limit(1)
      return row[0] ? { positivity: row[0].positivity, vibe: row[0].vibe, ... } : null
      ```
    - Replace `saveVibeCheck(args)`:
      ```typescript
      const existing = await db.select().from(vibeChecks).where(eq(vibeChecks.inputHash, args.inputHash)).limit(1)
      if (existing[0]) {
        await db.update(vibeChecks).set({ ...base, updatedAt: new Date() }).where(eq(vibeChecks.id, existing[0].id))
      } else {
        await db.insert(vibeChecks).values({ id: crypto.randomUUID(), ...base, createdAt: new Date(), updatedAt: new Date() })
      }
      ```
  - Keep ALL other logic unchanged: AI prompt, schema validation, hashing, the server function signature, etc.

  **Must NOT do**:
  - Do not change the AI prompt, model config, or vibe schema
  - Do not change the server function's public API (inputs/outputs)
  - Do not import from convex packages

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 6, 7, 8, 9, 10, 11)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 3, 4

  **References**:

  **Pattern References**:
  - `src/server/vibe-check.ts:1-463` — Current file. Only modify the Convex-related parts (lines 4, 6-7, 130-253). Keep everything else.
  - `convex/vibechecks.ts:1-87` — Current Convex query/mutation logic. Translate to Drizzle equivalents.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Vibe check has no Convex imports
    Tool: Bash
    Steps:
      1. Run `grep -c "convex" src/server/vibe-check.ts` — expect 0
      2. Verify imports from '@/db' and '@/db/schema'
      3. Verify checkWordVibe server function still exported
      4. Verify AI prompt and vibeSchema unchanged
    Expected Result: Convex replaced with Drizzle, AI logic preserved
    Failure Indicators: Convex references remain, AI logic changed
    Evidence: .sisyphus/evidence/task-12-vibe-check.txt
  ```

  **Commit**: YES (groups with 10, 11)
  - Message: `feat: add drizzle-based server functions for saved searches, leaderboard, and vibe checks`
  - Files: `src/server/vibe-check.ts`

---

- [ ] 13. Rewrite __root.tsx — remove Clerk/Convex providers

  **What to do**:
  - Remove all Clerk/Convex imports:
    - Remove: `ClerkProvider`, `useAuth` from `@clerk/tanstack-react-start`
    - Remove: `ConvexProviderWithClerk` from `convex/react-clerk`
    - Remove: `convex` import from `@/lib/convex-client`
  - Simplify `RootComponent`:
    ```tsx
    function RootComponent() {
      const { locale } = Route.useRouteContext()
      return (
        <I18nProvider initialLocale={locale}>
          <Outlet />
        </I18nProvider>
      )
    }
    ```
  - No provider wrapper needed for Better Auth — it uses cookie-based sessions
  - Keep ALL other code unchanged: `beforeLoad`, `head()`, `RootDocument`, devtools, analytics, etc.

  **Must NOT do**:
  - Do not modify head metadata, CSS imports, devtools, or analytics
  - Do not add any Better Auth provider (not needed)
  - Do not change the beforeLoad locale detection

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (with Tasks 14, 15, 16 — but only after 13)
  - **Blocks**: Tasks 14, 15, 16
  - **Blocked By**: Tasks 6, 7, 8, 9

  **References**:

  **Pattern References**:
  - `src/routes/__root.tsx:1-103` — Current file. Remove Clerk/Convex imports (lines 1, 11, 15) and simplify RootComponent (lines 63-75).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Root component has no Clerk/Convex references
    Tool: Bash
    Steps:
      1. Run `grep -c "clerk\|convex\|Clerk\|Convex" src/routes/__root.tsx` — expect 0
      2. Verify I18nProvider still wraps Outlet
      3. Verify beforeLoad still calls detectLocale
      4. Verify head() meta tags unchanged
    Expected Result: Clean root layout without auth/db providers
    Failure Indicators: Clerk/Convex references remain
    Evidence: .sisyphus/evidence/task-13-root.txt
  ```

  **Commit**: YES (groups with 14, 15, 16)
  - Message: `feat: migrate UI components from clerk+convex to better-auth+react-query`
  - Files: `src/routes/__root.tsx`

---

- [ ] 14. Rewrite auth-controls.tsx — Better Auth client hooks

  **What to do**:
  - Replace Clerk components with Better Auth hooks:
    - Remove: `SignedIn`, `SignedOut`, `SignInButton`, `UserButton` from `@clerk/tanstack-react-start`
    - Import: `authClient` from `@/lib/auth-client`
    - Use `authClient.useSession()` to get current session state
  - New component logic:
    - If `isPending`: show nothing or a skeleton
    - If no session (signed out): show a "Log in" button that calls `authClient.signIn.email()` or navigates to a sign-in flow
    - If session exists (signed in): show user name/email and a "Sign out" button that calls `authClient.signOut()`
  - Since the current app uses Clerk's modal sign-in (`SignInButton mode="modal"`), the simplest replacement is:
    - Signed out: Button that navigates to a simple inline sign-in form OR uses a dialog-based approach
    - Signed in: User avatar/name + sign out button
  - Keep the same visual style (Button component, size="sm", variant="outline")

  **Must NOT do**:
  - Do not create a separate login page (keep it simple — button + dialog or inline)
  - Do not change Button component imports or styling

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after T13)
  - **Parallel Group**: Wave 3 (with Tasks 15, 16)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 7, 13

  **References**:

  **Pattern References**:
  - `src/components/auth-controls.tsx:1-25` — Current file. Replace entirely but keep same export name `AuthControls`.
  - `src/components/ui/button.tsx` — Button component used. Keep same usage.
  - `src/components/ui/dialog.tsx` — Dialog component available for sign-in modal if needed.

  **External References**:
  - Better Auth React hooks: `authClient.useSession()` returns `{ data: session, isPending, error }`
  - Sign in: `authClient.signIn.email({ email, password })`
  - Sign out: `authClient.signOut()`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Auth controls component compiles
    Tool: Bash
    Steps:
      1. Verify no Clerk imports in file
      2. Verify authClient imported from '@/lib/auth-client'
      3. Verify useSession hook is used
      4. Verify sign out button calls authClient.signOut()
      5. TypeScript compiles
    Expected Result: Working auth controls with Better Auth
    Evidence: .sisyphus/evidence/task-14-auth-controls.txt
  ```

  **Commit**: YES (groups with 13, 15, 16)
  - Message: `feat: migrate UI components from clerk+convex to better-auth+react-query`
  - Files: `src/components/auth-controls.tsx`

---

- [ ] 15. Rewrite saved-searches-panel.tsx — server fns + React Query

  **What to do**:
  - Remove all Clerk/Convex imports:
    - Remove: `SignedIn`, `SignedOut`, `useAuth` from `@clerk/tanstack-react-start`
    - Remove: `useMutation`, `useQuery` from `convex/react`
    - Remove: `listSavedSearchesFn`, `saveSearchFn` from `@/lib/convex-functions`
  - Replace with Better Auth + server functions + React Query:
    - Import: `authClient` from `@/lib/auth-client`
    - Import: `useQuery`, `useMutation`, `useQueryClient` from `@tanstack/react-query`
    - Import: `listSavedSearches`, `saveSearch` from `@/server/saved-searches`
  - Replace `useAuth()` with `authClient.useSession()`
  - Replace Convex `useQuery(listSavedSearchesFn)` with React Query `useQuery({ queryKey: ['saved-searches'], queryFn: () => listSavedSearches() })`
  - Replace Convex `useMutation(saveSearchFn)` with React Query `useMutation({ mutationFn: (args) => saveSearch({ data: args }), onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-searches'] }) })`
  - Replace `<SignedOut>` with conditional: `if (!session) return <div>Sign in to save searches.</div>`
  - Replace `<SignedIn>` with conditional: `if (session) return <section>...</section>`
  - Keep all JSX structure, Link components, and styling unchanged

  **Must NOT do**:
  - Do not change the visual design or layout
  - Do not modify Link/navigation behavior
  - Do not use setState inside useEffect

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after T13)
  - **Parallel Group**: Wave 3 (with Tasks 14, 16)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 7, 10, 13

  **References**:

  **Pattern References**:
  - `src/components/saved-searches-panel.tsx:1-118` — Current file. Replace auth/data hooks but keep all JSX structure.
  - `src/hooks/use-name-check.ts:1-10` — Shows how React Query `useQuery` is already used in the codebase. Follow same pattern.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Saved searches panel compiles without Clerk/Convex
    Tool: Bash
    Steps:
      1. Run `grep -c "clerk\|convex\|Clerk\|Convex" src/components/saved-searches-panel.tsx` — expect 0
      2. Verify authClient.useSession() is used
      3. Verify useQuery from @tanstack/react-query is used for list
      4. Verify useMutation from @tanstack/react-query is used for save
      5. Verify Link components still navigate to /$name
    Expected Result: Panel uses Better Auth + React Query
    Failure Indicators: Clerk/Convex references, broken navigation
    Evidence: .sisyphus/evidence/task-15-saved-searches-panel.txt
  ```

  **Commit**: YES (groups with 13, 14, 16)
  - Message: `feat: migrate UI components from clerk+convex to better-auth+react-query`
  - Files: `src/components/saved-searches-panel.tsx`

---

- [ ] 16. Rewrite leaderboard.tsx — server fns + React Query

  **What to do**:
  - Remove Convex import: `useQuery` from `convex/react`, `leaderboardTopNamesFn` from `@/lib/convex-functions`
  - Replace with React Query + server function:
    - Import: `useQuery` from `@tanstack/react-query`
    - Import: `getTopNames` from `@/server/leaderboard`
  - Replace `useQuery(leaderboardTopNamesFn, { limit: 50 })` with:
    ```typescript
    const { data: entries, isLoading } = useQuery({
      queryKey: ['leaderboard', 50],
      queryFn: () => getTopNames({ data: { limit: 50 } }),
    })
    ```
  - Update the loading/empty/list conditional logic:
    - Convex returns `undefined` while loading → React Query uses `isLoading`
    - Replace `entries === undefined` check with `isLoading`
  - Keep ALL JSX structure, styling, formatDate helper, error component, and layout unchanged

  **Must NOT do**:
  - Do not change UI layout or styling
  - Do not change the LeaderboardError component

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (after T13)
  - **Parallel Group**: Wave 3 (with Tasks 14, 15)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 7, 11, 13

  **References**:

  **Pattern References**:
  - `src/routes/leaderboard.tsx:1-171` — Current file. Replace Convex hooks (lines 7, 11, 65) with React Query + server function.
  - `src/hooks/use-name-check.ts:1-10` — Existing React Query pattern in codebase.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Leaderboard page compiles without Convex
    Tool: Bash
    Steps:
      1. Run `grep -c "convex" src/routes/leaderboard.tsx` — expect 0
      2. Verify useQuery from @tanstack/react-query is used
      3. Verify getTopNames imported from server function
      4. Verify loading/empty/list conditionals still work
    Expected Result: Leaderboard uses React Query + server fn
    Evidence: .sisyphus/evidence/task-16-leaderboard.txt
  ```

  **Commit**: YES (groups with 13, 14, 15)
  - Message: `feat: migrate UI components from clerk+convex to better-auth+react-query`
  - Files: `src/routes/leaderboard.tsx`

---

- [ ] 17. Delete Convex files and old client/function files

  **What to do**:
  - Delete the entire `convex/` directory:
    - `convex/schema.ts`
    - `convex/savedsearches.ts`
    - `convex/vibechecks.ts`
    - `convex/leaderboard.ts`
    - `convex/tsconfig.json`
    - `convex/README.md`
    - `convex/_generated/` (entire directory)
  - Delete `src/lib/convex-client.ts`
  - Delete `src/lib/convex-functions.ts`
  - Verify NO remaining imports reference any of these deleted files

  **Must NOT do**:
  - Do not delete any other files

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 18)
  - **Blocks**: Task 19
  - **Blocked By**: Tasks 13, 14, 15, 16

  **References**:

  **Pattern References**:
  - `convex/` — Entire directory to delete
  - `src/lib/convex-client.ts` — File to delete
  - `src/lib/convex-functions.ts` — File to delete

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All Convex files removed
    Tool: Bash
    Steps:
      1. Verify `convex/` directory does not exist
      2. Verify `src/lib/convex-client.ts` does not exist
      3. Verify `src/lib/convex-functions.ts` does not exist
      4. Run `grep -r "convex" src/ --include="*.ts" --include="*.tsx"` — expect 0 matches
    Expected Result: No Convex files or references in codebase
    Failure Indicators: Files still exist, dangling imports
    Evidence: .sisyphus/evidence/task-17-delete-convex.txt
  ```

  **Commit**: YES (groups with 18)
  - Message: `chore: remove convex files and update deployment config`
  - Files: (deleted files + verified no orphan imports)

---

- [ ] 18. Update vercel.json + SETUP.md

  **What to do**:
  - **vercel.json**: Remove `convex deploy` from buildCommand. The new build command:
    ```json
    {
      "$schema": "https://openapi.vercel.sh/vercel.json",
      "installCommand": "bun install",
      "buildCommand": "NITRO_PRESET=vercel bun run build",
      "devCommand": "bun run dev"
    }
    ```
    Remove the entire `if` conditional that checks `VERCEL_ENV` for convex deploy.
  - **SETUP.md**: Rewrite entirely for the new stack:
    - Auth: Better Auth (self-hosted, cookie-based)
    - Database: Drizzle ORM + Planetscale Postgres
    - Package manager: Bun
    - Required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `AI_GATEWAY_API_KEY` (optional)
    - Local dev: `bun install` → create `.env.local` with DATABASE_URL and BETTER_AUTH_SECRET → `bun run dev`
    - Migrations: `bunx drizzle-kit generate` → `bunx drizzle-kit migrate` → `bunx drizzle-kit push`
    - Production deploy: `vercel deploy --prod`
    - Remove ALL Clerk and Convex references
  - Remove `convex:dev` and `convex:deploy` from `package.json` scripts
  - Add `db:generate`, `db:migrate`, `db:push`, `db:studio` scripts to package.json:
    ```json
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
    ```

  **Must NOT do**:
  - Do not change the deploy strategy beyond removing Convex

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Task 17)
  - **Blocks**: Task 19
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `vercel.json:1-7` — Current file. Simplify buildCommand.
  - `SETUP.md:1-122` — Current file. Rewrite for new stack.
  - `package.json:6-16` — Scripts section. Remove convex:*, add db:*.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Config files updated correctly
    Tool: Bash
    Steps:
      1. Verify vercel.json has no "convex" references
      2. Verify SETUP.md mentions Better Auth, Drizzle, Planetscale
      3. Verify SETUP.md has no Clerk or Convex references
      4. Verify package.json has db:generate, db:migrate, db:push scripts
      5. Verify package.json has no convex:dev, convex:deploy scripts
    Expected Result: Config files reflect new stack
    Evidence: .sisyphus/evidence/task-18-config.txt
  ```

  **Commit**: YES (groups with 17)
  - Message: `chore: remove convex files and update deployment config`
  - Files: `vercel.json`, `SETUP.md`, `package.json`

---

- [ ] 19. Build verification + fix remaining issues

  **What to do**:
  - Run `bun run build` and fix ALL errors
  - Run `bun run lint` (or `bunx ultracite check .`) and fix issues
  - Common expected issues to check:
    - `routeTree.gen.ts` may need regeneration (run `bun run dev` briefly or the tanstack router codegen)
    - Import paths for deleted files
    - TypeScript errors from type mismatches
    - Missing type exports
  - Verify no remaining references to `clerk`, `convex`, `Clerk`, `Convex` anywhere in `src/`
  - Run `grep -r "clerk\|convex\|Clerk\|Convex" src/ --include="*.ts" --include="*.tsx"` — must return 0 matches
  - If any env var references are broken, fix them

  **Must NOT do**:
  - Do not add new features
  - Do not change UI beyond fixing compile errors

  **Recommended Agent Profile**:
  - **Category**: `deep`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (after all Wave 4 tasks)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 17, 18

  **References**:

  **Pattern References**:
  - All files modified in Tasks 1-18

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full project builds successfully
    Tool: Bash
    Steps:
      1. Run `bun run build`
      2. Verify exit code 0
      3. Run `grep -r "clerk\|convex" src/ --include="*.ts" --include="*.tsx"` — expect 0 matches
      4. Run `grep -r "clerk\|convex" src/ --include="*.tsx"` — expect 0 matches
    Expected Result: Clean build, zero Clerk/Convex references
    Failure Indicators: Build fails, dangling references
    Evidence: .sisyphus/evidence/task-19-build.txt

  Scenario: Lint passes
    Tool: Bash
    Steps:
      1. Run `bun run lint`
      2. Verify no errors (warnings OK)
    Expected Result: Lint clean
    Evidence: .sisyphus/evidence/task-19-lint.txt
  ```

  **Commit**: YES
  - Message: `fix: resolve build errors after migration`
  - Files: (whatever needs fixing)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check exports, verify patterns). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `bun run build` + `bun run lint`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify Zod validation on all server function inputs.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill if UI)
  Start from clean state. Test: 1) App loads at `/`, 2) Search form works and navigates to `/$name`, 3) All section widgets render (domains, social, packages, github, vibe check, dictionary, etc.), 4) Auth controls visible, 5) Leaderboard page loads at `/leaderboard`. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| After Tasks | Message | Files | Verification |
|-------------|---------|-------|--------------|
| 1-5 | `chore: replace clerk+convex deps with better-auth+drizzle+postgres` | package.json, bun.lock, src/env*.ts, src/db/*, drizzle.config.ts, .gitignore | `bun install` succeeds |
| 6-9 | `feat: add better auth server and client configuration` | src/lib/auth.ts, src/lib/auth-client.ts, src/routes/api/auth/$.ts, src/start.ts | TS compiles |
| 10-12 | `feat: add drizzle-based server functions for saved searches, leaderboard, and vibe checks` | src/server/saved-searches.ts, src/server/leaderboard.ts, src/server/vibe-check.ts | TS compiles |
| 13-16 | `feat: migrate UI components from clerk+convex to better-auth+react-query` | src/routes/__root.tsx, src/components/auth-controls.tsx, src/components/saved-searches-panel.tsx, src/routes/leaderboard.tsx | TS compiles |
| 17-18 | `chore: remove convex files and update deployment config` | convex/ (deleted), src/lib/convex-*.ts (deleted), vercel.json, SETUP.md, package.json | No orphan imports |
| 19 | `fix: resolve build errors after migration` | (varies) | `bun run build` passes |

---

## Success Criteria

### Verification Commands
```bash
bun run build              # Expected: exit code 0
bun run lint               # Expected: no errors
grep -r "clerk" src/       # Expected: 0 matches
grep -r "convex" src/      # Expected: 0 matches
ls convex/                 # Expected: No such directory
```

### Final Checklist
- [ ] All "Must Have" present (Better Auth, Drizzle schema, server functions, auth controls)
- [ ] All "Must NOT Have" absent (no social auth, no email verification, no UI changes, no Clerk/Convex)
- [ ] Build succeeds with zero errors
- [ ] No Clerk or Convex references in source code
- [ ] All server functions use Drizzle queries
- [ ] Auth controls use Better Auth client hooks
- [ ] Saved searches panel uses React Query + server functions
- [ ] Leaderboard uses React Query + server function
- [ ] Vibe check caching uses Drizzle instead of ConvexHttpClient
- [ ] Environment variables validated by Zod

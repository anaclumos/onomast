# Better Auth + Drizzle Migration Learnings

## Task 1: Package Updates ✅

### Removed
- `@clerk/tanstack-react-start` - Clerk authentication library
- `convex` - Convex backend platform

### Added
- `better-auth@1.4.18` - Modern authentication library
- `drizzle-orm@0.45.1` - TypeScript ORM for databases
- `postgres@3.4.8` - PostgreSQL client
- `drizzle-kit@0.31.9` (devDependency) - Drizzle schema migration tool

### Key Insights
1. All packages installed successfully with bun
2. No dependency conflicts detected
3. Drizzle-kit provides CLI tools for schema management
4. Better-auth is a lightweight auth solution (vs Clerk's managed service)
5. Direct postgres driver + drizzle-orm = full control over database layer

### Next Steps
- Task 2: Set up database schema with Drizzle
- Task 3: Configure Better Auth
- Task 4: Create auth routes

## Task 5: Create drizzle.config.ts ✅

### Configuration Created
- File: `drizzle.config.ts` at project root
- Schema path: `./src/db/schema.ts` (will be created in Task 2)
- Output directory: `./drizzle` (migration files)
- Dialect: `postgresql`
- DB credentials: Uses `process.env.DATABASE_URL!` (non-null assertion)

### .gitignore Updated
- Added `drizzle/` entry to ignore migration output directory
- Prevents generated migration files from being committed

### Key Insights
1. Drizzle Kit config is minimal and straightforward
2. Schema path is relative to project root
3. Environment variable is required at runtime (non-null assertion)
4. Migration output directory should be ignored from version control
5. Config is ready for `drizzle-kit generate` and `drizzle-kit push` commands

### Next Steps
- Task 2: Create database schema (src/db/schema.ts)
- Task 3: Configure Better Auth
- Task 4: Create auth routes

## Task 2: Environment Variable Schema Updates ✅

### Key Findings

1. **Client Environment Variables**
   - Better Auth does NOT require client-side environment variables (unlike Clerk)
   - `clientEnvSchema` is now an empty object: `z.object({})`
   - `clientEnv.parse({})` is valid and safe for this architecture

2. **Server Environment Variables**
   - Replaced `CLERK_SECRET_KEY` with `DATABASE_URL` and `BETTER_AUTH_SECRET`
   - Both new vars use `z.string().min(1)` for validation
   - Preserved `NODE_ENV` and `AI_GATEWAY_API_KEY` as required

3. **Removed Artifacts**
   - Deleted `convexEnvSchema` and `ConvexEnv` type entirely
   - No Convex-related environment variables needed in new stack

4. **Pattern Preservation**
   - Maintained Zod validation pattern from original implementation
   - Kept `getServerEnv()` function pattern in `src/env.server.ts`
   - Type inference via `z.infer<typeof schema>` remains consistent

### Environment Variable Mapping

| Old (Clerk/Convex) | New (Better Auth/Drizzle) | Type | Required |
|---|---|---|---|
| VITE_CLERK_PUBLISHABLE_KEY | (removed) | - | - |
| VITE_CONVEX_URL | (removed) | - | - |
| CLERK_SECRET_KEY | BETTER_AUTH_SECRET | string | ✓ |
| - | DATABASE_URL | string | ✓ |
| NODE_ENV | NODE_ENV | enum | ✓ |
| AI_GATEWAY_API_KEY | AI_GATEWAY_API_KEY | string | ✗ |

### Files Modified
- `src/env.ts` (17 lines, down from 25)
- `src/env.client.ts` (6 lines, unchanged structure)
- `src/env.server.ts` (9 lines, unchanged structure)

### Next Steps
- Task 3: Create database schema (src/db/schema.ts)
- Task 4: Configure Better Auth
- Task 5: Create auth routes

## Task 4: Database Connection (src/db/index.ts) ✅

### Pattern: Planetscale-Compatible Postgres Connection

**File Created**: `src/db/index.ts`

```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

const client = postgres(process.env.DATABASE_URL!, { prepare: false })
export const db = drizzle(client, { schema })
```

### Key Decisions

1. **Package Choice**: `postgres` (not `pg` Pool)
   - Simpler API, better for serverless environments
   - Lighter weight than pg driver
   - Direct connection pooling support

2. **Planetscale Compatibility**: `prepare: false` option
   - Planetscale Postgres does NOT support prepared statements
   - This option is REQUIRED for compatibility
   - Without it, queries will fail on Planetscale

3. **Environment Variable Handling**
   - Direct `process.env.DATABASE_URL!` usage (non-null assertion)
   - Avoids circular dependency (db is used by auth which may be used before env validation)
   - Env validation happens at app startup via `env.server.ts`
   - This pattern is safe because DATABASE_URL is validated before any db operations

4. **Schema Import Pattern**
   - `import * as schema from './schema'` allows Drizzle to access all table definitions
   - Passed to drizzle constructor: `drizzle(client, { schema })`
   - Enables type-safe queries and automatic relation inference

### Blocking Dependencies
- **Blocks**: Tasks 6 (Better Auth config), 10 (saved-searches), 11 (leaderboard), 12 (vibe-check)
- **Blocked By**: Task 3 (schema must exist for import)

### Next Steps
- Task 3: Create database schema (src/db/schema.ts) - MUST be done before this works
- Task 6: Create Better Auth server config (uses this db connection)
- Task 10: Create saved-searches server functions (uses this db connection)

## Wave 1 Commit ✅

### Commit Details
- **Hash**: `3c216799866875400c731ebbe65d8c8e01a41465`
- **Message**: `chore: replace clerk+convex deps with better-auth+drizzle+postgres`
- **Date**: Tue Feb 17 00:24:36 2026 +0900
- **Files Changed**: 8 files, 357 insertions(+), 100 deletions(-)

### Files Committed
1. `.gitignore` - Added `drizzle/` entry
2. `bun.lock` - Updated lock file with new dependencies
3. `package.json` - Replaced clerk+convex with better-auth+drizzle+postgres
4. `src/env.ts` - Updated environment schema (removed Convex, added DATABASE_URL + BETTER_AUTH_SECRET)
5. `src/env.client.ts` - Simplified (no client env vars needed)
6. `src/env.server.ts` - Updated server env schema
7. `src/db/schema.ts` - Created Better Auth + app schema (121 lines)
8. `src/db/index.ts` - Created database connection (7 lines)
9. `drizzle.config.ts` - Created Drizzle configuration

### Linting Fixes Applied
- Replaced non-null assertions (`!`) with nullish coalescing (`??`) in:
  - `drizzle.config.ts`: `process.env.DATABASE_URL ?? ''`
  - `src/db/index.ts`: `process.env.DATABASE_URL ?? ''`
- Added biome suppression comment for namespace import in `src/db/index.ts`:
  - `// biome-ignore lint/performance/noNamespaceImport: Drizzle requires schema namespace`
  - Drizzle ORM requires schema to be passed as namespace object

### Wave 1 Complete
All Tasks 1-5 successfully committed. Ready for Wave 2 (Better Auth configuration).

## Task 7: Create Better Auth React Client (src/lib/auth-client.ts) ✅

### File Created
- **Location**: `src/lib/auth-client.ts`
- **Size**: 6 lines
- **Status**: Complete

### Implementation Pattern

```typescript
import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
})
```

### Key Design Decisions

1. **SSR Guard**: `typeof window !== 'undefined'`
   - Prevents errors in server-side rendering contexts
   - Returns `undefined` on server, `window.location.origin` on client
   - Allows safe import in both server and client components

2. **Dynamic baseURL**: `window.location.origin`
   - No hardcoded URLs (works in dev, staging, production)
   - Automatically uses current domain
   - Better Auth client uses this to make API calls to `/api/auth/*` endpoints

3. **No Plugins in Client Config**
   - Client config is minimal (only baseURL)
   - Plugins are configured on server-side only (in Task 6)
   - Keeps client bundle lean

4. **Export Pattern**: Named export `authClient`
   - Components use: `authClient.useSession()`, `authClient.signIn.email()`, etc.
   - Consistent with Better Auth React integration pattern
   - Type-safe hooks and methods

### Unblocks
- Task 13: Create sign-in page (uses `authClient.signIn.email()`)
- Task 14: Create sign-up page (uses `authClient.signUp.email()`)
- Task 15: Create sign-out functionality (uses `authClient.signOut()`)
- Task 16: Create session provider (uses `authClient.useSession()`)

### Verification
✅ File created with exact pattern
✅ SSR guard implemented correctly
✅ No hardcoded baseURL
✅ No plugins in client config
✅ TypeScript syntax valid
✅ Export named as 'authClient'

## Task 9: Rewrite src/start.ts — Remove Clerk Middleware ✅

### File Transformation

**Before**:
```typescript
import { clerkMiddleware } from '@clerk/tanstack-react-start/server'
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => {
  return {
    requestMiddleware: [clerkMiddleware()],
  }
})
```

**After**:
```typescript
import { createStart } from '@tanstack/react-start'

export const startInstance = createStart(() => {
  return {}
})
```

### Key Insights

1. **Middleware Not Needed for Better Auth**
   - Clerk uses request middleware to inject auth context
   - Better Auth handles authentication via API route (`/api/auth/$`)
   - No middleware required in `start.ts`

2. **Minimal Configuration Pattern**
   - `start.ts` becomes a simple factory function
   - Returns empty config object `{}`
   - TanStack Start handles routing and request handling separately

3. **Architecture Difference**
   - **Clerk**: Middleware-based auth injection (request → middleware → context)
   - **Better Auth**: Route-based auth (dedicated `/api/auth/$` endpoint)
   - This allows cleaner separation of concerns

### Verification Results
- ✓ Clerk import removed
- ✓ Clerk middleware removed from config
- ✓ No Clerk references remain in file
- ✓ `createStart` import preserved
- ✓ `startInstance` export preserved
- ✓ File structure matches specification

### Dependencies
- **Unblocks**: Task 13 (__root.tsx rewrite)
- **Blocked By**: None (independent task)

## Task 11: Create Leaderboard Server Function (src/server/leaderboard.ts) ✅

### File Created
- **Location**: `src/server/leaderboard.ts`
- **Size**: 49 lines
- **Status**: Complete

### Implementation Pattern

```typescript
import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { savedSearches } from '@/db/schema'

export type LeaderboardEntry = {
  normalizedName: string
  name: string
  saves: number
  lastSavedAt: number
}

export const getTopNames = createServerFn({ method: 'GET' }).handler(
  async (limit?: number): Promise<LeaderboardEntry[]> => {
    const constrainedLimit = Math.max(1, Math.min(limit ?? 50, 100))
    const allSearches = await db.select().from(savedSearches)
    const nameMap = new Map<string, LeaderboardEntry>()

    for (const search of allSearches) {
      const existing = nameMap.get(search.normalizedName)
      const updatedAtTime = search.updatedAt.getTime()

      if (!existing) {
        nameMap.set(search.normalizedName, {
          normalizedName: search.normalizedName,
          name: search.name,
          saves: 1,
          lastSavedAt: updatedAtTime,
        })
        continue
      }

      existing.saves += 1
      if (updatedAtTime > existing.lastSavedAt) {
        existing.lastSavedAt = updatedAtTime
        existing.name = search.name
      }
    }

    return Array.from(nameMap.values())
      .sort((a, b) => {
        if (b.saves !== a.saves) {
          return b.saves - a.saves
        }
        return b.lastSavedAt - a.lastSavedAt
      })
      .slice(0, constrainedLimit)
  }
)
```

### Key Design Decisions

1. **Import Path**: `@tanstack/react-start` (not `/server`)
   - Matches pattern in `detect-locale.ts` and `dictionary.ts`
   - Correct export location for `createServerFn`

2. **Public Endpoint**: No authentication required
   - Leaderboard is public data (aggregated search popularity)
   - No auth check in handler
   - Accessible to all users

3. **In-Memory Aggregation Pattern**
   - Fetches all `savedSearches` records
   - Uses `Map<normalizedName, LeaderboardEntry>` for grouping
   - Counts saves per normalized name
   - Tracks latest display name and timestamp
   - Matches Convex implementation exactly

4. **Timestamp Handling**: `search.updatedAt.getTime()`
   - Drizzle returns `Date` objects from `timestamp` columns
   - `.getTime()` converts to milliseconds (matches Convex `_creationTime`)
   - Enables numeric sorting by recency

5. **Limit Validation**: `Math.max(1, Math.min(limit ?? 50, 100))`
   - Default: 50 entries
   - Maximum: 100 entries
   - Minimum: 1 entry
   - Prevents invalid ranges

6. **Sorting Strategy**:
   - Primary: By saves count (descending)
   - Secondary: By lastSavedAt timestamp (descending)
   - Ensures consistent ordering for tied entries

### Convex → Drizzle Translation

| Convex | Drizzle | Notes |
|--------|---------|-------|
| `ctx.db.query('savedSearches').collect()` | `db.select().from(savedSearches)` | Fetch all records |
| `row._creationTime` | `row.updatedAt.getTime()` | Timestamp in milliseconds |
| `queryGeneric` handler | `createServerFn().handler()` | Server function pattern |
| No auth required | No auth check | Public endpoint |

### Type Exports

- **LeaderboardEntry**: Matches interface from `src/lib/convex-functions.ts`
  - `normalizedName: string` - Grouped search name
  - `name: string` - Latest display name for this search
  - `saves: number` - Total save count
  - `lastSavedAt: number` - Timestamp of most recent save (milliseconds)

### Verification Results
✅ File created with correct syntax
✅ Imports match existing server function patterns
✅ Type exports match LeaderboardEntry interface
✅ No Convex dependencies
✅ Public endpoint (no auth)
✅ Limit parameter with validation
✅ In-memory aggregation logic matches Convex
✅ Timestamp conversion correct (Date.getTime())

### Unblocks
- Task 16: Create leaderboard.tsx UI (uses `getTopNames` server function)

## Task 12: Rewrite vibe-check.ts — Replace ConvexHttpClient with Drizzle ✅

### Convex → Drizzle Translation

| Convex | Drizzle | Notes |
|--------|---------|-------|
| `ConvexHttpClient` singleton | Direct `db` import | No lazy init needed |
| `client.query(getVibeCheckByHashFn, { inputHash })` | `db.select().from(vibeChecks).where(eq(vibeChecks.inputHash, inputHash)).limit(1)` | Returns array, take `[0]` |
| `client.mutation(upsertVibeCheckFn, { ... })` | Select existing → update or insert | Manual upsert pattern |
| `convexEnvSchema.safeParse(process.env)` | (removed) | DB connection handled in `@/db` |

### Key Insights

1. **No More Null Client Guard**: Convex used `getConvexClient()` returning null when env vars missing. Drizzle's `db` is always available (connection failure is a runtime error, not a config check).

2. **Upsert Pattern**: Drizzle doesn't have a built-in upsert for Postgres text arrays. Used select-then-update-or-insert pattern matching the original Convex mutation logic.

3. **Timestamp Handling**: Convex used `Date.now()` (milliseconds). Drizzle schema uses `timestamp` columns with `new Date()` objects. The schema has `defaultNow()` on both `createdAt` and `updatedAt`.

4. **Select Projection for Upsert**: Used `db.select({ id: vibeChecks.id })` instead of `db.select()` for the existence check — minimal read, only need the ID for the WHERE clause.

5. **Fire-and-Forget Pattern Preserved**: `saveVibeCheck(...).catch(() => undefined)` in `generateVibeCheck()` remains unchanged — cache write failures are silently swallowed.

### Verification
- Zero Convex references in file
- All AI prompt logic, schemas, hashing unchanged
- `checkWordVibe` export signature preserved

## Task 8: Create Auth API Route (src/routes/api/auth/$.ts) ✅

### File Created
- **Location**: `src/routes/api/auth/$.ts`
- **Size**: 16 lines
- **Status**: Complete

### Implementation Pattern

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

### Key Design Decisions

1. **Catch-All Route**: `$` filename
   - TanStack Router's catch-all syntax
   - Matches all routes under `/api/auth/*`
   - Examples: `/api/auth/signin`, `/api/auth/signup`, `/api/auth/signout`, etc.

2. **Route Path**: `/api/auth/$`
   - Exact path required by Better Auth
   - All auth operations routed through this endpoint
   - Better Auth's handler processes sign-in, sign-up, sign-out, session refresh, etc.

3. **Dual Handler Pattern**: GET and POST
   - Both handlers delegate to `auth.handler(request)`
   - Better Auth's handler is method-agnostic
   - Supports all HTTP methods needed for auth flows

4. **Server-Side Only**: `server.handlers` pattern
   - Follows TanStack Router's server function pattern
   - Matches existing API route pattern (src/routes/api/og.ts)
   - No client-side code in this route

5. **Request Parameter**: `{ request: Request }`
   - Explicit type annotation for clarity
   - TanStack Router provides Request object
   - Better Auth's handler expects standard Web Request

### Pattern Reference
Follows exact structure from `src/routes/api/og.ts`:
```typescript
export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: async ({ request }) => { ... },
    },
  },
})
```

### Verification Results
✅ Directory created: `src/routes/api/auth/`
✅ File created: `src/routes/api/auth/$.ts`
✅ Imports correct (createFileRoute, auth)
✅ Route path: `/api/auth/$`
✅ GET handler present
✅ POST handler present
✅ Both handlers delegate to `auth.handler(request)`
✅ TypeScript: No errors
✅ No extra middleware or logic
✅ Follows existing API route pattern

### Unblocks
- Task 13: Create __root.tsx (needs auth route to be available)
- Task 14+: All auth-dependent features

### Dependencies
- **Requires**: Task 6 (Better Auth server config in src/lib/auth.ts) ✅
- **Requires**: Task 7 (Better Auth client in src/lib/auth-client.ts) ✅

## Task 10: Create Saved-Searches Server Functions (src/server/saved-searches.ts) ✅

### File Created
- **Location**: `src/server/saved-searches.ts`
- **Size**: ~90 lines
- **Status**: Complete

### Exports
- `listSavedSearches`: GET server function, authenticated
- `saveSearch`: POST server function, authenticated, Zod-validated input
- `SavedSearch` type: `{ id, name, description, region, language, latinName }`

### Auth Pattern Established

```typescript
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

// Inside handler:
const headers = getRequestHeaders()
const session = await auth.api.getSession({ headers })
if (!session?.user) throw new Error('Unauthorized')
```

### Key Design Decisions

1. **Headers Import**: `getRequestHeaders` from `@tanstack/react-start/server`
   - Re-exported from `@tanstack/start-server-core` → `react-start-server` → `react-start/server`
   - Returns `TypedHeaders<RequestHeaderMap>` (compatible with Better Auth's headers param)
   - NOT available from `@tanstack/react-start` main entry (that re-exports client-core only)

2. **Validator Method**: `.inputValidator()` (not `.validator()`)
   - Matches ALL existing server functions: social.ts, packages.ts, dictionary.ts, etc.
   - Accepts Zod schema directly

3. **SavedSearch Type**: Uses `null` (not `undefined`) for optional fields
   - Drizzle schema uses nullable text columns → returns `string | null`
   - Differs from Convex interface which used `string | undefined`

4. **Upsert Pattern**: Select-then-update-or-insert
   - Matches Convex `save` mutation logic exactly
   - Uses unique index `(userId, normalizedName)` for deduplication
   - On update: sets all fields + updatedAt
   - On insert: relies on schema $defaultFn for id, defaultNow() for timestamps

5. **Optional → Null Mapping**: `data.description ?? null`
   - Zod `.optional()` produces `string | undefined`
   - Drizzle nullable columns need `string | null`
   - Explicit coercion with `?? null`

### Convex → Drizzle Translation

| Convex | Drizzle | Notes |
|--------|---------|-------|
| `ctx.auth.getUserIdentity()` | `auth.api.getSession({ headers })` | Better Auth session |
| `identity.subject` | `session.user.id` | User ID |
| `ctx.db.query('savedSearches').withIndex('by_user', ...)` | `db.select().from(savedSearches).where(eq(...))` | Index query |
| `ctx.db.patch(existing._id, {...})` | `db.update(savedSearches).set({...}).where(eq(...))` | Update |
| `ctx.db.insert('savedSearches', {...})` | `db.insert(savedSearches).values({...})` | Insert |
| `.sort((a,b) => b.updatedAt - a.updatedAt)` | `.orderBy(desc(savedSearches.updatedAt))` | SQL ordering |

### Verification Results
- LSP diagnostics: 0 errors
- tsc --noEmit: No errors in src/server/saved-searches.ts
- grep convex: No Convex imports found

### Unblocks
- Task 15: saved-searches-panel.tsx UI rewrite (uses these server functions)

## Task 13: Rewrite __root.tsx — Remove Clerk/Convex Providers ✅

### Changes
- Removed 3 imports: `ClerkProvider`, `useAuth`, `ConvexProviderWithClerk`, `convex` client
- Simplified `RootComponent`: Only `I18nProvider` wrapping `Outlet` (no auth/db providers)
- File reduced from 103 → 96 lines

### Key Insight
- Better Auth uses cookie-based sessions → NO provider component needed
- Convex replaced by server functions → NO ConvexProvider needed
- `I18nProvider` is the only wrapper remaining in the component tree
- This is a significant architectural simplification: 3 nested providers → 1

### Preserved
- `beforeLoad` locale detection
- `head()` metadata (OG, Twitter, viewport)
- `RootDocument` (devtools, analytics, scripts, EscapeInAppBrowser)
- CSS import

### Unblocks
- Task 14: Sign-in/sign-up pages
- Task 15: Saved searches panel UI
- Task 16: Leaderboard UI

## Task 14: Rewrite auth-controls.tsx — Better Auth Client Hooks ✅

### File Transformation

**Before** (Clerk):
```typescript
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/tanstack-react-start'
import { Button } from '@/components/ui/button'

export function AuthControls() {
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <Button size="sm" variant="outline">
            Log in
          </Button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}
```

**After** (Better Auth):
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function AuthControls() {
  const { data: session, isPending } = authClient.useSession()
  const [isSigningOut, setIsSigningOut] = useState(false)

  if (isPending) {
    return null
  }

  if (!session) {
    return (
      <Button
        onClick={() => {
          window.location.href = '/auth/signin'
        }}
        size="sm"
        variant="outline"
      >
        Log in
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs">
        {session.user.name || session.user.email}
      </span>
      <Button
        disabled={isSigningOut}
        onClick={async () => {
          setIsSigningOut(true)
          try {
            await authClient.signOut()
            window.location.href = '/'
          } finally {
            setIsSigningOut(false)
          }
        }}
        size="sm"
        variant="outline"
      >
        {isSigningOut ? 'Signing out...' : 'Sign out'}
      </Button>
    </div>
  )
}
```

### Key Implementation Details

1. **Client Component**: `'use client'` directive required
   - `authClient.useSession()` is a React hook (client-only)
   - `useState` for managing sign-out loading state

2. **Session Hook**: `authClient.useSession()`
   - Returns: `{ data: session, isPending, error }`
   - `isPending`: True while session is loading
   - `session`: null when not authenticated, contains user data when authenticated

3. **Conditional Rendering**:
   - **Loading**: `if (isPending) return null` (no UI while fetching)
   - **Unauthenticated**: "Log in" button → navigates to `/auth/signin`
   - **Authenticated**: User info + "Sign out" button

4. **Sign-out Flow**:
   - `authClient.signOut()` clears session
   - Redirect to `/` after sign-out
   - Loading state: "Signing out..." text during request
   - Error handling: finally block ensures state reset

5. **Styling Preserved**:
   - Button: `size="sm"`, `variant="outline"` (same as Clerk version)
   - User info: `text-xs text-muted-foreground`
   - Layout: `flex items-center gap-2`

### Clerk → Better Auth Translation

| Clerk | Better Auth | Notes |
|-------|-------------|-------|
| `<SignedOut>` | `if (!session)` | Conditional rendering |
| `<SignedIn>` | `if (session)` | Conditional rendering |
| `<SignInButton mode="modal">` | `window.location.href = '/auth/signin'` | Navigation to sign-in page |
| `<UserButton />` | Custom user info + sign-out button | Manual implementation |
| `SignInButton` wraps `Button` | Direct `Button` component | Simpler structure |

### Verification Results
✅ No Clerk imports remain
✅ No Clerk references anywhere in file
✅ TypeScript: 0 errors
✅ authClient imported correctly
✅ useSession() hook used correctly
✅ Conditional rendering logic implemented
✅ Button styling preserved
✅ Sign-out functionality with redirect
✅ Loading state handling (isPending, isSigningOut)

### Unblocks
- Task 15: Rewrite saved-searches-panel.tsx
- Task 16: Rewrite leaderboard.tsx
- Task 17: Rewrite vibe-check-panel.tsx
- Task 18: Rewrite search-input.tsx
- Task 19: Build verification

## Task 15: Rewrite saved-searches-panel.tsx — Server Fns + React Query

### Clerk/Convex -> Better Auth/React Query Translation

| Before (Clerk/Convex) | After (Better Auth/React Query) |
|---|---|
| `useAuth()` | `authClient.useSession()` |
| `useQuery(fn, skip)` | `useQuery({ queryKey, queryFn, enabled: !!session })` |
| `useMutation(fn)` | `useMutation({ mutationFn, onSuccess: invalidate })` |
| `<SignedOut>` / `<SignedIn>` | `if (!session)` / `if (session)` |
| `search._id` | `search.id` |
| Manual `useState(isSaving)` | `saveMutation.isPending` |
| Manual `useState(statusText)` | `saveMutation.isSuccess` / `saveMutation.isError` |

### Key Insights

1. **React Query eliminates manual loading/error state**: No more `useState(isSaving)` + `useState(statusText)`. The mutation object provides `isPending`, `isSuccess`, `isError` directly.

2. **normalizedName required**: The new `saveSearch` server function requires `normalizedName` (used for deduplication). Computed as `name.toLowerCase()`.

3. **Server function call pattern**: Functions with `.inputValidator()` are called as `saveSearch({ data: { ... } })` — the `data` key wraps the validated input.

4. **Drizzle nullable vs Convex optional**: Drizzle returns `string | null` for nullable columns. The `toRouteSearch()` helper handles this with `|| undefined` coercion (works for both `null` and empty string).

5. **Query invalidation pattern**: `useMutation({ onSuccess: () => queryClient.invalidateQueries({ queryKey: ['saved-searches'] }) })` automatically refetches after save.

6. **Conditional rendering replaces wrapper components**: `<SignedOut>`/`<SignedIn>` were Clerk-specific React components. Better Auth uses `authClient.useSession()` with standard conditional rendering.

### Files Modified
- `src/components/saved-searches-panel.tsx` (118 -> 130 lines)

### Unblocks
- Task 19: Build verification

## Task 16: Rewrite leaderboard.tsx — Server Fns + React Query ✅

### Convex → React Query Translation

| Convex | React Query | Notes |
|--------|-------------|-------|
| `useQuery(fn, { limit: 50 })` | `useQuery({ queryKey, queryFn })` | Declarative query |
| Returns `undefined` while loading | `{ isLoading }` boolean | Explicit loading state |
| `entries === undefined` | `isLoading` | Loading check |
| Returns `T[]` directly | `{ data: T[] \| undefined }` | Destructure with rename |

### Key Insights

1. **Loading state difference**: Convex `useQuery` returns `undefined` while loading, then the data. React Query returns `{ data, isLoading, error }` — use `isLoading` boolean instead of checking `data === undefined`.

2. **Null safety on data**: React Query `data` can be `undefined` in non-loading states (error). Added `!entries || entries.length === 0` guard for the empty state check.

3. **Server function call pattern**: `getTopNames({ data: 50 })` — TanStack Start server functions use `{ data: ... }` wrapper, matching pattern in use-name-check.ts.

### Verification
- Zero Convex references in file
- LSP diagnostics: clean

## Task 17: Delete Convex Files and Old Client/Function Files ✅

### Deletions Completed

1. **Directory Deletion**:
   - `rm -rf convex/`
   - Removed entire directory including:
     - `convex/schema.ts`
     - `convex/savedsearches.ts`
     - `convex/vibechecks.ts`
     - `convex/leaderboard.ts`
     - `convex/tsconfig.json`
     - `convex/README.md`
     - `convex/_generated/` (entire directory)

2. **File Deletions**:
   - `rm src/lib/convex-client.ts`
   - `rm src/lib/convex-functions.ts`

### Verification Results

✅ **Directory Verification**:
- `ls convex/` → "No such file or directory"
- Confirmed: `convex/` directory completely removed

✅ **File Verification**:
- `ls src/lib/convex-client.ts` → "No such file or directory"
- `ls src/lib/convex-functions.ts` → "No such file or directory"
- Confirmed: Both files completely removed

✅ **Orphan Import Check**:
- `grep -r "convex" src/ --include="*.ts" --include="*.tsx"` → 0 matches
- Confirmed: No remaining Convex references in source code

### Migration Complete

All Convex infrastructure has been successfully removed:
- ✅ Backend schema files deleted
- ✅ Client library files deleted
- ✅ Function definitions deleted
- ✅ No orphan imports remain
- ✅ Codebase is clean of Convex references

### Architecture Summary

**Old Stack** (Removed):
- Convex backend (serverless functions + database)
- Convex client library
- Convex schema definitions

**New Stack** (In Place):
- Drizzle ORM + PostgreSQL (database layer)
- TanStack Start server functions (backend logic)
- Better Auth (authentication)
- React Query (client-side data fetching)

### Next Steps

Task 19: Build verification (unblocked by this task completion)

## Task 18: Update Deployment Configuration Files ✅

### Files Modified

1. **vercel.json**
   - BEFORE: Complex buildCommand with conditional Convex deploy
     ```json
     "buildCommand": "if [ \"$VERCEL_ENV\" = \"production\" ]; then bunx convex deploy -y --typecheck disable --codegen disable --cmd-url-env-var-name VITE_CONVEX_URL --cmd 'NITRO_PRESET=vercel bun run build'; else NITRO_PRESET=vercel bun run build; fi"
     ```
   - AFTER: Simple buildCommand
     ```json
     "buildCommand": "NITRO_PRESET=vercel bun run build"
     ```
   - CHANGE: Removed entire if/else conditional checking VERCEL_ENV for Convex deploy

2. **package.json (scripts section)**
   - REMOVED: `"convex:dev": "convex dev"`
   - REMOVED: `"convex:deploy": "convex deploy"`
   - ADDED: `"db:generate": "drizzle-kit generate"`
   - ADDED: `"db:migrate": "drizzle-kit migrate"`
   - ADDED: `"db:push": "drizzle-kit push"`
   - ADDED: `"db:studio": "drizzle-kit studio"`

3. **SETUP.md (complete rewrite)**
   - TITLE: "Setup (Clerk + Convex + Vercel)" → "Setup (Better Auth + Drizzle + Planetscale)"
   - STACK: Updated to Better Auth (self-hosted, cookie-based) + Drizzle ORM + Planetscale Postgres
   - REQUIREMENTS: Removed Convex project access, added Planetscale CLI
   - LOCAL DEV: Simplified to .env.local setup + drizzle-kit commands (no convex dev)
   - REMOVED: All Clerk JWT template setup instructions
   - REMOVED: All Convex deployment instructions
   - REMOVED: All Convex environment variable setup
   - ADDED: Database schema management section (generate, push, studio)
   - ADDED: Authentication setup section (Better Auth configuration)
   - ADDED: Production deploy section (Planetscale branch switching + drizzle-kit push)
   - ENV VARS: Updated to DATABASE_URL + BETTER_AUTH_SECRET (removed CLERK_* and VITE_CONVEX_URL)

### Verification Results

✅ vercel.json: No Convex references
✅ package.json: No Convex scripts
✅ SETUP.md: No Convex or Clerk references
✅ All three files updated successfully
✅ New stack documented: Better Auth + Drizzle + Planetscale
✅ Database scripts added: db:generate, db:migrate, db:push, db:studio
✅ Production deployment instructions updated

### Key Insights

1. **Simplified Build Process**: Removing Convex deploy from buildCommand simplifies the Vercel build pipeline. The app now builds with a single command instead of conditional logic.

2. **Database Management Scripts**: Drizzle Kit provides CLI tools for schema management:
   - `db:generate`: Creates migration files from schema changes
   - `db:migrate`: Runs migrations programmatically
   - `db:push`: Applies migrations to database
   - `db:studio`: Opens Drizzle Studio for database inspection

3. **Documentation Clarity**: SETUP.md now clearly documents:
   - How to get DATABASE_URL from Planetscale
   - How to generate and apply migrations
   - How to deploy to production with Planetscale branch switching
   - Environment variable requirements (DATABASE_URL + BETTER_AUTH_SECRET)

4. **Stack Migration Complete**: Configuration files now fully reflect the new stack:
   - No Clerk references (removed from SETUP.md)
   - No Convex references (removed from all three files)
   - Better Auth + Drizzle + Planetscale documented as the new stack

### Dependencies

- **Unblocks**: Task 19 (build verification)
- **Blocked By**: None (independent task)

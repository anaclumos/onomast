# REAL MANUAL QA

**Date:** 2026-02-17
**Server:** localhost:3001 (dev mode, vite)
**Method:** Playwright browser automation + code inspection

## SCENARIOS [5/5 PASS]:

- [x] **1. Homepage loads** - PASS (verified `/`)
  - Title: "onomast.app - Vibe Check Your Company Name"
  - Hero section with search CTA, feature grid (8 features), footer
  - Evidence: `01-homepage-loads.png`

- [x] **2. Search navigation** - PASS (form submits to `/$name`)
  - Cmd+K opens search dialog with name input, description, region/language selectors
  - Typing "acme" and clicking "Check" navigates to `/acme`
  - Page title updates to "acme - onomast.app"
  - Evidence: `02-search-navigation-acme.png`

- [x] **3. Section widgets** - PASS (all 11 sections render)
  - Vibe Score (gauge widget with score)
  - Pros & Cons (AI-powered, shows graceful "AI service unavailable" fallback)
  - Reddit Take (styled Reddit-like widget)
  - Similar Companies (widget card)
  - Word Meaning / Dictionary (definition, phonetics, part of speech)
  - Urban Dictionary (multiple entries with votes)
  - Domains (6 TLDs: .com, .dev, .app, .net, .org, .ai with taken/available status)
  - Social Media (Instagram, X/Twitter, TikTok, YouTube, Facebook)
  - Package Registries (npm, crates.io, Go, Homebrew, apt)
  - GitHub (user info + related repos with star counts)
  - Trademark & Business (external links to USPTO and OpenCorporates)
  - Evidence: `03-section-widgets-acme-full.png`

- [x] **4. Auth controls** - PASS (sign in button visible)
  - "Log in" button rendered via `<AuthControls />` using Better Auth session
  - When unauthenticated: shows "Log in" button (redirects to `/auth/signin`)
  - When authenticated: shows user name + "Sign out" button
  - Evidence: `04-auth-controls-visible.png`

- [x] **5. Leaderboard** - PASS (`/leaderboard` renders correctly)
  - Title: "Leaderboard - onomast.app"
  - Heading: "Most saved names" with description
  - Table with Rank / Name / Saves columns
  - Empty state shows "No data yet." (expected for local dev)
  - Error boundary component present for graceful failure
  - Evidence: `05-leaderboard-page.png`

## INTEGRATION [3/3 PASS]:

- [x] **Routing works** (TanStack Router)
  - File-based routes: `/`, `/$name`, `/leaderboard`
  - `createFileRoute` used correctly in all route files
  - Search params validated with Zod schema on `$name` route
  - `useNavigate` handles search form -> route navigation

- [x] **Data fetching works** (React Query + server fns)
  - `useNameCheck` hook fires 25 parallel queries (domains, social, packages, github, dictionary)
  - All use `useQuery` with proper `queryKey` and `queryFn` via `createServerFn`
  - Leaderboard uses `getTopNames` server function
  - Vibe check waits for availability data before firing (`enabled: enabled && availabilityReady`)

- [x] **Auth state works** (Better Auth session)
  - `authClient.useSession()` used in `AuthControls` and `SavedSearchesPanel`
  - Conditional rendering: unauthenticated shows "Log in" / "Sign in to save searches"
  - Authenticated shows user name, sign out button, saved searches list
  - Query for saved searches only enabled when session exists (`enabled: !!session`)

## EDGE CASES [4 TESTED]:

- [x] **Empty search** - Does NOT navigate, stays on `/` (correct)
- [x] **Special characters** - `test-name_123` navigates to `/test-name_123`, all widgets render
- [x] **Dictionary not found** - Shows "No dictionary definition found." gracefully
- [x] **Unauthenticated saved searches** - Shows "Sign in to save searches." banner
- Evidence: `06-edge-case-special-chars.png`

## CONSOLE ISSUES:

- 2 React DOM nesting warnings: `<button>` inside `<button>` in WidgetCard -> section buttons
  - Root cause: `widget-card.tsx` wraps content in a `<button>`, sections contain inner buttons ("Mark owned")
  - Severity: **Low** - cosmetic hydration warning, does not affect functionality
- 2 Recharts warnings: negative width/height on initial render (chart not yet sized)
  - Severity: **Low** - resolves after layout

## VERDICT: PASS

All 5 core scenarios pass. All 3 integration checks pass. 4 edge cases tested successfully.
No blocking issues found. Two minor console warnings (nested buttons, recharts sizing) are cosmetic.

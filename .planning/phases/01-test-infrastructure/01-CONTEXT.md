# Phase 1: Test Infrastructure - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Install and configure Vitest (unit) and Playwright (E2E) so that `npm run test:unit`, `npm run test:e2e`, and `npm run test` all execute cleanly — even with zero test files. No tests are written in this phase. The deliverable is a working test harness: config files, setup files, shared mock fixture, and wired npm scripts.

</domain>

<decisions>
## Implementation Decisions

### Vitest configuration
- **D-01:** Test config lives inline in `vite.config.js` (not a separate `vitest.config.js`)
- **D-02:** Environment: `jsdom` — required for React Testing Library
- **D-03:** Setup file: `./tests/unit/setup.js` — imports `@testing-library/jest-dom` matchers and runs `cleanup()` + `vi.unstubAllEnvs()` after each test
- **D-04:** Pin `jsdom@^26.1.0` explicitly — jsdom 27+ breaks Vitest with React 19 (ESM errors)
- **D-05:** Include `mockReset: true, restoreMocks: true` in the test block now — prevents mock state leaking between tests from day one

### Playwright configuration
- **D-06:** Config file: `playwright.config.js` at project root
- **D-07:** `testDir: './tests/e2e'`, `fullyParallel: true`, `retries: 0`
- **D-08:** `baseURL: 'http://localhost:5173'`, `reuseExistingServer: true` — reuses a running dev server locally to avoid port conflicts
- **D-09:** `webServer.command: 'npm run dev'` with `timeout: 120000`
- **D-10:** Reporter: `'html'` — rich browser-based report with screenshots and traces, best for local dev
- **D-11:** Projects: Chromium only (`devices['Desktop Chrome']`)
- **D-12:** `trace: 'on-first-retry'`

### Shared API mock fixture
- **D-13:** File location: `tests/e2e/mocks/api.js`
- **D-14:** Export shape: single `registerAll(page)` async function — registers all 9 route interceptors in one call. E2E tests call `await registerAll(page)` before `page.goto()`. No per-route named exports.
- **D-15:** Routes to mock (all 9): `**/validate-zipcode`, `**/echo`, `**/findback`, `**/uploadDocuments`, `**/ratesheetuploader`, `**/update`, `**/credit-unions`, `**/credit-unions/*/ratesheet`, `**/credit-unions/*` (DELETE)
- **D-16:** Each route returns a minimal valid JSON response — just enough for the app to proceed without errors (not real data)

### npm scripts
- **D-17:** `"test:unit": "vitest run"` — single run (not watch mode)
- **D-18:** `"test:e2e": "playwright test"`
- **D-19:** `"test": "npm run test:unit && npm run test:e2e"` — E2E only runs if unit passes (fast fail)

### Claude's Discretion
- Exact mock response bodies for each of the 9 routes (minimal valid shape — planner can decide)
- Whether `tests/e2e/mocks/api.js` exports any helper type constants

</decisions>

<specifics>
## Specific Ideas

- The user selected the `registerAll(page)` preview explicitly — the exact call pattern `await registerAll(page)` before `page.goto()` is the expected API
- `mockReset: true, restoreMocks: true` were confirmed from the research gotchas list — include verbatim in `vite.config.js` test block

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and requirements
- `.planning/ROADMAP.md` — Phase 1 section: deliverables, plan breakdown, requirement IDs INFRA-01 → INFRA-06
- `.planning/REQUIREMENTS.md` — INFRA-01 through INFRA-06 acceptance criteria

### Technical implementation
- `.planning/phases/01-test-infrastructure/01-RESEARCH.md` — Exact config blocks, package versions, known gotchas, `page.route()` patterns, env mocking approach

### Files to extend (read current state before modifying)
- `vite.config.js` — Add `test` block; currently has `plugins: [react()]` only
- `package.json` — Add `test:unit`, `test:e2e`, `test` scripts; currently has `dev`, `build`, `lint`, `preview`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — zero test infrastructure exists today (no Vitest, no Playwright, no test files)

### Established Patterns
- ESM modules throughout (`import`/`export`) — test files should use ESM (no `require`)
- `import.meta.env.VITE_API_URL` used for all API base URLs — use `vi.stubEnv('VITE_API_URL', 'http://test.local')` in unit tests; Playwright intercepts at network layer via `page.route()`
- No TypeScript — all test files in plain `.js` / `.jsx`

### Integration Points
- `vite.config.js` — extend with `test` block (non-breaking addition)
- `package.json` — add 3 new scripts (`test:unit`, `test:e2e`, `test`)
- New directories: `tests/unit/` and `tests/e2e/mocks/`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-test-infrastructure*
*Context gathered: 2026-04-03*

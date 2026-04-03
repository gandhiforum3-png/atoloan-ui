# Phase 1: Test Infrastructure — Research

**Date:** 2026-04-03
**Project:** atoloan-ui (React 19 + Vite 7, No TypeScript)
**Goal:** What do I need to know to plan Vitest + Playwright setup well?

---

## 1. Vitest Config for React 19 + Vite 7

**Exact `vite.config.js` test block:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/unit/setup.js',
  },
})
```

Use `environment: 'jsdom'` — required for React Testing Library. React 19 works fine with jsdom **26.x** (NOT 27.x — jsdom 27+ breaks Vitest with ESM errors).

---

## 2. React Testing Library Setup

**Packages:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom@^26.1.0
```

**`tests/unit/setup.js`:**
```javascript
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

afterEach(() => {
  cleanup()
  vi.unstubAllEnvs()
})
```

No React 19-specific workarounds needed beyond pinning jsdom to 26.x.

---

## 3. Playwright + Vite Dev Server Integration

**`playwright.config.js`:**
```javascript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120000,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

`reuseExistingServer: true` reuses a running dev server locally — avoids port conflicts.

---

## 4. Mocking `import.meta.env.VITE_API_URL` in Vitest

```javascript
import { vi } from 'vitest'

beforeEach(() => {
  vi.stubEnv('VITE_API_URL', 'http://test.local')
})
// vi.unstubAllEnvs() is handled by setup.js afterEach
```

`vi.stubEnv()` mocks both `process.env` and `import.meta.env` simultaneously.

---

## 5. Playwright `page.route()` Fetch Mocking

```javascript
// Register BEFORE page.goto()
await page.route('**/validate-zipcode', route =>
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ valid: true, city: 'Los Angeles' }),
  })
)
await page.goto('/')
```

Works with Vite dev server — Playwright intercepts at the network layer regardless. Pattern: glob `'**/<path>'` matches any origin.

---

## 6. npm Script Chaining

```json
"test:unit": "vitest run",
"test:e2e":  "playwright test",
"test":      "npm run test:unit && npm run test:e2e"
```

`&&` = run e2e only if unit tests pass. Fast fail on unit errors.

---

## 7. Known Gotchas

| Gotcha | Fix |
|--------|-----|
| jsdom 27 breaks Vitest | Pin `jsdom@^26.1.0` explicitly |
| `toBeInTheDocument` not found | Ensure `setupFiles` points to setup.js; `expect.extend(matchers)` must run |
| Playwright Chromium not installed | Run `npx playwright install chromium` after `npm install` |
| Route mock not catching request | Register `page.route()` **before** `page.goto()` |
| `vi.mock()` leaking between tests | Add `mockReset: true, restoreMocks: true` to Vitest config |

---

## Package Versions

```json
"vitest": "^3.x",
"@testing-library/react": "^16.x",
"@testing-library/user-event": "^14.x",
"@testing-library/jest-dom": "^6.x",
"jsdom": "^26.1.0",
"@playwright/test": "^1.x"
```

---

## RESEARCH COMPLETE

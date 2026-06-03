# TESTING.md — Testing Infrastructure

## Current State

**Zero test infrastructure.** No test framework is installed, no test files exist, no test scripts are configured.

```json
// package.json scripts — no "test" entry
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

## What Passes as Validation Today

| Check | Command | What It Catches |
|-------|---------|----------------|
| Lint | `npm run lint` | ESLint rule violations, React hooks misuse, unused vars (except `_` / capital prefix) |
| Build | `npm run build` | Broken imports, syntax errors, missing modules — Vite/Rollup must resolve everything at bundle time |

Run both before a Docker push:
```bash
npm run lint && npm run build
```

## Coverage Gaps

Nothing is tested:
- `useLoanWizard.js` — 442 lines of wizard state, step navigation, API calls
- `buildPreApprovalPayload()` / `sendPayload()` in `payloads.js`
- Contact info validation logic (email regex, phone digit count) in `useLoanWizard.js`
- `useRateSheetUploader.js` — section review flow, save/delete
- `loanCalculator.js` — `calculatePayments()` math
- All 13 functions in `validators.js` (currently dead code)
- `TreeEditor.jsx` — recursive JSON editing

## Adding Tests

Vitest is the natural fit for this Vite project — zero config needed, same plugin ecosystem.

```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

Add to `package.json`:
```json
"test": "vitest",
"test:ui": "vitest --ui"
```

Add to `vite.config.js`:
```js
test: { environment: 'jsdom' }
```

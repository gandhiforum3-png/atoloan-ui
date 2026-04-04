# Roadmap: atoloan-ui Test Coverage

## Milestone 1: Full Test Coverage

**Goal:** Developer can run `npm run test` before every deploy and get confidence that loan wizard, rate sheet uploader, calculator, and language toggle all work.
**Phases:** 3

---

### Phase 1: Test Infrastructure

**Goal:** Both Vitest and Playwright are installed, configured, and able to run — even with no tests yet. npm scripts wired up.

**Delivers:**
- `npm run test:unit` — Vitest runs, exits green (no test files = pass)
- `npm run test:e2e` — Playwright launches Vite dev server and Chromium, exits green
- `npm run test` — runs both in sequence
- `vite.config.js` updated with test block (jsdom environment)
- `playwright.config.js` configured (baseURL = localhost:5173, auto-start dev server, mocked API helper)
- Shared API mock fixtures file at `tests/e2e/mocks/api.js`

**Plans:**
1. Install + configure Vitest — `npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom`, update `vite.config.js`, add `tests/unit/setup.js`
2. Install + configure Playwright — `npx playwright install chromium`, create `playwright.config.js` with Vite dev server integration, create `tests/e2e/mocks/api.js` with all 9 route interceptors
3. Wire npm scripts — add `test:unit`, `test:e2e`, `test` to `package.json`; verify both runners exit clean

---

### Phase 2: Unit Tests

**Goal:** All pure functions, key components, and critical hook logic are covered by fast unit tests that run in milliseconds.

**Requirements:** [UNIT-01, UNIT-02, UNIT-03, UNIT-04, COMP-01, COMP-02, COMP-03, COMP-04, HOOK-01, HOOK-02, HOOK-03, HOOK-04, HOOK-05]

**Delivers:**
- `tests/unit/loanCalculator.test.js` — calculatePayments() verified for happy path + edge cases
- `tests/unit/payloads.test.js` — buildPreApprovalPayload() verified for correct shape and trimming
- `tests/unit/validators.test.js` — all 16 validator functions tested for valid/invalid inputs
- `tests/unit/StepOptions.test.jsx` — image rendering + broken image text fallback
- `tests/unit/ContactInfoForm.test.jsx` — error display when contactInfoErrors array is non-empty
- `tests/unit/LanguageContext.test.jsx` — toggle switches language, components re-render in Spanish
- `tests/unit/useLoanWizard.test.js` — step advance, cosigner skip branch, contact validation guards

**Plans:** 3 plans
- [ ] 02-01-PLAN.md — Utility unit tests (loanCalculator, payloads, validators)
- [x] 02-02-PLAN.md — Component unit tests (StepOptions, ContactInfoForm, LanguageContext)
- [x] 02-03-PLAN.md — Hook unit tests (useLoanWizard navigation and validation guards)

---

### Phase 3: E2E Tests

**Goal:** All 4 critical user flows are exercised in a real Chromium browser with mocked API responses. Tests must all pass before `docker build`.

**Delivers:**
- `tests/e2e/loan-wizard.spec.js` — full happy-path run + invalid zip + contact validation + cosigner skip
- `tests/e2e/rate-sheet-uploader.spec.js` — PDF upload → section review → save + view-existing bank load
- `tests/e2e/loan-calculator.spec.js` — payment calculation output + chart renders
- `tests/e2e/language-toggle.spec.js` — EN→ES label switch on home page and mid-wizard
- All tests pass with `npm run test:e2e`
- CLAUDE.md updated with test documentation

**Plans:**
1. E2E: Loan wizard — happy path full flow + invalid zip edge case + contact form validation + cosigner skip
2. E2E: Rate sheet uploader + loan calculator — PDF upload/review/save flow + calculator output
3. E2E: Language toggle + CLAUDE.md update — EN/ES switch verification + document `npm run test` in CLAUDE.md

---

## Requirements Coverage

| Phase | Requirements Covered |
|-------|---------------------|
| Phase 1 | INFRA-01 → INFRA-06 |
| Phase 2 | UNIT-01 → UNIT-04, COMP-01 → COMP-04, HOOK-01 → HOOK-05 |
| Phase 3 | E2E-01 → E2E-10 |

---
*Roadmap created: 2026-04-03*

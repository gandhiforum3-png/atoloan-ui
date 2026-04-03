# atoloan-ui — Test Coverage

## What This Is

atoloan-ui is a React 19 SPA for automotive loan pre-approval and rate sheet management. It serves two audiences: loan applicants (19-step bilingual wizard) and credit union admins (PDF rate sheet upload and editing). This project adds a full testing layer — unit tests and Playwright E2E tests — so developers can validate the app locally before every deploy.

## Core Value

A developer can run `npm run test` before building the Docker image and know with confidence that the loan wizard, rate sheet uploader, calculator, and language toggle all work correctly.

## Requirements

### Validated

- ✓ 19-step bilingual loan pre-approval wizard (EN/ES, image buttons, step navigation) — existing
- ✓ Rate sheet PDF upload → API parse → 7-section TreeEditor review → save to DB — existing
- ✓ Auto loan payment calculator with Chart.js pie chart — existing
- ✓ EN/ES language toggle via React Context — existing
- ✓ Kubernetes deployment at dev.atoloan.com via nginx ingress — existing

### Active

- [ ] Vitest unit test suite with `npm run test:unit`
  - [ ] Pure utility functions: `calculatePayments()`, `buildPreApprovalPayload()`, all validators
  - [ ] Component rendering: StepOptions image/fallback, ContactInfoForm validation errors, language label switching
  - [ ] Custom hook logic: useLoanWizard step navigation, cosigner skip branch, validation guards
- [ ] Playwright E2E suite with `npm run test:e2e`
  - [ ] Loan wizard: full happy-path run (loan type → employment → contact → find bank) with mocked API
  - [ ] Loan wizard edge cases: invalid zip rejected, contact form blocks on missing fields
  - [ ] Rate sheet uploader: PDF upload → section review → save flow with mocked API
  - [ ] Loan calculator: verify payment calculation output and chart render
  - [ ] Language toggle: EN → ES switch verified across pages
- [ ] `npm run test` runs both unit and E2E suites in sequence
- [ ] Test infrastructure documented in CLAUDE.md

### Out of Scope

- CI/CD pipeline integration — manual `npm run test` before deploy is sufficient for now
- Real backend in E2E tests — mocked API responses keep tests fast and self-contained
- Git pre-push hook — developer chooses when to run, not automated
- Visual regression testing — not needed at this stage
- Backend unit tests — this project covers the frontend only

## Context

The codebase currently has zero test infrastructure (no Vitest, no Playwright, no test files anywhere). All existing validation is inline in `useLoanWizard.js` — email regex, phone digit count, zip API call. The `validators.js` utility file has 13 functions defined but none are imported — these are prime candidates for unit tests.

Codebase map is at `.planning/codebase/`. Key files:
- `src/pages/loans/useLoanWizard.js` — wizard state machine (442 lines), all validation logic lives here
- `src/pages/loans/loanSteps.js` — step definitions + bilingual copy (627 lines)
- `src/pages/loans/payloads.js` — `buildPreApprovalPayload()` pure function
- `src/utils/loanCalculator.js` — `calculatePayments()` pure math
- `src/utils/validators.js` — 13 functions, all dead code, good unit test targets
- `src/components/TreeEditor.jsx` — recursive JSON editor

All API calls use `import.meta.env.VITE_API_URL` — Playwright will intercept these at the `fetch()` level via `page.route()`.

## Constraints

- **Tech Stack**: Vite 7 — Vitest is the natural unit test fit (zero config, same plugin system)
- **No TypeScript**: Tests written in plain JavaScript, no `tsc` step
- **E2E backend**: Mocked via Playwright `page.route()` interception — no real FastAPI backend required to run tests
- **Existing code**: No refactoring of source files to make them testable — tests must work with the code as-is

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Playwright for E2E (not Cypress) | Built-in `page.route()` mocking, headless by default, lighter weight, better Vite compatibility | — Pending |
| Vitest for unit tests | Zero-config for Vite projects, same ecosystem, fast parallel execution | — Pending |
| Mocked backend for E2E | No backend dependency — tests run anywhere, always fast, no flaky network | — Pending |
| Manual trigger only | `npm run test` before `docker build` — developer decides when to run, no hook overhead | — Pending |
| Happy path + key edge cases | Covers deploy-blocking failures without excessive test maintenance burden | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-03 after initialization*

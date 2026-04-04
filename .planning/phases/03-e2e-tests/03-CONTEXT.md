# Phase 3: E2E Tests - Context

**Gathered:** 2026-04-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Write 4 Playwright spec files covering the loan wizard, rate sheet uploader, loan calculator, and language toggle — all running in Chromium with mocked API responses via `page.route()`. No source files are modified. Deliverables: `loan-wizard.spec.js`, `rate-sheet-uploader.spec.js`, `loan-calculator.spec.js`, `language-toggle.spec.js`. All must pass under `npm run test:e2e`. CLAUDE.md updated with test commands and a Testing section.

</domain>

<decisions>
## Implementation Decisions

### Wizard flow depth (E2E-01 → E2E-04)
- **D-01:** Happy-path test asserts key milestones only — step 1 loads, zip accepted, contact form accepted, review step reached, bank result renders. Do NOT assert every step title.
- **D-02:** `/findback` mock must return a real bank so the bank name is assertable. Update `tests/e2e/mocks/api.js`: `{ banks: [{ name: 'Test Credit Union' }] }` (or equivalent shape the UI renders from).
- **D-03:** All 4 wizard tests (E2E-01 happy path, E2E-02 invalid zip, E2E-03 contact validation, E2E-04 cosigner skip) live in a single file: `tests/e2e/loan-wizard.spec.js` as separate `test()` blocks.

### File upload approach (E2E-05 → E2E-07)
- **D-04:** Use a real minimal PDF fixture at `tests/e2e/fixtures/sample.pdf`. Tests set it on the file input via `page.setInputFiles()`.
- **D-05:** The fixture only needs to be a valid PDF — content doesn't matter since `/ratesheetuploader` is mocked.

### Selector strategy
- **D-06:** Use Playwright text/role selectors throughout — `page.getByRole()`, `page.getByText()`, `page.getByLabel()`. No `data-testid` attributes added to source files.
- **D-07:** No source file modifications of any kind — tests work with the app as-is.

### CLAUDE.md update
- **D-08:** Add `npm run test`, `npm run test:unit`, `npm run test:e2e` to the existing `## Commands` section.
- **D-09:** Add a new `## Testing` section explaining: test directories (`tests/unit/`, `tests/e2e/`), the shared mock fixture (`tests/e2e/mocks/api.js` and `registerAll(page)`), and a brief note on how to add new tests.

### Claude's Discretion
- Exact milestone selector strings (button labels, headings) — derive from source files
- Exact `sample.pdf` content (any minimal valid PDF bytes)
- Order of `test()` blocks within each spec file
- Whether to use `test.describe()` grouping within spec files
- Exact mock body shape for `/findback` beyond `{ banks: [{ name: 'Test Credit Union' }] }`
- Exact wording of the new CLAUDE.md Testing section

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and acceptance criteria
- `.planning/ROADMAP.md` — Phase 3 section: deliverables, 3-plan breakdown, requirement IDs E2E-01 → E2E-10
- `.planning/REQUIREMENTS.md` — Full acceptance criteria for all 10 E2E requirements

### Test infrastructure (already built — read before writing tests)
- `playwright.config.js` — `testDir: ./tests/e2e`, `fullyParallel: true`, `reuseExistingServer: true`, `baseURL: http://localhost:5173`, Chromium only
- `tests/e2e/mocks/api.js` — `registerAll(page)` registers all 9 route interceptors; call before every `page.goto()`. NOTE: `/findback` mock body needs updating per D-02.
- `tests/e2e/health.spec.js` — Existing smoke test pattern to follow

### Source files under test (read to derive selectors and flow)
- `src/pages/loans/useLoanWizard.js` — wizard state machine; step IDs, navigation guards, cosigner skip branch (`'by-myself'` → jumps to `'employment'`)
- `src/pages/loans/loanSteps.js` — step definitions and EN/ES copy; derive button labels, step titles, and option text for role/text selectors
- `src/pages/loans/steps/ZipCodeInput.jsx` — zip input UI; error message rendered on invalid zip
- `src/pages/loans/steps/ContactInfoForm.jsx` — 8 required fields; inline errors rendered from `contactInfoErrors[]`
- `src/pages/ratesheet/useRateSheetUploader.js` — rate sheet state machine; upload → review flow
- `src/pages/ratesheet/constants.js` — 7-section review order; derive section labels for assertions
- `src/pages/LoanCalculator.jsx` (or equivalent) — calculator inputs and output labels for selector derivation
- `src/context/LanguageContext.jsx` — `toggleLanguage()` mechanism; derive toggle button label
- `src/components/Navbar.jsx` (or equivalent) — language toggle button location in the UI

### Prior phase context
- `.planning/phases/01-test-infrastructure/01-CONTEXT.md` — D-13 through D-16: mock fixture shape, `registerAll(page)` pattern, all 9 mocked routes
- `.planning/phases/02-unit-tests/02-CONTEXT.md` — D-18/D-19: plain JS, no TypeScript; ESM imports

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tests/e2e/mocks/api.js` — `registerAll(page)` already wired for all 9 routes; import and call in every spec
- `tests/e2e/health.spec.js` — minimal working spec pattern (`import { test, expect }`, `page.goto('/')`)

### Established Patterns
- `page.route()` interception — already proven in Phase 1; no new mock patterns needed
- ESM throughout — `import { test, expect } from '@playwright/test'`
- No TypeScript — `.spec.js` files only

### Integration Points
- All 4 spec files are new — `loan-wizard.spec.js`, `rate-sheet-uploader.spec.js`, `loan-calculator.spec.js`, `language-toggle.spec.js`
- `tests/e2e/fixtures/` directory needs creating with `sample.pdf`
- `tests/e2e/mocks/api.js` needs one update: `/findback` response body → `{ banks: [{ name: 'Test Credit Union' }] }`
- `CLAUDE.md` needs test commands + Testing section (D-08/D-09)

</code_context>

<specifics>
## Specific Ideas

- User explicitly chose text/role selectors (no `data-testid`) — do NOT add attributes to source files
- `/findback` mock update is required before E2E-01 happy path can assert a bank name — this is a prerequisite task in the first plan
- The fixture PDF only needs to be a valid PDF binary — the API response is mocked so content is irrelevant

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-e2e-tests*
*Context gathered: 2026-04-04*

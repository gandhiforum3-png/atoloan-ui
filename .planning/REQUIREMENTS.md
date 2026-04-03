# Requirements: atoloan-ui Test Coverage

**Defined:** 2026-04-03
**Core Value:** `npm run test` passes before every deploy, catching regressions across loan wizard, rate sheet uploader, calculator, and language toggle.

## v1 Requirements

### Infrastructure Setup

- [ ] **INFRA-01**: Vitest installed and configured (`vite.config.js` test block, jsdom environment)
- [ ] **INFRA-02**: React Testing Library + user-event installed
- [ ] **INFRA-03**: Playwright installed with Chromium browser
- [ ] **INFRA-04**: `npm run test:unit` runs Vitest suite
- [ ] **INFRA-05**: `npm run test:e2e` runs Playwright suite against Vite dev server
- [ ] **INFRA-06**: `npm run test` runs both unit and E2E in sequence

### Unit Tests — Utilities

- [ ] **UNIT-01**: `calculatePayments()` returns correct monthly payment, total interest, total paid for known inputs
- [ ] **UNIT-02**: `calculatePayments()` handles edge cases (zero down payment, minimum term)
- [ ] **UNIT-03**: `buildPreApprovalPayload()` correctly trims and maps all fields to payload shape
- [ ] **UNIT-04**: `validators.js` functions return correct error strings or null for valid/invalid inputs

### Unit Tests — Components

- [ ] **COMP-01**: `StepOptions` renders image buttons for options with img paths
- [ ] **COMP-02**: `StepOptions` renders text fallback when image fails to load (brokenImages)
- [ ] **COMP-03**: `ContactInfoForm` displays validation errors when contactInfoErrors array is non-empty
- [ ] **COMP-04**: Language toggle: component re-renders with Spanish labels when language switches to `'es'`

### Unit Tests — Hook Logic

- [ ] **HOOK-01**: `useLoanWizard` advances stepIndex on `handleSelect`
- [ ] **HOOK-02**: `useLoanWizard` skips cosigner steps when `'by-myself'` is selected
- [ ] **HOOK-03**: `useLoanWizard` blocks advance in `handleContactInfoContinue` when required fields missing
- [ ] **HOOK-04**: `useLoanWizard` blocks advance in `handleContactInfoContinue` on invalid email format
- [ ] **HOOK-05**: `useLoanWizard` blocks advance when phone is not 10 digits

### E2E Tests — Loan Wizard

- [ ] **E2E-01**: Full happy-path loan wizard (loan type → cosigner → employment → income → zip → contact → review → find bank) completes without errors
- [ ] **E2E-02**: Invalid zip code input shows an error message and does not advance
- [ ] **E2E-03**: Contact form with missing required fields shows validation errors and does not advance
- [ ] **E2E-04**: "By myself" cosigner selection skips cosigner steps and lands on employment step

### E2E Tests — Rate Sheet Uploader

- [ ] **E2E-05**: PDF upload flow: file selected → upload triggered → section review appears with parsed data
- [ ] **E2E-06**: Section review: confirm through all 7 sections → Save to Database button appears and triggers save
- [ ] **E2E-07**: View existing mode: bank list loads → selecting a bank loads its rate sheet

### E2E Tests — Loan Calculator

- [ ] **E2E-08**: Entering vehicle price, down payment, term, and interest rate renders a monthly payment value and pie chart

### E2E Tests — Language Toggle

- [ ] **E2E-09**: Switching to Spanish on the home page changes navigation and hero labels to Spanish
- [ ] **E2E-10**: Switching to Spanish mid-wizard re-renders step titles and button labels in Spanish

## v2 Requirements

### Future Enhancements

- **V2-01**: CI pipeline runs `npm run test` on every pull request
- **V2-02**: Git pre-push hook blocks push if tests fail
- **V2-03**: Visual regression snapshots for key wizard steps
- **V2-04**: E2E tests against real backend (integration mode)

## Out of Scope

| Feature | Reason |
|---------|--------|
| CI/CD integration | Manual pre-deploy trigger is sufficient for v1 |
| Real backend in E2E | Mocked API keeps tests self-contained and fast |
| Git pre-push hook | Developer preference to control when tests run |
| Backend tests | Frontend-only project scope |
| Visual regression | Not a current pain point |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 → INFRA-06 | Phase 1 | Pending |
| UNIT-01 → UNIT-04 | Phase 2 | Pending |
| COMP-01 → COMP-04 | Phase 2 | Pending |
| HOOK-01 → HOOK-05 | Phase 2 | Pending |
| E2E-01 → E2E-04 | Phase 3 | Pending |
| E2E-05 → E2E-07 | Phase 3 | Pending |
| E2E-08 | Phase 3 | Pending |
| E2E-09 → E2E-10 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-03*
*Last updated: 2026-04-03 after initialization*

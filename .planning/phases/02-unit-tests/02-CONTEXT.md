# Phase 2: Unit Tests - Context

**Gathered:** 2026-04-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Write 7 unit test files covering pure utility functions, key components, and critical hook logic. No source files are refactored — tests must work with the code as-is. Deliverables: `loanCalculator.test.js`, `payloads.test.js`, `validators.test.js`, `StepOptions.test.jsx`, `ContactInfoForm.test.jsx`, `LanguageContext.test.jsx`, `useLoanWizard.test.js`. All must pass under `npm run test:unit`.

</domain>

<decisions>
## Implementation Decisions

### Validator coverage scope
- **D-01:** Test ALL exports in `validators.js` — full file coverage including trivial functions
- **D-02:** `validateForm111()` — include one test asserting it returns `null`
- **D-03:** `updateItem()` — include test covering sessionStorage write + read behavior
- **D-04:** `updateAmount()` — include test asserting it returns its input unchanged
- **D-05:** All 15 true validator functions tested for both valid input (returns `null`) and invalid input (returns expected error string)

### Hook test setup pattern
- **D-06:** ALL `useLoanWizard` hook tests wrap `renderHook` in `LanguageProvider`
- **D-07:** Use a shared wrapper helper in `useLoanWizard.test.js`:
  ```js
  const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>
  renderHook(() => useLoanWizard(), { wrapper })
  ```
- **D-08:** No exception to this rule — even tests that never touch language use the wrapper for consistency

### Floating-point assertions (`calculatePayments`)
- **D-09:** Use `toBeCloseTo(expected, 2)` for all numeric results from `calculatePayments()` — penny-level precision
- **D-10:** Choose test inputs freely (not constrained to integer-friendly values)
- **D-11:** Apply `toBeCloseTo` to `monthlyPayment`, `totalInterestPaid`, `totalPaid`, `loanAmount`; `months` is an integer — use exact `toBe`

### Component test isolation
- **D-12:** `ContactInfoForm` receives all state as props (`contactInfo`, `errors`, `emailError`, `phoneError`, `onChange`, `onContinue`, `zipCode`, `copy`) — test in full isolation, no context or hook needed
- **D-13:** Pass a minimal `copy` object stub with only the placeholder strings the component renders
- **D-14:** `StepOptions` receives `options`, `selectedValue`, `onSelect`, `brokenImages`, `setBrokenImages` as props — test in full isolation
- **D-15:** Simulate broken image via `fireEvent.error(imgElement)` — triggers `onError` which calls `setBrokenImages`

### Language context test
- **D-16:** `LanguageContext.test.jsx` tests the toggle using the real `LanguageProvider` and a simple consumer component
- **D-17:** Assert English labels render by default; after `toggleLanguage()` fires, Spanish labels render

### General test conventions (carried from Phase 1)
- **D-18:** All test files in plain `.js` / `.jsx` — no TypeScript
- **D-19:** Files live under `tests/unit/` — picked up by Vitest `include: tests/unit/**` pattern
- **D-20:** Use `vi.stubEnv('VITE_API_URL', 'http://test.local')` in any test that imports a module referencing `import.meta.env.VITE_API_URL`

### Claude's Discretion
- Exact test input values for `calculatePayments()` (any reasonable vehicle price / term / rate)
- Order of test cases within each file
- Whether to use `describe` blocks to group related cases within a file
- Exact mock prop values for `ContactInfoForm` and `StepOptions` tests
- Whether `validators.test.js` uses one `describe` per function or a flat list

</decisions>

<specifics>
## Specific Ideas

- User explicitly chose `toBeCloseTo(expected, 2)` over integer-friendly inputs or manual rounding — use this pattern verbatim
- User explicitly chose `LanguageProvider` wrapper for ALL hook tests (not just language-related ones) — apply consistently even when language doesn't affect the scenario being tested
- Full file coverage on `validators.js` is intentional — include all 15 exports including `updateItem`, `updateAmount`, `validateForm111`

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase scope and acceptance criteria
- `.planning/ROADMAP.md` — Phase 2 section: deliverables, 3-plan breakdown, requirement IDs UNIT-01→04, COMP-01→04, HOOK-01→05
- `.planning/REQUIREMENTS.md` — Full acceptance criteria for all 13 unit test requirements

### Source files under test (read before writing tests)
- `src/utils/loanCalculator.js` — `calculatePayments()` and `formatCurrency()` — pure functions, no imports
- `src/utils/validators.js` — all 15 exports; note `updateItem` uses sessionStorage, `updateAmount` is passthrough
- `src/pages/loans/payloads.js` — `buildPreApprovalPayload()` pure function, trims all string fields
- `src/pages/loans/StepOptions.jsx` — props: `options`, `selectedValue`, `onSelect`, `brokenImages`, `setBrokenImages`; broken image path uses `onError` → `setBrokenImages`
- `src/pages/loans/steps/ContactInfoForm.jsx` — props-only, no context; `errors` array drives error list render
- `src/context/LanguageContext.jsx` — `LanguageProvider`, `useLanguage()`; default context value is `{ language: 'en', toggleLanguage: () => {} }`
- `src/pages/loans/useLoanWizard.js` — calls `useLanguage()`; wrap all hook tests in `LanguageProvider`

### Test infrastructure (read to understand setup)
- `.planning/phases/01-test-infrastructure/01-CONTEXT.md` — D-01 through D-19: Vitest config, jsdom env, setupFiles, mock patterns
- `tests/unit/setup.js` — RTL cleanup and jest-dom matchers already registered here
- `vite.config.js` — test block with `include: tests/unit/**`, `globals: true`, `mockReset: true`, `restoreMocks: true`

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `LanguageProvider` from `src/context/LanguageContext.jsx` — use as `renderHook` wrapper for all HOOK tests (D-06)
- `tests/unit/setup.js` — already imports `@testing-library/jest-dom` matchers; no need to import in individual test files

### Established Patterns
- ESM throughout — use `import`/`export` in all test files, no `require()`
- `import.meta.env.VITE_API_URL` used in `payloads.js` `sendPayload` — use `vi.stubEnv` if needed (only relevant if testing `sendPayload`, which is not in scope for UNIT-03)
- No TypeScript — `.js` and `.jsx` only

### Integration Points
- All 7 test files are new — no existing test files to modify
- Tests land in `tests/unit/` — Vitest picks them up automatically via the `include` glob

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-unit-tests*
*Context gathered: 2026-04-03*

# Phase 2: Unit Tests - Research

**Researched:** 2026-04-03
**Domain:** Vitest 4.x + React Testing Library 16.x unit testing for React 19 SPA
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Test ALL exports in `validators.js` — full file coverage including trivial functions
- **D-02:** `validateForm111()` — include one test asserting it returns `null`
- **D-03:** `updateItem()` — include test covering sessionStorage write + read behavior
- **D-04:** `updateAmount()` — include test asserting it returns its input unchanged
- **D-05:** All 15 true validator functions tested for both valid input (returns `null`) and invalid input (returns expected error string)
- **D-06:** ALL `useLoanWizard` hook tests wrap `renderHook` in `LanguageProvider`
- **D-07:** Use a shared wrapper helper in `useLoanWizard.test.js`: `const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>` then `renderHook(() => useLoanWizard(), { wrapper })`
- **D-08:** No exception to the LanguageProvider wrapper rule — apply even when language doesn't affect the scenario being tested
- **D-09:** Use `toBeCloseTo(expected, 2)` for all numeric results from `calculatePayments()`
- **D-10:** Choose test inputs freely (not constrained to integer-friendly values)
- **D-11:** Apply `toBeCloseTo` to `monthlyPayment`, `totalInterestPaid`, `totalPaid`, `loanAmount`; `months` is an integer — use exact `toBe`
- **D-12:** `ContactInfoForm` receives all state as props — test in full isolation, no context or hook needed
- **D-13:** Pass a minimal `copy` object stub with only the placeholder strings the component renders
- **D-14:** `StepOptions` receives `options`, `selectedValue`, `onSelect`, `brokenImages`, `setBrokenImages` as props — test in full isolation
- **D-15:** Simulate broken image via `fireEvent.error(imgElement)` — triggers `onError` which calls `setBrokenImages`
- **D-16:** `LanguageContext.test.jsx` tests the toggle using the real `LanguageProvider` and a simple consumer component
- **D-17:** Assert English labels render by default; after `toggleLanguage()` fires, Spanish labels render
- **D-18:** All test files in plain `.js` / `.jsx` — no TypeScript
- **D-19:** Files live under `tests/unit/` — picked up by Vitest `include: tests/unit/**` pattern
- **D-20:** Use `vi.stubEnv('VITE_API_URL', 'http://test.local')` in any test that imports a module referencing `import.meta.env.VITE_API_URL`

### Claude's Discretion

- Exact test input values for `calculatePayments()` (any reasonable vehicle price / term / rate)
- Order of test cases within each file
- Whether to use `describe` blocks to group related cases within a file
- Exact mock prop values for `ContactInfoForm` and `StepOptions` tests
- Whether `validators.test.js` uses one `describe` per function or a flat list

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| UNIT-01 | `calculatePayments()` returns correct monthly payment, total interest, total paid for known inputs | Source fully read; formula verified; `toBeCloseTo` precision pattern confirmed |
| UNIT-02 | `calculatePayments()` handles edge cases (zero down payment, minimum term) | Source handles `downPayment=0` via `Number(downPayment) \|\| 0`; zero-vehicle-price returns `{error}` object |
| UNIT-03 | `buildPreApprovalPayload()` correctly trims and maps all fields to payload shape | Source fully read; all 8 `contactInfo` fields trimmed; top-level string fields trimmed; pure function, no env needed |
| UNIT-04 | `validators.js` functions return correct error strings or null for valid/invalid inputs | All 16 exports audited (note: source has 16, not 15 — see Pitfall 1) |
| COMP-01 | `StepOptions` renders image buttons for options with img paths | Source fully read; props interface confirmed; `aria-pressed` attribute queryable |
| COMP-02 | `StepOptions` renders text fallback when image fails to load | `fireEvent.error` on `<img>` triggers `onError` → `setBrokenImages` — confirmed in source |
| COMP-03 | `ContactInfoForm` displays validation errors when contactInfoErrors array is non-empty | `errors.length > 0` gate renders error list; `errors` prop drives `<ul>` rendering |
| COMP-04 | Language toggle: component re-renders with Spanish labels when language switches to `'es'` | `copyByLanguage.es` contains all Spanish strings; toggle confirmed in `LanguageContext` source |
| HOOK-01 | `useLoanWizard` advances stepIndex on `handleSelect` | Advances when `!isLastStep` and no special-case branch matches |
| HOOK-02 | `useLoanWizard` skips cosigner steps when `'by-myself'` is selected | `findIndex('employment')` = index 4; cosigner step at index 1 — skip jumps from 1 to 4 |
| HOOK-03 | `useLoanWizard` blocks advance in `handleContactInfoContinue` when required fields missing | 8 required fields checked; missing fields collected into error array |
| HOOK-04 | `useLoanWizard` blocks advance in `handleContactInfoContinue` on invalid email format | Regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/u` checked; error pushed to `contactInfoErrors` |
| HOOK-05 | `useLoanWizard` blocks advance when phone is not 10 digits | `phoneDigits.length !== 10` check; non-numeric chars stripped before count |
</phase_requirements>

---

## Summary

This phase writes 7 unit test files against existing source code without modifying it. The test infrastructure from Phase 1 is already in place: Vitest 4.1.2 with jsdom environment, `@testing-library/react` 16.3.2 (React 19 compatible), `vi.stubEnv` for env mocking, and `vi.unstubAllEnvs()` called in `afterEach` by `setup.js`.

The key technical findings are: (1) the source file `validators.js` exports **16** functions, not 15 — the ROADMAP says "13 validator functions" but CONTEXT.md D-05 says "15 true validator functions" — the actual count from source is 16 named exports; (2) `useLoanWizard` calls `import.meta.env.VITE_API_URL` in four places (echo, findback, validate-zipcode, uploadDocuments) — hook tests that exercise those code paths must stub the env var AND mock `global.fetch`; (3) `window.alert` in jsdom is a no-op and does not need mocking for hook tests to pass; (4) `sessionStorage` is available in jsdom 26.x and `updateItem()` will work without any special setup.

**Primary recommendation:** Write tests in the order: utilities first (pure functions, no mocking), then components (props-only isolation, no mocking), then hook (most setup required). Within hook tests, only mock `fetch` for tests that exercise network-calling handlers; tests for `handleContactInfoContinue`, `handleSelect`, and the cosigner skip branch do not reach any `fetch` call and need only the `LanguageProvider` wrapper.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | 4.1.2 | Test runner, `vi` utilities | Already configured in `vite.config.js` |
| @testing-library/react | 16.3.2 | `render`, `renderHook`, `screen`, `fireEvent` | React 19 compatible (peer deps: React 18 or 19) |
| @testing-library/jest-dom | 6.9.1 | `toBeInTheDocument`, `toHaveTextContent` matchers | Already registered in `tests/unit/setup.js` |
| @testing-library/user-event | 14.6.1 | High-level user interactions (optional for this phase) | Available; `fireEvent` sufficient for most tests here |
| jsdom | 26.1.0 | DOM environment | Provides `sessionStorage`, `window.alert` (no-op), DOM APIs |

**Installation:** Nothing new to install. All libraries are present in `node_modules`.

### Runtime APIs Available in jsdom 26.x

| API | Available | Notes |
|-----|-----------|-------|
| `sessionStorage` | Yes | Full read/write support — `updateItem()` tests work as-is |
| `window.alert` | Yes (no-op) | Does not throw; `handleZipCodeContinue` tests can run without mocking |
| `fetch` | No in jsdom | jsdom 26.x does not provide `fetch`; Node 25.2 provides it globally via undici — available in Vitest process |
| `FormData` | Yes | Available in jsdom 26.x |

---

## Architecture Patterns

### Recommended Test File Structure

```
tests/unit/
├── loanCalculator.test.js    # pure function — no setup
├── payloads.test.js          # pure function — no env stub needed (sendPayload not tested)
├── validators.test.js        # pure functions — no setup
├── StepOptions.test.jsx      # RTL render, fireEvent.error, no context
├── ContactInfoForm.test.jsx  # RTL render, props-only, no context
├── LanguageContext.test.jsx  # RTL render with real LanguageProvider + consumer
└── useLoanWizard.test.js     # renderHook with LanguageProvider wrapper, vi.stubEnv + fetch mock for network tests
```

### Pattern 1: Pure Function Test (no imports of env or React)

**What:** Import the function directly, call it, assert with `expect`.
**When to use:** `loanCalculator.test.js`, `payloads.test.js`, `validators.test.js`

```js
// loanCalculator.test.js
import { calculatePayments, formatCurrency } from '../../src/utils/loanCalculator.js'

describe('calculatePayments', () => {
  it('returns correct monthly payment for standard inputs', () => {
    const result = calculatePayments({
      vehiclePrice: 25000,
      downPayment: 3000,
      loanTerm: 60,
      interestRate: 6.5,
    })
    expect(result.months).toBe(60)                        // integer — exact toBe
    expect(result.loanAmount).toBeCloseTo(22000, 2)       // floating — toBeCloseTo precision 2
    expect(result.monthlyPayment).toBeCloseTo(430.16, 2)
    expect(result.totalInterestPaid).toBeCloseTo(3809.60, 2)
    expect(result.totalPaid).toBeCloseTo(25809.60, 2)
  })

  it('returns error object when vehiclePrice is 0', () => {
    const result = calculatePayments({ vehiclePrice: 0, downPayment: 0, loanTerm: 60, interestRate: 5 })
    expect(result).toEqual({ error: 'Please enter a vehicle price.' })
  })

  it('defaults loanTerm to 72 when not provided', () => {
    const result = calculatePayments({ vehiclePrice: 20000, downPayment: 0 })
    expect(result.months).toBe(72)
  })
})
```

### Pattern 2: Component Test with Props Isolation

**What:** `render(<Component ...props />)`, assert DOM, use `fireEvent` for interactions.
**When to use:** `StepOptions.test.jsx`, `ContactInfoForm.test.jsx`

```jsx
// StepOptions.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import StepOptions from '../../src/pages/loans/StepOptions.jsx'

const baseOptions = [
  { value: 'opt1', img: '/images/opt1.png', alt: 'Option 1', label: 'Option 1' },
]

it('renders an img element for options with an img path', () => {
  const setBrokenImages = vi.fn()
  render(
    <StepOptions
      options={baseOptions}
      selectedValue={null}
      onSelect={vi.fn()}
      brokenImages={{}}
      setBrokenImages={setBrokenImages}
    />
  )
  expect(screen.getByAltText('Option 1')).toBeInTheDocument()
})

it('renders text fallback when image is marked broken', () => {
  render(
    <StepOptions
      options={baseOptions}
      selectedValue={null}
      onSelect={vi.fn()}
      brokenImages={{ '/images/opt1.png': true }}
      setBrokenImages={vi.fn()}
    />
  )
  expect(screen.queryByAltText('Option 1')).not.toBeInTheDocument()
  expect(screen.getByText('Option 1')).toBeInTheDocument()
})

it('calls setBrokenImages with the img path when image errors', () => {
  const setBrokenImages = vi.fn()
  render(
    <StepOptions
      options={baseOptions}
      selectedValue={null}
      onSelect={vi.fn()}
      brokenImages={{}}
      setBrokenImages={setBrokenImages}
    />
  )
  const img = screen.getByAltText('Option 1')
  fireEvent.error(img)
  expect(setBrokenImages).toHaveBeenCalledOnce()
})
```

### Pattern 3: Context Consumer Test

**What:** Render a simple inline consumer component inside the real `LanguageProvider`, trigger toggle, assert re-render.
**When to use:** `LanguageContext.test.jsx`

```jsx
// LanguageContext.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../../src/context/LanguageContext.jsx'

function TestConsumer() {
  const { language, toggleLanguage } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  )
}

it('defaults to English', () => {
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  expect(screen.getByTestId('lang')).toHaveTextContent('en')
})

it('switches to Spanish after toggle', () => {
  render(<LanguageProvider><TestConsumer /></LanguageProvider>)
  fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
  expect(screen.getByTestId('lang')).toHaveTextContent('es')
})
```

### Pattern 4: Hook Test with LanguageProvider Wrapper

**What:** `renderHook(() => useLoanWizard(), { wrapper })` where wrapper is the LanguageProvider component.
**When to use:** `useLoanWizard.test.js` — ALL tests in this file, no exceptions (D-06).

```jsx
// useLoanWizard.test.js
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider } from '../../src/context/LanguageContext.jsx'
import useLoanWizard from '../../src/pages/loans/useLoanWizard.js'

// Shared wrapper — define once at top of file
const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

describe('handleSelect — step advance', () => {
  it('advances stepIndex from 0 to 1 when loan type is selected', () => {
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    expect(result.current.stepIndex).toBe(0)
    act(() => {
      result.current.handleSelect('autoloan')
    })
    expect(result.current.stepIndex).toBe(1)
  })
})
```

### Pattern 5: Hook Test with fetch Mock

**What:** Mock `global.fetch` with `vi.fn()` before tests that exercise network-calling handlers.
**When to use:** Any hook test exercising `handleZipCodeContinue`, `handleDocumentUpload`, or the review step.

```jsx
// Not in scope for HOOK-01 through HOOK-05, but documented for awareness
beforeEach(() => {
  vi.stubEnv('VITE_API_URL', 'http://test.local')
  global.fetch = vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ valid: true, city: 'Test City' }),
    ok: true,
  })
})
```

### Anti-Patterns to Avoid

- **Importing `expect` from vitest explicitly:** `globals: true` in `vite.config.js` makes `expect`, `vi`, `describe`, `it`, `test`, `beforeEach`, `afterEach` available globally — do not import them.
- **Using `require()` in test files:** The project is `"type": "module"` throughout; use `import`/`export` only.
- **Testing `sendPayload` in `payloads.test.js`:** It calls `fetch` and `import.meta.env` — CONTEXT.md explicitly says it is not in scope for UNIT-03. Test `buildPreApprovalPayload` only.
- **Calling `act()` without `async` for synchronous state updates:** For synchronous `setState` calls inside handlers, wrapping in `act(() => { ... })` synchronously is sufficient and correct.
- **Nesting `LanguageProvider` inside the test body separately from the wrapper:** Pass it only via the `wrapper` option; do not double-wrap.

---

## Source File Audit: Critical Details

### `src/utils/validators.js` — 16 exports, not 15

The ROADMAP says "13 validator functions" and CONTEXT.md D-05 says "15 true validator functions," but the actual source exports **16 named functions**:

1. `validateForm5` — complex multi-field validator
2. `validateForm9` — time-at-job validator
3. `validateForm91` — cosigner time-at-job validator
4. `validateForm11` — monthly income
5. `validateForm111` — always returns `null` (D-02: test this)
6. `validateForm13` — down payment
7. `validateForm14` — DTI numbers
8. `validateForm15` — repo history
9. `validateForm15cosigner` — cosigner repo history
10. `validateForm17` — zip code
11. `validateForm19` — contact form fields
12. `validateForm20` — consent checkboxes
13. `signupDemoForm` — dealer signup
14. `validateFormHomepage` — homepage form
15. `updateItem` — sessionStorage write+read (D-03: test sessionStorage behavior)
16. `updateAmount` — passthrough (D-04: test returns input unchanged)

**Decision:** CONTEXT.md D-01 says "ALL exports" — write tests for all 16.

### `src/pages/loans/loanSteps.js` — Step array (stable, 19 steps)

`getSteps()` produces a fixed-order array. Step indices used in hook tests:

| Index | Step ID | Notes |
|-------|---------|-------|
| 0 | `loan-type` | Initial step; hook starts here |
| 1 | `cosigner` | Selecting `'by-myself'` triggers skip to index 4 |
| 2 | `cosigner-relative` | Skipped by `'by-myself'` path |
| 3 | `same-address` | Skipped by `'by-myself'` path |
| 4 | `employment` | Target of cosigner skip (`findIndex('employment')`) |
| 11 | `dti` | options: [] — empty array step |
| 16 | `contact-info` | options: [] — renders ContactInfoForm |
| 17 | `review` | options: one `null`-img button |
| 18 | `upload-documents` | Last step |

### `src/pages/loans/useLoanWizard.js` — Import map and env references

**Imports:**
- `useLanguage` from `LanguageContext` — requires `LanguageProvider` wrapper in all hook tests
- `copyByLanguage`, `getSteps` from `loanSteps` — no stubbing needed, pure data
- `buildPreApprovalPayload`, `sendPayload` from `payloads` — `sendPayload` calls `fetch`

**`import.meta.env.VITE_API_URL` references:**
- Line 140: `sendPreApprovalPayload` → called from `handleContactInfoContinue` after validation passes
- Line 162: `sendFindBankPayload` → called from `handleSelect` when `step.id === 'review'`
- Line 257: `handleZipCodeContinue` → direct fetch call
- Line 362: `handleDocumentUpload` → direct fetch call

**Which HOOK tests (01-05) need `vi.stubEnv` + fetch mock:**
- HOOK-01 (step advance on loan-type) — no network call
- HOOK-02 (cosigner skip) — no network call
- HOOK-03 (contact missing fields) — `handleContactInfoContinue` fails validation before reaching `sendPreApprovalPayload`; no network call
- HOOK-04 (invalid email) — same as HOOK-03; validation error exits before network
- HOOK-05 (invalid phone) — same as HOOK-03; validation error exits before network

**Conclusion:** HOOK-01 through HOOK-05 as specified do not exercise network code paths. `vi.stubEnv` is NOT required for these 5 specific tests. The env is only relevant if tests advance far enough to trigger `sendPreApprovalPayload` or `sendFindBankPayload`.

### `src/pages/loans/StepOptions.jsx` — Returns array, not single element

`StepOptions` returns `options.map(...)` — a React array, not a single root element. This is valid in React 19. `render(<StepOptions .../>)` in RTL works correctly; query by `screen.getByAltText()` or `screen.getByRole('button')`.

### `src/pages/loans/steps/ContactInfoForm.jsx` — Props interface

The component's `onChange` prop is called as `onChange('fieldName')` which must return an event handler function. When mocking: `const onChange = vi.fn().mockReturnValue(vi.fn())` — the outer `vi.fn()` captures field name calls, the inner returns a no-op event handler. For error display tests, only `errors`, `contactInfo`, `copy`, `onChange`, `onContinue` need to be passed; the component renders conditionally on `errors.length > 0`.

Minimal `copy` stub for `ContactInfoForm`:
```js
const copy = {
  firstNamePlaceholder: 'First Name',
  lastNamePlaceholder: 'Last Name',
  emailPlaceholder: 'Email Address',
  addressPlaceholder: 'Home Address',
  cityPlaceholder: 'City',
  statePlaceholder: 'State',
  zipPlaceholderForm: 'Zip Code',
  phonePlaceholder: 'Phone Number',
  continue: 'Continue',
}
```

Minimal `contactInfo` stub:
```js
const contactInfo = {
  firstName: '', lastName: '', email: '', address: '',
  city: '', state: '', zip: '', phone: '',
}
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Act warnings for async state | Custom async flushers | `act()` from `@testing-library/react` | Handles React 19's scheduler correctly |
| Broken image simulation | Custom DOM events | `fireEvent.error(imgElement)` | RTL's `fireEvent` correctly dispatches the error event that triggers `onError` |
| sessionStorage isolation | Manual clear calls | Vitest's jsdom resets between test files; within a file, call `sessionStorage.clear()` in `beforeEach` if needed | jsdom resets state per test file automatically |
| Context wrapping boilerplate | Separate wrapper component file | Inline `const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>` at top of the test file | Simple, co-located, matches D-07 verbatim |

---

## Common Pitfalls

### Pitfall 1: Validator export count mismatch

**What goes wrong:** Implementing 13 or 15 tests and missing 1-3 exports.
**Why it happens:** The ROADMAP says "13" and CONTEXT.md says "15" but the source has **16** named exports. The discrepancy is a documentation artifact.
**How to avoid:** Always drive the test list from the actual source file, not from docs. The correct list is the 16 functions enumerated in the Source File Audit above.
**Warning signs:** A `describe` block with fewer entries than `grep "^export function" src/utils/validators.js` returns.

### Pitfall 2: Forgetting `act()` wrapper for hook state updates

**What goes wrong:** `result.current.stepIndex` reads the stale value before the state update is flushed; test asserts wrong value.
**Why it happens:** Vitest + React 19 still require state updates from outside React's render cycle to be wrapped in `act()`.
**How to avoid:** Always wrap `result.current.handleSelect(...)` and other imperative calls in `act(() => { ... })`.
**Warning signs:** Test passes but produces "not wrapped in act" console warning; or assertion on `stepIndex` after a handler call returns the old value.

### Pitfall 3: Double-importing globals

**What goes wrong:** `import { describe, it, expect, vi } from 'vitest'` at top of every file when globals are enabled.
**Why it happens:** Forgetting `globals: true` is set in `vite.config.js`.
**How to avoid:** Do not add vitest imports to test files. The globals (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`) are injected automatically.
**Warning signs:** ESLint may flag undefined globals if eslint config doesn't know about vitest globals — that's an ESLint issue, not a test runtime issue.

### Pitfall 4: `vi.stubEnv` for hook tests that don't reach network code

**What goes wrong:** Unnecessary `vi.stubEnv` clutters the test or, worse, forgetting it in tests that DO reach network code.
**Why it happens:** The hook imports `payloads.js` which doesn't itself read `import.meta.env` — only `useLoanWizard.js` does inside its handler closures. Import-time evaluation does not trigger the env reference.
**How to avoid:** Only stub env in tests where the handler under test calls a function that reaches `import.meta.env.VITE_API_URL`. HOOK-01 through HOOK-05 as specified do not require `vi.stubEnv`.
**Warning signs:** Tests passing without `vi.stubEnv` — that's correct; the env is read lazily inside handlers.

### Pitfall 5: `onChange` mock in `ContactInfoForm` tests

**What goes wrong:** Passing `onChange={vi.fn()}` directly causes a runtime error because `ContactInfoForm` calls `onChange('fieldName')` and uses the return value as an event handler.
**Why it happens:** `onChange` is a curried function: `onChange('field')` returns an event handler.
**How to avoid:** Use `vi.fn().mockReturnValue(vi.fn())` so calling `onChange('firstName')` returns a function that can be assigned to `onChange` prop of the `<input>`.
**Warning signs:** TypeError "onChange(...) is not a function" in the rendered output.

### Pitfall 6: `StepOptions` returns an array — wrapping in a container

**What goes wrong:** RTL `render()` of a component that returns an array (no single root) may require a `<div>` wrapper in some edge cases.
**Why it happens:** `StepOptions` does `return options.map(...)` with no wrapping element.
**How to avoid:** RTL handles React array returns correctly — no wrapper needed in tests. If you encounter issues, wrap in `<div><StepOptions .../></div>`.
**Warning signs:** "Invalid hook call" or render errors — these indicate a different problem (likely missing React import), not the array return.

### Pitfall 7: `window.alert` in hook tests

**What goes wrong:** Concern that `handleZipCodeContinue` calling `window.alert()` will throw or block the test.
**Why it happens:** Browsers block on `alert()`; testers assume jsdom does too.
**How to avoid:** jsdom 26.x implements `window.alert` as a no-op. No mocking required. If you want to assert the alert was called: `vi.spyOn(window, 'alert')`.
**Warning signs:** None — it silently passes through.

---

## Code Examples

### `calculatePayments` — verified math for test assertion values

The formula (from source):
```
monInt = annInterest / 1200
loanAmount = vehiclePrice - downPayment
monthlyPayment = (monInt + monInt / (Math.pow(1 + monInt, months) - 1)) * loanAmount
totalInterestPaid = monthlyPayment * months - loanAmount
totalPaid = totalInterestPaid + loanAmount
```

For `vehiclePrice=25000, downPayment=3000, loanTerm=60, interestRate=6.5`:
- `monInt` = 6.5 / 1200 = 0.00541667
- `loanAmount` = 22000
- `monthlyPayment` ≈ 430.16
- `totalInterestPaid` ≈ 3809.60
- `totalPaid` ≈ 25809.60

For edge case `vehiclePrice=0`: returns `{ error: 'Please enter a vehicle price.' }`
For edge case `downPayment=0`: works normally, `loanAmount = vehiclePrice`
For edge case `loanTerm` not provided: defaults to 72 (via `Number(loanTerm) || 72`)
For edge case `interestRate` not provided: defaults to 11.33 (via `Number(interestRate) || 11.33`)

### `buildPreApprovalPayload` — test shape

```js
import { buildPreApprovalPayload } from '../../src/pages/loans/payloads.js'

it('trims all string fields', () => {
  const result = buildPreApprovalPayload({
    language: 'en',
    answers: { 'loan-type': 'autoloan' },
    otherMonthlyIncome: '  2500  ',
    otherDownPayment: '  1000  ',
    jobTitle: '  Engineer  ',
    timeAtJobMonths: '8',
    monthlyDebt: '  500  ',
    grossMonthlyIncome: '  4000  ',
    zipCode: '  90210  ',
    contactInfo: {
      firstName: '  John  ', lastName: '  Doe  ',
      email: '  j@j.com  ', address: '  123 Main  ',
      city: '  LA  ', state: '  CA  ',
      zip: '  90210  ', phone: '  5551234567  ',
    },
    summary: [],
  })

  expect(result.jobTitle).toBe('Engineer')
  expect(result.zipCode).toBe('90210')
  expect(result.contactInfo.firstName).toBe('John')
  expect(result.contactInfo.email).toBe('j@j.com')
  expect(result.timeAtJobMonths).toBe('8')      // not trimmed — it's not a string trim
  expect(result.answers).toEqual({ 'loan-type': 'autoloan' })
})
```

Note: `timeAtJobMonths` and `summary` are passed through unchanged (no `.trim()` in source).

### `renderHook` wrapper — exact pattern (D-07)

```jsx
import { renderHook, act } from '@testing-library/react'
import { LanguageProvider } from '../../src/context/LanguageContext.jsx'
import useLoanWizard from '../../src/pages/loans/useLoanWizard.js'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

it('starts at step 0', () => {
  const { result } = renderHook(() => useLoanWizard(), { wrapper })
  expect(result.current.stepIndex).toBe(0)
})
```

### Cosigner skip branch (HOOK-02)

```jsx
it('skips from cosigner step to employment step when by-myself selected', () => {
  const { result } = renderHook(() => useLoanWizard(), { wrapper })

  // Advance from step 0 (loan-type) to step 1 (cosigner)
  act(() => { result.current.handleSelect('autoloan') })
  expect(result.current.stepIndex).toBe(1)
  expect(result.current.step.id).toBe('cosigner')

  // Select by-myself — triggers findIndex('employment') = 4
  act(() => { result.current.handleSelect('by-myself') })
  expect(result.current.stepIndex).toBe(4)
  expect(result.current.step.id).toBe('employment')
})
```

### Contact validation guards (HOOK-03, HOOK-04, HOOK-05)

These tests must navigate to the `contact-info` step (index 16) before calling `handleContactInfoContinue`. Rather than navigating through 16 steps manually, use `act` to set state indirectly:

**Challenge:** `setStepIndex` is internal to the hook and not exposed in the returned API. The returned object does not include `setStepIndex`.

**Solution:** Navigate through steps programmatically by calling `handleSelect` for image-button steps. The steps from index 0 to 16 require specific selections. A simpler approach: only assert that `handleContactInfoContinue` populates `contactInfoErrors` without worrying about `stepIndex` — the contactInfo state can be pre-populated by calling `handleContactInfoChange` before the test assertion.

```jsx
it('populates contactInfoErrors when required fields are missing', () => {
  const { result } = renderHook(() => useLoanWizard(), { wrapper })
  // contactInfo starts empty — calling handleContactInfoContinue immediately
  // will hit the missing fields check
  act(() => { result.current.handleContactInfoContinue() })
  expect(result.current.contactInfoErrors.length).toBeGreaterThan(0)
  // stepIndex should NOT have advanced (still at 0, since validation blocked it)
  expect(result.current.stepIndex).toBe(0)
})

it('populates contactInfoErrors with email error on invalid email format', () => {
  const { result } = renderHook(() => useLoanWizard(), { wrapper })
  // Set an invalid email via handleContactInfoChange
  act(() => {
    result.current.handleContactInfoChange('email')({ target: { value: 'not-an-email' } })
  })
  act(() => { result.current.handleContactInfoContinue() })
  const errors = result.current.contactInfoErrors
  expect(errors.some(e => e.includes('email'))).toBe(true)
})
```

**Important insight:** `handleContactInfoContinue` checks `isLastStep` — if `stepIndex === steps.length - 1` (18), it early-returns. Since the hook initializes at step 0 and `steps.length` is 19, `isLastStep` is false at step 0. The validation logic runs normally regardless of the current step. Tests do NOT need to navigate to step 16 first.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|---------|
| Node.js | Test runner | Yes | 25.2.1 | — |
| vitest | All unit tests | Yes | 4.1.2 | — |
| @testing-library/react | Component + hook tests | Yes | 16.3.2 | — |
| @testing-library/jest-dom | DOM matchers | Yes | 6.9.1 | — |
| jsdom | DOM environment | Yes | 26.1.0 | — |
| fetch (global) | Hook tests with network | Yes (Node 25 undici) | Native | — |
| sessionStorage | `updateItem` test | Yes (jsdom 26) | — | — |

**Missing dependencies with no fallback:** None.

**Step 2.6: No new dependencies required. All tooling is installed.**

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `renderHook` from `@testing-library/react-hooks` | `renderHook` built into `@testing-library/react` | RTL v13 (2022) | No separate package needed |
| React 18 `act` from `react-dom/test-utils` | `act` from `@testing-library/react` | RTL v14+ | Single import for all test utilities |
| `jest.fn()` | `vi.fn()` | Vitest from day 1 | Same API, different import |
| `jest.stubEnv` | `vi.stubEnv` | Vitest 0.23+ | Confirmed present in vitest 4.1.2 type defs |

---

## Open Questions

1. **Validator count discrepancy across documents**
   - What we know: Source has 16 exports. ROADMAP says 13. CONTEXT.md says 15.
   - What's unclear: Whether any of the 16 are intentionally excluded by the user.
   - Recommendation: Follow D-01 ("Test ALL exports") — write 16 tests in `validators.test.js`. The planner should note this discrepancy and align on 16.

2. **Navigation to `contact-info` step for HOOK-03/04/05**
   - What we know: `handleContactInfoContinue` checks validation regardless of current `stepIndex` (except when `isLastStep`). The hook starts at step 0 (not step 18), so `isLastStep` is false.
   - What's unclear: Whether the user expects tests to navigate to step 16 first or to call the handler at step 0.
   - Recommendation: Call `handleContactInfoContinue` directly at step 0. The validation logic runs and `contactInfoErrors` is populated. This is the simplest correct approach and avoids complex step navigation in unit tests. Document this in plan so implementer understands the choice.

---

## Sources

### Primary (HIGH confidence)
- Source code read directly: `src/utils/loanCalculator.js`, `src/utils/validators.js`, `src/pages/loans/payloads.js`, `src/pages/loans/StepOptions.jsx`, `src/pages/loans/steps/ContactInfoForm.jsx`, `src/context/LanguageContext.jsx`, `src/pages/loans/useLoanWizard.js`, `src/pages/loans/loanSteps.js`
- `vite.config.js` — confirmed: `globals: true`, `environment: 'jsdom'`, `include: tests/unit/**`, `mockReset: true`, `restoreMocks: true`
- `tests/unit/setup.js` — confirmed: RTL cleanup + `vi.unstubAllEnvs()` in `afterEach`
- `package.json` + `node_modules` inspection — confirmed exact installed versions of all test libraries
- `node_modules/@testing-library/react/dist/index.js` — confirmed `renderHook` and `fireEvent` are exported
- `node_modules/vitest/dist/index.d.ts` — confirmed `vi.stubEnv` and `vi.unstubAllEnvs` are present in vitest 4.1.2 type definitions
- `node_modules/@testing-library/react/package.json` peerDependencies — confirmed React 19 support (`^18.0.0 || ^19.0.0`)

### Secondary (MEDIUM confidence)
- jsdom 26.x sessionStorage and `window.alert` availability: verified by direct Node.js instantiation of JSDOM

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all libraries verified at exact installed versions from `node_modules`
- Architecture (test patterns): HIGH — verified against actual source code structure and RTL 16.x API
- Pitfalls: HIGH — derived from direct source code reading and API inspection; not from training data alone

**Research date:** 2026-04-03
**Valid until:** 2026-07-03 (stable tooling; jsdom, RTL, and Vitest 4.x are not fast-moving)

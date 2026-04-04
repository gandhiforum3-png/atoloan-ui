# Phase 3: E2E Tests - Research

**Researched:** 2026-04-04
**Domain:** Playwright E2E testing of a React 19 SPA with mocked API responses
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Happy-path test asserts key milestones only — step 1 loads, zip accepted, contact form accepted, review step reached, bank result renders. Do NOT assert every step title.
- **D-02:** `/findback` mock must return a real bank so the bank name is assertable. Update `tests/e2e/mocks/api.js`: `{ banks: [{ name: 'Test Credit Union' }] }` (or equivalent shape the UI renders from).
- **D-03:** All 4 wizard tests (E2E-01 happy path, E2E-02 invalid zip, E2E-03 contact validation, E2E-04 cosigner skip) live in a single file: `tests/e2e/loan-wizard.spec.js` as separate `test()` blocks.
- **D-04:** Use a real minimal PDF fixture at `tests/e2e/fixtures/sample.pdf`. Tests set it on the file input via `page.setInputFiles()`.
- **D-05:** The fixture only needs to be a valid PDF — content doesn't matter since `/ratesheetuploader` is mocked.
- **D-06:** Use Playwright text/role selectors throughout — `page.getByRole()`, `page.getByText()`, `page.getByLabel()`. No `data-testid` attributes added to source files.
- **D-07:** No source file modifications of any kind — tests work with the app as-is.
- **D-08:** Add `npm run test`, `npm run test:unit`, `npm run test:e2e` to the existing `## Commands` section of CLAUDE.md.
- **D-09:** Add a new `## Testing` section explaining: test directories (`tests/unit/`, `tests/e2e/`), the shared mock fixture (`tests/e2e/mocks/api.js` and `registerAll(page)`), and a brief note on how to add new tests.

### Claude's Discretion

- Exact milestone selector strings (button labels, headings) — derive from source files
- Exact `sample.pdf` content (any minimal valid PDF bytes)
- Order of `test()` blocks within each spec file
- Whether to use `test.describe()` grouping within spec files
- Exact mock body shape for `/findback` beyond `{ banks: [{ name: 'Test Credit Union' }] }`
- Exact wording of the new CLAUDE.md Testing section

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| E2E-01 | Full happy-path loan wizard (loan type → cosigner → employment → income → zip → contact → review → find bank) completes without errors | Wizard step IDs, button labels, and flow documented in Selector Catalog below |
| E2E-02 | Invalid zip code input shows an error message and does not advance | `window.alert()` is the error mechanism — Playwright dialog handler needed |
| E2E-03 | Contact form with missing required fields shows validation errors and does not advance | Error container renders text "Fix the following:" + `<ul>` list items |
| E2E-04 | "By myself" cosigner selection skips cosigner steps and lands on employment step | `handleSelect` jumps to 'employment' step index when 'by-myself' selected |
| E2E-05 | PDF upload flow: file selected → upload triggered → section review appears with parsed data | `page.setInputFiles()` on unlabeled file input; section review heading pattern is "Review 1 of 7: Credit union info" |
| E2E-06 | Section review: confirm through all 7 sections → Save to Database button appears and triggers save | Button text "Confirm & Next" (sections 1–6), "Confirm" (section 7), then "Save to Database" appears |
| E2E-07 | View existing mode: bank list loads → selecting a bank loads its rate sheet | Mock shape mismatch — `/credit-unions` mock must return `{ credit_unions: [...] }` not a plain array |
| E2E-08 | Entering vehicle price, down payment, term, and interest rate renders a monthly payment value and pie chart | Calculator page uses labeled inputs; "Calculate" button; "Monthly Payment is:" text appears always; actual value replaces "---" |
| E2E-09 | Switching to Spanish on the home page changes navigation and hero labels to Spanish | Language toggle button `aria-label="Espanol"` (EN state); after click nav shows "Hogar", "Prestamo", etc. |
| E2E-10 | Switching to Spanish mid-wizard re-renders step titles and button labels in Spanish | Step title changes from EN to ES copy; "Continue" button becomes "Continuar" |
</phase_requirements>

---

## Summary

Phase 3 writes 4 Playwright spec files exercising the loan wizard, rate sheet uploader, loan calculator, and language toggle in a real Chromium browser. The test infrastructure is fully in place from Phase 1: `playwright.config.js`, `tests/e2e/mocks/api.js` with `registerAll(page)`, and the `npm run test:e2e` script. No source files are modified.

The primary challenge is deriving correct text/role selectors from the source without `data-testid` attributes. This research has fully catalogued every selector needed across all 4 spec files. One critical mock shape bug must be fixed before E2E-07 can pass: the `/credit-unions` GET mock returns a plain array but the `useRateSheetUploader` hook expects `data.credit_unions`. This must be addressed in the api.js update task.

The wizard happy-path flow (E2E-01) is the most complex test, traversing 19 steps. Strategy: click through image-button steps (images will fail to load in test env, triggering text-label fallback buttons), fill text inputs, and assert on key milestone headings/text per D-01.

**Primary recommendation:** Fix the `/credit-unions` mock shape in `api.js` as the very first task, then build each spec file using the Selector Catalog below as the authoritative reference.

---

## Project Constraints (from CLAUDE.md)

| Directive | Impact on Tests |
|-----------|-----------------|
| No TypeScript — JavaScript only | All spec files are `.spec.js` not `.spec.ts` |
| `import.meta.env.VITE_API_URL` for all API calls | Playwright intercepts at network layer via `page.route()` — already handled |
| React 19 SPA, Vite 7 | Dev server via `npm run dev`; `webServer.command` in playwright.config.js already set |
| No Redux/Zustand — local state only | No store hydration needed between tests; each test starts fresh at `page.goto()` |
| ESM throughout | `import { test, expect } from '@playwright/test'` — no `require()` |

---

## Standard Stack

### Core (already installed — verified from package.json)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@playwright/test` | installed | E2E test runner + assertions | Installed in Phase 1 |
| Chromium | via Playwright | Browser runtime | Installed in Phase 1 |

### Supporting

| Tool | Purpose | How Used |
|------|---------|---------|
| `page.route()` | Network interception | Already in `tests/e2e/mocks/api.js` via `registerAll(page)` |
| `page.setInputFiles()` | File input simulation | Used for PDF upload (E2E-05) |
| `page.on('dialog')` | Alert/confirm dialog handling | Needed for invalid-zip `window.alert()` (E2E-02) and confirm-delete dialogs |

**No new installations required.** All dependencies were installed in Phase 1.

---

## Architecture Patterns

### Established Pattern: `registerAll` before goto

From `tests/e2e/health.spec.js` and Phase 1 decisions (D-14):

```javascript
// Source: tests/e2e/mocks/api.js
import { test, expect } from '@playwright/test'
import { registerAll } from './mocks/api.js'

test('description', async ({ page }) => {
  await registerAll(page)
  await page.goto('/loans')
  // assertions...
})
```

Every test in every spec file MUST call `await registerAll(page)` before `page.goto()`.

### Recommended Project Structure

```
tests/e2e/
├── mocks/
│   └── api.js                    # existing — needs /findback + /credit-unions updates
├── fixtures/
│   └── sample.pdf                # NEW — minimal valid PDF binary
├── health.spec.js                # existing
├── loan-wizard.spec.js           # NEW — E2E-01, E2E-02, E2E-03, E2E-04
├── rate-sheet-uploader.spec.js   # NEW — E2E-05, E2E-06, E2E-07
├── loan-calculator.spec.js       # NEW — E2E-08
└── language-toggle.spec.js       # NEW — E2E-09, E2E-10
```

### Pattern: Image buttons in test environment

In the test environment, image files at `/images/*.png` will return 404 (no static assets served). `StepOptions.jsx` handles this via `onError` → `brokenImages` state → renders the text label as a `<span>` inside a `<button>`. This means ALL wizard image-option buttons will render as text fallbacks.

Selector strategy for image-button steps:
```javascript
// The button has no accessible role name from img alt — use getByText on the span label
await page.getByText('Auto Loans').click()        // loan-type step
await page.getByText('Full Time').click()          // employment step
```

The `<button>` element wrapping the fallback `<span>` has no `aria-label`, so `page.getByRole('button', { name: 'Auto Loans' })` may not match. Use `page.getByText()` for image-option buttons.

**Exception:** The "Find Bank" button on the review step has `option.img = null`, so it ALWAYS renders as a button with label text — `page.getByText('Find Bank')` works reliably.

### Pattern: Dialog handling for window.alert()

`handleZipCodeContinue` calls `window.alert(message)` on invalid zip:
```javascript
// Source: src/pages/loans/useLoanWizard.js line 268
window.alert(message)
```

Playwright auto-dismisses dialogs by default. To assert dialog text:
```javascript
page.on('dialog', async (dialog) => {
  expect(dialog.message()).toContain('valid zip code')
  await dialog.accept()
})
```

Register the handler BEFORE the action that triggers it.

### Pattern: Minimal valid PDF fixture

Create `tests/e2e/fixtures/sample.pdf` with minimal valid PDF bytes. The smallest valid PDF is approximately 67 bytes:

```
%PDF-1.0
1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj
2 0 obj<</Type /Pages /Kids[3 0 R] /Count 1>>endobj
3 0 obj<</Type /Page /MediaBox[0 0 3 3]>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer<</Size 4 /Root 1 0 R>>
startxref
190
%%EOF
```

Since `/ratesheetuploader` is mocked, content is irrelevant — only the `type: 'application/pdf'` MIME check in `handleFileChange` matters. The fixture file must have a valid PDF header (`%PDF-1.`) to avoid the MIME-type guard rejecting it based on extension. The `handleFileChange` guard checks `selected.type !== 'application/pdf'` — this is the browser MIME type from `file.type`, which Playwright sets based on file extension. A `.pdf` extension is sufficient.

### Anti-Patterns to Avoid

- **`await page.waitForTimeout(N)`**: Use `await page.waitForResponse()` or role-based assertions that auto-wait instead.
- **Asserting every step title**: D-01 explicitly forbids this — assert milestones only.
- **`data-testid` on source files**: D-07 forbids source file modification.
- **Strict-mode double-matching**: If `page.getByText('X')` matches multiple elements, narrow with `.first()` or use `.getByRole('heading', { name: 'X' })`.

---

## Selector Catalog

This is the authoritative reference for all selectors used across the 4 spec files. Derived directly from source code.

### Loan Wizard (`/loans`)

#### Step headings (rendered as `<h1>` in `Loans.jsx`)

| Step ID | EN Heading (h1) |
|---------|----------------|
| `loan-type` | `Select Loan Type` |
| `cosigner` | `Are You Applying With A Co-Signer?` |
| `cosigner-relative` | `Is Your Co-Signer A Relative?` |
| `same-address` | `Does Your Co-Signer Live At The Same Address?` |
| `employment` | `Select Employment Type` |
| `proof-of-income` | `Select Proof Of Income Type` |
| `monthly-income` | `Select Monthly Income` |
| `time-at-job` | `Choose Time At Job` |
| `drivers-license` | `Do You Have A Current Driver's License?` |
| `down-payment` | `Select Down Payment Amount` |
| `ssn-itin` | `Do You Have A Social Security Number or An ITIN Number?` |
| `dti` | `Let's Calculate Your Debt To Income Ratio` |
| `repo-history` | `Have You Ever Had A Repo?` |
| `residence-time` | `Your Time At Current Residence?` |
| `zip-code` | `Your Zip Code For Current Residence?` |
| `approval-info` | `What's the difference between approval and pre-approval?` |
| `contact-info` | `Provide Your Contact Information` |
| `review` | `Review & Continue` |
| `upload-documents` | `Upload Required Documents` |

#### Image-button option labels (EN, text fallback when image fails)

All rendered via `<span>{option.label}</span>` inside a `<button>`. Use `page.getByText(label)`.

| Step | Click to advance | Selector |
|------|-----------------|---------|
| `loan-type` | `Auto Loans` | `page.getByText('Auto Loans')` |
| `cosigner` (happy path) | `With Co-Signer` | `page.getByText('With Co-Signer')` |
| `cosigner` (skip path) | `By Myself` | `page.getByText('By Myself')` |
| `cosigner-relative` | `Relative` | `page.getByText('Relative')` |
| `same-address` | `Lives At Same Address` | `page.getByText('Lives At Same Address')` |
| `employment` | `Full Time` | `page.getByText('Full Time')` |
| `proof-of-income` | `Paystub` | `page.getByText('Paystub')` |
| `monthly-income` | `$3,000 Monthly` | `page.getByText('$3,000 Monthly')` |
| `drivers-license` | `Yes` | `page.getByText('Yes').first()` (may match multiple) |
| `down-payment` | `$0` | `page.getByText('$0')` |
| `ssn-itin` | `Social Security` | `page.getByText('Social Security')` |
| `repo-history` | `No` | `page.getByText('No').first()` |
| `residence-time` | `Over 1 Year` | `page.getByText('Over 1 Year')` |
| `approval-info` | `Continue` | `page.getByText('Continue').first()` (multiple "Continue" on page) |
| `review` | `Find Bank` | `page.getByText('Find Bank')` |

#### Special step components

| Step | Selector | Action |
|------|---------|--------|
| `time-at-job` (select option + job title) | `page.getByText('Over 2 Years')` | Click to select; then fill job title |
| `time-at-job` job title input | `page.getByPlaceholder("What's your job title?")` | Fill |
| `time-at-job` continue | `page.getByRole('button', { name: 'Continue' })` | Click (this Continue is from `TimeAtJobInput`) |
| `dti` skip | `page.getByRole('button', { name: 'Skip' })` | Click to skip DTI |
| `zip-code` input | `page.getByPlaceholder('Enter your zip code')` | Fill |
| `zip-code` continue | `page.getByRole('button', { name: 'Continue' })` | Click |
| `contact-info` first name | `page.getByPlaceholder('First Name')` | Fill |
| `contact-info` last name | `page.getByPlaceholder('Last Name')` | Fill |
| `contact-info` email | `page.getByPlaceholder('Email Address')` | Fill |
| `contact-info` address | `page.getByPlaceholder('Home Address')` | Fill |
| `contact-info` city | `page.getByPlaceholder('City')` | Fill (auto-filled from zip mock as 'Los Angeles') |
| `contact-info` state | `page.getByPlaceholder('State')` | Fill |
| `contact-info` zip | `page.getByPlaceholder('Zip Code')` | Fill (auto-populated from zip-code step) |
| `contact-info` phone | `page.getByPlaceholder('Phone Number')` | Fill |
| `contact-info` continue | `page.getByRole('button', { name: 'Continue' })` | Click |

#### Error selectors

| Error condition | Rendered by | Selector |
|----------------|-------------|---------|
| Invalid zip | `window.alert('Please enter a valid zip code.')` | `page.on('dialog', ...)` |
| Contact validation errors | `<strong>Fix the following:</strong>` + `<ul>` | `page.getByText('Fix the following:')` |
| Contact error items | `<li>` inside the error div | `page.getByText('Please fill in:')` (partial) |

#### Bank result (upload-documents step, after Find Bank)

The wizard advances to `upload-documents` step after `/findback`. The mock returns `{ banks: [] }` by default (needs update per D-02 to `{ banks: [{ name: 'Test Credit Union' }] }`).

Looking at `DocumentUpload.jsx`: it checks `findBankResponse?.data?.best_bank`. The `findBankResponse` from the hook is `{ receivedAt: ..., data: { banks: [...] } }`. There is NO rendering of `data.banks` in `DocumentUpload.jsx` — it only renders `data.best_bank`. The "Application Received" box appears when `findBankResponse?.data` exists (without `best_bank`).

**Implication for E2E-01:** The assertable bank result is the "Application Received" heading (`📋 Application Received`), not the bank name from `data.banks`. The D-02 note about asserting a bank name from `{ banks: [{ name: 'Test Credit Union' }] }` may need revision — the UI does not render `data.banks` directly. The `upload-documents` step heading (`Upload Required Documents`) is a simpler milestone assertion.

**Alternative:** Assert `page.getByText('Upload Required Documents')` as the final milestone (wizard reached upload-documents step after find bank call succeeded).

### Rate Sheet Uploader (`/ratesheetuploader`)

#### Upload mode selectors

| Element | Selector | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { name: 'Upload Ratesheet' })` | `<h1>` text from `rs.copy.title` |
| Mode toggle — upload | `page.getByText('Upload Ratesheet')` | `ModeToggle` button (includes emoji but getByText is partial) |
| Mode toggle — view existing | `page.getByText('View Existing Rate Sheet')` | `ModeToggle` button |
| File input | `page.getByLabel('Choose PDF file')` | `aria-label={rs.copy.selectFile}` on `<input type="file">` |
| Upload button | `page.getByRole('button', { name: 'Upload Ratesheet' })` | `<button type="submit">` with `rs.copy.submit` text |

#### Section review selectors (after upload)

| Element | Selector | Notes |
|---------|---------|-------|
| First section heading | `page.getByText('Review 1 of 7')` | Rendered as `Review {n} of 7: {sectionLabel}` |
| Section label (credit_union_info) | `page.getByText('credit union info')` | `toLabel()` converts underscores to spaces, lowercase |
| Confirm & Next button | `page.getByRole('button', { name: 'Confirm & Next' })` | Sections 1–6 |
| Confirm button (last section) | `page.getByRole('button', { name: 'Confirm' })` | Section 7 only |
| Save to Database button | `page.getByRole('button', { name: 'Save to Database' })` | Appears after all 7 confirmed |
| All sections confirmed banner | `page.getByText('All sections confirmed!')` | Partial match works |
| Save success message | `page.getByText('Successfully saved to database!')` | From `saveStatus.message` |

**Note on section labels:** `toLabel(key)` does `String(value).replace(/_/gu, ' ')`. Result is lowercase with spaces: `credit union info`, `rate policy`, `loan programs`, `guidelines`, `special programs`, `participation and funding`, `additional details`.

**Note on Save button text:** The button renders `'💾 Save to Database'` (with emoji). Use `page.getByRole('button', { name: /Save to Database/ })` with a regex to avoid emoji matching issues.

#### View existing mode selectors

| Element | Selector | Notes |
|---------|---------|-------|
| Bank select dropdown | `page.getByLabel('Select Credit Union / Bank:')` | `<label>` text in `BankSelector` |
| Bank option | `page.selectOption(selector, { label: 'Test Credit Union' })` | After mock returns bank list |
| Rate sheet loaded status | `page.getByText('Rate sheet loaded successfully')` | From `status.message` |

**CRITICAL MOCK BUG:** `useRateSheetUploader.js` line 45 expects:
```javascript
const creditUnions = data.credit_unions || []
```
But `tests/e2e/mocks/api.js` current mock for `GET /credit-unions` returns `[{ id: 1, name: 'Test Credit Union' }]` (a plain array). The hook will read `data.credit_unions` which will be `undefined`, and fall back to `[]`. Banks list will always be empty with the current mock.

**Fix required in api.js:**
```javascript
// GET /credit-unions — must return { credit_unions: [...] } not a plain array
body: JSON.stringify({ credit_unions: [{ id: 1, name: 'Test Credit Union' }] })
```

### Loan Calculator (`/loancalculator`)

| Element | Selector | Notes |
|---------|---------|-------|
| Page heading | `page.getByRole('heading', { name: 'Auto Loan Calculator' })` | `<h2>` text |
| Vehicle Price input | `page.getByLabel('Vehicle Price')` | `<label htmlFor="vehiclePrice">` |
| Down Payment input | `page.getByLabel('Down Payment')` | `<label htmlFor="downPayment">` |
| Loan Term input | `page.getByLabel('Loan Term Months')` | `<label htmlFor="loanTerm">` |
| Interest Rate input | `page.getByLabel('Interest Rate')` | `<label htmlFor="intRate">` |
| Calculate button | `page.getByRole('button', { name: 'Calculate' })` | `id="calculate"` |
| Monthly payment result text | `page.getByText('Monthly Payment is:')` | Always rendered (shows `---` before calc) |
| Payment value (after calc) | `page.locator('#paymentResults p').nth(1)` or `page.getByText(/\$\d+/)` | Shows `$XXX.XX / Month for N Years` |
| Total Interest Paid | `page.getByText('Total Interest Paid:')` | Always rendered |
| Canvas (chart) | `page.locator('#loanChart')` | `<canvas id="loanChart">` — present in DOM always, Chart.js fills it after Calculate |

**Calculator default values:** vehiclePrice=35000, downPayment=7000, loanTerm=72, interestRate=11.33. The "Calculate" button can be clicked without changing inputs — the result will render with these defaults.

**Asserting chart render:** The canvas element is always in the DOM. After clicking Calculate, Chart.js initializes. Assert canvas visibility: `await expect(page.locator('#loanChart')).toBeVisible()`. Chart.js may not render the chart in headless Chromium if the canvas is offscreen — use `page.evaluate(() => document.getElementById('loanChart').getContext('2d'))` to verify context is initialized, or simply assert a non-`---` value in the payment text.

### Language Toggle

| Element | Selector | Notes |
|---------|---------|-------|
| Language toggle button (EN state) | `page.getByRole('button', { name: 'Espanol' })` | `aria-label={labels.toggleAlt}` = `'Espanol'` when EN |
| Language toggle button (ES state) | `page.getByRole('button', { name: 'English' })` | `aria-label='English'` when ES |
| Home page EN headline | `page.getByText('Auto Financing')` | `<h1>` partial |
| Home page ES headline | `page.getByText('¡El auto nuevo comienza aquí!')` | Full h1 in ES |
| Nav Home link (EN) | `page.getByRole('link', { name: /Home/ })` | NavLink with `{labels.home}` |
| Nav Home link (ES) | `page.getByRole('link', { name: /Hogar/ })` | NavLink after toggle |
| Wizard step title (EN) | `page.getByRole('heading', { name: 'Select Loan Type' })` | `<h1>` on step 0 |
| Wizard step title (ES) | `page.getByRole('heading', { name: 'Seleccione Tipo De Prestamo' })` | After toggle |
| Wizard button (EN) | `page.getByText('Auto Loans')` | Image-button text fallback |
| Wizard button (ES) | `page.getByText('Prestamo De Auto')` | After toggle |

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---------|-------------|-------------|
| API mocking | Custom proxy/intercept server | `page.route()` + `route.fulfill()` — already in api.js |
| Dialog interception | JS monkey-patching of `window.alert` | `page.on('dialog', handler)` |
| File upload simulation | FormData construction in test | `page.setInputFiles(selector, path)` |
| Wait for network | `setTimeout` / polling | `page.waitForResponse()` or Playwright auto-wait |
| Minimal PDF creation | PDF library | Raw `%PDF-1.0` byte string — valid for MIME check |

---

## Common Pitfalls

### Pitfall 1: Image buttons — `getByRole` won't match

**What goes wrong:** In the test environment, images at `/images/*.png` 404. The `onError` handler fires and sets `brokenImages[img] = true`, so the fallback `<span>` renders. The `<button>` wrapping it has no `name` attribute set from the image alt (only the `<img>` had that). `page.getByRole('button', { name: 'Auto Loans' })` returns 0 elements.

**Why it happens:** `getByRole('button', { name })` computes accessible name from `aria-label`, button text content, or associated label. The fallback `<span>` provides text content, so `page.getByText('Auto Loans')` works but `getByRole('button', { name: 'Auto Loans' })` may not reliably.

**How to avoid:** Use `page.getByText('Auto Loans')` for image-option buttons. Use `page.getByRole('button', { name: 'Continue' })` only for non-image buttons (ZipCodeInput, ContactInfoForm, etc.).

**Warning signs:** Test hangs on `.click()` call; Playwright reports "waiting for getByRole(...)".

### Pitfall 2: `window.alert` blocks execution

**What goes wrong:** `handleZipCodeContinue` calls `window.alert()` on invalid zip. If no dialog handler is registered, Playwright auto-dismisses it — but if the test tries to assert the alert text after it's dismissed, it fails.

**Why it happens:** Playwright dismisses unhandled dialogs immediately. The `'dialog'` event fires synchronously.

**How to avoid:** Register `page.on('dialog', ...)` BEFORE the action that triggers the alert. The handler must call `dialog.accept()` or `dialog.dismiss()`.

### Pitfall 3: `/credit-unions` mock shape mismatch (BLOCKING for E2E-07)

**What goes wrong:** `useRateSheetUploader.js` reads `data.credit_unions` from the GET response. Current mock returns a plain array. `data.credit_unions` is `undefined`, so `banksList` stays `[]` and the select dropdown shows no options.

**Why it happens:** The mock was created with Claude's discretion (D-16 in Phase 1: "minimal valid JSON") without checking the hook's parsing logic.

**How to avoid:** Update the `GET **/credit-unions` mock body to `{ credit_unions: [{ id: 1, name: 'Test Credit Union' }] }` before writing E2E-07.

### Pitfall 4: "Find Bank" result — bank name not rendered in DocumentUpload

**What goes wrong:** D-02 expects to assert `{ banks: [{ name: 'Test Credit Union' }] }` from `/findback`. But `DocumentUpload.jsx` only renders `findBankResponse.data.best_bank` — it does NOT render `data.banks`. The `data.banks` array is never displayed.

**Why it happens:** The UI was designed for a different `/findback` response shape (`best_bank` not `banks`).

**How to avoid:** For E2E-01, assert the step progression milestone (heading "Upload Required Documents" appears) rather than a specific bank name. The "Application Received" div renders when `findBankResponse?.data` exists (which it will after the mock response). Assert `page.getByText('Application Received')`.

### Pitfall 5: `window.confirm` in delete flow

**What goes wrong:** `handleDeleteCurrentRateSheet` calls `window.confirm('Are you sure...')`. If not handled, Playwright dismisses it, which returns `false` — the delete is cancelled.

**Why it happens:** Playwright's auto-dismiss returns `false` for `confirm()` dialogs.

**How to avoid:** For any test exercising delete, register `page.on('dialog', d => d.accept())` before clicking delete.

### Pitfall 6: Contact form city is auto-populated

**What goes wrong:** After a valid zip code is accepted, `handleZipCodeContinue` sets `contactInfo.city = data.city` (from the mock: `'Los Angeles'`). On the contact step, the city field is already filled. Tests that try to fill it again may conflict.

**Why it happens:** The zip-code step mock returns `{ valid: true, city: 'Los Angeles' }`.

**How to avoid:** On the contact form step, skip filling the city field — it's already set. Only fill: firstName, lastName, email, address, state, phone.

### Pitfall 7: "Continue" button text appears on multiple steps

**What goes wrong:** The EN copy key `continue: 'Continue'` is used on ZipCodeInput, ContactInfoForm, TimeAtJobInput, DtiCalculator, and the approval-info step option. `page.getByRole('button', { name: 'Continue' })` may match multiple elements if rendered simultaneously.

**Why it happens:** Only one step renders at a time, but Playwright's strict mode (enabled by default) will throw if a locator matches multiple elements.

**How to avoid:** On the approval-info step, use `page.getByText('Continue').first()` since both "Continue" and "Exit" image buttons render. On special-step components, `getByRole('button', { name: 'Continue' })` is safe (only one).

### Pitfall 8: `fullyParallel: true` — test isolation

**What goes wrong:** Tests in different spec files run in parallel. Tests within a single spec file also run in parallel with `fullyParallel: true`. If tests share state (e.g., browser localStorage), they can interfere.

**Why it happens:** `playwright.config.js` sets `fullyParallel: true` (D-07 from Phase 1).

**How to avoid:** Each test gets its own browser context. No state is shared between tests. Each test calls `await registerAll(page)` independently. No cleanup needed.

---

## Code Examples

### Spec file structure (from health.spec.js pattern + Phase 1 decisions)

```javascript
// Source: tests/e2e/health.spec.js pattern + Phase 1 D-14
import { test, expect } from '@playwright/test'
import { registerAll } from './mocks/api.js'

test('test name', async ({ page }) => {
  await registerAll(page)
  await page.goto('/loans')
  // ...
})
```

### Dialog interception for invalid zip

```javascript
// Source: Playwright docs pattern — needed for window.alert() in handleZipCodeContinue
test('invalid zip shows error', async ({ page }) => {
  await registerAll(page)
  await page.goto('/loans')

  // Override /validate-zipcode to return invalid
  await page.route('**/validate-zipcode', route =>
    route.fulfill({ status: 200, contentType: 'application/json',
      body: JSON.stringify({ valid: false }) })
  )

  // Register dialog handler before triggering alert
  let alertMessage = ''
  page.on('dialog', async dialog => {
    alertMessage = dialog.message()
    await dialog.accept()
  })

  // Navigate to zip step and trigger validation...
  await page.getByPlaceholder('Enter your zip code').fill('00000')
  await page.getByRole('button', { name: 'Continue' }).click()

  expect(alertMessage).toContain('valid zip code')
  // Assert still on zip step
  await expect(page.getByRole('heading', { name: /Zip Code/ })).toBeVisible()
})
```

**Note:** Route registered after `registerAll` overrides the global mock for that route only within this test.

### File upload with setInputFiles

```javascript
// Source: Playwright docs — for tests/e2e/fixtures/sample.pdf
import path from 'path'
const FIXTURE_PDF = path.join(import.meta.dirname, 'fixtures', 'sample.pdf')

await page.getByLabel('Choose PDF file').setInputFiles(FIXTURE_PDF)
await page.getByRole('button', { name: 'Upload Ratesheet' }).click()
```

**Note:** `import.meta.dirname` requires Node 20.11+ or use `new URL('.', import.meta.url).pathname`.

### Confirm through all 7 sections

```javascript
// Click Confirm & Next 6 times, then Confirm once
for (let i = 0; i < 6; i++) {
  await page.getByRole('button', { name: 'Confirm & Next' }).click()
}
await page.getByRole('button', { name: 'Confirm' }).click()
await expect(page.getByText('All sections confirmed!')).toBeVisible()
await expect(page.getByRole('button', { name: /Save to Database/ })).toBeVisible()
```

### Minimal valid PDF for fixture file

The fixture file must exist as a real file at `tests/e2e/fixtures/sample.pdf`. Create it with a minimal PDF header. In Node.js (for a task that generates it):
```javascript
import { writeFileSync, mkdirSync } from 'fs'
mkdirSync('tests/e2e/fixtures', { recursive: true })
writeFileSync('tests/e2e/fixtures/sample.pdf',
  '%PDF-1.0\n1 0 obj<</Type /Catalog /Pages 2 0 R>>endobj\n' +
  '2 0 obj<</Type /Pages /Kids[3 0 R] /Count 1>>endobj\n' +
  '3 0 obj<</Type /Page /MediaBox[0 0 3 3]>>endobj\n' +
  'xref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n' +
  '0000000058 00000 n\n0000000115 00000 n\n' +
  'trailer<</Size 4 /Root 1 0 R>>\nstartxref\n190\n%%EOF\n'
)
```

---

## Environment Availability

| Dependency | Required By | Available | Notes |
|------------|------------|-----------|-------|
| `@playwright/test` | All E2E specs | Yes | In devDependencies |
| Chromium browser | All E2E specs | Installed in Phase 1 | Via `npx playwright install chromium` |
| `npm run dev` (Vite) | `webServer` in playwright.config.js | Yes | `reuseExistingServer: true` |
| `tests/e2e/fixtures/` dir | E2E-05 PDF upload | Does NOT exist | Must be created with `sample.pdf` |
| `tests/e2e/mocks/api.js` | All E2E specs | Exists | Needs 2 updates (findback + credit-unions) |

**Missing with no fallback:**
- `tests/e2e/fixtures/sample.pdf` — blocks E2E-05. Must be created as the first task in Plan 2.

**Blocking mock fixes:**
- `/findback` mock body: currently `{ banks: [] }` — needs `{ banks: [{ name: 'Test Credit Union' }] }` (D-02)
- `/credit-unions` GET mock: currently `[{ id: 1, ... }]` plain array — needs `{ credit_unions: [{ id: 1, name: 'Test Credit Union' }] }` to match hook parsing

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Cypress `cy.intercept()` | Playwright `page.route()` — already used | None — Playwright is the chosen tool |
| `page.waitForTimeout(N)` | Role/text locators with built-in auto-wait | Avoid all `waitForTimeout` calls |

**Note on Chart.js in headless Chromium:** Chart.js renders to a `<canvas>` element. In headless Chromium, canvas rendering works but visual pixel assertions are unreliable. Assert canvas existence (`.toBeVisible()`) rather than pixel-level chart content.

---

## Open Questions

1. **`findback` response — asserting bank name (E2E-01)**
   - What we know: D-02 says assert `{ banks: [{ name: 'Test Credit Union' }] }`. `DocumentUpload.jsx` does NOT render `data.banks`.
   - What's unclear: Is the "bank name assertion" meant to target the upload-documents step heading, or is a UI change needed?
   - Recommendation: Assert `page.getByText('Application Received')` (the info box that appears when `findBankResponse.data` exists) as the bank-step milestone. No source modification needed.

2. **`import.meta.dirname` availability**
   - What we know: Used for fixture path resolution in Node 20.11+. Playwright runs in Node.
   - What's unclear: Node version in the project environment.
   - Recommendation: Use `new URL('.', import.meta.url).pathname` as the path base — works in all ESM environments regardless of Node version.

3. **`sample.pdf` generation strategy**
   - What we know: Needs to be a real file at `tests/e2e/fixtures/sample.pdf`.
   - Recommendation: Use a Node script run as part of the task to write the minimal PDF bytes, or commit the binary directly.

---

## Sources

### Primary (HIGH confidence)

- `src/pages/loans/loanSteps.js` — All EN/ES copy strings, step IDs, option labels
- `src/pages/loans/useLoanWizard.js` — Step navigation logic, error messages, API calls
- `src/pages/loans/steps/ZipCodeInput.jsx` — Zip input placeholder, Continue button
- `src/pages/loans/steps/ContactInfoForm.jsx` — Field placeholders, error rendering pattern
- `src/pages/loans/StepOptions.jsx` — Image fallback rendering (text label in span)
- `src/pages/Loans.jsx` — How steps render (h1 title, conditional components)
- `src/pages/LoanCalculator.jsx` — Input labels, button text, result text, canvas id
- `src/pages/Home.jsx` — EN/ES headlines
- `src/components/Navbar.jsx` — Language toggle `aria-label`, nav link labels
- `src/pages/ratesheet/SectionReview.jsx` — Section review heading pattern, button labels
- `src/pages/ratesheet/ModeToggle.jsx` — Mode toggle button text
- `src/pages/ratesheet/BankSelector.jsx` — Select label, dropdown option rendering
- `src/pages/ratesheet/constants.js` — `reviewOrder`, `toLabel()` function
- `src/pages/ratesheet/useRateSheetUploader.js` — `/credit-unions` response parsing (`data.credit_unions`)
- `tests/e2e/mocks/api.js` — Current mock shapes (confirmed mock bug)
- `playwright.config.js` — Config verified (testDir, fullyParallel, baseURL, webServer)
- `package.json` — Scripts and devDependencies confirmed

---

## Metadata

**Confidence breakdown:**
- Selector catalog: HIGH — derived directly from JSX source files
- Mock shape analysis: HIGH — read both mock file and hook parsing code
- Chart.js canvas assertion: MEDIUM — headless behavior well-known but not verified against this specific setup
- `import.meta.dirname` availability: MEDIUM — depends on Node version not checked

**Research date:** 2026-04-04
**Valid until:** 2026-05-04 (source files are stable; no external APIs involved)

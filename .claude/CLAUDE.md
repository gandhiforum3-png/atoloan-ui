# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # Production build to /dist
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

No test runner is configured.

## Environment & API URL

All API calls use `import.meta.env.VITE_API_URL` as the base URL (set at build time by Vite).

- `.env.development` → `VITE_API_URL=http://127.0.0.1:8000`
- `.env.production` → `VITE_API_URL=http://dev.atoloan.api.com`

When building the Docker image for deployment, pass `--build-arg VITE_API_URL=http://dev.atoloan.api.com`.

## Architecture

**React 19 SPA** built with Vite 7. Client-side routing via React Router DOM v7. No TypeScript — JavaScript only. Plain CSS in `src/styles/`.

### Routing (`src/App.jsx`)

| Route | Page |
|-------|------|
| `/` | Home |
| `/loans` | Multi-step loan pre-approval wizard |
| `/loancalculator` | Auto loan payment calculator |
| `/ratesheetuploader` | PDF rate sheet upload & editor |
| `/terms` | Terms & conditions |

### State Management

- **React Context** (`src/context/LanguageContext.jsx`): Global EN/ES language toggle. Access via `useLanguage()` hook.
- **Local state only** (useState/useRef/useMemo) — no Redux or Zustand.
- Each major page has a dedicated custom hook that owns all state and API calls (`useLoanWizard.js`, `useRateSheetUploader.js`). Pages are thin renderers that consume those hooks.

### API Endpoints

- `POST /validate-zipcode` — zip code validation
- `POST /echo` — pre-approval payload echo
- `POST /findback` — bank matching
- `POST /uploadDocuments` — document upload
- `POST /ratesheetuploader` — PDF rate sheet processing
- `POST /update` — save rate sheet to DB
- `GET /credit-unions` — list banks
- `GET /credit-unions/{id}/ratesheet` — get rate sheet
- `DELETE /credit-unions/{id}` — delete rate sheet

### Loan Wizard (`/loans`)

The most complex feature. Flow is managed entirely by `src/pages/loans/useLoanWizard.js`.

- **Step definitions & bilingual copy**: `src/pages/loans/loanSteps.js`. The `copyByLanguage` object holds all EN/ES strings. `getSteps(language, copy)` returns the ordered step array. To add or reorder steps, edit this file.
- **Step rendering**: `src/pages/loans/StepOptions.jsx` renders image-button options. Each option has an `img` path (`/images/*.png`); if the image fails to load, a styled text fallback renders automatically via `brokenImages` state tracked in the hook.
- **Special step components** (in `src/pages/loans/steps/`): `ZipCodeInput`, `ContactInfoForm`, `DocumentUpload`, `MonthlyIncomeInput`, `DownPaymentInput`, `DtiCalculator`, `TimeAtJobInput`, `ReviewSummary` — these handle complex inputs that can't be image buttons.
- **Validation**: Two layers exist — `src/utils/validators.js` for legacy form-level validators, and inline validation logic in `useLoanWizard.js` for the special step components. See the table below.
- **API payload**: built in `src/pages/loans/payloads.js` (`buildPreApprovalPayload`). The wizard sends to `/echo` on the review step (once, guarded by `hasSentPreApproval`) and to `/findback` for bank matching.
- **Step `id` values** are used as keys in the `answers` object and in the payload — do not rename them without updating both `loanSteps.js` and `payloads.js`.

#### Validation by step

Each special step component has a dedicated `handle*Continue` in `useLoanWizard.js` that gates `setStepIndex`. Image-button steps advance automatically on click with no validation.

| Step / Component | Validator | Rules |
|---|---|---|
| `ZipCodeInput` | `handleZipCodeContinue` | Non-empty zip → `POST /validate-zipcode`; blocks on `data.valid === false`; auto-fills `contactInfo.city` on success |
| `ContactInfoForm` | `handleContactInfoContinue` | All 8 fields required; email must match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`; phone must be exactly 10 digits (stripped of non-digits); errors collected into `contactInfoErrors[]` array displayed inline |
| `MonthlyIncomeInput` | `handleMonthlyIncomeContinue` | Blocks if `otherMonthlyIncome` is empty when "Other" is selected |
| `DownPaymentInput` | `handleDownPaymentContinue` | Blocks if `otherDownPayment` is empty when "Other" is selected |
| `TimeAtJobInput` | `handleTimeAtJobContinue` | Requires `answers['time-at-job']` selected and `jobTitle` non-empty; additionally requires `timeAtJobMonths` when value is `'lessthanayear'` |
| `DtiCalculator` | `handleDtiContinue` / `handleDtiSkip` | Both fields required to continue; skip bypasses without values |
| `DocumentUpload` | `handleDocumentUpload` | Both `driversLicenseFile` and `paycheckFile` must be set before `POST /uploadDocuments` |
| `cosigner` (image button) | `handleSelect` | Special branch: selecting `'by-myself'` skips to the `'employment'` step (`findIndex`), bypassing all cosigner steps |

Validators in `src/utils/validators.js` (`validateForm5`, `validateForm9`, etc.) are named by legacy form number and are not currently wired to the wizard steps — they exist as standalone utilities.

### Rate Sheet Uploader (`/ratesheetuploader`)

State managed by `src/pages/ratesheet/useRateSheetUploader.js`. The page has three `viewMode` states: `'upload'`, `'view-existing'`, and a post-upload review flow.

- **Upload flow**: PDF → `POST /ratesheetuploader` → JSON response → `TreeEditor` (interactive JSON editor) → 7-section sequential review (`SectionReview`) → `POST /update` to save.
- **View existing flow**: fetches bank list from `GET /credit-unions`, user selects a bank, loads its rate sheet for editing or deletion.
- **Section order & shape**: defined by `reviewOrder` and `reviewSkeleton` in `src/pages/ratesheet/constants.js`. The 7 sections are `credit_union_info`, `rate_policy`, `loan_programs`, `guidelines`, `special_programs`, `participation_and_funding`, `additional_details`.
- **`TreeEditor`** (`src/components/TreeEditor.jsx`): generic recursive JSON editor used in the review flow. Works on any nested object/array structure.

### Bilingual Support

All translatable strings for the loan wizard are in `src/pages/loans/loanSteps.js` under `copyByLanguage` (`en`/`es`). Rate sheet uploader strings are in `src/pages/ratesheet/constants.js` under its own `copyByLanguage`. The language toggle lives in the Navbar and updates `LanguageContext`.

### Deployment

Deployed to Kubernetes (`atoloan-frontend` namespace) at `http://dev.atoloan.com` via nginx ingress. Docker image: `gandhiforum3/atoloan-ui:latest`. Manifests live in a separate repo at `~/atoloan-infra/k8s/frontend/`.

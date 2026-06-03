# ARCHITECTURE.md — Application Architecture

## Pattern

React 19 SPA. **Pages are thin renderers** — all state and business logic lives in custom hooks. Components consume hooks and render.

```
src/App.jsx          → React Router routes
src/pages/*.jsx      → thin page shells (consume hooks, render JSX)
src/pages/*/use*.js  → custom hooks (all state, validation, API calls)
src/components/      → shared presentational components
src/context/         → global state (language only)
src/utils/           → pure utility functions
```

## Global State

`src/context/LanguageContext.jsx` — single global context. Provides `{ language, toggleLanguage }` via `useLanguage()` hook. Values: `'en'` | `'es'`. All bilingual copy is derived from this.

## Loan Wizard Data Flow (`/loans`)

```
Loans.jsx
  └── useLoanWizard()                   ← all wizard state + logic
        ├── loanSteps.js                ← getSteps(language, copy) → step array
        │     └── copyByLanguage        ← all EN/ES label strings
        ├── payloads.js                 ← buildPreApprovalPayload() → POST body
        │     └── sendPayload()         ← generic fetch POST
        └── API calls
              ├── POST /validate-zipcode   (handleZipCodeContinue)
              ├── POST /echo               (handleContactInfoContinue → sendPreApprovalPayload)
              ├── POST /findback           (handleSelect on 'review' step)
              └── POST /uploadDocuments    (handleDocumentUpload)
```

**Step navigation**: `stepIndex` integer into `steps[]` array. `handleSelect(value)` advances by incrementing — except:
- `cosigner = 'by-myself'` → jumps to `'employment'` step via `findIndex`, skipping 2 cosigner steps
- `'review'` step → triggers `sendFindBankPayload()` instead of advancing

**State accumulation**: All inputs accumulate into `answers` (button selections) plus individual state variables (`jobTitle`, `contactInfo`, etc.). Nothing resets on back-navigation.

## Rate Sheet Uploader Data Flow (`/ratesheetuploader`)

```
RateSheetUploader.jsx
  └── useRateSheetUploader()            ← all uploader state + logic
        ├── constants.js                ← reviewOrder, reviewSkeleton, copyByLanguage
        ├── SectionReview.jsx           ← renders one section at a time
        │     └── TreeEditor.jsx        ← recursive JSON editor (handles obj/array/primitive)
        └── API calls
              ├── POST /ratesheetuploader   (handleSubmit — PDF upload)
              ├── GET  /credit-unions       (switchToViewExisting effect)
              ├── GET  /credit-unions/{id}/ratesheet  (handleBankSelection)
              ├── DELETE /credit-unions/{id}          (handleDeleteCurrentRateSheet)
              └── POST /update              (handleSaveToDatabase)
```

**Three `viewMode` states**: `'upload'` → `'view-existing'` → post-upload review (no named state, triggered by `responseResult !== null`).

**Section review flow**: Iterates `reviewOrder` (7 sections) via `reviewIndex`. Each section editable via `TreeEditor`. `confirmedSections[]` tracks completed sections. Final section shows Save / Download / Copy JSON actions.

**`TreeEditor`** (`src/components/TreeEditor.jsx`): Fully recursive. Handles arrays (add/remove/duplicate items), objects (add/remove fields), and primitives (string input, number input, boolean select, null-to-type conversion).

## Shared Components

| Component | Location | Used By |
|-----------|----------|---------|
| `Navbar` | `src/components/Navbar.jsx` | All pages (via `App.jsx` layout) |
| `Footer` | `src/components/Footer.jsx` | All pages (via `App.jsx` layout) |
| `TreeEditor` | `src/components/TreeEditor.jsx` | `SectionReview.jsx` only |

## Utility Layer

| File | Exports | Notes |
|------|---------|-------|
| `src/utils/loanCalculator.js` | `calculatePayments()`, `formatCurrency()` | Used only by `LoanCalculator.jsx` |
| `src/utils/validators.js` | 13 `validateFormN()` functions | **None currently imported** — dead code |
| `src/utils/fileUpload.js` | `uploadFile()`, `fileExplorer()`, `ajaxFileUpload()` | Legacy pattern; not used by main flows |

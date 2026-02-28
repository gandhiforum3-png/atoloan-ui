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

### API Communication

All API calls use `fetch()` directly, hardcoded to `http://127.0.0.1:8000`. Key endpoints:

- `POST /validate-zipcode` — zip code validation
- `POST /echo` — pre-approval payload echo
- `POST /findback` — bank matching
- `POST /uploadDocuments` — document upload
- `POST /ratesheetuploader` — PDF rate sheet processing
- `POST /update` — save rate sheet to DB
- `GET /credit-unions` — list banks
- `GET /credit-unions/{id}/ratesheet` — get rate sheet
- `DELETE /credit-unions/{id}` — delete rate sheet

### Key Pages

**`src/pages/Loans.jsx`** — The main feature. A 23-step multi-step form wizard for loan pre-approval. Step definitions and all bilingual copy live in `src/pages/loans/loanSteps.js` (`copyByLanguage` object). API payloads are constructed in `src/pages/loans/payloads.js`. Step UI rendered by `src/pages/loans/StepOptions.jsx`.

**`src/pages/RateSheetUploader.jsx`** — PDF upload → API parsing → interactive JSON TreeEditor → 7-section review → save to DB. Supports view/edit/delete of existing rate sheets.

**`src/pages/LoanCalculator.jsx`** — Loan payment calculator with Chart.js pie chart. Math in `src/utils/loanCalculator.js`.

### Bilingual Support

All translatable strings for the loan wizard are in `src/pages/loans/loanSteps.js` under the `copyByLanguage` object (keys: `en`, `es`). The language toggle is in the Navbar and updates context.

# atoloan-ui

React 19 SPA for automotive loan pre-approval and credit union rate sheet management. Serves two audiences: loan applicants (19-step bilingual EN/ES wizard) and credit union admins (PDF rate sheet upload and editing).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Dependencies](#dependencies)
- [Environment Setup](#environment-setup)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Docker / Deployment](#docker--deployment)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 22.x | Use the LTS release; matches Docker build image |
| npm | 10.x+ | Comes with Node 22 |
| Git | any | |

> Verify: `node -v && npm -v`

---

## Dependencies

### Runtime dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | DOM renderer |
| `react-router-dom` | ^7.11.0 | Client-side routing |
| `chart.js` | ^4.5.1 | Loan calculator pie chart |
| `react-markdown` | ^10.1.0 | Markdown rendering (rate sheet review) |
| `remark-gfm` | ^4.0.1 | GitHub-flavored Markdown support |

### Dev dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^7.2.4 | Build tool and dev server |
| `@vitejs/plugin-react` | ^5.1.1 | Vite React plugin (Fast Refresh) |
| `eslint` | ^9.39.1 | Linter |
| `eslint-plugin-react-hooks` | ^7.0.1 | React Hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.4.24 | Fast Refresh lint rules |
| `vitest` | ^4.1.2 | Unit test runner |
| `@testing-library/react` | ^16.3.2 | React component testing |
| `@testing-library/user-event` | ^14.6.1 | User interaction simulation |
| `@testing-library/jest-dom` | ^6.9.1 | DOM assertion matchers |
| `jsdom` | ^26.1.0 | DOM environment for unit tests (pinned to 26.x — 27+ breaks Vitest with React 19) |
| `@playwright/test` | ^1.59.1 | E2E test runner |
| `@types/react` | ^19.2.5 | React type definitions |
| `@types/react-dom` | ^19.2.3 | React DOM type definitions |
| `globals` | ^16.5.0 | ESLint globals config |

---

## Environment Setup

The app uses a single environment variable injected at **build time** by Vite.

### Variable reference

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Base URL for all backend API calls | Yes |

### Local development

Create `.env.development` in the project root (already committed — do not modify unless changing API host):

```
VITE_API_URL=http://127.0.0.1:8000
```

This points to the FastAPI backend running locally on port 8000.

### Production

Create `.env.production` in the project root:

```
VITE_API_URL=https://api.atoloans.com
```

> `.env.development` and `.env.production` are loaded automatically by Vite based on the `NODE_ENV`. Do not hard-code the API URL anywhere in source code — always use `import.meta.env.VITE_API_URL`.

---

## Getting Started

```bash
# 1. Clone the repo
git clone <repo-url>
cd atoloan-ui

# 2. Install dependencies (use ci for exact lock file versions)
npm ci

# 3. Start the dev server
npm run dev
```

The app will be available at **http://localhost:5173**.

The backend API must be running at `http://127.0.0.1:8000` (or whichever URL is in `.env.development`) for API-dependent features to work.

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with Hot Module Replacement at localhost:5173 |
| `build` | `vite build` | Production build to `/dist` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Run ESLint across all source files |
| `test:unit` | `vitest run --passWithNoTests` | Run unit tests once (non-watch) |
| `test:e2e` | `playwright test` | Run Playwright E2E tests against the dev server |
| `test` | `test:unit && test:e2e` | Run full test suite (unit first, E2E only if unit passes) |

---

## Testing

### Unit tests (Vitest + React Testing Library)

```bash
npm run test:unit
```

Test files live in `tests/unit/`. Setup file at `tests/unit/setup.js` auto-extends `expect` with jest-dom matchers and runs RTL cleanup after each test.

### E2E tests (Playwright)

```bash
npm run test:e2e
```

- Test files live in `tests/e2e/`
- Playwright auto-starts the Vite dev server (`npm run dev`) before running tests
- Only Chromium is used (no Firefox/WebKit)
- Shared API mock fixture at `tests/e2e/mocks/api.js` — call `await registerAll(page)` before `page.goto()` in every E2E test to intercept all 9 API routes

HTML test report is generated at `playwright-report/` after each run.

### Full suite

```bash
npm run test
```

Run this before every `docker build`.

### Installing Playwright browsers (first time or CI)

```bash
npx playwright install chromium
```

---

## Docker / Deployment

The app is deployed to Kubernetes at `http://dev.atoloan.com` via nginx ingress. Docker image: `gandhiforum3/atoloan-ui:latest`.

### Build the image

```bash
docker build \
  --build-arg VITE_API_URL=https://api.atoloans.com \
  -t gandhiforum3/atoloan-ui:latest \
  .
```

> `VITE_API_URL` must be passed as a build arg — it gets baked into the JS bundle at build time by Vite.

### Run locally

```bash
docker run -p 8080:80 gandhiforum3/atoloan-ui:latest
# App available at http://localhost:8080
```

### Two-stage build

| Stage | Base image | What it does |
|-------|-----------|--------------|
| Build | `node:22-alpine` | Runs `npm ci` + `npm run build`, outputs `/dist` |
| Serve | `nginx:alpine` | Serves `/dist` on port 80 with SPA fallback + gzip |

---

## Project Structure

```
atoloan-ui/
├── src/
│   ├── App.jsx                  # Route definitions
│   ├── context/
│   │   └── LanguageContext.jsx  # EN/ES language toggle (React Context)
│   ├── components/
│   │   └── TreeEditor.jsx       # Recursive JSON editor (rate sheet review)
│   ├── pages/
│   │   ├── loans/               # Loan pre-approval wizard
│   │   │   ├── useLoanWizard.js # All wizard state + validation logic
│   │   │   ├── loanSteps.js     # Step definitions + bilingual copy (EN/ES)
│   │   │   ├── payloads.js      # buildPreApprovalPayload()
│   │   │   └── steps/           # Special step components (ZipCodeInput, ContactInfoForm, etc.)
│   │   ├── ratesheet/           # Rate sheet uploader
│   │   │   ├── useRateSheetUploader.js
│   │   │   └── constants.js     # Section order, skeleton, bilingual copy
│   │   └── LoanCalculator/      # Auto loan payment calculator
│   ├── utils/
│   │   ├── loanCalculator.js    # calculatePayments() pure function
│   │   └── validators.js        # 13 validation utility functions
│   └── styles/                  # Plain CSS (Bootstrap 5.2.3 embedded)
├── tests/
│   ├── unit/
│   │   └── setup.js             # Vitest setup: jest-dom matchers, RTL cleanup
│   └── e2e/
│       ├── mocks/
│       │   └── api.js           # registerAll(page) — 9 route interceptors
│       └── health.spec.js       # Smoke test (app loads)
├── public/
│   └── images/                  # Wizard step images (*.png)
├── .env.development             # VITE_API_URL=http://127.0.0.1:8000
├── .env.production              # VITE_API_URL=https://api.atoloans.com
├── vite.config.js               # Vite + Vitest config
├── playwright.config.js         # Playwright E2E config
├── Dockerfile                   # Two-stage build (node:22-alpine → nginx:alpine)
└── nginx.conf                   # SPA fallback, gzip, 1-year asset caching
```

---

## API Endpoints

All calls use `import.meta.env.VITE_API_URL` as the base URL.

| Method | Path | Used by |
|--------|------|---------|
| `POST` | `/validate-zipcode` | Loan wizard — zip validation |
| `POST` | `/echo` | Loan wizard — pre-approval payload |
| `POST` | `/findback` | Loan wizard — bank matching |
| `POST` | `/uploadDocuments` | Loan wizard — document upload |
| `POST` | `/ratesheetuploader` | Rate sheet — PDF parse |
| `POST` | `/update` | Rate sheet — save to DB |
| `GET` | `/credit-unions` | Rate sheet — list banks |
| `GET` | `/credit-unions/:id/ratesheet` | Rate sheet — load existing |
| `DELETE` | `/credit-unions/:id` | Rate sheet — delete |

# CONVENTIONS.md — Code Conventions & Patterns

## Component Style

- Functional components only — no class components
- Custom hooks for all non-trivial state (`useLoanWizard`, `useRateSheetUploader`)
- Pages are thin: they call one hook and render JSX; no business logic in page files
- No component index files / barrel exports

## Naming

| Thing | Convention | Example |
|-------|-----------|---------|
| Component files | PascalCase `.jsx` | `ContactInfoForm.jsx` |
| Hook files | camelCase `.js` | `useLoanWizard.js` |
| Utility files | camelCase `.js` | `loanCalculator.js` |
| Functions | camelCase | `handleZipCodeContinue`, `buildPreApprovalPayload` |
| Constants/objects | camelCase | `copyByLanguage`, `reviewSkeleton` |
| CSS classes | Bootstrap names + kebab-case custom | `col-sm-12`, `loan-form-container` |

## Imports

ESM throughout (`"type": "module"` in package.json). Named imports preferred:
```js
import { useState, useMemo } from 'react'
import { useLanguage } from '../../context/LanguageContext'
```
No path aliases — all imports use relative paths with `../` prefixes.

## Bilingual Copy Pattern

All translatable strings live in a `copyByLanguage` object colocated with the feature:
- Loan wizard: `src/pages/loans/loanSteps.js`
- Rate sheet: `src/pages/ratesheet/constants.js`

**Usage pattern** (consistent across all features):
```js
const copy = useMemo(() => copyByLanguage[language] || copyByLanguage.en, [language])
```
Always falls back to `'en'`. Never add hardcoded English strings to JSX — add to both `en` and `es` keys.

## Image Button Pattern

Wizard steps use image buttons. Images live in `public/images/`:
- English: `btn_eng_{name}.png`
- Spanish: `btn_esp_{name}.png`

`getSteps()` in `loanSteps.js` uses:
```js
const img = (name) => `/images/${language === 'es' ? 'btn_esp' : 'btn_eng'}_${name}.png`
```

`StepOptions.jsx` tracks load failures in `brokenImages` state and renders a styled text fallback if an image 404s. New wizard steps must follow this naming convention and provide both language variants.

## Step ID Convention

Each wizard step has an `id` string (e.g., `'loan-type'`, `'cosigner'`, `'zip-code'`). These IDs are:
1. Keys in the `answers` object: `{ 'loan-type': 'autoloan' }`
2. Used for step-lookup via `findIndex` in navigation logic
3. Referenced in `buildPreApprovalPayload`

**Do not rename step IDs** without updating `loanSteps.js`, `useLoanWizard.js`, and `payloads.js`.

## Styling

No CSS modules. Three layers used together (inconsistently):
1. Bootstrap utility classes (`col-sm-12`, `btn`, `form-control`)
2. Global CSS in `src/styles/atoloans.css` and `src/styles/loanform.css`
3. Inline `style={{ ... }}` objects — heavily used in `Home.jsx`, step components, and `LoanCalculator.jsx`

No CSS variables or theme tokens. Colors hardcoded: primary green `#39b54a`, blue `#1b75bc`, dark `#2f3d4f`.

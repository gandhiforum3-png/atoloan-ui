# INTEGRATIONS.md — External Services & API

## Environment Variables

| Variable | Dev | Production |
|----------|-----|-----------|
| `VITE_API_URL` | `http://127.0.0.1:8000` | `http://dev.atoloan.api.com` |

Set in `.env.development` / `.env.production`. Accessed as `import.meta.env.VITE_API_URL`. **Baked into the bundle at build time** — changing the URL requires a full rebuild and redeploy.

## Backend API Endpoints

All calls use native `fetch()`. Base: `${import.meta.env.VITE_API_URL}`.

| Method | Path | Payload | Response | Caller |
|--------|------|---------|----------|--------|
| POST | `/validate-zipcode` | `{ zipcode }` | `{ valid, city }` | `useLoanWizard.js:257` |
| POST | `/echo` | Full pre-approval payload | — (logging) | `payloads.js` via `useLoanWizard.js:140` |
| POST | `/findback` | Full pre-approval payload | Bank match results | `useLoanWizard.js:162` |
| POST | `/uploadDocuments` | FormData: `drivers_license`, `paycheck`, `user_email`, `user_name` | `{ status, data }` | `useLoanWizard.js:362` |
| POST | `/ratesheetuploader` | FormData: PDF file | `{ result: { ...sections } }` | `useRateSheetUploader.js:197` |
| POST | `/update` | `editableResult` JSON | Save confirmation | `useRateSheetUploader.js:139` |
| GET | `/credit-unions` | — | `{ credit_unions: [...] }` | `useRateSheetUploader.js:39` |
| GET | `/credit-unions/{id}/ratesheet` | — | Rate sheet JSON | `useRateSheetUploader.js:90` |
| DELETE | `/credit-unions/{id}` | — | Confirmation | `useRateSheetUploader.js:116` |

## Pre-Approval Payload Shape

Built by `buildPreApprovalPayload()` in `src/pages/loans/payloads.js`:

```js
{
  language,           // 'en' | 'es'
  answers,            // { [stepId]: selectedValue }
  otherMonthlyIncome,
  otherDownPayment,
  jobTitle,
  timeAtJobMonths,
  monthlyDebt,
  grossMonthlyIncome,
  zipCode,
  contactInfo: { firstName, lastName, email, address, city, state, zip, phone },
  summary             // [{ label, value }]
}
```

## External CDNs

| Service | URL | Used For |
|---------|-----|---------|
| Google Fonts | `fonts.googleapis.com` / `fonts.gstatic.com` | Montserrat, Lato fonts |
| FontAwesome | `use.fontawesome.com/releases/v6.3.0/js/all.js` | Icons |

## Kubernetes Deployment

- **Namespace**: `atoloan-frontend`
- **Image**: `gandhiforum3/atoloan-ui:latest` (`imagePullPolicy: Always`)
- **Hostname**: `dev.atoloan.com` (nginx ingress)
- **Backend hostname**: `dev.atoloan.api.com` (separate `atoloan-backend` namespace)
- **Infra manifests**: `~/atoloan-infra/k8s/frontend/` (separate repo)
- **CoreDNS**: Both hostnames mapped to ingress controller IP `10.109.229.89`

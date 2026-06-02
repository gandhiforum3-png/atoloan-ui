# CONCERNS.md — Tech Debt & Risk

## High — Fix Before Production

### 1. XSS via `dangerouslySetInnerHTML` in Terms.jsx
`src/pages/Terms.jsx` fetches `/terms-content.html` at runtime and renders it with `dangerouslySetInnerHTML` — no sanitization. If the server or CDN is compromised, arbitrary scripts execute in users' browsers.
**Fix**: Sanitize with DOMPurify before rendering, or serve terms as plain text/markdown.

### 2. Raw API Debug Panel Exposed to Users
`src/pages/RateSheetUploader.jsx` renders a visible debug info block showing raw response lengths, parsed JSON existence, and emoji-annotated state — visible to end users in production.
**Fix**: Remove the debug panel entirely.

### 3. `window.alert()` for Zip Code Validation Errors
`useLoanWizard.js:268,277` uses blocking `window.alert()` for zip code validation failures. Breaks UI flow and is inconsistent with all other error handling.
**Fix**: Replace with inline error state (same pattern as `contactInfoErrors`).

### 4. No HTTPS in nginx.conf
`nginx.conf` listens on port 80 only. No TLS termination, no `Strict-Transport-Security` header, no redirect from HTTP to HTTPS. All traffic including contact info and document uploads is unencrypted.
**Fix**: TLS should be terminated at the ingress controller (already using nginx ingress in k8s — add TLS cert there).

### 5. Missing Security Headers in nginx.conf
No `X-Frame-Options`, `X-Content-Type-Options`, `Content-Security-Policy`, or `Referrer-Policy` headers.
**Fix**: Add to `nginx.conf` server block.

---

## Medium — Address Soon

### 6. Console Logs in Production Code (8+ instances)

| File | Lines | Content |
|------|-------|---------|
| `useLoanWizard.js` | 159, 215 | `'Sending find bank payload'`, `'Find Bank button clicked'` |
| `useLoanWizard.js` | 188 | `console.error` on find bank failure |
| `useRateSheetUploader.js` | 46, 48, 103, 129, 168 | Emoji debug logs: `'✅ Loaded N credit unions'`, `'📥 Response received...'`, `'✅ JSON parsed successfully'` |

**Fix**: Remove all. Error cases can use the existing `status` state for user-facing messages.

### 7. 13 Dead Validator Functions in `validators.js`
`src/utils/validators.js` exports `validateForm5`, `validateForm9`, `validateForm91`, `validateForm11`, `validateForm111`, `validateForm13`, `validateForm14`, `validateForm15`, `validateForm15cosigner`, `validateForm17`, `validateForm19`, `validateForm20`, `signupDemoForm`, `validateFormHomepage` — **none are imported anywhere** in the codebase.
**Fix**: Delete the file or keep only validators that get wired into the wizard.

### 8. `VITE_API_URL` Locked at Build Time
The API base URL is baked into the JS bundle. Changing the backend URL requires a full rebuild and redeploy — there is no runtime override mechanism.
**Note**: This is by design for Vite, but worth documenting for ops. The current `.env.production` URL is `http://dev.atoloan.api.com` (HTTP, not HTTPS).

---

## Low — Backlog

### 9. `fileUpload.js` Is Legacy Dead Code
`src/utils/fileUpload.js` exports `ajaxFileUpload()` which references an `ajax.php` endpoint — a legacy PHP pattern inconsistent with the REST API. Not imported anywhere in the main app flows.
**Fix**: Delete.

### 10. Inline Styles Throughout Components
100+ instances of `style={{ ... }}` props, particularly in `Home.jsx` (60+ instances), step components, and `LoanCalculator.jsx`. No CSS variables or theme tokens.
**Impact**: Maintenance burden, no dark mode or theming support.

### 11. No `docker-compose.yml` for Local Development
Running the frontend + backend locally requires manually starting each service. No compose file to wire them together.

### 12. Loan Calculator Defaults Are Hardcoded
`LoanCalculator.jsx` initializes with `vehiclePrice: 35000`, `downPayment: 7000`, `loanTerm: 72`, `interestRate: 11.33` — no configuration.

### 13. Home.jsx Copy Not in `copyByLanguage`
`Home.jsx` defines its own inline bilingual content object (`homeContent`) separate from the `copyByLanguage` pattern used everywhere else. Inconsistent and harder to maintain.

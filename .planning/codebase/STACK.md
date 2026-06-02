# STACK.md — Technology Stack

## Runtime

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | ^19.2.0 |
| Routing | React Router DOM | ^7.11.0 |
| Build Tool | Vite | ^7.2.4 |
| Language | JavaScript (ESM) | No TypeScript |
| Charts | Chart.js | ^4.5.1 |
| Markdown | React Markdown + Remark GFM | ^10.1.0 / ^4.0.1 |

## Styling

| Resource | Source | Version |
|----------|--------|---------|
| Bootstrap | Embedded in `src/styles/atoloans.css` | 5.2.3 |
| Google Fonts (Montserrat, Lato) | CDN (`fonts.googleapis.com`) | — |
| FontAwesome | CDN (`use.fontawesome.com`) | 6.3.0 |
| Custom CSS | `src/styles/atoloans.css`, `src/styles/loanform.css` | — |

No CSS modules. No CSS variables. Heavy inline styles throughout components.

## Dev Tooling

| Tool | Config File | Purpose |
|------|------------|---------|
| ESLint | `eslint.config.js` | Linting — `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |
| Vite | `vite.config.js` | Dev server + production bundler (Rollup-based) |

No test runner (no Vitest, Jest, or RTL installed).

## Containerization

- **Build**: `node:22-alpine` — runs `npm ci` + `npm run build`
- **Serve**: `nginx:alpine` — serves `/dist` on port 80
- **Config**: `nginx.conf` — SPA fallback, 1-year asset caching, gzip
- `VITE_API_URL` passed as `ARG` at build time and baked into the JS bundle

## Runtime Environment

- Dev server: `localhost:5173` (Vite default)
- Production: port 80 via nginx
- Node version: 22 (Alpine)

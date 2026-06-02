# STRUCTURE.md — Directory & File Structure

## Source Tree

```
src/
├── App.jsx                          # Router setup + Navbar/Footer layout
├── main.jsx                         # Vite entry point
├── index.css                        # Root styles
├── App.css                          # App-level styles
│
├── context/
│   └── LanguageContext.jsx          # EN/ES global language provider + useLanguage()
│
├── components/                      # Shared across pages
│   ├── Navbar.jsx                   # Nav bar with language toggle
│   ├── Footer.jsx                   # Footer with Terms link
│   └── TreeEditor.jsx               # Recursive JSON editor (obj/array/primitive)
│
├── pages/
│   ├── Home.jsx                     # Marketing landing page
│   ├── Loans.jsx                    # Loan wizard shell (~120 lines)
│   ├── LoanCalculator.jsx           # Payment calculator + Chart.js pie chart
│   ├── RateSheetUploader.jsx        # Rate sheet upload/view/edit shell
│   ├── Terms.jsx                    # Terms page — loads /public/terms-content.html
│   │
│   ├── loans/                       # Loan wizard internals
│   │   ├── useLoanWizard.js         # All wizard state + logic (442 lines)
│   │   ├── loanSteps.js             # Step definitions + EN/ES copy (627 lines)
│   │   ├── payloads.js              # buildPreApprovalPayload + sendPayload (49 lines)
│   │   ├── StepOptions.jsx          # Image-button renderer with broken-image fallback
│   │   └── steps/                   # Special input components (not image buttons)
│   │       ├── ZipCodeInput.jsx
│   │       ├── ContactInfoForm.jsx
│   │       ├── DocumentUpload.jsx
│   │       ├── DownPaymentInput.jsx
│   │       ├── DtiCalculator.jsx
│   │       ├── MonthlyIncomeInput.jsx
│   │       ├── ReviewSummary.jsx
│   │       └── TimeAtJobInput.jsx
│   │
│   └── ratesheet/                   # Rate sheet uploader internals
│       ├── useRateSheetUploader.js  # All uploader state + logic (337 lines)
│       ├── constants.js             # reviewOrder, reviewSkeleton, EN/ES copy
│       ├── BankSelector.jsx         # Credit union dropdown
│       ├── ModeToggle.jsx           # Upload vs View Existing toggle buttons
│       ├── SectionReview.jsx        # One-section-at-a-time editor (uses TreeEditor)
│       └── StatusMessage.jsx        # Alert/toast component
│
├── styles/
│   ├── atoloans.css                 # Main styles (Bootstrap 5.2.3 + custom, 2000+ lines)
│   └── loanform.css                 # Loan form specific styles
│
└── utils/
    ├── loanCalculator.js            # calculatePayments(), formatCurrency()
    ├── validators.js                # 13 validateFormN() functions (all unused/dead code)
    └── fileUpload.js                # uploadFile(), fileExplorer(), ajaxFileUpload()
```

## Public Assets

```
public/
├── images/                          # ~204 image files
│   ├── btn_eng_*.png                # English image buttons for wizard steps
│   ├── btn_esp_*.png                # Spanish image buttons for wizard steps
│   ├── carroad3.jpg / carroad4.jpg  # Hero background images
│   ├── tablet2.png                  # Feature section image
│   ├── circleicon*.png              # Feature icons
│   ├── womanlaptop.jpg              # Section background
│   └── favicon.ico
└── terms-content.html               # Terms page HTML (fetched at runtime by Terms.jsx)
```

## Key File Sizes

| File | Lines | Complexity |
|------|-------|-----------|
| `src/pages/loans/loanSteps.js` | 627 | High — all step defs + full EN+ES copy |
| `src/pages/loans/useLoanWizard.js` | 442 | High — 20+ state vars, 10+ handlers |
| `src/pages/ratesheet/useRateSheetUploader.js` | 337 | Medium-High — 13+ state vars, 10+ handlers |
| `src/utils/validators.js` | 142 | Low — pure functions, none imported |
| `src/pages/loans/payloads.js` | 49 | Low |

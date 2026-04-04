# Phase 3: E2E Tests - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.

**Date:** 2026-04-04
**Phase:** 03 — E2E Tests

---

## Area 1: Wizard flow depth

**Q:** How do you want to handle happy-path assertions for the 19-step wizard?
- Options: Assert key milestones only / Assert every step title / You decide
- **Selected:** Assert key milestones only (step 1 loads, zip accepted, contact accepted, review step, bank results)

**Q:** The `/findback` mock returns `{ banks: [] }`. Should empty banks be the "done" state, or should the mock return a real bank?
- Options: Empty banks is fine / Return a real bank in the mock / You decide
- **Selected:** Return a real bank — assert bank name appears on screen

**Q:** Should edge cases (E2E-02/03/04) be in the same file as the happy path or separate files?
- Options: Same file (loan-wizard.spec.js) / Separate files / You decide
- **Selected:** Same file — separate `test()` blocks in `loan-wizard.spec.js`

---

## Area 2: File upload approach

**Q:** How should E2E-05 handle the PDF file upload?
- Options: Real fixture PDF + setInputFiles() / Mock the fetch, skip real file
- **Selected:** Real fixture PDF at `tests/e2e/fixtures/sample.pdf` + `setInputFiles()`

---

## Area 3: Selector strategy

**Q:** Source has zero data-testid attributes. Use text/role selectors or add data-testid to source?
- Options: Text/role selectors only / Add data-testid to source / You decide
- **Selected:** Text/role selectors only — no source changes

---

## Area 4: CLAUDE.md update

**Q:** What should land in CLAUDE.md?
- Options: Commands only / Commands + brief Testing section / You decide
- **Selected:** Commands + brief Testing section

---

*Discussion conducted: 2026-04-04*

/**
 * Shared API mock fixture for E2E tests.
 * Registers all 9 API route interceptors with minimal valid responses.
 * Call `await registerAll(page)` before `page.goto()` in every E2E test.
 *
 * Decision refs: D-13 (file location), D-14 (registerAll shape),
 * D-15 (all 9 routes), D-16 (minimal valid JSON responses)
 */

export async function registerAll(page) {
  // POST /validate-zipcode
  await page.route('**/validate-zipcode', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ valid: true, city: 'Los Angeles' }),
    })
  )

  // POST /echo
  await page.route('**/echo', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  )

  // POST /findback
  await page.route('**/findback', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ banks: [] }),
    })
  )

  // POST /uploadDocuments
  await page.route('**/uploadDocuments', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  )

  // POST /ratesheetuploader
  await page.route('**/ratesheetuploader', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        credit_union_info: {},
        rate_policy: {},
        loan_programs: {},
        guidelines: {},
        special_programs: {},
        participation_and_funding: {},
        additional_details: {},
      }),
    })
  )

  // POST /update
  await page.route('**/update', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }),
    })
  )

  // GET /credit-unions
  await page.route('**/credit-unions', (route) => {
    if (route.request().method() === 'DELETE') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Test Credit Union' },
      ]),
    })
  })

  // GET /credit-unions/:id/ratesheet
  await page.route('**/credit-unions/*/ratesheet', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        credit_union_info: {},
        rate_policy: {},
        loan_programs: {},
        guidelines: {},
        special_programs: {},
        participation_and_funding: {},
        additional_details: {},
      }),
    })
  )

  // DELETE /credit-unions/:id
  await page.route('**/credit-unions/*', (route) => {
    if (route.request().method() === 'DELETE') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    }
    return route.continue()
  })
}

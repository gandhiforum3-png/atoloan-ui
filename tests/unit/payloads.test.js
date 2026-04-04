import { buildPreApprovalPayload } from '../../src/pages/loans/payloads.js'

const makeInput = (overrides = {}) => ({
  language: 'en',
  answers: { 'loan-type': 'auto', employment: 'full-time' },
  otherMonthlyIncome: '  2500  ',
  otherDownPayment: '  1000  ',
  jobTitle: '  Engineer  ',
  timeAtJobMonths: '6',
  monthlyDebt: '  500  ',
  grossMonthlyIncome: '  4000  ',
  zipCode: '  90210  ',
  contactInfo: {
    firstName: '  John  ',
    lastName: '  Doe  ',
    email: '  john@test.com  ',
    address: '  123 Main  ',
    city: '  LA  ',
    state: '  CA  ',
    zip: '  90210  ',
    phone: '  5551234567  ',
  },
  summary: 'some summary',
  ...overrides,
})

describe('buildPreApprovalPayload', () => {
  describe('string trimming', () => {
    it('trims all top-level string fields', () => {
      const result = buildPreApprovalPayload(makeInput())
      expect(result.otherMonthlyIncome).toBe('2500')
      expect(result.otherDownPayment).toBe('1000')
      expect(result.jobTitle).toBe('Engineer')
      expect(result.monthlyDebt).toBe('500')
      expect(result.grossMonthlyIncome).toBe('4000')
      expect(result.zipCode).toBe('90210')
    })

    it('trims all contactInfo fields', () => {
      const result = buildPreApprovalPayload(makeInput())
      expect(result.contactInfo.firstName).toBe('John')
      expect(result.contactInfo.lastName).toBe('Doe')
      expect(result.contactInfo.email).toBe('john@test.com')
      expect(result.contactInfo.address).toBe('123 Main')
      expect(result.contactInfo.city).toBe('LA')
      expect(result.contactInfo.state).toBe('CA')
      expect(result.contactInfo.zip).toBe('90210')
      expect(result.contactInfo.phone).toBe('5551234567')
    })
  })

  describe('answers shallow copy', () => {
    it('shallow-copies answers — result.answers is not the same reference', () => {
      const inputAnswers = { 'loan-type': 'auto', employment: 'full-time' }
      const result = buildPreApprovalPayload(makeInput({ answers: inputAnswers }))
      expect(result.answers).not.toBe(inputAnswers)
    })

    it('answers copy contains the same key-value pairs', () => {
      const inputAnswers = { 'loan-type': 'auto', employment: 'full-time' }
      const result = buildPreApprovalPayload(makeInput({ answers: inputAnswers }))
      expect(result.answers).toEqual(inputAnswers)
    })
  })

  describe('passthrough fields', () => {
    it('preserves language unchanged', () => {
      const result = buildPreApprovalPayload(makeInput({ language: 'es' }))
      expect(result.language).toBe('es')
    })

    it('preserves summary unchanged', () => {
      const result = buildPreApprovalPayload(makeInput({ summary: 'detailed summary text' }))
      expect(result.summary).toBe('detailed summary text')
    })

    it('passes timeAtJobMonths through as-is', () => {
      const result = buildPreApprovalPayload(makeInput({ timeAtJobMonths: '14' }))
      expect(result.timeAtJobMonths).toBe('14')
    })
  })
})

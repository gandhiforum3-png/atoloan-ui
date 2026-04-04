import { renderHook, act } from '@testing-library/react'
import { LanguageProvider } from '../../src/context/LanguageContext.jsx'
import useLoanWizard from '../../src/pages/loans/useLoanWizard.js'

const wrapper = ({ children }) => <LanguageProvider>{children}</LanguageProvider>

describe('handleSelect — step advance', () => {
  it('starts at stepIndex 0', () => {
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    expect(result.current.stepIndex).toBe(0)
    expect(result.current.step.id).toBe('loan-type')
  })

  it('advances stepIndex from 0 to 1 when loan type is selected', () => {
    // HOOK-01
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    act(() => { result.current.handleSelect('autoloan') })
    expect(result.current.stepIndex).toBe(1)
  })
})

describe('handleSelect — cosigner skip', () => {
  it('skips to employment step (index 4) when by-myself is selected at cosigner step', () => {
    // HOOK-02
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    // Step 0: select loan type to advance to cosigner (step 1)
    act(() => { result.current.handleSelect('autoloan') })
    expect(result.current.stepIndex).toBe(1)
    expect(result.current.step.id).toBe('cosigner')
    // Step 1: select 'by-myself' — should skip to employment
    act(() => { result.current.handleSelect('by-myself') })
    expect(result.current.stepIndex).toBe(4)
    expect(result.current.step.id).toBe('employment')
  })

  it('stores by-myself answer in answers object', () => {
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    act(() => { result.current.handleSelect('autoloan') })
    act(() => { result.current.handleSelect('by-myself') })
    expect(result.current.answers['cosigner']).toBe('by-myself')
  })
})

describe('handleContactInfoContinue — missing fields', () => {
  it('blocks advance and populates contactInfoErrors when all fields are empty', () => {
    // HOOK-03
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    const initialStepIndex = result.current.stepIndex
    act(() => { result.current.handleContactInfoContinue() })
    // stepIndex should NOT change
    expect(result.current.stepIndex).toBe(initialStepIndex)
    // contactInfoErrors should contain the missing fields message
    expect(result.current.contactInfoErrors.length).toBeGreaterThan(0)
    expect(result.current.contactInfoErrors.some(e => e.includes('Please fill in:'))).toBe(true)
    expect(result.current.contactInfoErrors.some(e => e.includes('First Name'))).toBe(true)
    expect(result.current.contactInfoErrors.some(e => e.includes('Phone Number'))).toBe(true)
  })
})

describe('handleContactInfoContinue — invalid email', () => {
  it('blocks advance and sets email error when email format is invalid', () => {
    // HOOK-04
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    // Fill all 8 fields, but with invalid email
    act(() => {
      result.current.handleContactInfoChange('firstName')({ target: { value: 'John' } })
      result.current.handleContactInfoChange('lastName')({ target: { value: 'Doe' } })
      result.current.handleContactInfoChange('email')({ target: { value: 'invalid-email' } })
      result.current.handleContactInfoChange('address')({ target: { value: '123 Main St' } })
      result.current.handleContactInfoChange('city')({ target: { value: 'LA' } })
      result.current.handleContactInfoChange('state')({ target: { value: 'CA' } })
      result.current.handleContactInfoChange('zip')({ target: { value: '90210' } })
      result.current.handleContactInfoChange('phone')({ target: { value: '5551234567' } })
    })
    const stepBefore = result.current.stepIndex
    act(() => { result.current.handleContactInfoContinue() })
    expect(result.current.stepIndex).toBe(stepBefore)
    expect(result.current.contactInfoErrors).toContain('please add valid email')
    expect(result.current.emailValidationError).toBe('please add valid email')
  })
})

describe('handleContactInfoContinue — invalid phone', () => {
  it('blocks advance and sets phone error when phone is not 10 digits', () => {
    // HOOK-05
    const { result } = renderHook(() => useLoanWizard(), { wrapper })
    // Fill all 8 fields with valid email but short phone
    act(() => {
      result.current.handleContactInfoChange('firstName')({ target: { value: 'John' } })
      result.current.handleContactInfoChange('lastName')({ target: { value: 'Doe' } })
      result.current.handleContactInfoChange('email')({ target: { value: 'john@test.com' } })
      result.current.handleContactInfoChange('address')({ target: { value: '123 Main St' } })
      result.current.handleContactInfoChange('city')({ target: { value: 'LA' } })
      result.current.handleContactInfoChange('state')({ target: { value: 'CA' } })
      result.current.handleContactInfoChange('zip')({ target: { value: '90210' } })
      result.current.handleContactInfoChange('phone')({ target: { value: '12345' } })
    })
    const stepBefore = result.current.stepIndex
    act(() => { result.current.handleContactInfoContinue() })
    expect(result.current.stepIndex).toBe(stepBefore)
    expect(result.current.contactInfoErrors).toContain('please add valid phone number')
    expect(result.current.phoneValidationError).toBe('please add valid phone number')
  })
})

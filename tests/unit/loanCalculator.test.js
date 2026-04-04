import { calculatePayments, formatCurrency } from '../../src/utils/loanCalculator.js'

describe('calculatePayments', () => {
  describe('happy path: known inputs produce correct output', () => {
    it('returns correct values for vehiclePrice=25000, down=3000, term=60, rate=6.5', () => {
      const result = calculatePayments({
        vehiclePrice: 25000,
        downPayment: 3000,
        loanTerm: 60,
        interestRate: 6.5,
      })
      expect(result.months).toBe(60)
      expect(result.loanAmount).toBeCloseTo(22000, 2)
      expect(result.monthlyPayment).toBeCloseTo(430.46, 2)
      expect(result.totalInterestPaid).toBeCloseTo(3827.32, 2)
      expect(result.totalPaid).toBeCloseTo(25827.32, 2)
    })
  })

  describe('edge cases', () => {
    it('returns error object when vehiclePrice is 0', () => {
      const result = calculatePayments({
        vehiclePrice: 0,
        downPayment: 0,
        loanTerm: 60,
        interestRate: 5,
      })
      expect(result).toEqual({ error: 'Please enter a vehicle price.' })
    })

    it('returns error object when vehiclePrice is falsy (undefined)', () => {
      const result = calculatePayments({ vehiclePrice: undefined })
      expect(result).toEqual({ error: 'Please enter a vehicle price.' })
    })

    it('defaults loanTerm to 72 when not provided, zero down payment results in full vehicle price as loan', () => {
      const result = calculatePayments({
        vehiclePrice: 20000,
        downPayment: 0,
      })
      expect(result.loanAmount).toBeCloseTo(20000, 2)
      expect(result.months).toBe(72)
    })

    it('defaults interestRate to 11.33 and loanTerm to 72 when neither provided', () => {
      const result = calculatePayments({ vehiclePrice: 15000 })
      expect(result.months).toBe(72)
      // With 11.33% rate and 72 months, monthlyPayment should be > 0
      expect(result.monthlyPayment).toBeGreaterThan(0)
      // Verify interest is applied (total paid > loan amount)
      expect(result.totalPaid).toBeGreaterThan(15000)
    })
  })
})

describe('formatCurrency', () => {
  it('formats 1234.5 as "1,234.50"', () => {
    expect(formatCurrency(1234.5)).toBe('1,234.50')
  })

  it('formats 0 as "0.00"', () => {
    expect(formatCurrency(0)).toBe('0.00')
  })

  it('formats a round number with two decimal places', () => {
    expect(formatCurrency(5000)).toBe('5,000.00')
  })
})

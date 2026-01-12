export function calculatePayments({
  vehiclePrice,
  downPayment,
  loanTerm,
  interestRate,
}) {
  const amount = Number(vehiclePrice)
  const months = Number(loanTerm) || 72
  const down = Number(downPayment) || 0
  const annInterest = Number(interestRate) || 11.33

  if (!amount) {
    return { error: 'Please enter a vehicle price.' }
  }

  const monInt = annInterest / 1200
  const loanAmount = amount - down
  const monthlyPayment =
    (monInt + monInt / (Math.pow(1 + monInt, months) - 1)) * (amount - down)
  const totalInterestPaid = monthlyPayment * months - loanAmount
  const totalPaid = totalInterestPaid + loanAmount

  return {
    monthlyPayment,
    totalInterestPaid,
    loanAmount,
    totalPaid,
    months,
  }
}

export function formatCurrency(value) {
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

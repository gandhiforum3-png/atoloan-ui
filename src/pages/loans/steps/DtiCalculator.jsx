export default function DtiCalculator({
  monthlyDebt,
  grossMonthlyIncome,
  onDebtChange,
  onIncomeChange,
  onContinue,
  onSkip,
  disabled,
  copy,
}) {
  return (
    <div style={{ marginTop: '16px', textAlign: 'center' }}>
      <p style={{ marginBottom: '12px', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        {copy.dtiDescription}
      </p>
      <h3 style={{ textAlign: 'center', margin: '16px 0' }}>{copy.dtiCalculatorTitle}</h3>
      <div style={{ maxWidth: '420px', margin: '0 auto', textAlign: 'left' }}>
        <label style={{ display: 'block', marginBottom: '6px' }}>{copy.recurringDebtLabel}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <span>$</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            className="form-control"
            value={monthlyDebt}
            onChange={(event) => onDebtChange(event.target.value)}
            placeholder="0"
          />
        </div>
        <label style={{ display: 'block', marginBottom: '6px' }}>{copy.grossIncomeLabel}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>$</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            className="form-control"
            value={grossMonthlyIncome}
            onChange={(event) => onIncomeChange(event.target.value)}
            placeholder="0"
          />
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onSkip}
          style={{ marginRight: '10px' }}
        >
          {copy.skip}
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={onContinue}
          disabled={disabled}
        >
          {copy.continue}
        </button>
      </div>
    </div>
  )
}

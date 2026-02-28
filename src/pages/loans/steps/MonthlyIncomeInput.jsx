export default function MonthlyIncomeInput({ value, onChange, onContinue, disabled, copy }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <input
        type="number"
        inputMode="numeric"
        min="0"
        className="form-control"
        placeholder={copy.enterMonthlyIncome}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ maxWidth: '320px', margin: '0 auto' }}
      />
      <button
        type="button"
        className="btn btn-success"
        style={{ marginTop: '12px' }}
        onClick={onContinue}
        disabled={disabled}
      >
        {copy.continue}
      </button>
    </div>
  )
}

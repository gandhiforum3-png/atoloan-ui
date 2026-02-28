export default function ZipCodeInput({ value, onChange, onContinue, disabled, copy }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <input
        type="text"
        inputMode="numeric"
        className="form-control"
        placeholder={copy.zipPlaceholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ maxWidth: '220px', margin: '0 auto' }}
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

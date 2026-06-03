export default function ZipCodeInput({ value, onChange, onContinue, disabled, isValidating, error, copy }) {
  return (
    <div style={{ marginTop: '16px' }}>
      <input
        type="text"
        inputMode="numeric"
        className={`form-control${error ? ' field-error' : ''}`}
        placeholder={copy.zipPlaceholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{ maxWidth: '220px', margin: '0 auto' }}
        maxLength={5}
      />
      {error && (
        <div style={{ color: '#dc3545', fontSize: '13px', marginTop: '6px' }}>
          {error}
        </div>
      )}
      <button
        type="button"
        className="btn btn-success"
        style={{ marginTop: '12px', padding: '10px 28px' }}
        onClick={onContinue}
        disabled={disabled || isValidating}
      >
        {isValidating ? 'Validating…' : copy.continue}
      </button>
    </div>
  )
}

export default function TimeAtJobInput({
  selectedValue,
  timeAtJobMonths,
  onMonthsChange,
  jobTitle,
  onJobTitleChange,
  onContinue,
  disabled,
  copy,
}) {
  return (
    <div style={{ marginTop: '16px' }}>
      {selectedValue === 'lessthanayear' && (
        <select
          className="form-control"
          value={timeAtJobMonths}
          onChange={(event) => onMonthsChange(event.target.value)}
          style={{ maxWidth: '260px', margin: '0 auto 12px' }}
        >
          <option value="">{copy.selectMonths}</option>
          {Array.from({ length: 11 }, (_, index) => index + 1).map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      )}
      <input
        type="text"
        className="form-control"
        placeholder={copy.jobTitlePlaceholder}
        value={jobTitle}
        onChange={(event) => onJobTitleChange(event.target.value)}
        style={{ maxWidth: '420px', margin: '0 auto' }}
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

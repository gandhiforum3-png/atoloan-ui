export default function StepOptions({ options, selectedValue, onSelect }) {
  if (!options || options.length === 0) return null

  const isBinary = options.length === 2
  const gridClass = `step-options-grid${isBinary ? ' step-options-2col' : ''}`

  return (
    <div className={gridClass}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`step-option-card${selectedValue === option.value ? ' selected' : ''}`}
          onClick={() => onSelect(option.value)}
          aria-pressed={selectedValue === option.value}
        >
          {option.icon && <span className="step-option-icon" aria-hidden="true">{option.icon}</span>}
          <span className="step-option-label">{option.label}</span>
        </button>
      ))}
    </div>
  )
}

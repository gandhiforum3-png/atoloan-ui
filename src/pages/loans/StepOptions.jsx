const fallbackButtonStyle = {
  display: 'inline-block',
  padding: '18px 28px',
  margin: '6px',
  border: '4px solid #39b54a',
  borderRadius: '10px',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  background: '#fff',
  color: '#000',
}

export default function StepOptions({
  options,
  selectedValue,
  onSelect,
  brokenImages,
  setBrokenImages,
}) {
  return options.map((option) => {
    const isSelected = selectedValue === option.value
    const selectedStyle = isSelected ? { outline: '4px solid #39b54a', borderRadius: '10px' } : undefined

    if (!option.img) {
      return (
        <button
          key={option.value}
          type="button"
          className="btn p-0 border-0 bg-transparent"
          onClick={() => onSelect(option.value)}
          aria-pressed={isSelected}
        >
          <span style={{ ...fallbackButtonStyle, ...(selectedStyle || {}) }}>{option.label}</span>
        </button>
      )
    }

    return (
      <button
        key={option.value}
        type="button"
        className="btn p-0 border-0 bg-transparent"
        onClick={() => onSelect(option.value)}
        aria-pressed={isSelected}
      >
        {brokenImages[option.img] ? (
          <span style={{ ...fallbackButtonStyle, ...(selectedStyle || {}) }}>{option.label}</span>
        ) : (
          <img
            src={option.img}
            alt={option.alt}
            className="imgbutton"
            style={selectedStyle}
            onError={() => setBrokenImages((prev) => ({ ...prev, [option.img]: true }))}
          />
        )}
      </button>
    )
  })
}

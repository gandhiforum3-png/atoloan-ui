export default function ContactInfoForm({
  contactInfo,
  errors,
  emailError,
  phoneError,
  onChange,
  onContinue,
  zipCode,
  copy,
}) {
  return (
    <div style={{ marginTop: '16px', textAlign: 'left' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        {errors.length > 0 && (
          <div
            style={{
              background: '#fbe9e7',
              border: '1px solid #f5c6cb',
              color: '#b71c1c',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '12px',
            }}
          >
            <strong>Fix the following:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: '18px' }}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        <input
          type="text"
          className="form-control"
          placeholder={copy.firstNamePlaceholder}
          value={contactInfo.firstName}
          onChange={onChange('firstName')}
          style={{ marginBottom: '12px' }}
        />
        <input
          type="text"
          className="form-control"
          placeholder={copy.lastNamePlaceholder}
          value={contactInfo.lastName}
          onChange={onChange('lastName')}
          style={{ marginBottom: '12px' }}
        />
        <input
          type="email"
          className="form-control"
          placeholder={copy.emailPlaceholder}
          value={contactInfo.email}
          onChange={onChange('email')}
          style={{ marginBottom: '12px' }}
        />
        {emailError && (
          <div style={{ color: '#d9534f', marginBottom: '12px' }}>
            {emailError}
          </div>
        )}
        <input
          type="text"
          className="form-control"
          placeholder={copy.addressPlaceholder}
          value={contactInfo.address}
          onChange={onChange('address')}
          style={{ marginBottom: '12px' }}
        />
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <input
            type="text"
            className="form-control"
            placeholder={copy.cityPlaceholder}
            value={contactInfo.city}
            onChange={onChange('city')}
          />
          <input
            type="text"
            className="form-control"
            placeholder={copy.statePlaceholder}
            value={contactInfo.state}
            onChange={onChange('state')}
          />
          <input
            type="text"
            inputMode="numeric"
            className="form-control"
            placeholder={copy.zipPlaceholderForm}
            value={contactInfo.zip || zipCode}
            onChange={onChange('zip')}
          />
        </div>
        <input
          type="tel"
          className="form-control"
          placeholder={copy.phonePlaceholder}
          value={contactInfo.phone}
          onChange={onChange('phone')}
          style={{ marginBottom: '12px' }}
        />
        {phoneError && (
          <div style={{ color: '#d9534f', marginBottom: '12px' }}>
            {phoneError}
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={onContinue}
          >
            {copy.continue}
          </button>
        </div>
      </div>
    </div>
  )
}

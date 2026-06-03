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
    <div style={{ marginTop: '20px', textAlign: 'left' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {errors.length > 0 && (
          <div
            style={{
              background: '#fbe9e7',
              border: '1px solid #f5c6cb',
              color: '#b71c1c',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <strong>Please fix the following:</strong>
            <ul style={{ margin: '8px 0 0', paddingLeft: '18px' }}>
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="contact-form-grid">
          <div className="contact-form-field">
            <label className="contact-form-label" htmlFor="firstName">{copy.firstNamePlaceholder}</label>
            <input
              id="firstName"
              type="text"
              className="form-control"
              placeholder={copy.firstNamePlaceholder}
              value={contactInfo.firstName}
              onChange={onChange('firstName')}
            />
          </div>

          <div className="contact-form-field">
            <label className="contact-form-label" htmlFor="lastName">{copy.lastNamePlaceholder}</label>
            <input
              id="lastName"
              type="text"
              className="form-control"
              placeholder={copy.lastNamePlaceholder}
              value={contactInfo.lastName}
              onChange={onChange('lastName')}
            />
          </div>

          <div className="contact-form-field full-width">
            <label className="contact-form-label" htmlFor="email">{copy.emailPlaceholder}</label>
            <input
              id="email"
              type="email"
              className={`form-control${emailError ? ' field-error' : ''}`}
              placeholder={copy.emailPlaceholder}
              value={contactInfo.email}
              onChange={onChange('email')}
            />
            {emailError && <span className="contact-field-error">{emailError}</span>}
          </div>

          <div className="contact-form-field full-width">
            <label className="contact-form-label" htmlFor="phone">{copy.phonePlaceholder}</label>
            <input
              id="phone"
              type="tel"
              className={`form-control${phoneError ? ' field-error' : ''}`}
              placeholder={copy.phonePlaceholder}
              value={contactInfo.phone}
              onChange={onChange('phone')}
            />
            {phoneError && <span className="contact-field-error">{phoneError}</span>}
          </div>

          <div className="contact-form-field full-width">
            <label className="contact-form-label" htmlFor="address">{copy.addressPlaceholder}</label>
            <input
              id="address"
              type="text"
              className="form-control"
              placeholder={copy.addressPlaceholder}
              value={contactInfo.address}
              onChange={onChange('address')}
            />
          </div>

          <div className="contact-form-field">
            <label className="contact-form-label" htmlFor="city">{copy.cityPlaceholder}</label>
            <input
              id="city"
              type="text"
              className="form-control"
              placeholder={copy.cityPlaceholder}
              value={contactInfo.city}
              onChange={onChange('city')}
            />
          </div>

          <div className="contact-form-field" style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '10px' }}>
            <div className="contact-form-field">
              <label className="contact-form-label" htmlFor="state">{copy.statePlaceholder}</label>
              <input
                id="state"
                type="text"
                className="form-control"
                placeholder={copy.statePlaceholder}
                value={contactInfo.state}
                onChange={onChange('state')}
              />
            </div>
            <div className="contact-form-field">
              <label className="contact-form-label" htmlFor="zip">{copy.zipPlaceholderForm}</label>
              <input
                id="zip"
                type="text"
                inputMode="numeric"
                className="form-control"
                placeholder={copy.zipPlaceholderForm}
                value={contactInfo.zip || zipCode}
                onChange={onChange('zip')}
              />
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="btn btn-success"
            style={{ padding: '12px 40px', fontSize: '16px', borderRadius: '8px' }}
            onClick={onContinue}
          >
            {copy.continue} →
          </button>
        </div>
      </div>
    </div>
  )
}

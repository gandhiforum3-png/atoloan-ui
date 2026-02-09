import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { copyByLanguage, getSteps } from './loans/loanSteps'
import { buildPreApprovalPayload, sendPayload } from './loans/payloads'
import StepOptions from './loans/StepOptions'

export default function Loans() {
  const { language } = useLanguage()
  const copy = useMemo(() => copyByLanguage[language] || copyByLanguage.en, [language])
  const steps = useMemo(() => getSteps(language, copy), [language, copy])
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [otherMonthlyIncome, setOtherMonthlyIncome] = useState('')
  const [otherDownPayment, setOtherDownPayment] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [timeAtJobMonths, setTimeAtJobMonths] = useState('')
  const [monthlyDebt, setMonthlyDebt] = useState('')
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [zipValidationError, setZipValidationError] = useState('')
  const [emailValidationError, setEmailValidationError] = useState('')
  const [phoneValidationError, setPhoneValidationError] = useState('')
  const [contactInfoErrors, setContactInfoErrors] = useState([])
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
  })
  const [hasSentPreApproval, setHasSentPreApproval] = useState(false)
  const [findBankResponse, setFindBankResponse] = useState(null)
  const [brokenImages, setBrokenImages] = useState({})

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1

  const summary = useMemo(
    () => {
      const items = steps
        .map((item) => {
          const selected = answers[item.id]
          if (!selected) return null
          const option = item.options.find((opt) => opt.value === selected)
          if (!option) return null
          if (item.id === 'monthly-income' && selected === 'other') {
            return {
              label: item.title,
              value: otherMonthlyIncome ? `$${otherMonthlyIncome} ${copy.monthlyAmountLabel}` : copy.other,
            }
          }
          if (item.id === 'down-payment' && selected === 'other') {
            return {
              label: item.title,
              value: otherDownPayment ? `$${otherDownPayment} ${copy.downPaymentLabel}` : copy.other,
            }
          }
          if (item.id === 'time-at-job' && selected === 'lessthanayear') {
            const monthsLabel = timeAtJobMonths
              ? language === 'es'
                ? `${timeAtJobMonths} Mes${timeAtJobMonths === '1' ? '' : 'es'}`
                : `${timeAtJobMonths} Month${timeAtJobMonths === '1' ? '' : 's'}`
              : copy.monthsLabel
            return {
              label: item.title,
              value: `${option.alt} (${monthsLabel})`,
            }
          }
          if (item.id === 'dti') {
            const debtLabel = monthlyDebt ? `$${monthlyDebt}` : copy.notProvided
            const incomeLabel = grossMonthlyIncome ? `$${grossMonthlyIncome}` : copy.notProvided
            return {
              label: item.title,
              value: `${copy.summaryDebt}: ${debtLabel}, ${copy.summaryIncome}: ${incomeLabel}`,
            }
          }
          return { label: item.title, value: option.alt }
        })
        .filter(Boolean)

      if (jobTitle) {
        items.push({ label: copy.jobTitleLabel, value: jobTitle })
      }
      if (zipCode) {
        items.push({ label: copy.zipTitle, value: zipCode })
      }
      if (contactInfo.firstName) {
        items.push({ label: copy.firstNamePlaceholder, value: contactInfo.firstName })
      }
      if (contactInfo.lastName) {
        items.push({ label: copy.lastNamePlaceholder, value: contactInfo.lastName })
      }
      if (contactInfo.email) {
        items.push({ label: copy.emailPlaceholder, value: contactInfo.email })
      }
      if (contactInfo.phone) {
        items.push({ label: copy.phonePlaceholder, value: contactInfo.phone })
      }
      if (contactInfo.address || contactInfo.city || contactInfo.state || contactInfo.zip) {
        items.push({
          label: copy.addressPlaceholder,
          value: `${contactInfo.address}, ${contactInfo.city}, ${contactInfo.state} ${contactInfo.zip}`.replace(/^,\s*/u, '').trim(),
        })
      }

      return items
    },
    [
      answers,
      copy,
      contactInfo.address,
      contactInfo.city,
      contactInfo.email,
      contactInfo.firstName,
      contactInfo.lastName,
      contactInfo.phone,
      contactInfo.state,
      contactInfo.zip,
      grossMonthlyIncome,
      language,
      jobTitle,
      monthlyDebt,
      otherDownPayment,
      otherMonthlyIncome,
      steps,
      timeAtJobMonths,
      zipCode,
    ]
  )

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }))

    // These steps require additional input before advancing.
    if (step.id === 'cosigner' && value === 'by-myself') {
      setStepIndex(steps.findIndex((item) => item.id === 'employment'))
      return
    }

    if (step.id === 'monthly-income' && value === 'other') {
      return
    }

    if (step.id === 'time-at-job') {
      return
    }

    if (step.id === 'down-payment' && value === 'other') {
      return
    }

    if (step.id === 'review') {
      console.log('Find Bank button clicked')
      sendFindBankPayload()
    }

    if (!isLastStep) {
      setStepIndex((prev) => prev + 1)
    }
  }

  const handleMonthlyIncomeContinue = () => {
    if (!otherMonthlyIncome.trim() || isLastStep) return
    setStepIndex((prev) => prev + 1)
  }

  const handleDownPaymentContinue = () => {
    if (!otherDownPayment.trim() || isLastStep) return
    setStepIndex((prev) => prev + 1)
  }

  const handleTimeAtJobContinue = () => {
    const selected = answers['time-at-job']
    if (!selected || !jobTitle.trim() || isLastStep) return
    if (selected === 'lessthanayear' && !timeAtJobMonths) return
    setStepIndex((prev) => prev + 1)
  }

  const handleDtiContinue = () => {
    if (!monthlyDebt.trim() || !grossMonthlyIncome.trim() || isLastStep) return
    setStepIndex((prev) => prev + 1)
  }

  const handleDtiSkip = () => {
    if (isLastStep) return
    setStepIndex((prev) => prev + 1)
  }

  const handleZipCodeContinue = async () => {
    const trimmedZip = zipCode.trim()
    if (!trimmedZip || isLastStep) return

    try {
      const response = await fetch('http://127.0.0.1:8000/validate-zipcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zipcode: trimmedZip }),
      })
      const data = await response.json()
      if (!data?.valid) {
        const message = 'Please enter a valid zip code.'
        setZipValidationError(message)
        window.alert(message)
        return
      }
      if (data?.city) {
        setContactInfo((prev) => ({ ...prev, city: data.city }))
      }
    } catch (error) {
      const message = 'Unable to validate zip code. Please try again.'
      setZipValidationError(message)
      window.alert(message)
      return
    }

    setZipValidationError('')
    setContactInfo((prev) => ({ ...prev, zip: trimmedZip }))
    setStepIndex((prev) => prev + 1)
  }

  const handleContactInfoChange = (field) => (event) => {
    const value = event.target.value
    setContactInfo((prev) => ({ ...prev, [field]: value }))
    if (field === 'email') {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value.trim())) {
        setEmailValidationError('please add valid email')
      } else {
        setEmailValidationError('')
      }
    }
    if (field === 'phone') {
      const digits = value.replace(/\D/gu, '')
      if (!value || digits.length === 10) {
        setPhoneValidationError('')
      }
    }
    if (field === 'zip') {
      setZipCode(value)
    }
  }

  const handleContactInfoContinue = () => {
    const emailValue = contactInfo.email.trim()
    const phoneValue = contactInfo.phone.trim()
    const phoneDigits = phoneValue.replace(/\D/gu, '')
    const errors = []
    if (emailValue && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(emailValue)) {
      const message = 'please add valid email'
      setEmailValidationError(message)
      errors.push(message)
    }
    if (phoneValue && phoneDigits.length !== 10) {
      const message = 'please add valid phone number'
      setPhoneValidationError(message)
      errors.push(message)
    }

    const requiredFields = [
      { key: 'firstName', label: 'First Name', value: contactInfo.firstName },
      { key: 'lastName', label: 'Last Name', value: contactInfo.lastName },
      { key: 'email', label: 'Email Address', value: emailValue },
      { key: 'address', label: 'Home Address', value: contactInfo.address },
      { key: 'city', label: 'City', value: contactInfo.city },
      { key: 'state', label: 'State', value: contactInfo.state },
      { key: 'zip', label: 'Zip Code', value: contactInfo.zip },
      { key: 'phone', label: 'Phone Number', value: phoneValue },
    ]
    const missing = requiredFields.filter((field) => !field.value.trim())
    if (missing.length) {
      errors.push(`Please fill in: ${missing.map((field) => field.label).join(', ')}.`)
    }
    if (errors.length || isLastStep) {
      setContactInfoErrors(errors)
      return
    }
    setContactInfoErrors([])
    // Send the pre-approval payload once the contact info is complete.
    sendPreApprovalPayload()
    setStepIndex((prev) => prev + 1)
  }

  const sendPreApprovalPayload = async () => {
    if (hasSentPreApproval) return
    await sendPayload(
      'http://127.0.0.1:8000/echo',
      buildPreApprovalPayload({
        language,
        answers,
        otherMonthlyIncome,
        otherDownPayment,
        jobTitle,
        timeAtJobMonths,
        monthlyDebt,
        grossMonthlyIncome,
        zipCode,
        contactInfo,
        summary,
      }),
      () => setHasSentPreApproval(true)
    )
  }

  const sendFindBankPayload = async () => {
    console.log('Sending find bank payload')
    setFindBankResponse(null)
    try {
      const response = await fetch('http://127.0.0.1:8000/findback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        body: JSON.stringify(
          buildPreApprovalPayload({
            language,
            answers,
            otherMonthlyIncome,
            otherDownPayment,
            jobTitle,
            timeAtJobMonths,
            monthlyDebt,
            grossMonthlyIncome,
            zipCode,
            contactInfo,
            summary,
          })
        ),
      })
      const data = await response.json()
      setFindBankResponse({ receivedAt: new Date().toISOString(), data })
    } catch (error) {
      console.error('Failed to send find bank payload', error)
      setFindBankResponse({ error: 'Failed to fetch response.' })
    }
  }

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  return (
    <section id="last">
      <div className="full">
        <div className="pagecontainer">
          <form className="form-horizontal">
            <h1>{step.title}</h1>
            {step.question && step.question !== step.title && (
              <p className="centered" style={{ paddingBottom: '30px', fontSize: '25px', fontWeight: 'bold' }}>
                {step.question}
              </p>
            )}
            <div className="lt">
              <div className="form-group">
                <div className="col-sm-12 centered">
                  {step.id === 'approval-info' && (
                    <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                      <p style={{ marginBottom: '12px', maxWidth: '860px', marginLeft: 'auto', marginRight: 'auto' }}>
                        {copy.approvalText}
                      </p>
                    </div>
                  )}
                  <StepOptions
                    options={step.options}
                    selectedValue={answers[step.id]}
                    onSelect={handleSelect}
                    brokenImages={brokenImages}
                    setBrokenImages={setBrokenImages}
                  />
                  {step.id === 'review' && findBankResponse && (
                    <div style={{ marginTop: '16px', textAlign: 'left' }}>
                      <pre
                        style={{
                          background: '#f7f7f7',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {JSON.stringify(findBankResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                  {step.id === 'monthly-income' && answers[step.id] === 'other' && (
                    <div style={{ marginTop: '16px' }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        className="form-control"
                        placeholder={copy.enterMonthlyIncome}
                        value={otherMonthlyIncome}
                        onChange={(event) => setOtherMonthlyIncome(event.target.value)}
                        style={{ maxWidth: '320px', margin: '0 auto' }}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ marginTop: '12px' }}
                        onClick={handleMonthlyIncomeContinue}
                        disabled={!otherMonthlyIncome.trim()}
                      >
                        {copy.continue}
                      </button>
                    </div>
                  )}
                  {step.id === 'time-at-job' && (
                    <div style={{ marginTop: '16px' }}>
                      {answers[step.id] === 'lessthanayear' && (
                        <select
                          className="form-control"
                          value={timeAtJobMonths}
                          onChange={(event) => setTimeAtJobMonths(event.target.value)}
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
                        onChange={(event) => setJobTitle(event.target.value)}
                        style={{ maxWidth: '420px', margin: '0 auto' }}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ marginTop: '12px' }}
                        onClick={handleTimeAtJobContinue}
                        disabled={
                          !answers[step.id] ||
                          !jobTitle.trim() ||
                          (answers[step.id] === 'lessthanayear' && !timeAtJobMonths)
                        }
                      >
                        {copy.continue}
                      </button>
                    </div>
                  )}
                  {step.id === 'down-payment' && answers[step.id] === 'other' && (
                    <div style={{ marginTop: '16px' }}>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        className="form-control"
                        placeholder={copy.enterDownPayment}
                        value={otherDownPayment}
                        onChange={(event) => setOtherDownPayment(event.target.value)}
                        style={{ maxWidth: '320px', margin: '0 auto' }}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ marginTop: '12px' }}
                        onClick={handleDownPaymentContinue}
                        disabled={!otherDownPayment.trim()}
                      >
                        {copy.continue}
                      </button>
                    </div>
                  )}
                  {step.id === 'dti' && (
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
                            onChange={(event) => setMonthlyDebt(event.target.value)}
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
                            onChange={(event) => setGrossMonthlyIncome(event.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={handleDtiSkip}
                          style={{ marginRight: '10px' }}
                        >
                          {copy.skip}
                        </button>
                        <button
                          type="button"
                          className="btn btn-success"
                          onClick={handleDtiContinue}
                          disabled={!monthlyDebt.trim() || !grossMonthlyIncome.trim()}
                        >
                          {copy.continue}
                        </button>
                      </div>
                    </div>
                  )}
                  {step.id === 'zip-code' && (
                    <div style={{ marginTop: '16px' }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        className="form-control"
                        placeholder={copy.zipPlaceholder}
                        value={zipCode}
                        onChange={(event) => setZipCode(event.target.value)}
                        style={{ maxWidth: '220px', margin: '0 auto' }}
                      />
                      <button
                        type="button"
                        className="btn btn-success"
                        style={{ marginTop: '12px' }}
                        onClick={handleZipCodeContinue}
                        disabled={!zipCode.trim()}
                      >
                        {copy.continue}
                      </button>
                    </div>
                  )}
                  {step.id === 'contact-info' && (
                    <div style={{ marginTop: '16px', textAlign: 'left' }}>
                      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
                        {contactInfoErrors.length > 0 && (
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
                              {contactInfoErrors.map((error) => (
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
                          onChange={handleContactInfoChange('firstName')}
                          style={{ marginBottom: '12px' }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder={copy.lastNamePlaceholder}
                          value={contactInfo.lastName}
                          onChange={handleContactInfoChange('lastName')}
                          style={{ marginBottom: '12px' }}
                        />
                        <input
                          type="email"
                          className="form-control"
                          placeholder={copy.emailPlaceholder}
                          value={contactInfo.email}
                          onChange={handleContactInfoChange('email')}
                          style={{ marginBottom: '12px' }}
                        />
                        {emailValidationError && (
                          <div style={{ color: '#d9534f', marginBottom: '12px' }}>
                            {emailValidationError}
                          </div>
                        )}
                        <input
                          type="text"
                          className="form-control"
                          placeholder={copy.addressPlaceholder}
                          value={contactInfo.address}
                          onChange={handleContactInfoChange('address')}
                          style={{ marginBottom: '12px' }}
                        />
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder={copy.cityPlaceholder}
                            value={contactInfo.city}
                            onChange={handleContactInfoChange('city')}
                          />
                          <input
                            type="text"
                            className="form-control"
                            placeholder={copy.statePlaceholder}
                            value={contactInfo.state}
                            onChange={handleContactInfoChange('state')}
                          />
                          <input
                            type="text"
                            inputMode="numeric"
                            className="form-control"
                            placeholder={copy.zipPlaceholderForm}
                            value={contactInfo.zip || zipCode}
                            onChange={handleContactInfoChange('zip')}
                          />
                        </div>
                        <input
                          type="tel"
                          className="form-control"
                          placeholder={copy.phonePlaceholder}
                          value={contactInfo.phone}
                          onChange={handleContactInfoChange('phone')}
                          style={{ marginBottom: '12px' }}
                        />
                        {phoneValidationError && (
                          <div style={{ color: '#d9534f', marginBottom: '12px' }}>
                            {phoneValidationError}
                          </div>
                        )}
                        <div style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleContactInfoContinue}
                          >
                            {copy.continue}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  <br />
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      className="btn p-0 border-0 bg-transparent"
                      onClick={handleBack}
                    >
                      <img src="/images/leftarrow.png" alt={copy.back} className="arrowbutton" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          {isLastStep && summary.length > 0 && (
            <div className="container" style={{ paddingTop: '30px' }}>
              <h2 style={{ textAlign: 'center' }}>{copy.preApprovalAnswersTitle}</h2>
              <div className="row" style={{ justifyContent: 'center' }}>
                <div className="col-sm-10">
                  <ul style={{ fontSize: '18px', lineHeight: '32px' }}>
                    {summary.map((item) => (
                      <li key={item.label}>
                        <strong>{item.label}:</strong> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

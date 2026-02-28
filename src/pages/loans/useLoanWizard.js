import { useMemo, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { copyByLanguage, getSteps } from './loanSteps'
import { buildPreApprovalPayload, sendPayload } from './payloads'

export default function useLoanWizard() {
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
  const [, setZipValidationError] = useState('')
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
  const [driversLicenseFile, setDriversLicenseFile] = useState(null)
  const [paycheckFile, setPaycheckFile] = useState(null)
  const [documentUploadStatus, setDocumentUploadStatus] = useState(null)
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false)

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
      setStepIndex((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to send find bank payload', error)
      setFindBankResponse({ error: 'Failed to fetch response.' })
      setStepIndex((prev) => prev + 1)
    }
  }

  const handleSelect = (value) => {
    setAnswers((prev) => ({ ...prev, [step.id]: value }))

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
      return
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
    } catch {
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
    sendPreApprovalPayload()
    setStepIndex((prev) => prev + 1)
  }

  const handleDocumentUpload = async () => {
    if (!driversLicenseFile || !paycheckFile) {
      setDocumentUploadStatus({ error: 'Please select both files before submitting.' })
      return
    }

    setIsUploadingDocuments(true)
    setDocumentUploadStatus(null)

    try {
      const formData = new FormData()
      formData.append('drivers_license', driversLicenseFile)
      formData.append('paycheck', paycheckFile)
      formData.append('user_email', contactInfo.email)
      formData.append('user_name', `${contactInfo.firstName}_${contactInfo.lastName}`)

      const response = await fetch('http://127.0.0.1:8000/uploadDocuments', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        setDocumentUploadStatus({ success: true, data })
      } else {
        setDocumentUploadStatus({ error: data.detail || data.errors?.join(', ') || 'Upload failed' })
      }
    } catch (error) {
      console.error('Document upload failed:', error)
      setDocumentUploadStatus({ error: 'Failed to upload documents. Please try again.' })
    } finally {
      setIsUploadingDocuments(false)
    }
  }

  const handleBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  return {
    copy,
    step,
    stepIndex,
    isLastStep,
    answers,
    summary,
    // Monthly income
    otherMonthlyIncome,
    setOtherMonthlyIncome,
    handleMonthlyIncomeContinue,
    // Down payment
    otherDownPayment,
    setOtherDownPayment,
    handleDownPaymentContinue,
    // Time at job
    jobTitle,
    setJobTitle,
    timeAtJobMonths,
    setTimeAtJobMonths,
    handleTimeAtJobContinue,
    // DTI
    monthlyDebt,
    setMonthlyDebt,
    grossMonthlyIncome,
    setGrossMonthlyIncome,
    handleDtiContinue,
    handleDtiSkip,
    // Zip code
    zipCode,
    setZipCode,
    handleZipCodeContinue,
    // Contact info
    contactInfo,
    contactInfoErrors,
    emailValidationError,
    phoneValidationError,
    handleContactInfoChange,
    handleContactInfoContinue,
    // Document upload
    findBankResponse,
    driversLicenseFile,
    setDriversLicenseFile,
    paycheckFile,
    setPaycheckFile,
    documentUploadStatus,
    isUploadingDocuments,
    handleDocumentUpload,
    // Images
    brokenImages,
    setBrokenImages,
    // Navigation
    handleSelect,
    handleBack,
  }
}

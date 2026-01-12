import { useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const copyByLanguage = {
  en: {
    loanTypeTitle: 'Select Loan Type',
    autoLoans: 'Auto Loans',
    autoRefinance: 'Auto Refinance',
    cosignerTitle: 'Are You Applying With A Co-Signer?',
    byMyself: 'By Myself',
    withCosigner: 'With Co-Signer',
    cosignerRelativeTitle: 'Is Your Co-Signer A Relative?',
    relative: 'Relative',
    nonRelative: 'Not Relative',
    sameAddressTitle: 'Does Your Co-Signer Live At The Same Address?',
    livesSameAddress: 'Lives At Same Address',
    notSameAddress: "Doesn't Live At Same Address",
    employmentTitle: 'Select Employment Type',
    fullTime: 'Full Time',
    partTime: 'Part Time',
    tempSeasonal: 'Temp/Seasonal',
    selfEmployed: 'Self Employed',
    ssiRetired: 'SSI / Retired',
    military: 'Military',
    disability: 'Disability',
    proofIncomeTitle: 'Select Proof Of Income Type',
    paystub: 'Paystub',
    w2: 'W2',
    taxes: 'Taxes',
    taxes2Years: 'Taxes 2 Years',
    form1099: '1099',
    proofBenefits: 'Proof Of Benefits',
    rewardLetter: 'Reward Letter',
    monthlyIncomeTitle: 'Select Monthly Income',
    other: 'Other',
    notProvided: 'Not provided',
    monthlyAmountLabel: 'Monthly',
    timeAtJobTitle: 'Choose Time At Job',
    over2Years: 'Over 2 Years',
    oneToTwoYears: '1-2 Years',
    lessThanYear: 'Less Than A Year',
    monthsLabel: 'Months',
    driversLicenseTitle: "Do You Have A Current Driver's License?",
    yes: 'Yes',
    no: 'No',
    downPaymentTitle: 'Select Down Payment Amount',
    downPaymentLabel: 'Down',
    enterDownPayment: 'Enter down payment amount',
    ssnItinTitle: 'Do You Have A Social Security Number or An ITIN Number?',
    socialSecurity: 'Social Security',
    itin: 'ITIN',
    dtiTitle: "Let's Calculate Your Debt To Income Ratio",
    dtiDescription:
      'Your debt-to-income ratio (DTI) is all your monthly debt payments divided by your gross monthly income. Recurring monthly debt can include things such as: car payments, credit cards, mortgage, personal loans, school loans, etc.',
    dtiCalculatorTitle: 'Debt To Income Ratio Calculator',
    recurringDebtLabel: 'Your Recurring Monthly Debt:',
    grossIncomeLabel: 'Your Gross Monthly Income:',
    skip: 'Skip',
    continue: 'Continue',
    repoTitle: 'Have You Ever Had A Repo?',
    residenceTimeTitle: 'Your Time At Current Residence?',
    over1Year: 'Over 1 Year',
    under1Year: 'Under 1 Year',
    zipTitle: 'Your Zip Code For Current Residence?',
    zipPlaceholder: 'Enter your zip code',
    approvalTitle: "What's the difference between approval and pre-approval?",
    approvalText:
      'One word: verification. Pre-approvals are an estimate, not a promise. A pre-approval is a non-binding statement saying, based on a cursory review of your unverified financial status, that you are eligible for a loan up to a certain amount. It is based on a credit check and (again unverified) claims of income and debt. The approval is a the process of obtaining a specific loan on a specific car for a specific amount. These are subject to review of a complete loan application.',
    exit: 'Exit',
    contactTitle: 'Provide Your Contact Information',
    firstNamePlaceholder: 'First Name',
    lastNamePlaceholder: 'Last Name',
    emailPlaceholder: 'Email Address',
    addressPlaceholder: 'Home Address',
    cityPlaceholder: 'City',
    statePlaceholder: 'State',
    zipPlaceholderForm: 'Zip Code',
    phonePlaceholder: 'Phone Number',
    jobTitleLabel: "What's Your Job Title",
    jobTitlePlaceholder: "What's your job title?",
    preApprovalAnswersTitle: 'Your Pre-Approval Answers',
    reviewTitle: 'Review & Continue',
    seeMonthlyPayment: 'See Monthly Payment',
    summaryDebt: 'Debt',
    summaryIncome: 'Income',
    selectMonths: 'Select months',
    enterMonthlyIncome: 'Enter monthly income',
    fullNameLabel: 'Full Name',
    back: 'Back',
  },
  es: {
    loanTypeTitle: 'Seleccione Tipo De Prestamo',
    autoLoans: 'Prestamo De Auto',
    autoRefinance: 'Refinanciamiento De Auto',
    cosignerTitle: 'Estas Solicitando Con Un Cosignatario?',
    byMyself: 'Por Mi Mismo',
    withCosigner: 'Con Cosignatario',
    cosignerRelativeTitle: 'Tu Cosignatario Es Un Familiar?',
    relative: 'Familiar',
    nonRelative: 'No Familiar',
    sameAddressTitle: 'Tu Cosignatario Vive En La Misma Direccion?',
    livesSameAddress: 'Vive En La Misma Direccion',
    notSameAddress: 'No Vive En La Misma Direccion',
    employmentTitle: 'Seleccione Tipo De Empleo',
    fullTime: 'Tiempo Completo',
    partTime: 'Medio Tiempo',
    tempSeasonal: 'Temporal/Estacional',
    selfEmployed: 'Autoempleado',
    ssiRetired: 'SSI / Jubilado',
    military: 'Militar',
    disability: 'Discapacidad',
    proofIncomeTitle: 'Seleccione Tipo De Comprobante De Ingresos',
    paystub: 'Talones De Pago',
    w2: 'W2',
    taxes: 'Impuestos',
    taxes2Years: 'Impuestos 2 Anos',
    form1099: '1099',
    proofBenefits: 'Prueba De Beneficios',
    rewardLetter: 'Carta De Beneficios',
    monthlyIncomeTitle: 'Seleccione Ingreso Mensual',
    other: 'Otro',
    notProvided: 'No provisto',
    monthlyAmountLabel: 'Mensual',
    timeAtJobTitle: 'Elija Tiempo En El Trabajo',
    over2Years: 'Mas De 2 Anos',
    oneToTwoYears: '1-2 Anos',
    lessThanYear: 'Menos De Un Ano',
    monthsLabel: 'Meses',
    driversLicenseTitle: 'Tiene Una Licencia De Conducir Vigente?',
    yes: 'Si',
    no: 'No',
    downPaymentTitle: 'Seleccione Monto Del Pago Inicial',
    downPaymentLabel: 'Pago Inicial',
    enterDownPayment: 'Ingrese el pago inicial',
    ssnItinTitle: 'Tiene Un Numero De Seguro Social O Un Numero ITIN?',
    socialSecurity: 'Seguro Social',
    itin: 'ITIN',
    dtiTitle: 'Calculemos Su Relacion Deuda/Ingreso',
    dtiDescription:
      'Su relacion deuda/ingreso (DTI) es el total de sus pagos mensuales de deuda dividido entre su ingreso mensual bruto. La deuda mensual recurrente puede incluir pagos de auto, tarjetas de credito, hipoteca, prestamos personales, prestamos estudiantiles, etc.',
    dtiCalculatorTitle: 'Calculadora De Relacion Deuda/Ingreso',
    recurringDebtLabel: 'Su Deuda Mensual Recurrente:',
    grossIncomeLabel: 'Su Ingreso Mensual Bruto:',
    skip: 'Omitir',
    continue: 'Continuar',
    repoTitle: 'Alguna Vez Tuvo Un Repo?',
    residenceTimeTitle: 'Tiempo En Su Residencia Actual?',
    over1Year: 'Mas De 1 Ano',
    under1Year: 'Menos De 1 Ano',
    zipTitle: 'Su Codigo Postal De Residencia Actual?',
    zipPlaceholder: 'Ingrese su codigo postal',
    approvalTitle: 'Cual Es La Diferencia Entre Aprobacion Y Preaprobacion?',
    approvalText:
      'Una palabra: verificacion. Las preaprobaciones son una estimacion, no una promesa. Una preaprobacion es una declaracion no vinculante que dice, basada en una revision superficial de su estado financiero no verificado, que usted es elegible para un prestamo hasta cierto monto. Se basa en una verificacion de credito y en afirmaciones (no verificadas) de ingresos y deudas. La aprobacion es el proceso de obtener un prestamo especifico para un auto especifico por un monto especifico. Estas estan sujetas a revision de una solicitud completa.',
    exit: 'Salir',
    contactTitle: 'Proporcione Su Informacion De Contacto',
    firstNamePlaceholder: 'Nombre',
    lastNamePlaceholder: 'Apellido',
    emailPlaceholder: 'Correo Electronico',
    addressPlaceholder: 'Direccion',
    cityPlaceholder: 'Ciudad',
    statePlaceholder: 'Estado',
    zipPlaceholderForm: 'Codigo Postal',
    phonePlaceholder: 'Numero De Telefono',
    jobTitleLabel: 'Cual Es Su Puesto De Trabajo',
    jobTitlePlaceholder: 'Cual es su puesto de trabajo?',
    preApprovalAnswersTitle: 'Sus Respuestas De Preaprobacion',
    reviewTitle: 'Revision Y Continuar',
    seeMonthlyPayment: 'Ver Pago Mensual',
    summaryDebt: 'Deuda',
    summaryIncome: 'Ingreso',
    selectMonths: 'Seleccione meses',
    enterMonthlyIncome: 'Ingrese ingreso mensual',
    fullNameLabel: 'Nombre Completo',
    back: 'Atras',
  },
}

const getSteps = (language, copy) => {
  const img = (name) => `/images/${language === 'es' ? 'btn_esp' : 'btn_eng'}_${name}.png`

  return [
    {
      id: 'loan-type',
      title: copy.loanTypeTitle,
      options: [
        {
          value: 'autoloan',
          img: img('autoloan'),
          alt: copy.autoLoans,
          label: copy.autoLoans,
        },
        {
          value: 'autorefinance',
          img: img('autorefinance'),
          alt: copy.autoRefinance,
          label: copy.autoRefinance,
        },
      ],
    },
    {
      id: 'cosigner',
      title: copy.cosignerTitle,
      question: copy.cosignerTitle,
      options: [
        {
          value: 'by-myself',
          img: img('bymyself'),
          alt: copy.byMyself,
          label: copy.byMyself,
        },
        {
          value: 'with-cosigner',
          img: img('withacosigner'),
          alt: copy.withCosigner,
          label: copy.withCosigner,
        },
      ],
    },
    {
      id: 'cosigner-relative',
      title: copy.cosignerRelativeTitle,
      options: [
        {
          value: 'relative',
          img: img('relative'),
          alt: copy.relative,
          label: copy.relative,
        },
        {
          value: 'non-relative',
          img: img('nonrelative'),
          alt: copy.nonRelative,
          label: copy.nonRelative,
        },
      ],
    },
    {
      id: 'same-address',
      title: copy.sameAddressTitle,
      options: [
        {
          value: 'same-address',
          img: img('livesameaddress'),
          alt: copy.livesSameAddress,
          label: copy.livesSameAddress,
        },
        {
          value: 'different-address',
          img: img('nolivesameaddress'),
          alt: copy.notSameAddress,
          label: copy.notSameAddress,
        },
      ],
    },
    {
      id: 'employment',
      title: copy.employmentTitle,
      options: [
        {
          value: 'fulltime',
          img: img('fulltime'),
          alt: copy.fullTime,
          label: copy.fullTime,
        },
        {
          value: 'parttime',
          img: img('parttime'),
          alt: copy.partTime,
          label: copy.partTime,
        },
        {
          value: 'tempseasonal',
          img: img('tempseasonal'),
          alt: copy.tempSeasonal,
          label: copy.tempSeasonal,
        },
        {
          value: 'selfemployed',
          img: img('selfemployed'),
          alt: copy.selfEmployed,
          label: copy.selfEmployed,
        },
        {
          value: 'ssiretired',
          img: img('ssiretired'),
          alt: copy.ssiRetired,
          label: copy.ssiRetired,
        },
        {
          value: 'military',
          img: img('military'),
          alt: copy.military,
          label: copy.military,
        },
        {
          value: 'disability',
          img: img('disability'),
          alt: copy.disability,
          label: copy.disability,
        },
      ],
    },
    {
      id: 'proof-of-income',
      title: copy.proofIncomeTitle,
      options: [
        {
          value: 'paystub',
          img: img('paystub'),
          alt: copy.paystub,
          label: copy.paystub,
        },
        {
          value: 'w2',
          img: img('w2'),
          alt: copy.w2,
          label: copy.w2,
        },
        {
          value: 'taxes',
          img: img('taxes'),
          alt: copy.taxes,
          label: copy.taxes,
        },
        {
          value: 'taxes-2-years',
          img: img('taxes2years'),
          alt: copy.taxes2Years,
          label: copy.taxes2Years,
        },
        {
          value: '1099',
          img: img('1099'),
          alt: copy.form1099,
          label: copy.form1099,
        },
        {
          value: 'proof-of-benefits',
          img: img('proofofbenefits'),
          alt: copy.proofBenefits,
          label: copy.proofBenefits,
        },
        {
          value: 'reward-letter',
          img: img('rewardletter'),
          alt: copy.rewardLetter,
          label: copy.rewardLetter,
        },
      ],
    },
    {
      id: 'monthly-income',
      title: copy.monthlyIncomeTitle,
      options: [
        {
          value: '2000',
          img: img('2000monthly'),
          alt: `$2,000 ${copy.monthlyAmountLabel}`,
          label: `$2,000 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '2500',
          img: img('2500monthly'),
          alt: `$2,500 ${copy.monthlyAmountLabel}`,
          label: `$2,500 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '3000',
          img: img('3000monthly'),
          alt: `$3,000 ${copy.monthlyAmountLabel}`,
          label: `$3,000 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '3500',
          img: img('3500monthly'),
          alt: `$3,500 ${copy.monthlyAmountLabel}`,
          label: `$3,500 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '4000',
          img: img('4000monthly'),
          alt: `$4,000 ${copy.monthlyAmountLabel}`,
          label: `$4,000 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '4500',
          img: img('4500monthly'),
          alt: `$4,500 ${copy.monthlyAmountLabel}`,
          label: `$4,500 ${copy.monthlyAmountLabel}`,
        },
        {
          value: '5000',
          img: img('5000monthly'),
          alt: `$5,000 ${copy.monthlyAmountLabel}`,
          label: `$5,000 ${copy.monthlyAmountLabel}`,
        },
        {
          value: 'other',
          img: img('othermonthly'),
          alt: copy.other,
          label: copy.other,
        },
      ],
    },
    {
      id: 'time-at-job',
      title: copy.timeAtJobTitle,
      options: [
        {
          value: 'over2years',
          img: img('over2years'),
          alt: copy.over2Years,
          label: copy.over2Years,
        },
        {
          value: '1-2years',
          img: img('12years'),
          alt: copy.oneToTwoYears,
          label: copy.oneToTwoYears,
        },
        {
          value: 'lessthanayear',
          img: img('lessthanayear'),
          alt: copy.lessThanYear,
          label: copy.lessThanYear,
        },
      ],
    },
    {
      id: 'drivers-license',
      title: copy.driversLicenseTitle,
      question: copy.driversLicenseTitle,
      options: [
        {
          value: 'yes',
          img: img('yes'),
          alt: copy.yes,
          label: copy.yes,
        },
        {
          value: 'no',
          img: img('no'),
          alt: copy.no,
          label: copy.no,
        },
      ],
    },
    {
      id: 'down-payment',
      title: copy.downPaymentTitle,
      options: [
        {
          value: '0down',
          img: img('0down'),
          alt: '$0',
          label: '$0',
        },
        {
          value: '1000-1500',
          img: img('1000to1500down'),
          alt: '$1,000-$1,500',
          label: '$1,000-$1,500',
        },
        {
          value: '2000-2500',
          img: img('2000to2500down'),
          alt: '$2,000-$2,500',
          label: '$2,000-$2,500',
        },
        {
          value: '3000-3500',
          img: img('3000to3500down'),
          alt: '$3,000-$3,500',
          label: '$3,000-$3,500',
        },
        {
          value: '4000-4500',
          img: img('4000to4500down'),
          alt: '$4,000-$4,500',
          label: '$4,000-$4,500',
        },
        {
          value: '5000-6500',
          img: img('5000to6500down'),
          alt: '$5,000-$6,500',
          label: '$5,000-$6,500',
        },
        {
          value: 'other',
          img: img('otheramountdown'),
          alt: copy.other,
          label: copy.other,
        },
      ],
    },
    {
      id: 'ssn-itin',
      title: copy.ssnItinTitle,
      question: copy.ssnItinTitle,
      options: [
        {
          value: 'social-security',
          img: img('socialsecurity'),
          alt: copy.socialSecurity,
          label: copy.socialSecurity,
        },
        {
          value: 'itin',
          img: img('itin'),
          alt: copy.itin,
          label: copy.itin,
        },
      ],
    },
    {
      id: 'dti',
      title: copy.dtiTitle,
      options: [],
    },
    {
      id: 'repo-history',
      title: copy.repoTitle,
      question: copy.repoTitle,
      options: [
        {
          value: 'repo-yes',
          img: img('repoyes'),
          alt: copy.yes,
          label: copy.yes,
        },
        {
          value: 'repo-no',
          img: img('repono'),
          alt: copy.no,
          label: copy.no,
        },
      ],
    },
    {
      id: 'residence-time',
      title: copy.residenceTimeTitle,
      question: copy.residenceTimeTitle,
      options: [
        {
          value: 'over2years',
          img: img('over2years'),
          alt: copy.over2Years,
          label: copy.over2Years,
        },
        {
          value: 'over1year',
          img: img('over1year'),
          alt: copy.over1Year,
          label: copy.over1Year,
        },
        {
          value: 'under1year',
          img: img('under1year'),
          alt: copy.under1Year,
          label: copy.under1Year,
        },
      ],
    },
    {
      id: 'zip-code',
      title: copy.zipTitle,
      question: copy.zipTitle,
      options: [],
    },
    {
      id: 'approval-info',
      title: copy.approvalTitle,
      options: [
        {
          value: 'continue',
          img: img('continue'),
          alt: copy.continue,
          label: copy.continue,
        },
        {
          value: 'exit',
          img: img('exit'),
          alt: copy.exit,
          label: copy.exit,
        },
      ],
    },
    {
      id: 'contact-info',
      title: copy.contactTitle,
      options: [],
    },
    {
      id: 'review',
      title: copy.reviewTitle,
      options: [
        {
          value: 'see-payment',
          img: img('seemonthlypayment'),
          alt: copy.seeMonthlyPayment,
          label: copy.seeMonthlyPayment,
        },
      ],
    },
  ]
}

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
      if (contactInfo.firstName || contactInfo.lastName) {
        items.push({
          label: copy.fullNameLabel,
          value: `${contactInfo.firstName} ${contactInfo.lastName}`.trim(),
        })
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

  const handleZipCodeContinue = () => {
    if (!zipCode.trim() || isLastStep) return
    setContactInfo((prev) => ({ ...prev, zip: zipCode.trim() }))
    setStepIndex((prev) => prev + 1)
  }

  const handleContactInfoChange = (field) => (event) => {
    const value = event.target.value
    setContactInfo((prev) => ({ ...prev, [field]: value }))
    if (field === 'zip') {
      setZipCode(value)
    }
  }

  const handleContactInfoContinue = () => {
    const requiredFields = [
      contactInfo.firstName,
      contactInfo.lastName,
      contactInfo.email,
      contactInfo.address,
      contactInfo.city,
      contactInfo.state,
      contactInfo.zip,
      contactInfo.phone,
    ]
    if (requiredFields.some((field) => !field.trim()) || isLastStep) return
    setStepIndex((prev) => prev + 1)
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
                  {step.options.map((option) => {
                    const isSelected = answers[step.id] === option.value
                    const selectedStyle = isSelected
                      ? { outline: '4px solid #39b54a', borderRadius: '10px' }
                      : undefined

                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="btn p-0 border-0 bg-transparent"
                        onClick={() => handleSelect(option.value)}
                        aria-pressed={isSelected}
                      >
                        {brokenImages[option.img] ? (
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '18px 28px',
                              margin: '6px',
                              border: '4px solid #39b54a',
                              borderRadius: '10px',
                              fontWeight: 'bold',
                              textTransform: 'uppercase',
                              background: '#fff',
                              color: '#000',
                              ...(selectedStyle || {}),
                            }}
                          >
                            {option.label}
                          </span>
                        ) : (
                          <img
                            src={option.img}
                            alt={option.alt}
                            className="imgbutton"
                            style={selectedStyle}
                            onError={() =>
                              setBrokenImages((prev) => ({ ...prev, [option.img]: true }))
                            }
                          />
                        )}
                      </button>
                    )
                  })}
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
                        <div style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-success"
                            onClick={handleContactInfoContinue}
                            disabled={[
                              contactInfo.firstName,
                              contactInfo.lastName,
                              contactInfo.email,
                              contactInfo.address,
                              contactInfo.city,
                              contactInfo.state,
                              contactInfo.zip || zipCode,
                              contactInfo.phone,
                            ].some((field) => !String(field).trim())}
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

import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { calculatePayments, formatCurrency } from '../utils/loanCalculator'

export default function LoanCalculator() {
  const [values, setValues] = useState({
    vehiclePrice: 35000,
    downPayment: 7000,
    loanTerm: 72,
    interestRate: 11.33,
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  const handleChange = (key) => (event) => {
    const nextValue = event.target.value.replace(/[^0-9.]/g, '')
    setValues((prev) => ({ ...prev, [key]: nextValue }))
  }

  const handleCalculate = () => {
    const calc = calculatePayments({
      vehiclePrice: values.vehiclePrice,
      downPayment: values.downPayment,
      loanTerm: values.loanTerm,
      interestRate: values.interestRate,
    })

    if (calc.error) {
      setError(calc.error)
      return
    }

    setError('')
    setResult(calc)

    if (window.innerWidth < 750) {
      document.getElementById('paymentresultsmobile')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (!result || !chartRef.current) return

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    chartInstance.current = new Chart(chartRef.current, {
      type: 'pie',
      data: {
        labels: ['Interest Paid', 'Loan Amount'],
        datasets: [
          {
            backgroundColor: ['#39b54a', '#1b75bc'],
            data: [result.totalInterestPaid.toFixed(2), result.loanAmount.toFixed(2)],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          title: {
            display: false,
            text: '',
          },
        },
      },
    })
  }, [result])

  return (
    <section id="last">
      <div className="full">
        <section className="pagecontainer" style={{ backgroundColor: '#fff', marginTop: '180px', padding: '20px' }}>
          <div className="container" style={{ paddingBottom: '30px' }}>
            <div className="row">
              <div className="col-sm-12">
                <h2 style={{ paddingBottom: '20px' }}>Auto Loan Calculator</h2>
                <p style={{ fontSize: '18px' }}>
                  Your monthly auto loan payment will depend on the car price, down payment, length of the loan
                  (term), and interest rate of the loan, which is highly dependent on your credit score. Interest
                  rates on used car loans also tend to be higher than those on new car loans. Use the inputs below
                  to get a sense of what your monthly auto loan payment could end up being.
                </p>
              </div>
            </div>
          </div>

          <div className="row justify-content-evenly">
            <div className="col-md-4">
              <form id="loanCalc" className="">
                {[
                  { id: 'vehiclePrice', label: 'Vehicle Price', prefix: '$', min: 0, max: 200000, step: 1000, key: 'vehiclePrice' },
                  { id: 'downPayment', label: 'Down Payment', prefix: '$', min: 0, max: 200000, step: 500, key: 'downPayment' },
                  { id: 'loanTerm', label: 'Loan Term (Months)', suffix: 'mo', min: 24, max: 120, step: 12, key: 'loanTerm' },
                  { id: 'intRate', label: 'Interest Rate', suffix: '%', min: 0, max: 30, step: 0.01, key: 'interestRate' },
                ].map(({ id, label, prefix, suffix, min, max, step, key }) => (
                  <div key={id} className="col-md-12" style={{ marginBottom: '8px' }}>
                    <div className="form-group">
                      <label htmlFor={id} style={{ fontWeight: '600', fontSize: '13px', color: '#495057', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px', display: 'block' }}>
                        {label}
                      </label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {prefix && <span style={{ color: '#495057', fontWeight: '600' }}>{prefix}</span>}
                        <input
                          type="text"
                          className="form-control"
                          id={id}
                          value={values[key]}
                          onChange={handleChange(key)}
                          style={{ flex: 1 }}
                        />
                        {suffix && <span style={{ color: '#495057', fontWeight: '600' }}>{suffix}</span>}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#adb5bd' }}>{prefix}{min}{suffix}</span>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          step={step}
                          value={values[key]}
                          style={{ flex: 1 }}
                          onChange={handleChange(key)}
                        />
                        <span style={{ fontSize: '11px', color: '#adb5bd' }}>{prefix}{max}{suffix}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="clearfix"></div>
                <div className="col-md-12">
                  <button
                    type="button"
                    className="calcBtn"
                    id="calculate"
                    style={{ marginTop: '15px', border: 'none' }}
                    onClick={handleCalculate}
                  >
                    Calculate
                  </button>
                </div>
                {error && (
                  <p style={{ color: '#9f2323', fontWeight: 'bold', marginTop: '10px' }}>{error}</p>
                )}
              </form>
            </div>

            <div className="col-md-4">
              <div id="paymentresultsmobile"></div>
              <div id="paymentResults">
                {!result && (
                  <p style={{ textAlign: 'center', color: '#adb5bd', fontSize: '15px', padding: '20px 0' }}>
                    Enter your loan details and click <strong>Calculate</strong> to see your estimate.
                  </p>
                )}
                <p style={{ textAlign: 'center', fontSize: '14px', color: '#6c757d', marginBottom: '4px' }}>
                  {result ? 'Monthly Payment' : ''}
                </p>
                <p style={{ textAlign: 'center', fontSize: '42px', fontWeight: 'bold', margin: '0 0 4px', lineHeight: 1 }}>
                  {result ? `$${formatCurrency(result.monthlyPayment)}` : ''}
                  {result && <span style={{ fontSize: '16px', fontWeight: '400', color: '#6c757d' }}> / mo for {result.months / 12} yrs</span>}
                </p>
                <p style={{ textAlign: 'center', fontSize: '20px' }}>
                  Total Interest Paid:{' '}
                  <span style={{ fontSize: '28px', color: '#39b54a' }}>
                    ${result ? formatCurrency(result.totalInterestPaid) : '---'}
                  </span>
                </p>
                <p style={{ textAlign: 'center', fontSize: '20px' }}>
                  Loan Amount:{' '}
                  <span style={{ fontSize: '28px', color: '#1b75bc' }}>
                    ${result ? formatCurrency(result.loanAmount) : '---'}
                  </span>
                </p>
                <p style={{ textAlign: 'center', fontSize: '20px' }}>
                  Total Paid:{' '}
                  <span style={{ fontSize: '28px', color: '#9f2323' }}>
                    ${result ? formatCurrency(result.totalPaid) : '---'}
                  </span>
                </p>
                <canvas
                  id="loanChart"
                  ref={chartRef}
                  style={{ width: '300px', maxWidth: '300px', height: '300px', marginLeft: 'auto', marginRight: 'auto' }}
                ></canvas>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
}

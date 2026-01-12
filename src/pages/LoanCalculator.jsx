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
            backgroundColor: ['#5ab054', '#1b75bc'],
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
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="vehiclePrice" style={{ paddingTop: '15px' }}>
                      Vehicle Price
                    </label>
                    <br />
                    <div style={{ float: 'left', padding: '5px 5px 0 0' }}>$</div>
                    <div style={{ float: 'left', width: '95%' }}>
                      <input
                        type="text"
                        className="form-control"
                        id="vehiclePrice"
                        placeholder="Vehicle Price"
                        value={values.vehiclePrice}
                        onChange={handleChange('vehiclePrice')}
                      />
                    </div>
                    <br />
                    <input
                      type="range"
                      id="vehiclePriceSlider"
                      min="0"
                      max="200000"
                      value={values.vehiclePrice}
                      style={{ width: '100%' }}
                      onChange={handleChange('vehiclePrice')}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="downPayment" style={{ paddingTop: '15px' }}>
                      Down Payment
                    </label>
                    <br />
                    <div style={{ float: 'left', padding: '5px 5px 0 0' }}>$</div>
                    <div style={{ float: 'left', width: '95%' }}>
                      <input
                        type="text"
                        className="form-control"
                        id="downPayment"
                        placeholder="Down Payment"
                        value={values.downPayment}
                        onChange={handleChange('downPayment')}
                      />
                    </div>
                    <br />
                    <input
                      type="range"
                      id="downPaymentSlider"
                      min="0"
                      max="200000"
                      value={values.downPayment}
                      style={{ width: '100%' }}
                      onChange={handleChange('downPayment')}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="loanTerm" style={{ paddingTop: '15px' }}>
                      Loan Term Months
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="loanTerm"
                      placeholder="Loan Term Months"
                      value={values.loanTerm}
                      onChange={handleChange('loanTerm')}
                    />
                    <input
                      type="range"
                      id="loanTermSlider"
                      min="24"
                      max="120"
                      step="12"
                      value={values.loanTerm}
                      style={{ width: '100%' }}
                      onChange={handleChange('loanTerm')}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label htmlFor="intRate" style={{ paddingTop: '15px' }}>
                      Interest Rate
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="intRate"
                      placeholder="Interest Rate"
                      value={values.interestRate}
                      onChange={handleChange('interestRate')}
                      style={{ float: 'left', width: '95%' }}
                    />
                    <div style={{ float: 'right', padding: '5px 5px 0 0' }}>%</div>
                    <input
                      type="range"
                      id="intRateSlider"
                      min="0"
                      max="30"
                      step=".01"
                      value={values.interestRate}
                      style={{ width: '100%' }}
                      onChange={handleChange('interestRate')}
                    />
                  </div>
                </div>
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
                <p style={{ textAlign: 'center', fontSize: '20px', lineHeight: '50px' }}>
                  Monthly Payment is:
                  <br />
                </p>
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: '35px',
                    lineHeight: '18px',
                    fontWeight: 'bold',
                    paddingTop: '0px',
                    marginTop: '-20px',
                  }}
                >
                  ${result ? formatCurrency(result.monthlyPayment) : '---'}
                  <span style={{ fontSize: '20px' }}>
                    {' '}
                    / Month for {result ? result.months / 12 : '---'} Years
                  </span>
                </p>
                <p style={{ textAlign: 'center', fontSize: '20px' }}>
                  Total Interest Paid:{' '}
                  <span style={{ fontSize: '28px', color: '#5ab054' }}>
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

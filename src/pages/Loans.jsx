import useLoanWizard from './loans/useLoanWizard'
import StepOptions from './loans/StepOptions'
import MonthlyIncomeInput from './loans/steps/MonthlyIncomeInput'
import TimeAtJobInput from './loans/steps/TimeAtJobInput'
import DownPaymentInput from './loans/steps/DownPaymentInput'
import DtiCalculator from './loans/steps/DtiCalculator'
import ZipCodeInput from './loans/steps/ZipCodeInput'
import ContactInfoForm from './loans/steps/ContactInfoForm'
import DocumentUpload from './loans/steps/DocumentUpload'
import ReviewSummary from './loans/steps/ReviewSummary'

export default function Loans() {
  const wizard = useLoanWizard()
  const { copy, step, stepIndex, isLastStep, answers, summary } = wizard

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
                    onSelect={wizard.handleSelect}
                    brokenImages={wizard.brokenImages}
                    setBrokenImages={wizard.setBrokenImages}
                  />
                  {step.id === 'review' && wizard.findBankResponse && (
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
                        {JSON.stringify(wizard.findBankResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                  {step.id === 'monthly-income' && answers[step.id] === 'other' && (
                    <MonthlyIncomeInput
                      value={wizard.otherMonthlyIncome}
                      onChange={wizard.setOtherMonthlyIncome}
                      onContinue={wizard.handleMonthlyIncomeContinue}
                      disabled={!wizard.otherMonthlyIncome.trim()}
                      copy={copy}
                    />
                  )}
                  {step.id === 'time-at-job' && (
                    <TimeAtJobInput
                      selectedValue={answers[step.id]}
                      timeAtJobMonths={wizard.timeAtJobMonths}
                      onMonthsChange={wizard.setTimeAtJobMonths}
                      jobTitle={wizard.jobTitle}
                      onJobTitleChange={wizard.setJobTitle}
                      onContinue={wizard.handleTimeAtJobContinue}
                      disabled={
                        !answers[step.id] ||
                        !wizard.jobTitle.trim() ||
                        (answers[step.id] === 'lessthanayear' && !wizard.timeAtJobMonths)
                      }
                      copy={copy}
                    />
                  )}
                  {step.id === 'down-payment' && answers[step.id] === 'other' && (
                    <DownPaymentInput
                      value={wizard.otherDownPayment}
                      onChange={wizard.setOtherDownPayment}
                      onContinue={wizard.handleDownPaymentContinue}
                      disabled={!wizard.otherDownPayment.trim()}
                      copy={copy}
                    />
                  )}
                  {step.id === 'dti' && (
                    <DtiCalculator
                      monthlyDebt={wizard.monthlyDebt}
                      grossMonthlyIncome={wizard.grossMonthlyIncome}
                      onDebtChange={wizard.setMonthlyDebt}
                      onIncomeChange={wizard.setGrossMonthlyIncome}
                      onContinue={wizard.handleDtiContinue}
                      onSkip={wizard.handleDtiSkip}
                      disabled={!wizard.monthlyDebt.trim() || !wizard.grossMonthlyIncome.trim()}
                      copy={copy}
                    />
                  )}
                  {step.id === 'zip-code' && (
                    <ZipCodeInput
                      value={wizard.zipCode}
                      onChange={wizard.setZipCode}
                      onContinue={wizard.handleZipCodeContinue}
                      disabled={!wizard.zipCode.trim()}
                      copy={copy}
                    />
                  )}
                  {step.id === 'contact-info' && (
                    <ContactInfoForm
                      contactInfo={wizard.contactInfo}
                      errors={wizard.contactInfoErrors}
                      emailError={wizard.emailValidationError}
                      phoneError={wizard.phoneValidationError}
                      onChange={wizard.handleContactInfoChange}
                      onContinue={wizard.handleContactInfoContinue}
                      zipCode={wizard.zipCode}
                      copy={copy}
                    />
                  )}
                  {step.id === 'upload-documents' && (
                    <DocumentUpload
                      findBankResponse={wizard.findBankResponse}
                      driversLicenseFile={wizard.driversLicenseFile}
                      paycheckFile={wizard.paycheckFile}
                      onDriversLicenseChange={wizard.setDriversLicenseFile}
                      onPaycheckChange={wizard.setPaycheckFile}
                      onUpload={wizard.handleDocumentUpload}
                      uploadStatus={wizard.documentUploadStatus}
                      isUploading={wizard.isUploadingDocuments}
                      copy={copy}
                    />
                  )}
                  <br />
                  {stepIndex > 0 && (
                    <button
                      type="button"
                      className="btn p-0 border-0 bg-transparent"
                      onClick={wizard.handleBack}
                    >
                      <img src="/images/leftarrow.png" alt={copy.back} className="arrowbutton" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>

          {isLastStep && summary.length > 0 && (
            <ReviewSummary summary={summary} copy={copy} />
          )}
        </div>
      </div>
    </section>
  )
}

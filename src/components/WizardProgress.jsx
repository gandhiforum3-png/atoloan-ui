export default function WizardProgress({ stepIndex, totalSteps }) {
  const current = stepIndex + 1
  const percent = Math.round((current / totalSteps) * 100)

  return (
    <div className="wizard-progress">
      <div className="wizard-progress-label">
        Step {current} of {totalSteps}
      </div>
      <div className="wizard-progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className="wizard-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

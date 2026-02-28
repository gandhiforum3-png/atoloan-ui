export default function ReviewSummary({ summary, copy }) {
  return (
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
  )
}

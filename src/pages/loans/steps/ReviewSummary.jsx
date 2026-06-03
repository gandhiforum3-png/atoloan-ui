export default function ReviewSummary({ summary, copy }) {
  return (
    <div className="container" style={{ paddingTop: '30px', paddingBottom: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>{copy.preApprovalAnswersTitle}</h2>
      <div className="review-summary-card">
        <table className="review-table">
          <tbody>
            {summary.map((item) => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

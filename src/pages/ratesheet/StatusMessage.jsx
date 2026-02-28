export default function StatusMessage({ status, style }) {
  if (!status.message) return null

  return (
    <div
      style={{
        marginBottom: '16px',
        padding: '12px',
        borderRadius: '8px',
        color: status.type === 'error' ? '#b71c1c' : '#2e7d32',
        background: status.type === 'error' ? '#fbe9e7' : '#e8f5e9',
        border: `1px solid ${status.type === 'error' ? '#f5c6cb' : '#c8e6c9'}`,
        ...style,
      }}
    >
      {status.message}
    </div>
  )
}

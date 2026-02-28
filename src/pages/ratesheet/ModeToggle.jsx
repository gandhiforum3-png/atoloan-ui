export default function ModeToggle({ viewMode, onUploadClick, onViewExistingClick }) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto 24px' }}>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onUploadClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: viewMode === 'upload' ? '2px solid #4caf50' : '2px solid #ddd',
            borderRadius: '8px',
            background: viewMode === 'upload' ? '#4caf50' : '#fff',
            color: viewMode === 'upload' ? '#fff' : '#666',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          📤 Upload Ratesheet
        </button>
        <button
          type="button"
          onClick={onViewExistingClick}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: viewMode === 'view-existing' ? '2px solid #2196f3' : '2px solid #ddd',
            borderRadius: '8px',
            background: viewMode === 'view-existing' ? '#2196f3' : '#fff',
            color: viewMode === 'view-existing' ? '#fff' : '#666',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          👁️ View Existing Rate Sheet
        </button>
      </div>
    </div>
  )
}

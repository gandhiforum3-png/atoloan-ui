export default function DocumentUpload({
  findBankResponse,
  driversLicenseFile,
  paycheckFile,
  onDriversLicenseChange,
  onPaycheckChange,
  onUpload,
  uploadStatus,
  isUploading,
  copy,
}) {
  return (
    <div style={{ marginTop: '16px', textAlign: 'center' }}>
      <p style={{ marginBottom: '20px', maxWidth: '720px', marginLeft: 'auto', marginRight: 'auto' }}>
        {copy.uploadDocumentsDescription}
      </p>

      {findBankResponse?.data?.best_bank ? (
        <div style={{
          background: '#e8f5e9',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '12px' }}>🎉 Best Bank Offer Found!</h3>
          <p style={{ margin: '4px 0' }}><strong>Bank:</strong> {findBankResponse.data.best_bank.bank_name}</p>
          <p style={{ margin: '4px 0' }}><strong>Interest Rate:</strong> {findBankResponse.data.best_bank.interest_rate}</p>
          <p style={{ margin: '4px 0' }}><strong>Program:</strong> {findBankResponse.data.best_bank.program_name}</p>
          <p style={{ margin: '4px 0' }}><strong>Term:</strong> {findBankResponse.data.best_bank.term_in_months} months</p>
        </div>
      ) : findBankResponse?.error ? (
        <div style={{
          background: '#fff3e0',
          border: '1px solid #ff9800',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ color: '#e65100', marginBottom: '12px' }}>⚠️ Credit Check Issue</h3>
          <p>Please upload your documents below and we will review your application manually.</p>
        </div>
      ) : findBankResponse?.data ? (
        <div style={{
          background: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h3 style={{ color: '#1565c0', marginBottom: '12px' }}>📋 Application Received</h3>
          <p>Please upload your documents below to complete your application.</p>
        </div>
      ) : null}

      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'left' }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            📄 {copy.driversLicenseLabel}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onDriversLicenseChange(e.target.files[0])}
            style={{ marginBottom: '4px' }}
          />
          {driversLicenseFile && (
            <div style={{ color: '#4caf50', fontSize: '14px' }}>
              ✓ {driversLicenseFile.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            💰 {copy.paycheckLabel}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => onPaycheckChange(e.target.files[0])}
            style={{ marginBottom: '4px' }}
          />
          {paycheckFile && (
            <div style={{ color: '#4caf50', fontSize: '14px' }}>
              ✓ {paycheckFile.name}
            </div>
          )}
        </div>

        {uploadStatus?.error && (
          <div style={{
            background: '#ffebee',
            border: '1px solid #f44336',
            color: '#c62828',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            ❌ {uploadStatus.error}
          </div>
        )}

        {uploadStatus?.success && (
          <div style={{
            background: '#e8f5e9',
            border: '1px solid #4caf50',
            color: '#2e7d32',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            ✅ {copy.uploadSuccess}
            <p style={{ margin: '8px 0 0', fontSize: '14px' }}>
              Submission ID: {uploadStatus.data.submission_id}
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="btn btn-success"
            onClick={onUpload}
            disabled={!driversLicenseFile || !paycheckFile || isUploading || uploadStatus?.success}
            style={{ padding: '12px 32px', fontSize: '16px' }}
          >
            {isUploading ? 'Uploading...' : copy.submitDocuments}
          </button>
        </div>
      </div>
    </div>
  )
}

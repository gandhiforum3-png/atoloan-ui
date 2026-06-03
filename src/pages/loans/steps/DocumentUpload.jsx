import { useRef } from 'react'

function FileZone({ label, file, onFileChange, accept }) {
  const inputRef = useRef(null)

  return (
    <div
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${file ? '#39b54a' : '#ced4da'}`,
        borderRadius: '10px',
        padding: '20px 16px',
        textAlign: 'center',
        cursor: 'pointer',
        background: file ? '#eaf7ec' : '#fafafa',
        transition: 'border-color 0.15s, background 0.15s',
        marginBottom: '16px',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={(e) => onFileChange(e.target.files[0])}
      />
      <div style={{ fontSize: '28px', marginBottom: '6px' }}>{file ? '✅' : '📎'}</div>
      <div style={{ fontWeight: '600', fontSize: '14px', color: '#212529', marginBottom: '4px' }}>{label}</div>
      {file ? (
        <div style={{ fontSize: '13px', color: '#39b54a', fontWeight: '500' }}>{file.name}</div>
      ) : (
        <div style={{ fontSize: '13px', color: '#6c757d' }}>Click to choose a file</div>
      )}
    </div>
  )
}

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
      <p style={{ marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
        {copy.uploadDocumentsDescription}
      </p>

      {findBankResponse?.data?.best_bank && (
        <div style={{ background: '#eaf7ec', border: '1px solid #39b54a', borderRadius: '10px', padding: '16px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>🎉</div>
          <strong style={{ color: '#2e7d32' }}>Best Match Found!</strong>
          <div style={{ marginTop: '8px', fontSize: '14px', lineHeight: '1.7' }}>
            <div><strong>Bank:</strong> {findBankResponse.data.best_bank.bank_name}</div>
            <div><strong>Rate:</strong> {findBankResponse.data.best_bank.interest_rate}</div>
            <div><strong>Program:</strong> {findBankResponse.data.best_bank.program_name}</div>
            <div><strong>Term:</strong> {findBankResponse.data.best_bank.term_in_months} months</div>
          </div>
        </div>
      )}

      {findBankResponse?.error && (
        <div style={{ background: '#fff3e0', border: '1px solid #ff9800', borderRadius: '10px', padding: '16px', marginBottom: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
          ⚠️ Please upload your documents and we'll review your application manually.
        </div>
      )}

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <FileZone
          label={copy.driversLicenseLabel}
          file={driversLicenseFile}
          onFileChange={onDriversLicenseChange}
          accept="image/*,.pdf"
        />
        <FileZone
          label={copy.paycheckLabel}
          file={paycheckFile}
          onFileChange={onPaycheckChange}
          accept="image/*,.pdf"
        />

        {uploadStatus?.error && (
          <div style={{ background: '#ffebee', border: '1px solid #f44336', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            ❌ {uploadStatus.error}
          </div>
        )}
        {uploadStatus?.success && (
          <div style={{ background: '#eaf7ec', border: '1px solid #39b54a', color: '#2e7d32', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
            ✅ {copy.uploadSuccess}
            {uploadStatus.data?.submission_id && (
              <div style={{ marginTop: '4px', fontSize: '12px' }}>ID: {uploadStatus.data.submission_id}</div>
            )}
          </div>
        )}

        <button
          type="button"
          className="hero-cta-btn"
          onClick={onUpload}
          disabled={!driversLicenseFile || !paycheckFile || isUploading || uploadStatus?.success}
          style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px' }}
        >
          {isUploading ? 'Uploading…' : copy.submitDocuments}
        </button>
      </div>
    </div>
  )
}

import useRateSheetUploader from './ratesheet/useRateSheetUploader'
import ModeToggle from './ratesheet/ModeToggle'
import BankSelector from './ratesheet/BankSelector'
import StatusMessage from './ratesheet/StatusMessage'
import SectionReview from './ratesheet/SectionReview'

export default function RateSheetUploader() {
  const rs = useRateSheetUploader()

  return (
    <section id="ratesheetuploader">
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '12px' }}>{rs.copy.title}</h1>
        <p style={{ textAlign: 'center', marginBottom: '24px' }}>{rs.copy.description}</p>

        <ModeToggle
          viewMode={rs.viewMode}
          onUploadClick={rs.switchToUpload}
          onViewExistingClick={rs.switchToViewExisting}
        />

        {rs.viewMode === 'view-existing' && (
          <BankSelector
            banksList={rs.banksList}
            selectedBankId={rs.selectedBankId}
            isLoadingBanks={rs.isLoadingBanks}
            isLoadingRateSheet={rs.isLoadingRateSheet}
            responseResult={rs.responseResult}
            onBankSelection={rs.handleBankSelection}
            onDelete={rs.handleDeleteCurrentRateSheet}
          />
        )}

        <form
          id="rate-sheet-editor"
          onSubmit={rs.handleSubmit}
          style={{
            maxWidth: rs.responseResult ? '1200px' : '560px',
            margin: '0 auto',
            transition: 'max-width 0.3s ease'
          }}
        >
          {rs.viewMode === 'upload' && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={rs.handleFileChange}
                  className="form-control"
                  aria-label={rs.copy.selectFile}
                />
              </div>
              <StatusMessage status={rs.status} />
              <div style={{ textAlign: 'center' }}>
                <button type="submit" className="btn btn-success" disabled={rs.isUploading}>
                  {rs.isUploading ? '...' : rs.copy.submit}
                </button>
              </div>
            </>
          )}

          {rs.viewMode === 'view-existing' && (
            <StatusMessage
              status={rs.status}
              style={{ maxWidth: '1200px', margin: '0 auto 16px' }}
            />
          )}

          {(rs.responseResult || rs.responseBody || rs.rawResponse) && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 DEBUG INFO:</div>
              <div>responseResult exists: {rs.responseResult ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseResult is object: {typeof rs.responseResult === 'object' ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseResult keys: {rs.responseResult ? Object.keys(rs.responseResult).join(', ') : 'N/A'}</div>
              <div>responseBody exists: {rs.responseBody ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseBody length: {rs.responseBody ? rs.responseBody.length : 0}</div>
              <div style={{ marginTop: '12px' }}>
                <details>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '4px' }}>
                    📄 View Raw Response ({rs.rawResponse.length} chars)
                  </summary>
                  <pre style={{
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    background: '#fff',
                    padding: '8px',
                    borderRadius: '4px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    fontSize: '11px',
                    marginTop: '8px'
                  }}>
                    {rs.rawResponse}
                  </pre>
                </details>
              </div>
            </div>
          )}

          {rs.responseResult && (
            <SectionReview
              reviewIndex={rs.reviewIndex}
              confirmedSections={rs.confirmedSections}
              showRawJSON={rs.showRawJSON}
              currentSectionKey={rs.currentSectionKey}
              currentSectionValue={rs.currentSectionValue}
              isLastSection={rs.isLastSection}
              isSaving={rs.isSaving}
              saveStatus={rs.saveStatus}
              onToggleRawJSON={() => rs.setShowRawJSON(!rs.showRawJSON)}
              onBack={rs.handleReviewBack}
              onConfirm={rs.handleConfirmSection}
              onSaveToDatabase={rs.handleSaveToDatabase}
              onSectionChange={rs.handleSectionChange}
              onDownloadJSON={rs.handleDownloadJSON}
              onCopyJSON={rs.handleCopyJSON}
            />
          )}

          {rs.responseBody && !rs.responseResult && (
            <div
              style={{
                background: '#f7f7f7',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                marginTop: '16px',
                textAlign: 'left',
              }}
            >
              <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
                {rs.responseBody}
              </pre>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

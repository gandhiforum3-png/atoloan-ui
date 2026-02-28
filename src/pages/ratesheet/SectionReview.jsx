import TreeEditor from '../../components/TreeEditor'
import { reviewOrder, toLabel } from './constants'

export default function SectionReview({
  reviewIndex,
  confirmedSections,
  showRawJSON,
  currentSectionKey,
  currentSectionValue,
  isLastSection,
  isSaving,
  saveStatus,
  onToggleRawJSON,
  onBack,
  onConfirm,
  onSaveToDatabase,
  onSectionChange,
  onDownloadJSON,
  onCopyJSON,
}) {
  return (
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
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Review {reviewIndex + 1} of {reviewOrder.length}:{' '}
            {currentSectionKey ? toLabel(currentSectionKey) : 'N/A'}
          </div>
          <button
            type="button"
            onClick={onToggleRawJSON}
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              border: '1px solid #666',
              borderRadius: '4px',
              background: showRawJSON ? '#666' : '#fff',
              color: showRawJSON ? '#fff' : '#666',
              cursor: 'pointer',
            }}
          >
            {showRawJSON ? 'Hide' : 'Show'} Raw JSON
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {reviewOrder.map((sectionKey, idx) => (
            <div
              key={sectionKey}
              style={{
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                background: confirmedSections.includes(sectionKey)
                  ? '#4caf50'
                  : idx === reviewIndex
                  ? '#2196f3'
                  : '#e0e0e0',
                color: confirmedSections.includes(sectionKey) || idx === reviewIndex ? '#fff' : '#666',
                fontWeight: idx === reviewIndex ? 'bold' : 'normal',
              }}
            >
              {toLabel(sectionKey)}
              {confirmedSections.includes(sectionKey) && ' ✓'}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '6px',
          padding: '12px',
          maxHeight: '600px',
          overflow: 'auto',
          marginBottom: '16px',
        }}
      >
        {showRawJSON ? (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              fontSize: '12px',
              margin: 0,
            }}
          >
            {JSON.stringify(currentSectionValue ?? {}, null, 2)}
          </pre>
        ) : (
          <TreeEditor
            data={currentSectionValue ?? {}}
            onChange={(updated) => onSectionChange(currentSectionKey, updated)}
            path={[currentSectionKey]}
          />
        )}
      </div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className="btn btn-outline-secondary"
          disabled={reviewIndex === 0}
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={onConfirm}
        >
          {isLastSection ? 'Confirm' : 'Confirm & Next'}
        </button>
        {confirmedSections.length === reviewOrder.length && (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSaveToDatabase}
              disabled={isSaving}
              style={{ fontWeight: 'bold' }}
            >
              {isSaving ? 'Saving...' : '💾 Save to Database'}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={onDownloadJSON}
            >
              Download JSON
            </button>
          </>
        )}
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={onCopyJSON}
          style={{ fontSize: '14px' }}
        >
          Copy JSON
        </button>
      </div>
      {confirmedSections.length === reviewOrder.length && (
        <>
          <div
            style={{
              marginTop: '16px',
              padding: '12px',
              background: '#e8f5e9',
              border: '1px solid #4caf50',
              borderRadius: '6px',
              color: '#2e7d32',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            ✓ All sections confirmed! You can now save to database, download, or copy the final JSON.
          </div>
          {saveStatus.message && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '6px',
                color: saveStatus.type === 'error' ? '#b71c1c' : '#1b5e20',
                background: saveStatus.type === 'error' ? '#ffebee' : '#e8f5e9',
                border: `2px solid ${saveStatus.type === 'error' ? '#f44336' : '#4caf50'}`,
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {saveStatus.type === 'success' ? '✅' : '❌'} {saveStatus.message}
            </div>
          )}
        </>
      )}
    </div>
  )
}

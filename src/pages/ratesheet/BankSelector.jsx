export default function BankSelector({
  banksList,
  selectedBankId,
  isLoadingBanks,
  isLoadingRateSheet,
  responseResult,
  onBankSelection,
  onDelete,
}) {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto 24px' }}>
      <div style={{
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
          Select Credit Union / Bank:
        </label>
        {isLoadingBanks ? (
          <div style={{ padding: '12px', textAlign: 'center', color: '#666' }}>
            Loading banks...
          </div>
        ) : (
          <select
            value={selectedBankId}
            onChange={(e) => onBankSelection(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              background: '#fff',
              cursor: 'pointer'
            }}
          >
            <option value="">-- Select a Bank / Credit Union --</option>
            {banksList.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.name || bank.credit_union_info?.name || `Bank ID: ${bank.id}`}
              </option>
            ))}
          </select>
        )}
        {isLoadingRateSheet && (
          <div style={{ marginTop: '12px', padding: '12px', textAlign: 'center', color: '#2196f3' }}>
            Loading rate sheet...
          </div>
        )}
        {selectedBankId && responseResult && (
          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={onDelete}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                border: '1px solid #f44336',
                borderRadius: '6px',
                background: '#fff',
                color: '#f44336',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🗑️ Delete This Rate Sheet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

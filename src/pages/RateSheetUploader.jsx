import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'

const copyByLanguage = {
  en: {
    title: 'Upload Ratesheet',
    description: 'Upload your ratesheet PDF to send it to the backend.',
    selectFile: 'Choose PDF file',
    submit: 'Upload Ratesheet',
    success: 'Ratesheet uploaded successfully.',
    error: 'Failed to upload ratesheet.',
    invalidType: 'Please select a PDF file.',
  },
  es: {
    title: 'Subir Tarifario',
    description: 'Sube tu PDF de tarifas para enviarlo al backend.',
    selectFile: 'Elegir archivo PDF',
    submit: 'Subir Tarifario',
    success: 'Tarifario subido correctamente.',
    error: 'No se pudo subir el tarifario.',
    invalidType: 'Seleccione un archivo PDF.',
  },
}

const toLabel = (value) => String(value).replace(/_/gu, ' ')

const reviewOrder = [
  'credit_union_info',
  'rate_policy',
  'loan_programs',
  'guidelines',
  'special_programs',
  'participation_and_funding',
  'additional_details',
]

const reviewSkeleton = {
  credit_union_info: {},
  rate_policy: {},
  loan_programs: [],
  guidelines: {},
  special_programs: {},
  participation_and_funding: {},
  additional_details: {},
}

function TreeEditor({ data, onChange, path = [] }) {
  // Handle arrays with add/remove functionality
  if (Array.isArray(data)) {
    const handleAddEmpty = () => {
      // Determine the type of items in the array to create appropriate default
      if (data.length === 0) {
        // Empty array - add an empty object by default
        onChange([...data, {}])
      } else {
        // Clone the structure of the last item
        const lastItem = data[data.length - 1]
        if (typeof lastItem === 'object' && lastItem !== null) {
          // Create empty object with same keys
          const newItem = Array.isArray(lastItem)
            ? []
            : Object.keys(lastItem).reduce((acc, key) => ({ ...acc, [key]: null }), {})
          onChange([...data, newItem])
        } else {
          // Primitive type
          onChange([...data, ''])
        }
      }
    }

    const handleDuplicate = () => {
      if (data.length === 0) {
        onChange([{}])
      } else {
        // Deep clone the last item with all its values
        const lastItem = data[data.length - 1]
        const cloned = JSON.parse(JSON.stringify(lastItem))
        onChange([...data, cloned])
      }
    }

    const handleRemove = (index) => {
      const updated = data.filter((_, i) => i !== index)
      onChange(updated)
    }

    return (
      <div style={{ marginLeft: '16px', border: '1px solid #e0e0e0', padding: '12px', borderRadius: '6px', background: '#fafafa' }}>
        {data.map((item, index) => (
          <div key={`${path.join('.')}.${index}`} style={{ marginBottom: '12px', padding: '8px', background: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#555' }}>{`Item ${index + 1}`}</div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  border: '1px solid #f44336',
                  borderRadius: '4px',
                  background: '#fff',
                  color: '#f44336',
                  cursor: 'pointer',
                }}
              >
                Remove
              </button>
            </div>
            <TreeEditor
              data={item}
              onChange={(next) => {
                const updated = [...data]
                updated[index] = next
                onChange(updated)
              }}
              path={[...path, index]}
            />
          </div>
        ))}
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            type="button"
            onClick={handleAddEmpty}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid #4caf50',
              borderRadius: '4px',
              background: '#fff',
              color: '#4caf50',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            + Add Empty
          </button>
          {data.length > 0 && (
            <button
              type="button"
              onClick={handleDuplicate}
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                background: '#fff',
                color: '#2196f3',
                cursor: 'pointer',
                flex: 1,
              }}
            >
              + Duplicate Last
            </button>
          )}
        </div>
      </div>
    )
  }

  // Handle objects with add field functionality
  if (data && typeof data === 'object') {
    const [newFieldKey, setNewFieldKey] = useState('')
    const [showAddField, setShowAddField] = useState(false)

    const handleAddField = () => {
      if (newFieldKey.trim() && !Object.prototype.hasOwnProperty.call(data, newFieldKey.trim())) {
        onChange({ ...data, [newFieldKey.trim()]: '' })
        setNewFieldKey('')
        setShowAddField(false)
      }
    }

    const handleRemoveField = (key) => {
      const { [key]: removed, ...rest } = data
      onChange(rest)
    }

    return (
      <div style={{ marginLeft: path.length ? '16px' : '0' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={`${path.join('.')}.${key}`} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ fontWeight: 'bold', fontSize: '13px', color: '#333' }}>{toLabel(key)}</div>
              <button
                type="button"
                onClick={() => handleRemoveField(key)}
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  border: '1px solid #ff9800',
                  borderRadius: '3px',
                  background: '#fff',
                  color: '#ff9800',
                  cursor: 'pointer',
                }}
              >
                Remove Field
              </button>
            </div>
            <TreeEditor
              data={value}
              onChange={(next) => onChange({ ...data, [key]: next })}
              path={[...path, key]}
            />
          </div>
        ))}
        {Object.keys(data).length === 0 && (
          <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>No fields available.</div>
        )}
        {showAddField ? (
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <input
              type="text"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              placeholder="Field name"
              style={{
                flex: 1,
                padding: '6px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                fontSize: '13px',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleAddField()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddField}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                border: '1px solid #2196f3',
                borderRadius: '4px',
                background: '#2196f3',
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddField(false)
                setNewFieldKey('')
              }}
              style={{
                padding: '6px 12px',
                fontSize: '13px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                background: '#fff',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddField(true)}
            style={{
              padding: '6px 12px',
              fontSize: '13px',
              border: '1px solid #2196f3',
              borderRadius: '4px',
              background: '#fff',
              color: '#2196f3',
              cursor: 'pointer',
              marginTop: '8px',
            }}
          >
            + Add Field
          </button>
        )}
      </div>
    )
  }

  // Handle primitives with type detection
  const handlePrimitiveChange = (value) => {
    // Try to maintain the original type
    if (typeof data === 'boolean') {
      onChange(value === 'true')
    } else if (typeof data === 'number') {
      const parsed = parseFloat(value)
      onChange(isNaN(parsed) ? value : parsed)
    } else {
      onChange(value)
    }
  }

  // Boolean input
  if (typeof data === 'boolean') {
    return (
      <select
        value={String(data)}
        onChange={(e) => onChange(e.target.value === 'true')}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    )
  }

  // Number input
  if (typeof data === 'number') {
    return (
      <input
        type="number"
        value={data}
        onChange={(e) => {
          const val = e.target.value
          onChange(val === '' ? null : parseFloat(val))
        }}
        style={{
          width: '100%',
          padding: '8px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
      />
    )
  }

  // Null value with conversion options
  if (data === null) {
    return (
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          type="text"
          value=""
          placeholder="null"
          disabled
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            background: '#f5f5f5',
            color: '#999',
          }}
        />
        <button
          type="button"
          onClick={() => onChange({})}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            background: '#fff',
            color: '#2196f3',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Object
        </button>
        <button
          type="button"
          onClick={() => onChange([])}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #4caf50',
            borderRadius: '4px',
            background: '#fff',
            color: '#4caf50',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Array
        </button>
        <button
          type="button"
          onClick={() => onChange('')}
          style={{
            padding: '6px 12px',
            fontSize: '12px',
            border: '1px solid #ff9800',
            borderRadius: '4px',
            background: '#fff',
            color: '#ff9800',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          → Text
        </button>
      </div>
    )
  }

  // Text/string input (default)
  return (
    <input
      type="text"
      value={data ?? ''}
      onChange={(e) => handlePrimitiveChange(e.target.value)}
      style={{
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
      }}
    />
  )
}

export default function RateSheetUploader() {
  const { language } = useLanguage()
  const copy = copyByLanguage[language] || copyByLanguage.en
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isUploading, setIsUploading] = useState(false)
  const [responseBody, setResponseBody] = useState('')
  const [responseResult, setResponseResult] = useState(null)
  const [editableResult, setEditableResult] = useState({})
  const [reviewIndex, setReviewIndex] = useState(0)
  const [confirmedSections, setConfirmedSections] = useState([])
  const [showRawJSON, setShowRawJSON] = useState(false)
  const [rawResponse, setRawResponse] = useState('')

  useEffect(() => {
    if (!responseResult || typeof responseResult !== 'object') {
      setEditableResult({})
      return
    }
    setEditableResult(responseResult)
  }, [responseResult])

  const currentSectionKey = reviewOrder[reviewIndex]
  const hasSection =
    currentSectionKey && Object.prototype.hasOwnProperty.call(editableResult, currentSectionKey)
  const currentSectionValue = hasSection
    ? editableResult[currentSectionKey]
    : reviewSkeleton[currentSectionKey] ?? null
  const isLastSection = reviewIndex >= reviewOrder.length - 1

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] || null
    if (selected && selected.type !== 'application/pdf') {
      setFile(null)
      setStatus({ type: 'error', message: copy.invalidType })
      return
    }
    setFile(selected)
    setStatus({ type: '', message: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      setStatus({ type: 'error', message: copy.invalidType })
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setIsUploading(true)
    setStatus({ type: '', message: '' })
    setResponseBody(null)
    setResponseResult(null)
    setReviewIndex(0)
    setConfirmedSections([])
    setRawResponse('')
    try {
      const response = await fetch('http://127.0.0.1:8000/ratesheetuploader', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      const text = await response.text()
      setRawResponse(text)
      console.log('📥 Response received, length:', text.length)
      try {
        const parsed = JSON.parse(text)
        console.log('✅ JSON parsed successfully')
        console.log('📦 Response structure:', Object.keys(parsed))
        const result = parsed?.result
        const fileRateSheet =
          (parsed?.files && parsed.files[0] && parsed.files[0].rate_sheet) ||
          (result?.files && result.files[0] && result.files[0].rate_sheet)
        const directRateSheet = parsed?.rate_sheet || result?.rate_sheet
        const payload = fileRateSheet || directRateSheet || result || parsed
        const normalized =
          payload && typeof payload === 'object' && payload.rate_sheet ? payload.rate_sheet : payload
        console.log('🔄 Normalized data keys:', normalized && typeof normalized === 'object' ? Object.keys(normalized) : typeof normalized)

        // Always merge with skeleton to ensure UI shows
        const finalData = { ...reviewSkeleton, ...normalized }
        console.log('✨ Setting responseResult with keys:', Object.keys(finalData))

        // Check if backend returned empty object
        const hasData = normalized && typeof normalized === 'object' && Object.keys(normalized).length > 0
        if (!hasData) {
          console.warn('⚠️ Backend returned empty data - showing empty form for manual entry')
        }

        setResponseResult(finalData)
        setResponseBody('')

        // Check if we have actual data (not just skeleton)
        setStatus({
          type: 'success',
          message: hasData ? copy.success : 'Upload successful. Backend returned empty data - you can enter data manually.'
        })
      } catch (err) {
        console.error('❌ JSON parse error:', err)
        setResponseBody(text)
        setStatus({ type: 'error', message: 'Failed to parse response JSON' })
      }
    } catch (error) {
      console.error('Ratesheet upload failed', error)
      setStatus({ type: 'error', message: copy.error })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section id="ratesheetuploader">
      <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '12px' }}>{copy.title}</h1>
        <p style={{ textAlign: 'center', marginBottom: '24px' }}>{copy.description}</p>
        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: responseResult ? '1200px' : '560px',
            margin: '0 auto',
            transition: 'max-width 0.3s ease'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="form-control"
              aria-label={copy.selectFile}
            />
          </div>
          {status.message && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px',
                borderRadius: '8px',
                color: status.type === 'error' ? '#b71c1c' : '#2e7d32',
                background: status.type === 'error' ? '#fbe9e7' : '#e8f5e9',
                border: `1px solid ${status.type === 'error' ? '#f5c6cb' : '#c8e6c9'}`,
              }}
            >
              {status.message}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <button type="submit" className="btn btn-success" disabled={isUploading}>
              {isUploading ? '...' : copy.submit}
            </button>
          </div>
          {/* DEBUG INFO */}
          {(responseResult || responseBody || rawResponse) && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '8px',
              fontSize: '13px'
            }}>
              <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>🔍 DEBUG INFO:</div>
              <div>responseResult exists: {responseResult ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseResult is object: {typeof responseResult === 'object' ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseResult keys: {responseResult ? Object.keys(responseResult).join(', ') : 'N/A'}</div>
              <div>responseBody exists: {responseBody ? 'YES ✅' : 'NO ❌'}</div>
              <div>responseBody length: {responseBody ? responseBody.length : 0}</div>
              <div style={{ marginTop: '12px' }}>
                <details>
                  <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '4px' }}>
                    📄 View Raw Response ({rawResponse.length} chars)
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
                    {rawResponse}
                  </pre>
                </details>
              </div>
            </div>
          )}
          {responseResult && (
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
                    onClick={() => setShowRawJSON(!showRawJSON)}
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
                    onChange={(updated) => {
                      setEditableResult((prev) => ({
                        ...prev,
                        [currentSectionKey]: updated,
                      }))
                    }}
                    path={[currentSectionKey]}
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={reviewIndex === 0}
                  onClick={() => setReviewIndex((prev) => Math.max(prev - 1, 0))}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    if (currentSectionKey && !confirmedSections.includes(currentSectionKey)) {
                      setConfirmedSections((prev) => [...prev, currentSectionKey])
                    }
                    if (!isLastSection) {
                      setReviewIndex((prev) => prev + 1)
                    }
                  }}
                >
                  {isLastSection ? 'Confirm' : 'Confirm & Next'}
                </button>
                {confirmedSections.length === reviewOrder.length && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const jsonStr = JSON.stringify(editableResult, null, 2)
                      const blob = new Blob([jsonStr], { type: 'application/json' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `ratesheet-${new Date().toISOString().split('T')[0]}.json`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Download JSON
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-outline-info"
                  onClick={() => {
                    const jsonStr = JSON.stringify(editableResult, null, 2)
                    navigator.clipboard.writeText(jsonStr)
                    alert('JSON copied to clipboard!')
                  }}
                  style={{ fontSize: '14px' }}
                >
                  Copy JSON
                </button>
              </div>
              {confirmedSections.length === reviewOrder.length && (
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
                  ✓ All sections confirmed! You can now download or copy the final JSON.
                </div>
              )}
            </div>
          )}
          {responseBody && !responseResult && (
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
                {responseBody}
              </pre>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

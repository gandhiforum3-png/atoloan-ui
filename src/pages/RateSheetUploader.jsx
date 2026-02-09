import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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

export default function RateSheetUploader() {
  const { language } = useLanguage()
  const copy = copyByLanguage[language] || copyByLanguage.en
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isUploading, setIsUploading] = useState(false)
  const [responseBody, setResponseBody] = useState('')
  const [responseIsMarkdown, setResponseIsMarkdown] = useState(false)

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
    try {
      const response = await fetch('http://127.0.0.1:8000/ratesheetuploader', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      const text = await response.text()
      setResponseIsMarkdown(true)
      try {
        const parsed = JSON.parse(text)
        const markdown =
          parsed?.markdown ||
          parsed?.content ||
          parsed?.file ||
          parsed?.data ||
          ''
        setResponseBody(typeof markdown === 'string' ? markdown : text)
      } catch {
        setResponseBody(text)
      }
      setStatus({ type: 'success', message: copy.success })
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
        <form onSubmit={handleSubmit} style={{ maxWidth: '560px', margin: '0 auto' }}>
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
          {responseBody && responseIsMarkdown && (
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
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ node, ...props }) => (
                    <table
                      {...props}
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '12px 0',
                        fontSize: '14px',
                      }}
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th
                      {...props}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        background: '#f0f0f0',
                        textAlign: 'left',
                      }}
                    />
                  ),
                  td: ({ node, ...props }) => (
                    <td
                      {...props}
                      style={{
                        border: '1px solid #ddd',
                        padding: '8px',
                        textAlign: 'left',
                      }}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <p {...props} style={{ margin: '8px 0', lineHeight: '1.5' }} />
                  ),
                  h1: ({ node, ...props }) => (
                    <h1 {...props} style={{ fontSize: '20px', margin: '12px 0' }} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 {...props} style={{ fontSize: '18px', margin: '12px 0' }} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 {...props} style={{ fontSize: '16px', margin: '10px 0' }} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul {...props} style={{ paddingLeft: '20px', margin: '8px 0' }} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol {...props} style={{ paddingLeft: '20px', margin: '8px 0' }} />
                  ),
                }}
              >
                {responseBody}
              </ReactMarkdown>
            </div>
          )}
        </form>
      </div>
    </section>
  )
}

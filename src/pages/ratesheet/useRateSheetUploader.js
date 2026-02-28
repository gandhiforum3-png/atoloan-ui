import { useEffect, useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { copyByLanguage, reviewOrder, reviewSkeleton } from './constants'

export default function useRateSheetUploader() {
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
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' })
  const [viewMode, setViewMode] = useState('upload')
  const [banksList, setBanksList] = useState([])
  const [selectedBankId, setSelectedBankId] = useState('')
  const [isLoadingBanks, setIsLoadingBanks] = useState(false)
  const [isLoadingRateSheet, setIsLoadingRateSheet] = useState(false)

  useEffect(() => {
    if (!responseResult || typeof responseResult !== 'object') {
      setEditableResult({})
      return
    }
    setEditableResult(responseResult)
  }, [responseResult])

  useEffect(() => {
    if (viewMode === 'view-existing' && banksList.length === 0) {
      const fetchBanks = async () => {
        setIsLoadingBanks(true)
        try {
          const response = await fetch('http://127.0.0.1:8000/credit-unions')
          if (!response.ok) {
            throw new Error('Failed to fetch banks list')
          }
          const data = await response.json()
          const creditUnions = data.credit_unions || []
          setBanksList(Array.isArray(creditUnions) ? creditUnions : [])
          console.log(`✅ Loaded ${creditUnions.length} credit unions`)
        } catch (error) {
          console.error('Failed to fetch banks:', error)
          setBanksList([])
          setStatus({ type: 'error', message: 'Failed to load banks list' })
        } finally {
          setIsLoadingBanks(false)
        }
      }
      fetchBanks()
    }
  }, [viewMode, banksList.length])

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

  const handleBankSelection = async (bankId) => {
    if (!bankId) {
      setSelectedBankId('')
      setResponseResult(null)
      return
    }

    setSelectedBankId(bankId)
    setIsLoadingRateSheet(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(`http://127.0.0.1:8000/credit-unions/${bankId}/ratesheet`)
      if (!response.ok) {
        throw new Error('Failed to fetch rate sheet')
      }

      const rateSheet = await response.json()
      const finalData = { ...reviewSkeleton, ...rateSheet }
      setResponseResult(finalData)
      setReviewIndex(0)
      setConfirmedSections([])
      setSaveStatus({ type: '', message: '' })
      setStatus({ type: 'success', message: 'Rate sheet loaded successfully' })
    } catch (error) {
      console.error('Failed to fetch rate sheet:', error)
      setStatus({ type: 'error', message: 'Failed to load rate sheet' })
      setResponseResult(null)
    } finally {
      setIsLoadingRateSheet(false)
    }
  }

  const handleDeleteCurrentRateSheet = async () => {
    if (!selectedBankId) return
    if (!window.confirm('Are you sure you want to delete this rate sheet?')) return

    try {
      const response = await fetch(`http://127.0.0.1:8000/credit-unions/${selectedBankId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete rate sheet')
      }

      setResponseResult(null)
      setSelectedBankId('')
      setBanksList(prev => prev.filter(bank => bank.id !== selectedBankId))
      setStatus({ type: 'success', message: 'Rate sheet deleted successfully' })
    } catch (error) {
      console.error('Failed to delete rate sheet:', error)
      setStatus({ type: 'error', message: 'Failed to delete rate sheet' })
    }
  }

  const handleSaveToDatabase = async () => {
    setIsSaving(true)
    setSaveStatus({ type: '', message: '' })

    try {
      const response = await fetch('http://127.0.0.1:8000/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editableResult),
      })

      if (!response.ok) {
        throw new Error('Failed to save to database')
      }

      const result = await response.json()
      console.log('✅ Saved to database:', result)

      setSaveStatus({
        type: 'success',
        message: 'Successfully saved to database!'
      })

      if (viewMode === 'view-existing') {
        const listResponse = await fetch('http://127.0.0.1:8000/credit-unions')
        if (listResponse.ok) {
          const data = await listResponse.json()
          const creditUnions = data.credit_unions || []
          setBanksList(Array.isArray(creditUnions) ? creditUnions : [])
        }
      }
    } catch (error) {
      console.error('❌ Failed to save to database:', error)
      setSaveStatus({
        type: 'error',
        message: 'Failed to save to database. Please try again.'
      })
    } finally {
      setIsSaving(false)
    }
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
    setSaveStatus({ type: '', message: '' })
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

        const finalData = { ...reviewSkeleton, ...normalized }
        console.log('✨ Setting responseResult with keys:', Object.keys(finalData))

        const hasData = normalized && typeof normalized === 'object' && Object.keys(normalized).length > 0
        if (!hasData) {
          console.warn('⚠️ Backend returned empty data - showing empty form for manual entry')
        }

        setResponseResult(finalData)
        setResponseBody('')

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

  const handleSectionChange = (sectionKey, updated) => {
    setEditableResult((prev) => ({
      ...prev,
      [sectionKey]: updated,
    }))
  }

  const handleConfirmSection = () => {
    if (currentSectionKey && !confirmedSections.includes(currentSectionKey)) {
      setConfirmedSections((prev) => [...prev, currentSectionKey])
    }
    if (!isLastSection) {
      setReviewIndex((prev) => prev + 1)
    }
  }

  const handleReviewBack = () => {
    setReviewIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleDownloadJSON = () => {
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
  }

  const handleCopyJSON = () => {
    const jsonStr = JSON.stringify(editableResult, null, 2)
    navigator.clipboard.writeText(jsonStr)
    alert('JSON copied to clipboard!')
  }

  const switchToUpload = () => {
    setViewMode('upload')
    setResponseResult(null)
    setSelectedBankId('')
  }

  const switchToViewExisting = () => {
    setViewMode('view-existing')
  }

  return {
    copy,
    viewMode,
    switchToUpload,
    switchToViewExisting,
    // Upload
    file,
    isUploading,
    status,
    handleFileChange,
    handleSubmit,
    // Bank selector
    banksList,
    selectedBankId,
    isLoadingBanks,
    isLoadingRateSheet,
    handleBankSelection,
    handleDeleteCurrentRateSheet,
    // Response / review
    responseResult,
    responseBody,
    rawResponse,
    editableResult,
    reviewIndex,
    confirmedSections,
    showRawJSON,
    setShowRawJSON,
    currentSectionKey,
    currentSectionValue,
    isLastSection,
    handleSectionChange,
    handleConfirmSection,
    handleReviewBack,
    // Save
    isSaving,
    saveStatus,
    handleSaveToDatabase,
    handleDownloadJSON,
    handleCopyJSON,
  }
}

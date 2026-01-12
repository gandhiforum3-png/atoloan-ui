export function uploadFile(event, onUpload) {
  event.preventDefault()
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    ajaxFileUpload(file, onUpload)
  }
}

export function fileExplorer(inputId = 'selectfile') {
  const input = document.getElementById(inputId)
  if (input) {
    input.click()
  }
}

export async function ajaxFileUpload(file, onUpload, endpoint = '/ajax.php') {
  if (!file) return null
  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) throw new Error('Upload failed')
    const text = await response.text()
    if (onUpload) onUpload(text)
    return text
  } catch (error) {
    if (onUpload) onUpload('error')
    return null
  }
}

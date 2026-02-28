export const copyByLanguage = {
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

export const toLabel = (value) => String(value).replace(/_/gu, ' ')

export const reviewOrder = [
  'credit_union_info',
  'rate_policy',
  'loan_programs',
  'guidelines',
  'special_programs',
  'participation_and_funding',
  'additional_details',
]

export const reviewSkeleton = {
  credit_union_info: {},
  rate_policy: {},
  loan_programs: [],
  guidelines: {},
  special_programs: {},
  participation_and_funding: {},
  additional_details: {},
}

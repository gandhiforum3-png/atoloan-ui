export const buildPreApprovalPayload = ({
  language,
  answers,
  otherMonthlyIncome,
  otherDownPayment,
  jobTitle,
  timeAtJobMonths,
  zipCode,
  contactInfo,
  summary,
}) => ({
  language,
  answers: { ...answers },
  otherMonthlyIncome: otherMonthlyIncome.trim(),
  otherDownPayment: otherDownPayment.trim(),
  jobTitle: jobTitle.trim(),
  timeAtJobMonths,
  zipCode: zipCode.trim(),
  contactInfo: {
    firstName: contactInfo.firstName.trim(),
    lastName: contactInfo.lastName.trim(),
    email: contactInfo.email.trim(),
    address: contactInfo.address.trim(),
    city: contactInfo.city.trim(),
    state: contactInfo.state.trim(),
    zip: contactInfo.zip.trim(),
    phone: contactInfo.phone.trim(),
  },
  summary,
})

export const sendPayload = async (endpoint, payload, onSuccess) => {
  try {
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (onSuccess) onSuccess()
  } catch (error) {
    console.error(`Failed to send payload to ${endpoint}`, error)
  }
}

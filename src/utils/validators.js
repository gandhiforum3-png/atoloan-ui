export function validateForm5(values) {
  if (!values.ssnoritin) return 'Select Social Security Number or ITIN.'
  if (!values.employmenttype) return 'Select Employment Type.'
  if (!values.paymenttype && !values.paymenttypeself && !values.paymenttyperetired) {
    return 'Select Proof Of Income Type.'
  }
  if (!values.monthlyincome) return 'Select Monthly Income.'
  if (values.monthlyincome === '8' && !values.othermonthlyincome) {
    return 'Select Monthly Income.'
  }
  const exemptEmployment = ['5', '7']
  if (!exemptEmployment.includes(values.employmenttype) && !values.timeatjob) {
    return 'Select Time At Job.'
  }
  if (
    !exemptEmployment.includes(values.employmenttype) &&
    values.timeatjob === '3' &&
    !values.othertimeatjob
  ) {
    return 'Select Time At Job.'
  }
  if (!exemptEmployment.includes(values.employmenttype) && !values.jobtitle) {
    return 'Enter Job Title.'
  }
  if (!values.havedriverslicense) {
    return "Select Whether You Have A Current Driver's License."
  }
  if (!values.downpayment) return 'Select Down Payment Amount.'
  if (!values.vin) return 'Enter the stock number of car you purchased.'
  if (values.downpayment === '7' && !values.otherdownpayment) {
    return 'You must enter downpayment amount.'
  }
  return null
}

export function validateForm9(values) {
  if (values.timeatjob === 'none') return 'You must select time at job.'
  if (!values.othertimeatjob && values.timeatjob === 'lessthanayear') {
    return 'You must enter months at job.'
  }
  if (!values.jobtitle) return 'You must enter a job title.'
  return null
}

export function validateForm91(values) {
  if (values.timeatjobcosigner === 'none') return 'You must select time at job.'
  if (!values.othertimeatjobcosigner && values.timeatjobcosigner === 'lessthanayear') {
    return 'You must enter months at job.'
  }
  if (!values.jobtitlecosigner) return 'You must enter a job title.'
  return null
}

export function validateForm11(values) {
  if (!values.monthlyincome) return 'Select your monthly income.'
  return null
}

export function validateForm111() {
  return null
}

export function validateForm13(values) {
  const hasRadio = Boolean(values.downpayment)
  if (!hasRadio && !values.otherdownpayment) {
    return 'Enter a down payment amount.'
  }
  return null
}

export function validateForm14(values) {
  if (values.monthlydebt && Number.isNaN(Number(values.monthlydebt))) {
    return 'You must enter a number.'
  }
  if (values.monthlyincome && Number.isNaN(Number(values.monthlyincome))) {
    return 'You must enter a number.'
  }
  return null
}

export function validateForm15(values) {
  if (!values.howlongsincerepo && values.isRepoVisible) {
    return 'You must enter years/months since your repo'
  }
  return null
}

export function validateForm15cosigner(values) {
  if (!values.howlongsincerepocosigner && values.isRepoVisible) {
    return 'You must enter years/months since your cosigner repo'
  }
  return null
}

export function validateForm17(values) {
  if (!values.zipcode) return 'You must enter your zip code.'
  return null
}

export function validateForm19(values) {
  if (!values.firstname) return 'Enter Your First Name'
  if (!values.lastname) return 'Enter Your Last Name'
  if (!values.email) return 'Enter Your Email'
  if (!values.address) return 'Enter Your Address'
  if (!values.city) return 'Enter Your City'
  if (!values.state) return 'Enter Your State'
  return null
}

export function validateForm20(values) {
  if (!values.agreeauthorizedconsent) return 'You must agree to authorized consent.'
  if (!values.agreenda) return 'You must confirm non disclosure agreement.'
  return null
}

export function signupDemoForm(values) {
  if (!values.dealershipname) return 'You must enter the name.'
  if (!values.firstname) return 'You must enter your first name.'
  if (!values.lastname) return 'You must enter your last name.'
  if (!values.email) return 'You must enter your email.'
  if (!values.phone) return 'You must enter your phone.'
  return null
}

export function validateFormHomepage(values) {
  if (!values.loantype || values.loantype === 'select') return 'You must select loan type.'
  if (!values.zipcode) return 'You must enter a zip code'
  return null
}

export function updateItem(rownumber) {
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(`item[${rownumber}]`, 'Lorem ipsum')
    return sessionStorage.getItem(`item[${rownumber}]`)
  }
  return null
}

export function updateAmount(rownumber) {
  return rownumber
}

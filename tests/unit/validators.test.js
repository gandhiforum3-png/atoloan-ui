import {
  validateForm5,
  validateForm9,
  validateForm91,
  validateForm11,
  validateForm111,
  validateForm13,
  validateForm14,
  validateForm15,
  validateForm15cosigner,
  validateForm17,
  validateForm19,
  validateForm20,
  signupDemoForm,
  validateFormHomepage,
  updateItem,
  updateAmount,
} from '../../src/utils/validators.js'

describe('validateForm5', () => {
  const validInput = {
    ssnoritin: 'ss',
    employmenttype: '1',
    paymenttype: 'paystub',
    monthlyincome: '3000',
    timeatjob: '1',
    jobtitle: 'Dev',
    havedriverslicense: 'yes',
    downpayment: '1000',
    vin: 'ABC123',
  }

  it('returns null for valid input', () => {
    expect(validateForm5(validInput)).toBeNull()
  })

  it('returns error when ssnoritin is missing', () => {
    expect(validateForm5({ ...validInput, ssnoritin: '' })).toBe('Select Social Security Number or ITIN.')
  })

  it('returns error when employmenttype is missing', () => {
    expect(validateForm5({ ...validInput, employmenttype: '' })).toBe('Select Employment Type.')
  })

  it('returns error when monthlyincome is missing', () => {
    expect(validateForm5({ ...validInput, monthlyincome: '' })).toBe('Select Monthly Income.')
  })

  it('returns error when monthlyincome is "8" and othermonthlyincome is empty', () => {
    expect(validateForm5({ ...validInput, monthlyincome: '8', othermonthlyincome: '' })).toBe('Select Monthly Income.')
  })

  it('returns error when downpayment is "7" and otherdownpayment is missing', () => {
    expect(validateForm5({ ...validInput, downpayment: '7', otherdownpayment: '' })).toBe('You must enter downpayment amount.')
  })

  it('skips timeatjob/jobtitle checks for exempt employment type "5"', () => {
    const exemptInput = {
      ...validInput,
      employmenttype: '5',
      timeatjob: '',
      jobtitle: '',
    }
    expect(validateForm5(exemptInput)).toBeNull()
  })

  it('skips timeatjob/jobtitle checks for exempt employment type "7"', () => {
    const exemptInput = {
      ...validInput,
      employmenttype: '7',
      timeatjob: '',
      jobtitle: '',
    }
    expect(validateForm5(exemptInput)).toBeNull()
  })
})

describe('validateForm9', () => {
  it('returns null for valid input (over2years + jobtitle)', () => {
    expect(validateForm9({ timeatjob: 'over2years', jobtitle: 'Dev' })).toBeNull()
  })

  it('returns error when timeatjob is "none"', () => {
    expect(validateForm9({ timeatjob: 'none' })).toBe('You must select time at job.')
  })

  it('returns error when timeatjob is "lessthanayear" and othertimeatjob is empty', () => {
    expect(validateForm9({ timeatjob: 'lessthanayear', othertimeatjob: '', jobtitle: 'Dev' })).toBe('You must enter months at job.')
  })

  it('returns error when jobtitle is missing', () => {
    expect(validateForm9({ timeatjob: 'over2years', jobtitle: '' })).toBe('You must enter a job title.')
  })
})

describe('validateForm91', () => {
  it('returns null for valid input (cosigner over2years + jobtitlecosigner)', () => {
    expect(validateForm91({ timeatjobcosigner: 'over2years', jobtitlecosigner: 'Dev' })).toBeNull()
  })

  it('returns error when timeatjobcosigner is "none"', () => {
    expect(validateForm91({ timeatjobcosigner: 'none' })).toBe('You must select time at job.')
  })

  it('returns error when timeatjobcosigner is "lessthanayear" and othertimeatjobcosigner is empty', () => {
    expect(validateForm91({ timeatjobcosigner: 'lessthanayear', othertimeatjobcosigner: '', jobtitlecosigner: 'Dev' })).toBe('You must enter months at job.')
  })
})

describe('validateForm11', () => {
  it('returns null when monthlyincome is provided', () => {
    expect(validateForm11({ monthlyincome: '3000' })).toBeNull()
  })

  it('returns error when monthlyincome is missing', () => {
    expect(validateForm11({})).toBe('Select your monthly income.')
  })
})

describe('validateForm111', () => {
  it('always returns null', () => {
    expect(validateForm111()).toBeNull()
  })
})

describe('validateForm13', () => {
  it('returns null when downpayment (radio) is provided', () => {
    expect(validateForm13({ downpayment: '1000' })).toBeNull()
  })

  it('returns null when otherdownpayment is provided even if downpayment is falsy', () => {
    expect(validateForm13({ downpayment: '', otherdownpayment: '500' })).toBeNull()
  })

  it('returns error when both downpayment and otherdownpayment are missing', () => {
    expect(validateForm13({ downpayment: '', otherdownpayment: '' })).toBe('Enter a down payment amount.')
  })

  it('returns error when called with empty object', () => {
    expect(validateForm13({})).toBe('Enter a down payment amount.')
  })
})

describe('validateForm14', () => {
  it('returns null for empty object (no fields = no error)', () => {
    expect(validateForm14({})).toBeNull()
  })

  it('returns null for valid numeric monthlydebt', () => {
    expect(validateForm14({ monthlydebt: '500' })).toBeNull()
  })

  it('returns error when monthlydebt is non-numeric', () => {
    expect(validateForm14({ monthlydebt: 'abc' })).toBe('You must enter a number.')
  })

  it('returns error when monthlyincome is non-numeric', () => {
    expect(validateForm14({ monthlyincome: 'xyz' })).toBe('You must enter a number.')
  })
})

describe('validateForm15', () => {
  it('returns null when isRepoVisible is falsy', () => {
    expect(validateForm15({})).toBeNull()
  })

  it('returns null when isRepoVisible is true and howlongsincerepo is provided', () => {
    expect(validateForm15({ isRepoVisible: true, howlongsincerepo: '2 years' })).toBeNull()
  })

  it('returns error when isRepoVisible is true and howlongsincerepo is empty', () => {
    expect(validateForm15({ isRepoVisible: true, howlongsincerepo: '' })).toBe('You must enter years/months since your repo')
  })
})

describe('validateForm15cosigner', () => {
  it('returns null when isRepoVisible is falsy', () => {
    expect(validateForm15cosigner({})).toBeNull()
  })

  it('returns null when isRepoVisible is true and howlongsincerepocosigner is provided', () => {
    expect(validateForm15cosigner({ isRepoVisible: true, howlongsincerepocosigner: '1 year' })).toBeNull()
  })

  it('returns error when isRepoVisible is true and howlongsincerepocosigner is empty', () => {
    expect(validateForm15cosigner({ isRepoVisible: true, howlongsincerepocosigner: '' })).toBe('You must enter years/months since your cosigner repo')
  })
})

describe('validateForm17', () => {
  it('returns null when zipcode is provided', () => {
    expect(validateForm17({ zipcode: '90210' })).toBeNull()
  })

  it('returns error when zipcode is missing', () => {
    expect(validateForm17({})).toBe('You must enter your zip code.')
  })
})

describe('validateForm19', () => {
  const validInput = {
    firstname: 'A',
    lastname: 'B',
    email: 'c@d.com',
    address: '123',
    city: 'LA',
    state: 'CA',
  }

  it('returns null for valid input', () => {
    expect(validateForm19(validInput)).toBeNull()
  })

  it('returns error for first missing field (firstname)', () => {
    expect(validateForm19({})).toBe('Enter Your First Name')
  })

  it('returns error when firstname is missing but others present', () => {
    expect(validateForm19({ ...validInput, firstname: '' })).toBe('Enter Your First Name')
  })

  it('returns error when lastname is missing', () => {
    expect(validateForm19({ ...validInput, lastname: '' })).toBe('Enter Your Last Name')
  })

  it('returns error when email is missing', () => {
    expect(validateForm19({ ...validInput, email: '' })).toBe('Enter Your Email')
  })
})

describe('validateForm20', () => {
  it('returns null when both consent fields are true', () => {
    expect(validateForm20({ agreeauthorizedconsent: true, agreenda: true })).toBeNull()
  })

  it('returns error when agreeauthorizedconsent is missing', () => {
    expect(validateForm20({})).toBe('You must agree to authorized consent.')
  })

  it('returns error when agreenda is missing', () => {
    expect(validateForm20({ agreeauthorizedconsent: true })).toBe('You must confirm non disclosure agreement.')
  })
})

describe('signupDemoForm', () => {
  const validInput = {
    dealershipname: 'D',
    firstname: 'F',
    lastname: 'L',
    email: 'e@e.com',
    phone: '123',
  }

  it('returns null for valid input', () => {
    expect(signupDemoForm(validInput)).toBeNull()
  })

  it('returns error when dealershipname is missing', () => {
    expect(signupDemoForm({})).toBe('You must enter the name.')
  })

  it('returns error when firstname is missing', () => {
    expect(signupDemoForm({ ...validInput, firstname: '' })).toBe('You must enter your first name.')
  })

  it('returns error when email is missing', () => {
    expect(signupDemoForm({ ...validInput, email: '' })).toBe('You must enter your email.')
  })
})

describe('validateFormHomepage', () => {
  it('returns null for valid input', () => {
    expect(validateFormHomepage({ loantype: 'auto', zipcode: '90210' })).toBeNull()
  })

  it('returns error when loantype is missing', () => {
    expect(validateFormHomepage({})).toBe('You must select loan type.')
  })

  it('returns error when loantype is "select" (default/unselected)', () => {
    expect(validateFormHomepage({ loantype: 'select' })).toBe('You must select loan type.')
  })

  it('returns error when zipcode is missing after valid loantype', () => {
    expect(validateFormHomepage({ loantype: 'auto', zipcode: '' })).toBe('You must enter a zip code')
  })
})

describe('updateItem', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('writes "Lorem ipsum" to sessionStorage and returns it', () => {
    const result = updateItem(5)
    expect(result).toBe('Lorem ipsum')
  })

  it('can be read back from sessionStorage after call', () => {
    updateItem(5)
    expect(sessionStorage.getItem('item[5]')).toBe('Lorem ipsum')
  })

  it('works with different row numbers', () => {
    const result = updateItem(42)
    expect(result).toBe('Lorem ipsum')
    expect(sessionStorage.getItem('item[42]')).toBe('Lorem ipsum')
  })
})

describe('updateAmount', () => {
  it('returns numeric input unchanged', () => {
    expect(updateAmount(42)).toBe(42)
  })

  it('returns string input unchanged', () => {
    expect(updateAmount('hello')).toBe('hello')
  })

  it('returns 0 unchanged', () => {
    expect(updateAmount(0)).toBe(0)
  })
})

import { render, screen } from '@testing-library/react'
import ContactInfoForm from '../../src/pages/loans/steps/ContactInfoForm.jsx'

const copy = {
  firstNamePlaceholder: 'First Name',
  lastNamePlaceholder: 'Last Name',
  emailPlaceholder: 'Email Address',
  addressPlaceholder: 'Home Address',
  cityPlaceholder: 'City',
  statePlaceholder: 'State',
  zipPlaceholderForm: 'Zip Code',
  phonePlaceholder: 'Phone Number',
  continue: 'Continue',
}
const emptyContactInfo = {
  firstName: '', lastName: '', email: '', address: '',
  city: '', state: '', zip: '', phone: '',
}

const defaultProps = {
  contactInfo: emptyContactInfo,
  errors: [],
  emailError: '',
  phoneError: '',
  onChange: vi.fn().mockReturnValue(vi.fn()),
  onContinue: vi.fn(),
  zipCode: '',
  copy,
}

describe('ContactInfoForm', () => {
  it('displays error list when errors array is non-empty', () => {
    render(<ContactInfoForm {...defaultProps} errors={['Missing field 1', 'Missing field 2']} />)
    expect(screen.getByText('Fix the following:')).toBeInTheDocument()
    expect(screen.getByText('Missing field 1')).toBeInTheDocument()
    expect(screen.getByText('Missing field 2')).toBeInTheDocument()
  })

  it('hides error box when errors array is empty', () => {
    render(<ContactInfoForm {...defaultProps} errors={[]} />)
    expect(screen.queryByText('Fix the following:')).not.toBeInTheDocument()
  })

  it('shows emailError below email input when truthy', () => {
    render(<ContactInfoForm {...defaultProps} emailError="please add valid email" />)
    expect(screen.getByText('please add valid email')).toBeInTheDocument()
  })

  it('shows phoneError below phone input when truthy', () => {
    render(<ContactInfoForm {...defaultProps} phoneError="please add valid phone number" />)
    expect(screen.getByText('please add valid phone number')).toBeInTheDocument()
  })

  it('renders all 8 input placeholders from copy', () => {
    render(<ContactInfoForm {...defaultProps} />)
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Home Address')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Zip Code')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Phone Number')).toBeInTheDocument()
  })
})

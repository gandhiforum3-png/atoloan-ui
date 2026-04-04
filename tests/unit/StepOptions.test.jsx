import { render, screen, fireEvent } from '@testing-library/react'
import StepOptions from '../../src/pages/loans/StepOptions.jsx'

const optionsWithImg = [
  { value: 'opt1', img: '/images/opt1.png', alt: 'Option 1', label: 'Option 1' },
  { value: 'opt2', img: '/images/opt2.png', alt: 'Option 2', label: 'Option 2' },
]
const optionsNoImg = [
  { value: 'opt3', img: null, alt: 'Option 3', label: 'Option 3' },
]

describe('StepOptions', () => {
  it('renders img elements for options with img paths', () => {
    render(
      <StepOptions
        options={optionsWithImg}
        selectedValue={null}
        onSelect={vi.fn()}
        brokenImages={{}}
        setBrokenImages={vi.fn()}
      />
    )
    expect(screen.getByAltText('Option 1')).toBeInTheDocument()
    expect(screen.getByAltText('Option 2')).toBeInTheDocument()
  })

  it('renders text fallback for options without img path', () => {
    render(
      <StepOptions
        options={optionsNoImg}
        selectedValue={null}
        onSelect={vi.fn()}
        brokenImages={{}}
        setBrokenImages={vi.fn()}
      />
    )
    expect(screen.getByText('Option 3')).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('renders text fallback when image is marked broken', () => {
    render(
      <StepOptions
        options={optionsWithImg}
        selectedValue={null}
        onSelect={vi.fn()}
        brokenImages={{ '/images/opt1.png': true }}
        setBrokenImages={vi.fn()}
      />
    )
    expect(screen.queryByAltText('Option 1')).toBeNull()
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    // Option 2 still has working image
    expect(screen.getByAltText('Option 2')).toBeInTheDocument()
  })

  it('calls setBrokenImages when image fires onError', () => {
    const setBrokenImages = vi.fn()
    render(
      <StepOptions
        options={optionsWithImg}
        selectedValue={null}
        onSelect={vi.fn()}
        brokenImages={{}}
        setBrokenImages={setBrokenImages}
      />
    )
    fireEvent.error(screen.getByAltText('Option 1'))
    expect(setBrokenImages).toHaveBeenCalledOnce()
  })

  it('calls onSelect with option value on click', () => {
    const onSelect = vi.fn()
    render(
      <StepOptions
        options={optionsWithImg}
        selectedValue={null}
        onSelect={onSelect}
        brokenImages={{}}
        setBrokenImages={vi.fn()}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /Option 1/ }))
    expect(onSelect).toHaveBeenCalledWith('opt1')
  })
})

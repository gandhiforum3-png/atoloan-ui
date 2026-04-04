import { render, screen, fireEvent } from '@testing-library/react'
import { LanguageProvider, useLanguage } from '../../src/context/LanguageContext.jsx'

function TestConsumer() {
  const { language, toggleLanguage } = useLanguage()
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={toggleLanguage}>Toggle</button>
    </div>
  )
}

describe('LanguageContext', () => {
  it('defaults to English', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })

  it('switches to Spanish after toggle', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Toggle' }))
    expect(screen.getByTestId('lang')).toHaveTextContent('es')
  })

  it('toggles back to English on second click', () => {
    render(
      <LanguageProvider>
        <TestConsumer />
      </LanguageProvider>
    )
    const btn = screen.getByRole('button', { name: 'Toggle' })
    fireEvent.click(btn)
    fireEvent.click(btn)
    expect(screen.getByTestId('lang')).toHaveTextContent('en')
  })
})

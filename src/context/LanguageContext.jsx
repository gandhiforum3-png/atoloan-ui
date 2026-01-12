import { createContext, useContext, useMemo, useState } from 'react'

const LanguageContext = createContext({
  language: 'en',
  toggleLanguage: () => {},
})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'es' : 'en'))
  }

  const value = useMemo(() => ({ language, toggleLanguage }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}

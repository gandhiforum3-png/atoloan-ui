import { Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Loans from './pages/Loans'
import LoanCalculator from './pages/LoanCalculator'
import Terms from './pages/Terms'

function App() {
  return (
    <LanguageProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loans" element={<Loans />} />
        <Route path="/loancalculator" element={<LoanCalculator />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      <Footer />
    </LanguageProvider>
  )
}

export default App

import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const navLabels = {
  en: {
    home: 'Home',
    preApproved: 'Loan',
    calculator: 'Loan Calculator',
    ratesheet: 'Upload Ratesheet',
  },
  es: {
    home: 'Hogar',
    preApproved: 'Prestamo',
    calculator: 'Calculadora',
    ratesheet: 'Subir Tarifario',
  },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, toggleLanguage } = useLanguage()
  const labels = navLabels[language]

  return (
    <nav className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/images/atoloans.png" alt="Ato Loans" id="toplogo" />
        </Link>
        <button
          className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
          type="button"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          Menu
          <i className="fas fa-bars"></i>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/">
                <i className="fa fa-home" aria-hidden="true"></i> {labels.home}
              </NavLink>
            </li>
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/loans">
                <i className="fas fa-bank"></i> {labels.preApproved}
              </NavLink>
            </li>
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/loancalculator">
                <i className="fas fa-calculator"></i> {labels.calculator}
              </NavLink>
            </li>
            <li className="nav-item mx-0 mx-lg-1">
              <NavLink className="nav-link py-3 px-0 px-lg-3 rounded" to="/ratesheetuploader">
                <i className="fas fa-upload"></i> {labels.ratesheet}
              </NavLink>
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="lang-toggle"
          onClick={toggleLanguage}
          aria-label={language === 'en' ? 'Switch to Spanish' : 'Switch to English'}
        >
          <span className={language === 'en' ? 'lang-active' : 'lang-inactive'}>EN</span>
          <span className="lang-separator">|</span>
          <span className={language === 'es' ? 'lang-active' : 'lang-inactive'}>ES</span>
        </button>
      </div>
    </nav>
  )
}

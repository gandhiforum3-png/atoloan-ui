import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const navLabels = {
  en: {
    home: 'Home',
    preApproved: 'Get Pre-Approved',
    calculator: 'Loan Calculator',
    toggleAlt: 'Espanol',
    toggleImg: '/images/espanolbutton.png',
  },
  es: {
    home: 'Hogar',
    preApproved: 'Obtener Pre-Aprobado',
    calculator: 'Calculadora de Préstamos',
    toggleAlt: 'English',
    toggleImg: '/images/englishbutton.png',
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
          </ul>
        </div>
        <button
          type="button"
          className="btn p-0 border-0 bg-transparent"
          onClick={toggleLanguage}
          aria-label={labels.toggleAlt}
        >
          <img
            src={labels.toggleImg}
            alt={labels.toggleAlt}
            className="imgbutton languagebutton"
            style={{ height: '75px', width: 'auto' }}
          />
        </button>
      </div>
    </nav>
  )
}

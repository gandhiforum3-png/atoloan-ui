import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'

const homeContent = {
  en: {
    headline: 'Auto Financing \nThe Smart Way',
    heroList: [
      'No Personal Information Needed',
      'Get Pre-Approved in 14 Simple Questions',
      'No Credit Check',
      'Discover Which Lender Has The Best Interest Rates In Your Area',
      'A Real Pre-Approval',
    ],
    heroCtaImg: '/images/btn_eng_getpreapproved.png',
    heroCtaAlt: 'Get Pre-Approved Now!',
    preapprovedImg: '/images/eng_getpreapproved.png',
    preapprovedHeading: 'Fast, Easy and "Requiring Zero Personal Information."',
    learnHeading: 'Learn How It Works',
    smartHeading: 'The Smart Way To Secure Auto Financing',
    smartBullets: [
      'Never give us any personal\ninfo before pre-approval.',
      'A real pre-approval.',
      'Transparent finance.',
      'Secure and confidential.',
    ],
    digitalHeading: 'Welcome To\nDigital Retailing',
    digitalBullets: [
      'Fast, easy, secure.',
      'No credit check.',
      'Upload documents easily and securely.',
    ],
    welcomeCopy:
      'Welcome to Atoloans, the future in automotive loan pre-approval software that takes the guesswork out of which lender has the best interest rates. Our system matches you to your best lenders automatically from 1,000+ top credit unions and banks. By simply clicking through 14 questions (based on real-time approval factors), we streamline and enhance a fast approval. Welcome to DIGITAL RETAIL FINANCING bringing a more human(e) approach to automotive financing. We focus on a customer-first experience through instant pre-approvals and the best financing options.',
    welcomeBullets: [
      'Qualified offers in minutes.',
      'Completely free to use.',
      'Nationawide lender network.',
      'Data and privacy secured.',
    ],
    welcomeCtaImg: '/images/btn_eng_getstarted.png',
    welcomeCtaAlt: 'Get Started',
    preapprovalIntro:
      'Get Pre-approvals in minutes with interest rates from multiple credit unions in your area. See which credit union has the best interest rates without having them run your credit! Completely free to use. Nationwide lender network. Data and privacy secured.',
    iconCards: [
      {
        img: '/images/circleicon1.png',
        title: 'A Real Pre-Approval Without The Work!',
        copy:
          'Receive a real, personalized Pre-Approval with interest rates from multiple credit unions/banks in your area.',
      },
      {
        img: '/images/circleicon2.png',
        title: 'From Click To Done',
        copy:
          'Once Pre-Approved just select the financial institution you desire and upload the required documents and our finance department will contact you for document verification.',
      },
      {
        img: '/images/circleicon3.png',
        title: 'Make It Yours',
        copy: 'Deliver or Pick Up? Your Choice!',
      },
    ],
    finalCtaImg: '/images/btn_eng_getpreapproved.png',
    finalCtaAlt: 'Get Pre-Approved Now!',
  },
  es: {
    headline: '¡El auto nuevo comienza aquí!',
    heroList: [
      'No se requiere información personal para las aprobaciones previas',
      'Vea qué prestamista tiene las mejores tasas de interés',
      'Sin verificación de crédito',
      'Una aprobación previa real',
    ],
    heroCtaImg: '/images/btn_esp_getpreapproved.png',
    heroCtaAlt: '¡Obtenga una aprobación previa ahora!',
    preapprovedImg: '/images/esp_getpreapproved.png',
    preapprovedHeading: 'Rápido, fácil y "sin información personal."',
    learnHeading: 'Aprenda cómo funciona',
    smartHeading: 'La forma inteligente de asegurar financiamiento automotriz',
    smartBullets: [
      'Nunca nos dé información personal\nantes de la pre-aprobación.',
      'Una pre-aprobación real.',
      'Finanzas transparentes.',
      'Seguro y confidencial.',
    ],
    digitalHeading: 'Bienvenido a\nventa minorista digital',
    digitalBullets: [
      'Rápido, fácil, seguro.',
      'Sin verificación de crédito.',
      'Suba documentos de manera fácil y segura.',
    ],
    welcomeCopy:
      'Bienvenido a atoloans, el programa del futuro de pre-aprobaciones de préstamos de autos que elimina las dudas sobre cual financiera tiene los mejores intereses. Nuestro programa lo conecta con los mejores prestamistas automáticamente atrás de 1,000+ más principales de credit unions y bancos. Con solo responder 14 preguntas (basadas en factores de aprobación en tiempo real), facilitamos y mejoramos una aprobación rápida. Bienvenido a FINANCIERO DIGITAL, que aporta un enfoque más humano en el financiamiento de automóviles, nos centramos en una experiencia centrada en el cliente a través de las mejores opciones financieras. Una aprobación previa real sin el esfuerzo!',
    welcomeBullets: [
      'Ofertas calificadas en minutos.',
      'Uso completamente gratuito.',
      'Red de prestamistas a nivel nacional.',
      'Datos y privacidad asegurados.',
    ],
    welcomeCtaImg: '/images/btn_esp_getstarted.png',
    welcomeCtaAlt: 'Comenzar',
    preapprovalIntro:
      'Obtenga pre-aprobaciones en minutos con tasas de interés de múltiples cooperativas de crédito en su área. Vea qué cooperativa de crédito tiene las mejores tasas sin que revisen su crédito. Uso completamente gratuito. Red nacional de prestamistas. Datos y privacidad asegurados.',
    iconCards: [
      {
        img: '/images/circleicon1.png',
        title: '¡Una pre-aprobación real sin esfuerzo!',
        copy:
          'Reciba una pre-aprobación real y personalizada con tasas de interés de múltiples cooperativas/bancos en su área.',
      },
      {
        img: '/images/circleicon2.png',
        title: 'De clic a listo',
        copy:
          'Una vez pre-aprobado, seleccione la institución financiera deseada y cargue los documentos requeridos. Nuestro equipo se comunicará para verificación.',
      },
      {
        img: '/images/circleicon3.png',
        title: 'Hágalo suyo',
        copy: '¿Entrega o recoger? ¡Su elección!',
      },
    ],
    finalCtaImg: '/images/btn_esp_getpreapproved.png',
    finalCtaAlt: '¡Obtenga una aprobación previa ahora!',
  },
}

export default function Home() {
  const { language } = useLanguage()
  const content = homeContent[language]

  return (
    <section id="last">
      <div className="full">
        <header className="masthead text-white text-center homehero">
          <div className="container d-flex align-items-center flex-column" style={{ marginTop: '-65px' }}>
            <div className="col-sm-12 left">
              <h1 className="masthead-heading homeheadline">
                {content.headline.split('\n').map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </h1>
              <div style={{ textAlign: 'left' }}>
                <ul className="homeherolist">
                  {content.heroList.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div style={{ textAlign: 'left', paddingTop: '30px' }}>
                <Link to="/loans" className="hero-cta-btn">
                  {content.heroCtaAlt} →
                </Link>
                <div className="hero-trust-badges">
                  {content.heroList.slice(0, 3).map((badge) => (
                    <span key={badge} className="hero-trust-badge">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="page-section" style={{ backgroundColor: '#fff', textAlign: 'center' }}>
          <div className="container">
            <img
              src={content.preapprovedImg}
              alt="Get Pre-Approved In 14 Clicks"
              style={{ paddingBottom: '25px', textAlign: 'center' }}
              className="img-fluid"
            />
            <h2 style={{ textAlign: 'center', fontSize: '40px', paddingBottom: '50px' }}>
              {content.preapprovedHeading}
            </h2>
            <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8">
                <img
                  src="/images/tablet2.png"
                  alt="Tablet"
                  style={{ width: '100%', height: 'auto', paddingBottom: '75px', textAlign: 'center' }}
                  className="img-fluid"
                />
                <div className="col-sm-2"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section" style={{ backgroundColor: '#fff', marginTop: '-200px' }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <h2 style={{ textAlign: 'center', fontSize: '40px' }}>{content.learnHeading}</h2>
                <div className="iframeVideo" style={{ paddingTop: '40px' }}>
                  <iframe
                    src="https://www.youtube.com/embed/tGT6QvQtn70?si=B8nkqA5REP5mYMh5"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
            <section className="page-section" style={{ borderBottom: 'solid 0px #000', paddingBottom: '0px', paddingTop: '150px' }}>
              <div className="container">
                <div className="row">
                  <div className="col-sm-4">
                    <h2 style={{ textAlign: 'left', fontSize: '42px' }}>
                      {content.smartHeading.split('\n').map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </h2>
                    <div>
                      <ul>
                        {content.smartBullets.map((bullet) => (
                          <li key={bullet} style={{ fontSize: '22px' }}>
                            {bullet.split('\n').map((line) => (
                              <span key={line}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </li>
                        ))}
                      </ul>
              </div>
                  </div>

                  <div className="col-sm-4">
                    <img src="/images/womanlaptop.jpg" alt="Woman on Laptop" className="img-fluid" />
                  </div>

                  <div className="col-sm-4">
                    <h2 style={{ textAlign: 'left', fontSize: '42px' }}>
                      {content.digitalHeading.split('\n').map((line) => (
                        <span key={line}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </h2>
                    <div>
                      <ul>
                        {content.digitalBullets.map((bullet) => (
                          <li key={bullet} style={{ fontSize: '22px' }}>
                            {bullet}
                          </li>
                        ))}
                      </ul>
              </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        <section className="page-section" style={{ backgroundColor: '#2f3d4f', position: 'relative' }}>
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                <img
                  src="/images/tablet2.png"
                  alt="Tablet"
                  style={{ width: '100%', height: 'auto', paddingBottom: '75px' }}
                />
              </div>
              <div className="col-sm-6" style={{ padding: '0 30px 50px 30px' }}>
                <p style={{ fontSize: '22px', lineHeight: '34px', color: '#fff' }}>{content.welcomeCopy}</p>
                <div style={{ fontSize: '22px', lineHeight: '32px', color: '#fff' }}>
                  <ul>
                    {content.welcomeBullets.map((bullet) => (
                      <li key={bullet} style={{ fontSize: '20px', color: '#fff' }}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
              </div>
                <br />
                <p style={{ textAlign: 'left', marginTop: '8px' }}>
                  <Link to="/loans" className="hero-cta-btn" style={{ fontSize: '16px', padding: '14px 28px' }}>
                    {content.welcomeCtaAlt} →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="page-section" style={{ marginTop: '-100px' }}>
          <div className="container">
            <p style={{ fontSize: '23px' }}>{content.preapprovalIntro}</p>
            <div className="row">
              {content.iconCards.map((card) => (
                <div key={card.title} className="col-sm-4" style={{ padding: '35px' }}>
                  <p style={{ textAlign: 'center' }}>
                    <Link to="/loans">
                      <img src={card.img} alt={card.title} style={{ width: '100%', height: 'auto' }} className="img-fluid" />
                    </Link>
                  </p>
                  <h3 style={{ textAlign: 'center' }}>{card.title}</h3>
                  <p style={{ textAlign: 'center', fontSize: '20px' }}>{card.copy}</p>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/loans" className="hero-cta-btn">
                {content.finalCtaAlt} →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </section>
  )
}

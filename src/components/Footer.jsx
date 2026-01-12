import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <>
      <footer className="footer text-center" style={{ marginTop: '120px' }}>
        <div className="container">
          <div style={{ textAlign: 'center' }}>
            <Link to="/terms" style={{ color: '#fff' }}>
              Terms & Conditions / Privacy Policy
            </Link>
          </div>
          <div className="row">
            <div className="col-lg-4 mb-5 mb-lg-0"></div>
            <div className="col-lg-4 mb-5 mb-lg-0" style={{ display: 'none' }}>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-facebook-f"></i>
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-twitter"></i>
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-linkedin-in"></i>
              </a>
              <a className="btn btn-outline-light btn-social mx-1" href="#!">
                <i className="fab fa-fw fa-dribbble"></i>
              </a>
            </div>
            <div className="col-lg-4"></div>
          </div>
        </div>
      </footer>
      <div className="copyright py-4 text-center text-white">
        <div className="container">
          <small>Copyright &copy; AtoLoans 2026</small>
        </div>
      </div>
    </>
  )
}

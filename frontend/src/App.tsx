import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Certificates from './pages/Certificates';
import CertificateDisplay from './pages/CertificateDisplay';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              <span className="logo-text">CIE</span>
              <span className="logo-spark">Spark</span>
            </Link>
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/certificates" className="nav-link">Certificates</Link>
              </li>
            </ul>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificate/:srn/:eventName" element={<CertificateDisplay />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

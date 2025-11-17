import { useState, useEffect } from 'react';
import './Home.css';
import headerImage from '../assets/logo.png';
import { getApiUrl } from '../config/api';

interface Stats {
  totalCertificates: number;
  totalStudents: number;
  totalEvents: number;
}

function Home() {
  const [stats, setStats] = useState<Stats>({ totalCertificates: 0, totalStudents: 0, totalEvents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(getApiUrl('/api/stats'));
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* CIE Spark Event Introduction Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="highlight">CIE Spark</span>
          </h1>
          <p className="hero-subtitle">
            Premier Ideation & Innovation Event
          </p>
          <p className="hero-description">
            CIE Spark is a flagship ideation event that brings together brilliant minds to solve real-world challenges. 
            With <strong>30 teams</strong> comprising <strong>100 talented students</strong> and guidance from 
            <strong>7 industry mentors</strong>, we foster innovation and entrepreneurial thinking.
          </p>
          <div className="event-highlights">
            <div className="highlight-item">
              <div className="highlight-number">30</div>
              <div className="highlight-label">Teams</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-number">100</div>
              <div className="highlight-label">Students</div>
            </div>
            <div className="highlight-item">
              <div className="highlight-number">7</div>
              <div className="highlight-label">Industry Mentors</div>
            </div>
          </div>
          <a href="/certificates" className="cta-button">
            View Event Certificates →
          </a>
        </div>
        <div className="hero-image">
          <img 
            src={headerImage} 
            alt="CIE Spark Event" 
            className="header-screenshot"
          />
        </div>
      </section>

      {/* Blockchain Verification Section */}
      <section className="blockchain-section">
        <div className="blockchain-content">
          <h2 className="section-title">Blockchain-Verified Achievement Certificates</h2>
          <p className="blockchain-description">
            Every CIE Spark certificate is secured using cutting-edge blockchain technology. 
            Our certificates are minted as NFTs on the Polygon network, ensuring permanent verification, 
            authenticity, and immutability of your achievements.
          </p>
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">

            <div className="stat-value">{loading ? '...' : stats.totalCertificates}</div>
            <div className="stat-label">Certificates Issued</div>
          </div>
          <div className="stat-card">

            <div className="stat-value">{loading ? '...' : stats.totalStudents}</div>
            <div className="stat-label">Students Recognized</div>
          </div>
          <div className="stat-card">

            <div className="stat-value">{loading ? '...' : stats.totalEvents}</div>
            <div className="stat-label">Events Covered</div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Why Choose CIESpark?</h2>
        <div className="features-grid">
          <div className="feature-card">

            <h3>Blockchain Secured</h3>
            <p>Every certificate is minted as an NFT on Polygon blockchain, ensuring immutability and authenticity.</p>
          </div>
          <div className="feature-card">

            <h3>Instantly Verifiable</h3>
            <p>Verify any certificate instantly using blockchain technology. No intermediaries required.</p>
          </div>
          <div className="feature-card">

            <h3>IPFS Storage</h3>
            <p>Certificates are stored on IPFS, ensuring permanent availability and decentralized hosting.</p>
          </div>
          <div className="feature-card">

            <h3>Fast & Efficient</h3>
            <p>Powered by Polygon network for fast transactions and minimal gas fees.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2025 CIESpark - Blockchain Certificate Verification System</p>
        <p className="footer-tech">Built with React, Node.js, MongoDB & Polygon</p>
      </footer>
    </div>
  );
}

export default Home;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Certificates.css';
import { getApiUrl } from '../config/api';

interface Certificate {
  _id: string;
  srn: string;
  studentName?: string;
  event: string; // Changed from eventName to event
  imageUrl: string; // Changed from certificateUrl to imageUrl
  date?: string; // Changed from issueDate to date
  achievement?: string; // Added achievement field
  projectDescription?: string; // Added projectDescription field
  transactionHash?: string;
  verified?: boolean;
}

function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filteredCertificates, setFilteredCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSRN, setSearchSRN] = useState('');
  const [searchEvent, setSearchEvent] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    filterCertificates();
  }, [searchSRN, searchEvent, certificates]);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(getApiUrl('/api/certificates'));
      const data = await response.json();
      // Filter out certificates with missing event name
      const validCertificates = data.filter((cert: Certificate) => 
        cert.event && cert.event.trim() !== ''
      );
      setCertificates(validCertificates);
      setFilteredCertificates(validCertificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCertificates = () => {
    let filtered = certificates;

    if (searchSRN) {
      filtered = filtered.filter(cert =>
        cert.srn && cert.srn.toLowerCase().includes(searchSRN.toLowerCase())
      );
    }

    if (searchEvent) {
      filtered = filtered.filter(cert =>
        cert.event && cert.event.toLowerCase().includes(searchEvent.toLowerCase())
      );
    }

    setFilteredCertificates(filtered);
  };

  const generateCertificateUrl = (certificate: Certificate) => {
    if (!certificate.event || certificate.event.trim() === '') {
      console.warn('Certificate has no event name:', certificate);
      return '#';
    }
    const normalizedEventName = certificate.event.replace(/\s+/g, '').toLowerCase();
    return `/certificate/${certificate.srn}/${normalizedEventName}`;
  };

  if (loading) {
    return (
      <div className="certificates-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="certificates-page">
      <div className="certificates-header">
        <h1>Certificate Gallery</h1>
        <p>Browse all blockchain-verified certificates by student</p>
      </div>

      <div className="search-section">
        <div className="search-container">
          <div className="search-field">
            <label>Search by SRN</label>
            <input
              type="text"
              placeholder="Enter SRN..."
              value={searchSRN}
              onChange={(e) => setSearchSRN(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-field">
            <label>Search by Event</label>
            <input
              type="text"
              placeholder="Enter event name..."
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              className="search-input"
            />
          </div>
          <button 
            className="clear-btn"
            onClick={() => {
              setSearchSRN('');
              setSearchEvent('');
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="results-count">
          Showing {filteredCertificates.length} of {certificates.length} certificates
        </div>
      </div>

      <div className="certificates-list">
        {filteredCertificates.length === 0 ? (
          <div className="no-results">
            <p>No certificates found matching your search criteria.</p>
          </div>
        ) : (
          <div className="list-container">
            <div className="list-header">
              <span className="header-student">Student Name</span>
              <span className="header-event">Event</span>
              <span className="header-badge">Achievement</span>
              <span className="header-date">Issue Date</span>
            </div>
            {filteredCertificates.map((certificate) => (
              <div key={certificate._id} className="certificate-list-item">
                <div className="student-info">
                  {certificate.event && certificate.event.trim() !== '' ? (
                    <Link 
                      to={generateCertificateUrl(certificate)}
                      className="student-name-link"
                    >
                      {certificate.studentName || 'N/A'}
                    </Link>
                  ) : (
                    <span className="student-name-disabled">
                      {certificate.studentName || 'N/A'}
                    </span>
                  )}
                  <span className="student-srn">SRN: {certificate.srn}</span>
                </div>
                <div className="event-info">
                  <span className="event-name">{certificate.event || 'No Event Name'}</span>
                </div>
                <div className="badge-info">
                  {certificate.achievement && (
                    <span className="badge-pill">{certificate.achievement}</span>
                  )}
                </div>
                <div className="date-info">
                  {certificate.date ? (
                    <span className="issue-date">
                      {certificate.date}
                    </span>
                  ) : (
                    <span className="no-date">N/A</span>
                  )}
                </div>
                {certificate.verified && (
                  <div className="verified-indicator">
                    <span className="verified-badge">✓ Verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Certificates;

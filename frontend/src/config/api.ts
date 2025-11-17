// API Configuration
const API_CONFIG = {
  // Your backend deployment URL
  BACKEND_URL: 'https://cie-sparke-website-lraz.vercel.app',
  
  // API endpoints
  ENDPOINTS: {
    STATS: '/api/stats',
    CERTIFICATES: '/api/certificates',
    CERTIFICATE_BY_ID: '/api/certificates'
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BACKEND_URL}${endpoint}`;
};

export default API_CONFIG;
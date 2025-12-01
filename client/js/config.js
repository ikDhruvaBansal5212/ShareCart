// Environment Configuration
// Change these values based on your deployment environment

const CONFIG = {
  // Backend API URL (change for production)
  API_BASE_URL: 'https://sharecart.onrender.com/api',
  SOCKET_URL: 'https://sharecart.onrender.com',
  
  // For local development, use:
  // API_BASE_URL: 'http://localhost:5000/api',
  // SOCKET_URL: 'http://localhost:5000',
  
  // Environment
  ENV: 'production' // 'development' or 'production'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}

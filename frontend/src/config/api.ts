// API Configuration
// For development (local backend)
const DEV_API_URL = 'http://localhost:5001';

// For production (Firebase hosting)
const PROD_API_URL = '';

// Use environment variable or default based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? PROD_API_URL : DEV_API_URL);

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    ITEMS: '/api/items',
    USERS: '/api/users',
    MESSAGES: '/api/messages',
    UPLOAD: '/api/upload-profile-photo',
    ADMIN: '/api/admin'
  }
};

export default API_CONFIG;

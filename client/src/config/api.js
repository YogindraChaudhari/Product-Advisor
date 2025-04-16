// API base URL configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API endpoint paths
export const ENDPOINTS = {
  ADVICE: `${API_URL}/api/advice`,
  HEALTH: `${API_URL}/health`,
  ACCOUNT: `${API_URL}/api/account`,
};

export default API_URL;
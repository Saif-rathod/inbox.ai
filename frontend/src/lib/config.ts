// Production-first configuration for Vercel deployment
const PRODUCTION_API_URL = 'https://inbox-ai.onrender.com'
const LOCAL_API_URL = 'http://localhost:8000'

// Force production URL for all deployments - only use localhost when explicitly on localhost
export const API_BASE_URL = (typeof window !== 'undefined' && window.location.hostname === 'localhost') 
  ? LOCAL_API_URL 
  : PRODUCTION_API_URL

// Debug logging for deployment
if (typeof window !== 'undefined') {
  console.log('🔧 Hostname:', window.location.hostname)
  console.log('🔧 API_BASE_URL:', API_BASE_URL)
  console.log('🔧 Full URL:', window.location.href)
}

export const API_ENDPOINTS = {
  emails: `${API_BASE_URL}/api/emails`,
  stats: `${API_BASE_URL}/api/stats`,
  fetchEmails: `${API_BASE_URL}/api/fetch-emails`,
  summarizeEmail: (id: number) => `${API_BASE_URL}/api/summarize/${id}`,
}

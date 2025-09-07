// Production-first configuration for Vercel deployment
const PRODUCTION_API_URL = 'https://inbox-ai.onrender.com'
const LOCAL_API_URL = 'http://localhost:8000'

// Force production URL in all environments except explicit development
const isExplicitDev = process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.hostname === 'localhost'

export const API_BASE_URL = isExplicitDev 
  ? LOCAL_API_URL 
  : PRODUCTION_API_URL

// Debug logging (only in development)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  console.log('🔧 API_BASE_URL:', API_BASE_URL)
  console.log('🔧 isExplicitDev:', isExplicitDev)
  console.log('🔧 hostname:', window.location.hostname)
}

export const API_ENDPOINTS = {
  emails: `${API_BASE_URL}/api/emails`,
  stats: `${API_BASE_URL}/api/stats`,
  fetchEmails: `${API_BASE_URL}/api/fetch-emails`,
  summarizeEmail: (id: number) => `${API_BASE_URL}/api/summarize/${id}`,
}

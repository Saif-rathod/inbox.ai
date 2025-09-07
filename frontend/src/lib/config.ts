// Production-first configuration for Netlify deployment
const PRODUCTION_API_URL = 'https://inbox-ai.onrender.com'
const LOCAL_API_URL = 'http://localhost:8000'

// Use production URL as default, fallback to localhost only in development
export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? (process.env.NEXT_PUBLIC_API_URL || LOCAL_API_URL)
  : (process.env.NEXT_PUBLIC_API_URL || PRODUCTION_API_URL)

export const API_ENDPOINTS = {
  emails: `${API_BASE_URL}/api/emails`,
  stats: `${API_BASE_URL}/api/stats`,
  fetchEmails: `${API_BASE_URL}/api/fetch-emails`,
  summarizeEmail: (id: number) => `${API_BASE_URL}/api/summarize/${id}`,
}

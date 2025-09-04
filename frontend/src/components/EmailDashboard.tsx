'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RefreshCw, Download, Clock, User, Calendar, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Email {
  id: number
  sender: string
  subject: string
  received_at: string
  summary?: {
    topic: string
    key_points: string
    action_required: string
    provider: string
  }
}

interface EmailsResponse {
  emails: Email[]
  count: number
}

interface StatsResponse {
  total_emails: number
  total_summaries: number
  today_emails: number
  summary_rate: number
}

const API_BASE = 'http://localhost:8000'

// API functions
const fetchEmails = async (): Promise<EmailsResponse> => {
  const response = await fetch(`${API_BASE}/api/emails`)
  if (!response.ok) throw new Error('Failed to fetch emails')
  return response.json()
}

const fetchStats = async (): Promise<StatsResponse> => {
  const response = await fetch(`${API_BASE}/api/stats`)
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

const fetchNewEmails = async (hours: number, summarize: boolean) => {
  const response = await fetch(`${API_BASE}/api/fetch-emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hours, summarize }),
  })
  if (!response.ok) throw new Error('Failed to fetch new emails')
  return response.json()
}

export default function EmailDashboard() {
  const [fetchHours, setFetchHours] = useState(24)
  const queryClient = useQueryClient()

  const { data: emails, isLoading: emailsLoading, error: emailsError } = useQuery({
    queryKey: ['emails'],
    queryFn: fetchEmails,
  })

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
  })

  const fetchEmailsMutation = useMutation({
    mutationFn: ({ hours, summarize }: { hours: number; summarize: boolean }) =>
      fetchNewEmails(hours, summarize),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['emails'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
    },
  })

  const handleFetchEmails = () => {
    fetchEmailsMutation.mutate({ hours: fetchHours, summarize: true })
  }

  if (emailsError) {
    return (
      <div className="glass rounded-2xl p-6 border border-red-500/30">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
          <p className="text-red-300">
            Error loading emails. Make sure the backend server is running on port 8000.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center fade-in-up">
        <h2 className="text-4xl font-bold text-gradient mb-4">Email Dashboard</h2>
        <p className="text-gray-400 text-lg">Manage and summarize your emails with AI</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass rounded-2xl p-6 hover-glow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-300">Total Emails</h3>
            <div className="w-12 h-12 neon-border-blue rounded-xl flex items-center justify-center group-hover:scale-pulse">
              <span className="text-2xl">📧</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {statsLoading ? '...' : stats?.total_emails || 0}
          </p>
          <p className="text-sm text-gray-400">All time</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-glow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-300">Summarized</h3>
            <div className="w-12 h-12 neon-border-purple rounded-xl flex items-center justify-center group-hover:scale-pulse">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {statsLoading ? '...' : stats?.total_summaries || 0}
          </p>
          <p className="text-sm text-gray-400">Processed emails</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-glow group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-300">Today</h3>
            <div className="w-12 h-12 neon-border-blue rounded-xl flex items-center justify-center group-hover:scale-pulse">
              <span className="text-2xl">📅</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {statsLoading ? '...' : stats?.today_emails || 0}
          </p>
          <p className="text-sm text-gray-400">New emails</p>
        </div>

        <div className="glass rounded-2xl p-6 hover-glow group">
          <div className="flex items-center justify-between mb-4">{/* ...existing code... */}
            <h3 className="font-semibold text-gray-300">Success Rate</h3>
            <div className="w-12 h-12 neon-border-purple rounded-xl flex items-center justify-center group-hover:scale-pulse">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {statsLoading ? '...' : `${stats?.summary_rate || 0}%`}
          </p>
          <p className="text-sm text-gray-400">Processing accuracy</p>
        </div>
      </div>

      {/* Actions */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <label htmlFor="hours" className="text-sm font-medium text-gray-300">
                Fetch emails from last:
              </label>
              <select
                id="hours"
                value={fetchHours}
                onChange={(e) => setFetchHours(Number(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value={1} className="bg-gray-900 text-white">1 hour</option>
                <option value={6} className="bg-gray-900 text-white">6 hours</option>
                <option value={12} className="bg-gray-900 text-white">12 hours</option>
                <option value={24} className="bg-gray-900 text-white">24 hours</option>
                <option value={48} className="bg-gray-900 text-white">48 hours</option>
                <option value={168} className="bg-gray-900 text-white">1 week</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleFetchEmails}
            disabled={fetchEmailsMutation.isPending}
            className="group btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetchEmailsMutation.isPending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            )}
            {fetchEmailsMutation.isPending ? 'Fetching...' : 'Fetch & Summarize'}
          </button>
        </div>

        {fetchEmailsMutation.isSuccess && (
          <div className="mt-4 p-4 glass border border-green-500/30 rounded-lg">
            <p className="text-green-400 text-sm flex items-center">
              <span className="mr-2">✅</span>
              Successfully fetched and processed emails!
            </p>
          </div>
        )}

        {fetchEmailsMutation.isError && (
          <div className="mt-4 p-4 glass border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm flex items-center">
              <span className="mr-2">❌</span>
              Error fetching emails. Please try again.
            </p>
          </div>
        )}
      </div>

      {/* Email List */}
      <div className="glass rounded-2xl">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Emails</h2>
              <p className="text-gray-400 text-sm">
                {emailsLoading ? 'Loading...' : `${emails?.count || 0} emails found`}
              </p>
            </div>
            <div className="w-12 h-12 neon-border-blue rounded-xl flex items-center justify-center float-animation">
              <span className="text-2xl">📬</span>
            </div>
          </div>
        </div>

        <div className="divide-y divide-white/10">{emailsLoading ? (
            <div className="p-8 text-center text-gray-400">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
              </div>
              Loading emails...
            </div>
          ) : emails?.emails?.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="w-12 h-12 glass rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📭</span>
              </div>
              <p className="font-medium mb-2 text-white">No emails found</p>
              <p className="text-sm">Try fetching some emails first using the button above.</p>
            </div>
          ) : (
            emails?.emails?.map((email) => (
              <EmailCard key={email.id} email={email} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

function EmailCard({ email }: { email: Email }) {
  return (
    <div className="p-6 hover:bg-white/5 transition-all duration-200 group">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 neon-border-blue rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {email.sender}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-3 h-3 text-gray-400" />
                <p className="text-xs text-gray-400">
                  {formatDistanceToNow(new Date(email.received_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 leading-tight group-hover:text-gradient transition-colors duration-300">
            {email.subject}
          </h3>
        </div>

        {email.summary && (
          <div className="lg:max-w-md dark-glass p-5 rounded-xl border border-white/10 hover-glow">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-1">📋 Topic</h4>
                <p className="text-sm text-gray-300 leading-relaxed">{email.summary.topic}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-purple-400 mb-1">💡 Key Points</h4>
                <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                  {email.summary.key_points}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-cyan-400 mb-2">⚡ Action Required</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  email.summary.action_required.toLowerCase().includes('yes') || email.summary.action_required.toLowerCase().includes('action')
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {email.summary.action_required}
                </span>
              </div>
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 flex items-center">
                  <span className="mr-1">🤖</span>
                  Summarized by {email.summary.provider}
                </p>
              </div>
            </div>
          </div>
        )}

        {!email.summary && (
          <div className="lg:max-w-md glass p-5 rounded-xl border border-yellow-500/30">
            <div className="text-center">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-yellow-400 text-lg">📝</span>
              </div>
              <p className="text-sm text-yellow-300 font-medium mb-1">Summary Pending</p>
              <p className="text-xs text-yellow-400">This email hasn&apos;t been processed yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import Footer from '@/components/Footer'
import EmailDashboard from '@/components/EmailDashboard'
import ChatInterface from '@/components/ChatInterface'
import TestimonialsSection from '@/components/TestimonialsSection'
import PricingSection from '@/components/PricingSection'
import LoginScreen from '@/components/LoginScreen'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'emails' | 'chat' | 'stats'>('home')
  const { isAuthenticated } = useAuth()

  // Show login screen if trying to access protected content without authentication
  if (!isAuthenticated && ['emails', 'chat', 'stats'].includes(activeTab)) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        <LoginScreen />
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="min-h-screen">
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'home' && (
            <>
              <HeroSection />
              <TestimonialsSection />
              <PricingSection />
            </>
          )}
          {activeTab === 'emails' && isAuthenticated && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <EmailDashboard />
            </div>
          )}
          {activeTab === 'chat' && isAuthenticated && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ChatInterface />
            </div>
          )}
          {activeTab === 'stats' && isAuthenticated && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <StatsView />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

function StatsView() {
  // Use the same API functions as EmailDashboard
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const response = await fetch('http://localhost:8000/api/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      return response.json()
    },
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center fade-in-up">
        <h2 className="text-4xl font-bold text-gradient mb-4">Email Analytics</h2>
        <p className="text-gray-400 text-lg">Insights into your email management performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="w-12 h-12 neon-border-blue rounded-xl flex items-center justify-center group-hover:scale-pulse">
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-300">Success Rate</h3>
            <div className="w-12 h-12 neon-border-blue rounded-xl flex items-center justify-center group-hover:scale-pulse">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="text-4xl font-bold text-white mb-2">
            {statsLoading ? '...' : `${Math.round(stats?.summary_rate || 0)}%`}
          </p>
          <p className="text-sm text-gray-400">Processing accuracy</p>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="glass rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-8">Performance Overview</h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activity Chart Placeholder */}
          <div className="dark-glass rounded-xl p-6 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 neon-border-blue rounded-full flex items-center justify-center mx-auto mb-4 float-animation">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="font-semibold text-white mb-2">Email Activity</h4>
              <p className="text-gray-400 text-sm">Interactive charts coming soon</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white text-lg">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-4 dark-glass rounded-lg hover-glow">
                <div className="w-10 h-10 neon-border-blue rounded-full flex items-center justify-center">
                  <span className="text-blue-400">📧</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Email fetching ready</p>
                  <p className="text-xs text-gray-400">Backend connected</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 dark-glass rounded-lg hover-glow">
                <div className="w-10 h-10 neon-border-purple rounded-full flex items-center justify-center">
                  <span className="text-purple-400">✨</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">AI summarization active</p>
                  <p className="text-xs text-gray-400">Ready to process emails</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 dark-glass rounded-lg hover-glow">
                <div className="w-10 h-10 neon-border-blue rounded-full flex items-center justify-center">
                  <span className="text-cyan-400">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Chat interface available</p>
                  <p className="text-xs text-gray-400">Ask questions about your emails</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

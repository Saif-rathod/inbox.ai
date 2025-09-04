'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Zap, Shield, Clock, ArrowRight, Play } from 'lucide-react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      description: 'Get intelligent summaries of your emails instantly with advanced AI technology',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Smart Insights',
      description: 'Chat with your emails and get actionable insights that matter',
      color: 'darkBlue'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays private with enterprise-grade local processing',
      color: 'lightBlue'
    },
    {
      icon: Clock,
      title: 'Real-time Updates',
      description: 'Stay updated with live email synchronization across all devices',
      color: 'skyBlue'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      darkBlue: 'from-blue-700 to-blue-800',
      lightBlue: 'from-blue-400 to-blue-500',
      skyBlue: 'from-sky-500 to-blue-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <section className="relative min-h-screen bg-black overflow-hidden flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-700/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              <span className="text-gradient neon-text">
                AI that reads your emails,
              </span>
              <br />
              so you don&apos;t have to
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-6 mb-16 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <button className="group btn-primary text-lg px-8 py-4 flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button className="group btn-secondary text-lg px-8 py-4 flex items-center">
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="text-gray-400 text-sm mb-6">Trusted by professionals at</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              {['Google', 'Microsoft', 'Apple', 'Meta', 'Amazon'].map((company, index) => (
                <div key={company} className="text-2xl font-bold text-gray-600 hover:text-gray-400 transition-colors duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                  {company}
                </div>
              ))}
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div
                  key={index}
                  className={`group glass rounded-3xl p-8 hover-glow transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{ animationDelay: `${800 + index * 200}ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(feature.color)} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 float-animation`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-gradient transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Stats Section */}
          <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2 neon-text">10,000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2 neon-text">1M+</div>
              <div className="text-gray-400">Emails Processed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-2 neon-text">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-blue-500 to-blue-700 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}

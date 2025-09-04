'use client'

import { Github, Twitter, Linkedin, Heart, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'AI Chat', href: '#chat' },
      { name: 'Analytics', href: '#analytics' },
      { name: 'API Reference', href: '#api' },
    ],
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' },
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Documentation', href: '#docs' },
      { name: 'Status', href: '#status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'GDPR', href: '#gdpr' },
    ],
  }

  const socialLinks = [
    { name: 'GitHub', icon: Github, href: '#github', color: 'hover:text-gray-300' },
    { name: 'Twitter', icon: Twitter, href: '#twitter', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, href: '#linkedin', color: 'hover:text-blue-500' },
  ]

  return (
    <footer className="relative bg-black border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center p-1">
                <Image
                  src="/logo.png"
                  alt="InboxPrism Logo"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                  style={{ background: 'transparent' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">InboxPrism</h3>
                <p className="text-blue-400 text-sm flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI Email Assistant
                </p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
              Transform your email experience with AI-powered summarization and intelligent chat capabilities.
              Stay organized and never miss important information with InboxPrism.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`w-12 h-12 glass rounded-xl flex items-center justify-center text-gray-400 ${item.color} hover-glow transition-all duration-300 group`}
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div className="fade-in-up">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Product
            </h4>
            <ul className="space-y-4">
              {links.product.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Company
            </h4>
            <ul className="space-y-4">
              {links.company.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Support
            </h4>
            <ul className="space-y-4">
              {links.support.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center">
              <span className="w-2 h-2 bg-blue-700 rounded-full mr-2"></span>
              Legal
            </h4>
            <ul className="space-y-4">
              {links.legal.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 transform inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="glass rounded-2xl p-8 mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
            <p className="text-gray-400 mb-6">
              Get the latest updates on new features and AI advancements in email management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors duration-200"
              />
              <button className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} InboxPrism. All rights reserved.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-blue-400 text-sm">All systems operational</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm flex items-center">
              Made with <Heart className="w-4 h-4 text-blue-500 mx-2 animate-pulse" /> for better email management
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

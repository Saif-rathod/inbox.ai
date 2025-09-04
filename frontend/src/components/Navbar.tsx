"use client";

import React from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = ({ activeTab, setActiveTab }: { activeTab?: string; setActiveTab?: (tab: 'home' | 'emails' | 'chat' | 'stats') => void }) => {
  const { isAuthenticated, logout } = useAuth();

  const handleNavClick = (tab: 'home' | 'emails' | 'chat' | 'stats') => {
    if (setActiveTab) {
      setActiveTab(tab)
    }
  }

  const handleLogout = () => {
    logout();
    if (setActiveTab) {
      setActiveTab('home');
    }
  }

  return (
    <nav className="hero-nav">
      <div className="hero-nav-content">
        <button onClick={() => handleNavClick('home')} className="hero-logo">
          <div className="logo-icon">
            <Image
              src="/logo.png"
              alt="EmailAgent Logo"
              width={60}
              height={60}
              className="rounded-full object-cover"
              style={{ background: 'transparent' }}
              priority
            />
          </div>
        <span className="ml-2 font-bold text-3xl">Inbox</span>
        </button>

        <div className="hero-nav-links">
          <button
            onClick={() => handleNavClick('home')}
            className={`nav-link ${activeTab === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick('emails')}
            className={`nav-link ${activeTab === 'emails' ? 'active' : ''} ${!isAuthenticated && ['emails'].includes(activeTab || '') ? 'opacity-50' : ''}`}
            title={!isAuthenticated ? 'Login required to access emails' : ''}
          >
            Emails {!isAuthenticated && <span className="text-xs ml-1">🔒</span>}
          </button>
          <button
            onClick={() => handleNavClick('chat')}
            className={`nav-link ${activeTab === 'chat' ? 'active' : ''} ${!isAuthenticated && ['chat'].includes(activeTab || '') ? 'opacity-50' : ''}`}
            title={!isAuthenticated ? 'Login required to access chat' : ''}
          >
            Chat {!isAuthenticated && <span className="text-xs ml-1">🔒</span>}
          </button>
          <button
            onClick={() => handleNavClick('stats')}
            className={`nav-link ${activeTab === 'stats' ? 'active' : ''} ${!isAuthenticated && ['stats'].includes(activeTab || '') ? 'opacity-50' : ''}`}
            title={!isAuthenticated ? 'Login required to access analytics' : ''}
          >
            Analytics {!isAuthenticated && <span className="text-xs ml-1">🔒</span>}
          </button>

          {/* Authentication Status */}
          <div className="nav-link-spacer">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="nav-link bg-blue-900/30 hover:bg-blue-800/50 px-3 py-1 rounded-lg transition-all border border-blue-700/50"
                title="Logout from admin panel"
              >
                <span className="text-green-400 mr-2">●</span>
                Admin
                <span className="text-xs ml-2">🚪</span>
              </button>
            ) : (
              <div className="nav-link opacity-70 cursor-default px-3 py-1">
                <span className="text-gray-500 mr-2">●</span>
                Guest
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

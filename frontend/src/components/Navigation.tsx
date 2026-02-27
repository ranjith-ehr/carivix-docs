import { Menu, X, Users, Info, Zap, DollarSign, Twitter, Linkedin, Instagram, Facebook, MessageSquare, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';
import { User } from '../services/authService';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
  currentUser?: User | null;
  onLogout: () => void;
  showCommunityModal: boolean;
  setShowCommunityModal: (show: boolean) => void;
}

export default function Navigation({
  currentPage,
  onNavigate,
  isLoggedIn,
  currentUser,
  onLogout,
  showCommunityModal,
  setShowCommunityModal
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        localStorage.getItem('theme') === 'dark';
    }
    return true;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleCommunityClick = () => {
    setShowCommunityModal(true);
  };

  return (
    <>
      <nav className="bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--border-color)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="p-1 transition-transform group-hover:scale-110">
                <img
                  src="/logo.png"
                  alt="CARIVIX Logo"
                  className="w-12 h-12 object-contain rounded-lg"
                />
              </div>
              <span className="text-2xl font-black font-gravix bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] bg-clip-text text-transparent tracking-tighter">
                CARIVIX
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-10">
              <button
                onClick={handleCommunityClick}
                className={`flex items-center space-x-2 text-sm font-bold tracking-widest uppercase transition-all ${currentPage === 'community' ? 'text-[#14b8a6]' : 'text-[var(--text-secondary)] hover:text-[#14b8a6]'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Community</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`flex items-center space-x-2 text-sm font-bold tracking-widest uppercase transition-all ${currentPage === 'about' ? 'text-[#14b8a6]' : 'text-[var(--text-secondary)] hover:text-[#14b8a6]'
                  }`}
              >
                <Info className="w-4 h-4" />
                <span>About</span>
              </button>
              <button
                onClick={() => onNavigate('features')}
                className={`flex items-center space-x-2 text-sm font-bold tracking-widest uppercase transition-all ${currentPage === 'features' ? 'text-[#14b8a6]' : 'text-[var(--text-secondary)] hover:text-[#14b8a6]'
                  }`}
              >
                <Zap className="w-4 h-4" />
                <span>Features</span>
              </button>
              <button
                onClick={() => onNavigate('pricing')}
                className={`flex items-center space-x-2 text-sm font-bold tracking-widest uppercase transition-all ${currentPage === 'pricing' ? 'text-[#14b8a6]' : 'text-[var(--text-secondary)] hover:text-[#14b8a6]'
                  }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>Pricing</span>
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-6">

              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-[var(--border-color)] text-[var(--text-secondary)] hover:text-[#14b8a6] transition-all"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('profile')}
                    className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)] hover:text-[#14b8a6] transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={onLogout}
                    className="px-6 py-2.5 text-xs font-black tracking-widest uppercase text-[var(--text-primary)] border border-[var(--border-color)] rounded-xl hover:bg-[#14b8a6]/10 transition-all font-gravix"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => onNavigate('login')}
                    className="text-sm font-bold tracking-widest uppercase text-[var(--text-secondary)] hover:text-[#14b8a6] transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => onNavigate('signup')}
                    className="px-6 py-2.5 text-xs font-black tracking-widest uppercase text-white bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] rounded-xl hover:scale-105 transition-all shadow-lg shadow-[#14b8a6]/20"
                  >
                    Get Started
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--border-color)] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
            <div className="px-6 py-8 space-y-6">
              <button onClick={handleCommunityClick} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                Community
              </button>
              <button onClick={() => onNavigate('about')} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                About
              </button>
              <button onClick={() => onNavigate('features')} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                Features
              </button>
              <button onClick={() => onNavigate('pricing')} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                Pricing
              </button>
              <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
                {isLoggedIn ? (
                  <>
                    <button onClick={() => onNavigate('profile')} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                      Profile
                    </button>
                    <button onClick={onLogout} className="block w-full px-6 py-4 text-center font-black tracking-widest uppercase text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl">
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => onNavigate('login')} className="block w-full text-left text-lg font-bold text-[var(--text-secondary)] hover:text-[#14b8a6]">
                      Sign In
                    </button>
                    <button onClick={() => onNavigate('signup')} className="block w-full px-6 py-4 text-center font-black tracking-widest uppercase text-white bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] rounded-2xl">
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>


      {showCommunityModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowCommunityModal(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-3xl shadow-2xl max-w-md w-full p-8 border border-[var(--border-color)] relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="flex justify-between items-center mb-8 relative z-10">
              <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight uppercase">Community</h2>
              <button onClick={() => setShowCommunityModal(false)} className="p-2 hover:bg-[var(--bg-primary)] rounded-xl transition-colors border border-transparent hover:border-[var(--border-color)]">
                <X className="w-5 h-5 text-[var(--text-secondary)]" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Connect With Us</h3>
                <div className="grid grid-cols-2 gap-3">
                  <a href="https://www.linkedin.com/in/carivix-ai-70a90b372/" target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-blue-700/50 hover:bg-blue-700/5 transition-all group">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">LinkedIn</span>
                  </a>
                  <a href="https://discord.com/invite/nsT9tT5k" target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all group">
                    <MessageSquare className="w-5 h-5 text-indigo-500" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Discord</span>
                  </a>
                  <a href="https://www.instagram.com/carivix.ai/?__pwa=1#" target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-pink-500/50 hover:bg-pink-500/5 transition-all group">
                    <Instagram className="w-5 h-5 text-pink-500" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Instagram</span>
                  </a>
                  <a href="https://x.com/CarivixAi/status/1985709520639967701" target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-blue-400/50 hover:bg-blue-400/5 transition-all group">
                    <Twitter className="w-5 h-5 text-blue-400" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Twitter</span>
                  </a>
                  <a href="https://www.facebook.com/people/Carivix-Ai/pfbid0TULF442DE9ktRBymVKcmTPqRpBxvtxSk8BxAvyfKKzeG4ekJaNLJJfBNMv9ap5Fnl/?rdid=m4huM9cb3cnSYCui&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1QqGJfKWNx%2F" target="_blank" rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-blue-600/50 hover:bg-blue-600/5 transition-all group">
                    <Facebook className="w-5 h-5 text-blue-600" />
                    <span className="text-xs font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">Facebook</span>
                  </a>
                  <div className="flex items-center space-x-3 p-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl">
                    <div className="flex flex-col items-start min-w-0">
                      <span className="text-[10px] font-black text-[var(--text-primary)] truncate w-full">{isLoggedIn && currentUser?.name || 'Portal'}</span>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 ml-1">Resources</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowCommunityModal(false);
                      onNavigate('docs');
                    }}
                    className="w-full text-left block p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-[#14b8a6]/50 hover:bg-[#14b8a6]/5 transition-all group"
                  >
                    <div className="font-black text-[var(--text-primary)] uppercase tracking-wider text-xs group-hover:text-[#14b8a6]">Documentation</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">Learn how to use CARIVIX AI</div>
                  </button>
                  <a href="#" className="block p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                    <div className="font-black text-[var(--text-primary)] uppercase tracking-wider text-xs group-hover:text-blue-500">API Reference</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">Integrate with our platform</div>
                  </a>
                  <a href="#" className="block p-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl hover:border-[#0ea5e9]/50 hover:bg-[#0ea5e9]/5 transition-all group">
                    <div className="font-black text-[var(--text-primary)] uppercase tracking-wider text-xs group-hover:text-[#0ea5e9]">Support</div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">Get help from our team</div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

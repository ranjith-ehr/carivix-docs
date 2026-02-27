import { useState, useEffect } from 'react';
import { User, Mail, Shield, Bell, Zap, Globe, Lock, CreditCard, Activity, History, Plus } from 'lucide-react';
import { authService, User as UserType } from '../services/authService';
import { chatService } from '../services/chatService';

interface ProfileProps {
  onNavigate?: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: 'Acme Corporation',
    title: 'Data Analyst'
  });

  const [preferences, setPreferences] = useState(() => {
    const saved = localStorage.getItem('app-preferences');
    // Prioritize the actual current theme state
    const currentTheme = localStorage.getItem('theme') ||
      (document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed, theme: currentTheme };
    }

    return {
      theme: currentTheme,
      notifications: true,
      language: 'English',
      twoFactor: false
    };
  });

  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);
  const [stats, setStats] = useState({ analyses: 0, files: 0, uptime: '0%' });
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
      if (savedAvatar) setAvatar(savedAvatar);
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem(`avatar_${user.id}`, base64String);
          setAvatar(base64String);
          showToast('Avatar updated successfully!');
        } catch (e) {
          console.error('Storage quota exceeded', e);
          showToast('Image too large to save', 'error');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    localStorage.setItem('app-preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Sync theme with document
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (preferences.theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else if (preferences.theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [preferences.theme]);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        setFormData({
          name: currentUser.name || '',
          email: currentUser.email || '',
          company: currentUser.company || 'Acme Corporation',
          title: currentUser.title || 'Data Analyst'
        });

        // Load stats
        const userStats = await chatService.getUserStats();
        setStats(userStats);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    setIsEditing(false);
    if (user) {
      try {
        const updatedUser = await authService.updateProfile({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          title: formData.title
        });
        setUser(updatedUser);
        showToast('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile', error);
        showToast('Failed to update profile', 'error');
      }
    }
  };

  const handleSignOutAll = async () => {
    if (confirm('Are you sure you want to sign out from all devices?')) {
      try {
        await authService.signOutAll();
        showToast('Signed out from all devices');
        // The user will be signed out locally too
        window.location.reload();
      } catch (error) {
        showToast('Failed to sign out all sessions', 'error');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('CRITICAL: Are you sure you want to deactivate your account? This action cannot be undone.')) {
      try {
        await authService.deleteAccount();
        showToast('Account deactivated');
        window.location.reload();
      } catch (error) {
        showToast('Failed to deactivate account', 'error');
      }
    }
  };

  if (!user) return <div>Loading...</div>;

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'history', label: 'History', icon: Activity },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-[var(--text-primary)] mb-2 tracking-tighter uppercase font-gravix">Settings</h1>
            <p className="text-[var(--text-secondary)] font-medium">Manage your account and app preferences</p>
          </div>
          {message && (
            <div className={`px-4 py-2 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-4 ${message.type === 'success' ? 'bg-[#14b8a6]/20 text-[#14b8a6]' : 'bg-red-500/20 text-red-500'
              }`}>
              {message.text}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all font-gravix uppercase tracking-widest text-xs font-black ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-[var(--bg-secondary)]/50 text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-color)]'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'account' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Profile Section */}
                <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-xl border border-[var(--border-color)] p-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative group">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center transform group-hover:scale-105 transition-all shadow-xl shadow-blue-500/20 relative overflow-hidden">
                        {avatar ? (
                          <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <input
                        type="file"
                        id="avatar-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-2 -right-2 bg-[var(--bg-secondary)] p-2 rounded-lg shadow-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-600 cursor-pointer"
                      >
                        <Activity className="w-4 h-4" />
                      </label>
                    </div>
                    <div className="relative z-10">
                      <h2 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">{user.name}</h2>
                      <div className="flex items-center mt-1 space-x-2">
                        <span className="px-3 py-1 bg-[#14b8a6]/10 text-[#14b8a6] text-[10px] font-black rounded-full uppercase tracking-widest">PRO PLAN</span>
                        <span className="text-[var(--text-secondary)] text-sm italic opacity-60">Joined February 2024</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Full Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!isEditing}
                          className="w-full px-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] disabled:opacity-60 transition-all font-bold text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Email Address</label>
                        <div className="relative">
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            disabled={!isEditing}
                            className="w-full pl-12 pr-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] disabled:opacity-60 transition-all font-bold text-[var(--text-primary)]"
                          />
                          <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 relative z-10">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Company</label>
                        <input
                          type="text"
                          value={formData.company}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] disabled:opacity-60 transition-all font-bold text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Title</label>
                        <input
                          type="text"
                          value={formData.title}
                          disabled={!isEditing}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] disabled:opacity-60 transition-all font-bold text-[var(--text-primary)]"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex space-x-3 relative z-10">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSave}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-8 py-4 bg-[var(--bg-primary)] text-[var(--text-secondary)] rounded-2xl font-black uppercase tracking-widest text-xs border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-all"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-8 py-4 bg-transparent border-2 border-blue-600 text-blue-600 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-blue-500/10"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Stats Section */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Analyses Run', value: stats.analyses.toLocaleString(), icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                    { label: 'Files Exported', value: stats.files.toLocaleString(), icon: CreditCard, color: 'text-teal-500', bg: 'bg-teal-500/10' },
                    { label: 'System Uptime', value: stats.uptime, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' }
                  ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="bg-[var(--bg-secondary)] p-6 rounded-[2rem] border border-[var(--border-color)] shadow-xl text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                        <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 relative z-10 transition-transform group-hover:scale-110`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <p className="text-3xl font-black text-[var(--text-primary)] relative z-10 tracking-tight">{stat.value}</p>
                        <p className="text-[10px] text-[var(--text-secondary)] font-black uppercase mt-1 relative z-10 tracking-[0.2em]">{stat.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-xl border border-[var(--border-color)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-8 flex items-center tracking-tight relative z-10 uppercase">
                  <Lock className="w-6 h-6 mr-3 text-red-500" />
                  Security Center
                </h3>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between p-6 bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-color)] shadow-inner">
                    <div>
                      <p className="font-black text-[var(--text-primary)] uppercase tracking-wider text-sm">Two-Factor Auth</p>
                      <p className="text-sm text-[var(--text-secondary)] font-medium">Add an extra layer of security to your account.</p>
                    </div>
                    <button
                      onClick={() => setPreferences({ ...preferences, twoFactor: !preferences.twoFactor })}
                      className={`w-12 h-6 rounded-full transition-all relative ${preferences.twoFactor ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.twoFactor ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-color)] shadow-inner">
                    <div>
                      <p className="font-black text-[var(--text-primary)] uppercase tracking-wider text-sm">Active Sessions</p>
                      <p className="text-sm text-[var(--text-secondary)] font-medium">Currently logged in on 3 devices.</p>
                    </div>
                    <button
                      onClick={handleSignOutAll}
                      className="text-[#14b8a6] font-black text-xs uppercase tracking-widest hover:underline"
                    >
                      Revoke All
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleDeleteAccount}
                      className="text-red-500 font-black bg-red-500/10 px-8 py-4 rounded-2xl hover:bg-red-500/20 transition-all text-xs uppercase tracking-widest"
                    >
                      Deactivate Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-[var(--bg-secondary)] rounded-[2.5rem] shadow-xl border border-[var(--border-color)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <h3 className="text-xl font-black text-[var(--text-primary)] mb-8 flex items-center tracking-tight relative z-10 uppercase">
                  <Globe className="w-6 h-6 mr-3 text-teal-500" />
                  App Settings
                </h3>

                <div className="space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Display Theme</label>
                      <select
                        value={preferences.theme}
                        onChange={(e) => {
                          setPreferences({ ...preferences, theme: e.target.value });
                          showToast(`Theme changed to ${e.target.value}`);
                        }}
                        className="w-full px-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] text-[var(--text-primary)] font-bold appearance-none"
                      >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">System Default</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Language</label>
                      <select
                        value={preferences.language}
                        onChange={(e) => {
                          setPreferences({ ...preferences, language: e.target.value });
                          showToast(`Language set to ${e.target.value}`);
                        }}
                        className="w-full px-4 py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#14b8a6] text-[var(--text-primary)] font-bold appearance-none"
                      >
                        <option>English</option>
                        <option>Spanish</option>
                        <option>German</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[#14b8a6]/5 rounded-[2.5rem] border border-[#14b8a6]/10 shadow-inner">
                    <div>
                      <p className="font-black text-[#14b8a6] uppercase tracking-wider text-sm">Push Notifications</p>
                      <p className="text-sm text-[var(--text-secondary)] font-medium">Receive alerts directly on your computer.</p>
                    </div>
                    <button
                      onClick={() => {
                        const newVal = !preferences.notifications;
                        setPreferences({ ...preferences, notifications: newVal });
                        showToast(`Notifications ${newVal ? 'Enabled' : 'Disabled'}`);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${preferences.notifications ? 'bg-teal-600' : 'bg-gray-300'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${preferences.notifications ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-[var(--bg-secondary)] rounded-2xl shadow-xl border border-[var(--border-color)] p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center">
                    <History className="w-5 h-5 mr-3 text-[#14b8a6]" />
                    Login Activity
                  </h3>
                  <button
                    onClick={() => onNavigate?.('history')}
                    className="text-sm font-bold text-[#14b8a6] hover:underline"
                  >
                    View Full History
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-[var(--text-secondary)]">Your recent login sessions and locations are tracked for security purposes.</p>
                  <div className="p-12 bg-[var(--bg-primary)] rounded-[2rem] border border-[var(--border-color)] text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-[#14b8a6]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110 duration-500">
                        <Activity className="w-8 h-8 text-[#14b8a6]" />
                      </div>
                      <p className="text-[var(--text-primary)] font-black text-lg">Active Session Tracking</p>
                      <p className="text-[var(--text-secondary)] text-sm max-w-xs mx-auto mt-2">We monitor coordinates and login times to help protect your account from unauthorized access.</p>
                      <button
                        onClick={() => onNavigate?.('history')}
                        className="mt-8 px-10 py-4 bg-gradient-to-r from-[#14b8a6] to-[#0ea5e9] text-white rounded-2xl font-black text-sm shadow-xl shadow-[#14b8a6]/20 hover:scale-105 transition-all"
                      >
                        View Detailed Timeline
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}

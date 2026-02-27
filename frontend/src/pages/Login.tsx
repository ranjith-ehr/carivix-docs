import { useState } from 'react';
import { Mail, Lock, MapPin, ArrowRight, Loader2 } from 'lucide-react';
import { authService, User } from '../services/authService';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
}

export default function Login({ onLogin, onNavigate }: LoginProps) {
  const [email, setEmail] = useState(localStorage.getItem('lastEmail') || '');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    localStorage.setItem('lastEmail', value);
  };
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const [isUsingIPFallback, setIsUsingIPFallback] = useState(false);

  const fetchLocationByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      if (data.latitude && data.longitude) {
        setLocation({
          lat: data.latitude,
          lng: data.longitude
        });
        setIsUsingIPFallback(true);
        return true;
      }
    } catch (e) {
      console.error('IP location fallback failed:', e);
    }
    return false;
  };

  const handleGetLocation = () => {
    setGettingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let message = 'Unable to retrieve your location';

        // Attempt IP-based fallback if native positioning fails
        if (error.code === error.POSITION_UNAVAILABLE || error.code === error.TIMEOUT) {
          fetchLocationByIP().then(success => {
            if (success) {
              setLocationError('');
            } else {
              setLocationError('Unable to detect location via GPS or IP. Please check your connection.');
            }
            setGettingLocation(false);
          });
          return;
        }

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Action denied. Please enable location permissions in your browser settings to continue.';
            break;
        }
        setLocationError(message);
        setGettingLocation(false);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!location) {
      setError('Location access is mandatory to log in for security reasons. Please share your location first.');
      setIsLoading(false);
      return;
    }

    try {
      const user = await authService.login(email, password, location);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-mesh flex items-center justify-center p-4 transition-colors duration-300 relative overflow-hidden">
      <div className="absolute inset-0 bg-circuit-pattern opacity-[0.03] pointer-events-none"></div>
      <div className="absolute inset-0 bg-dot-pattern opacity-[0.1] pointer-events-none"></div>
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#14b8a6]/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#0ea5e9]/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="bg-[var(--bg-secondary)]/80 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-8 border border-[var(--border-color)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-teal-600 to-green-600"></div>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-gravix bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-[var(--text-secondary)] text-sm">Sign in to access your analytics dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[var(--text-primary)]"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-xs font-medium text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[var(--text-primary)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-[var(--text-secondary)] ml-1">Location Detection</label>
              {location && <span className="text-xs text-green-600 font-medium">Location Detected ✓</span>}
            </div>
            <button
              type="button"
              onClick={handleGetLocation}
              className={`w-full flex items-center justify-center space-x-2 py-3 rounded-xl border transition-all ${location
                ? 'bg-green-500/10 border-green-500/20 text-green-600'
                : 'bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-blue-300'
                }`}
            >
              {gettingLocation ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <MapPin className={`w-5 h-5 ${location ? 'text-green-600' : 'text-gray-400'}`} />
              )}
              <span className="text-sm font-medium">
                {gettingLocation ? 'Detecting...' : location ? 'Update Location' : 'Share My Location'}
              </span>
            </button>
            {locationError && <p className="text-xs text-red-500 ml-1">{locationError}</p>}
            {location && (
              <p className="text-xs text-gray-400 ml-1 text-center">
                {isUsingIPFallback ? 'Approximate Location (IP): ' : 'GPS Location: '}
                Lat {location.lat.toFixed(4)}, Long {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span className="font-semibold">Sign In</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              className="text-blue-600 font-medium hover:underline"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';

import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Documentation from './pages/Documentation';
import LoginHistory from './pages/LoginHistory';
import { authService, User } from './services/authService';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showLandingOnHome, setShowLandingOnHome] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setIsLoggedIn(true);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };
    checkUser();
  }, []);

  const handleLogin = (user?: User) => {
    setIsLoggedIn(true);
    if (user) {
      setCurrentUser(user);
    } else {
      authService.getCurrentUser().then(u => setCurrentUser(u));
    }
    setCurrentPage('home');
    setShowLandingOnHome(false);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
    setShowLandingOnHome(true);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      setShowLandingOnHome(true);
    } else {
      setShowLandingOnHome(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home
            isLoggedIn={isLoggedIn}
            forceLanding={showLandingOnHome}
            onOpenChat={() => {
              if (isLoggedIn) {
                setShowLandingOnHome(false);
              } else {
                setCurrentPage('login');
              }
            }}
          />
        );
      case 'about':
        return <About />;
      case 'features':
        return <Features />;
      case 'pricing':
        return <Pricing />;
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <Signup onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'forgot-password':
        return <ForgotPassword onNavigate={handleNavigate} />;
      case 'profile':
        return isLoggedIn ? <Profile onNavigate={handleNavigate} /> : <Home isLoggedIn={false} />;
      case 'docs':
        return <Documentation onBack={() => handleNavigate('home')} />;
      case 'history':
        return isLoggedIn ? <LoginHistory onBack={() => handleNavigate('profile')} /> : <Home isLoggedIn={false} />;
      default:
        return (
          <Home
            isLoggedIn={isLoggedIn}
            forceLanding={showLandingOnHome}
            onOpenChat={() => {
              if (isLoggedIn) {
                setShowLandingOnHome(false);
              } else {
                setCurrentPage('login');
              }
            }}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        showCommunityModal={showCommunityModal}
        setShowCommunityModal={setShowCommunityModal}
      />
      {renderPage()}
    </div>
  );
}

export default App;

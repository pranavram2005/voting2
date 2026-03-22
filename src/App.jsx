import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import SimpleDataViewer from './SimpleDataViewer';
import Header from './Header';
import HomePage from './Home';
import AddBoothAgent from './AddBoothAgent';
import ConfirmationsAdmin from './ConfirmationsAdmin';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [currentPage, setCurrentPage] = useState('home');
  const [languageMode, setLanguageMode] = useState('tamil'); // 'tamil' or 'english'

  // Toggle language function
  const toggleLanguage = () => {
    setLanguageMode(prev => prev === 'tamil' ? 'english' : 'tamil');
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

      // Handle URL routing for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      const handlePopState = () => {
        const path = window.location.pathname;
        if (path === '/dashboard') {
          setCurrentPage('dashboard');
        } else if (path === '/voters') {
          setCurrentPage('voters');
        } else if (path === '/add-booth-agent') {
          setCurrentPage('addBoothAgent');
        } else if (path === '/confirmations') {
          setCurrentPage('confirmations');
        } else {
          setCurrentPage('home');
        }
      };

      window.addEventListener('popstate', handlePopState);

      // Set initial page based on URL
      const path = window.location.pathname;
      if (path === '/voters') {
        setCurrentPage('voters');
      } else if (path === '/dashboard') {
        setCurrentPage('dashboard');
      } else if (path === '/add-booth-agent') {
        setCurrentPage('addBoothAgent');
      } else if (path === '/confirmations') {
        setCurrentPage('confirmations');
      } else {
        setCurrentPage('home');
        window.history.replaceState({}, '', '/');
      }

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isAuthenticated]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    window.history.pushState({}, '', '/');
    setCurrentPage('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else if (page === 'dashboard') {
      window.history.pushState({}, '', '/dashboard');
    } else if (page === 'voters') {
      window.history.pushState({}, '', '/voters');
    } else if (page === 'addBoothAgent') {
      window.history.pushState({}, '', '/add-booth-agent');
    } else if (page === 'confirmations') {
      window.history.pushState({}, '', '/confirmations');
    }
  };

  const switchToRegister = () => {
    setAuthMode('register');
  };

  const switchToLogin = () => {
    setAuthMode('login');
  };

  // Show different content based on authentication and page
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={switchToLogin}
        />
      );
    } else {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={switchToRegister}
        />
      );
    }
  }

  // If authenticated, show main app with header
  return (
    <div className="app-container">
      <Header 
        user={currentUser}
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        languageMode={languageMode}
        onToggleLanguage={toggleLanguage}
      />
      
      <div className="main-content">
        {currentPage === 'home' ? (
          <HomePage languageMode={languageMode} />
        ) : currentPage === 'dashboard' ? (
          <Dashboard
            user={currentUser}
            languageMode={languageMode}
          />
        ) : currentPage === 'addBoothAgent' ? (
          <AddBoothAgent
            languageMode={languageMode}
            user={currentUser}
            onNavigate={handleNavigation}
          />
        ) : currentPage === 'confirmations' ? (
          <ConfirmationsAdmin
            user={currentUser}
            languageMode={languageMode}
          />
        ) : (
          <SimpleDataViewer
            languageMode={languageMode}
            onToggleLanguage={toggleLanguage}
            user={currentUser}
          />
        )}
      </div>
    </div>
  
  );
};

export default App;
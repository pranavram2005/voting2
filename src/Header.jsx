import React, { useState, useEffect } from 'react';

const Header = ({ user, currentPage, onNavigate, onLogout, languageMode, onToggleLanguage }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Translation texts
  const translations = {
    tamil: {
      brandName: "TVK",
      brandTagline: "தமிழக வெற்றி கழகம் | EST. 2024",
      homeNav: "🏠 முகப்பு",
      dashboardNav: "📊 களப்பலகை",
      votersNav: "👥 வாக்காளர் தரவு",
      addBoothAgentNav: "👤 பூத் ஏஜெண்ட் சேர்க்கவும்",
      confirmationsNav: "✅ வாக்கு உறுதிப்பாடு",
      welcome: "வரவேற்கிறோம்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      languageToggle: "🌐 EN",
      menu: "மெனு"
    },
    english: {
      brandName: "TVK",
      brandTagline: "Tamilaga Vetri Kazhagam | EST. 2024",
      homeNav: "🏠 Home",
      dashboardNav: "📊 Dashboard",
      votersNav: "👥 Voter Data",
      addBoothAgentNav: "👤 Add Booth Agent",
      confirmationsNav: "✅ Vote Confirmations",
      welcome: "Welcome",
      settings: "Settings",
      logout: "Logout",
      languageToggle: "🌐 தமிழ்",
      menu: "Menu"
    }
  };

  const t = translations[languageMode];

  return (
    <header style={{
      background: 'linear-gradient(135deg, #0D0D0D 0%, #1A0A0A 50%, #220A0A 100%)',
      borderBottom: '3px solid #C8102E',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 30px rgba(200,16,46,0.4)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '12px 16px' : '16px 40px',
        flexWrap: isMobile ? 'wrap' : 'nowrap'
      }}>
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px',
          minWidth: 'fit-content'
        }}>
          <div style={{
            width: isMobile ? '50px' : '70px',
            height: isMobile ? '50px' : '70px',
            background: 'radial-gradient(circle, #F4A900 0%, #C8860A 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '20px' : '30px',
            boxShadow: '0 0 20px rgba(244,169,0,0.5)',
            border: '3px solid rgba(255,255,255,0.2)',
            position: 'relative',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}>
            ☀️
          </div>
          <div>
            <h1 style={{
              fontSize: isMobile ? '24px' : '36px',
              letterSpacing: isMobile ? '2px' : '4px',
              color: '#F4A900',
              lineHeight: '1',
              fontWeight: 'bold',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              margin: 0
            }}>
              {t.brandName}
            </h1>
            <p style={{
              fontSize: isMobile ? '9px' : '11px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: isMobile ? '1px' : '2px',
              marginTop: '2px',
              margin: 0,
              display: isMobile ? 'none' : 'block' // Hide tagline on very small screens
            }}>
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: 'rgba(244,169,0,0.1)',
              border: '1px solid #F4A900',
              borderRadius: '6px',
              color: '#F4A900',
              padding: '8px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>{isMenuOpen ? '✕' : '☰'}</span>
            <span>{t.menu}</span>
          </button>
        )}

        {/* Desktop Navigation & User Info */}
        {!isMobile && (
          <>
            {/* Navigation */}
            <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <NavButton
                label={t.homeNav}
                isActive={currentPage === 'home'}
                onClick={() => onNavigate('home')}
                isMobile={false}
              />
              <NavButton
                label={t.dashboardNav}
                isActive={currentPage === 'dashboard'}
                onClick={() => onNavigate('dashboard')}
                isMobile={false}
              />
              <NavButton
                label={t.votersNav}
                isActive={currentPage === 'voters'}
                onClick={() => onNavigate('voters')}
                isMobile={false}
              />
              {/* Show Add Booth Agent only for super admin */}
              {user && user.role === 'super_admin' && (
                <>
                  <NavButton
                    label={t.addBoothAgentNav}
                    isActive={currentPage === 'addBoothAgent'}
                    onClick={() => onNavigate('addBoothAgent')}
                    isMobile={false}
                  />
                  <NavButton
                    label={t.confirmationsNav}
                    isActive={currentPage === 'confirmations'}
                    onClick={() => onNavigate('confirmations')}
                    isMobile={false}
                  />
                </>
              )}
            </nav>

            {/* User Info */}
            {user && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                {/* Language Toggle Switch */}
                <div
                  onClick={onToggleLanguage}
                  style={{
                    width: '80px',
                    height: '36px',
                    background: languageMode === 'tamil' ? '#C8102E' : '#F4A900',
                    borderRadius: '18px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '2px solid #000',
                    boxShadow: '0 3px 8px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 8px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
                  }}
                >
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#000',
                    transition: 'color 0.3s',
                    zIndex: 2,
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1'
                  }}>த</span>

                  <div style={{
                    width: '28px',
                    height: '28px',
                    background: '#fff',
                    borderRadius: '50%',
                    position: 'absolute',
                    left: languageMode === 'tamil' ? '4px' : '48px',
                    transition: 'left 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(0,0,0,0.1)'
                  }} />

                  <span style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: languageMode === 'english' ? '#000' : 'rgba(255,255,255,0.4)',
                    transition: 'color 0.3s',
                    zIndex: 2,
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: '1'
                  }}>EN</span>
                </div>

                <div style={{
                  width: '40px',
                  height: '40px',
                  background: 'linear-gradient(135deg, #C8102E, #A00020)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    {t.welcome} {user.fullName || user.username}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <span style={{ cursor: 'pointer', marginRight: '8px' }}>{t.settings}</span>
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
                    <span 
                      onClick={onLogout}
                      style={{ 
                        cursor: 'pointer', 
                        marginLeft: '8px',
                        color: '#F4A900',
                        transition: 'color 0.3s'
                      }}
                    >
                      {t.logout}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMenuOpen && (
        <div style={{
          background: 'rgba(0,0,0,0.95)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Navigation Links */}
          <NavButton
            label={t.homeNav}
            isActive={currentPage === 'home'}
            onClick={() => {
              onNavigate('home');
              setIsMenuOpen(false);
            }}
            isMobile={true}
          />
          <NavButton
            label={t.dashboardNav}
            isActive={currentPage === 'dashboard'}
            onClick={() => {
              onNavigate('dashboard');
              setIsMenuOpen(false);
            }}
            isMobile={true}
          />
          <NavButton
            label={t.votersNav}
            isActive={currentPage === 'voters'}
            onClick={() => {
              onNavigate('voters');
              setIsMenuOpen(false);
            }}
            isMobile={true}
          />
          {/* Show Add Booth Agent only for super admin */}
          {user && user.role === 'super_admin' && (
            <>
              <NavButton
                label={t.addBoothAgentNav}
                isActive={currentPage === 'addBoothAgent'}
                onClick={() => {
                  onNavigate('addBoothAgent');
                  setIsMenuOpen(false);
                }}
                isMobile={true}
              />
              <NavButton
                label={t.confirmationsNav}
                isActive={currentPage === 'confirmations'}
                onClick={() => {
                  onNavigate('confirmations');
                  setIsMenuOpen(false);
                }}
                isMobile={true}
              />
            </>
          )}
          
          {/* Language Toggle for Mobile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Language:</span>
            <div
              onClick={onToggleLanguage}
              style={{
                width: '60px',
                height: '30px',
                background: languageMode === 'tamil' ? '#C8102E' : '#F4A900',
                borderRadius: '15px',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                background: '#fff',
                borderRadius: '50%',
                position: 'absolute',
                left: languageMode === 'tamil' ? '3px' : '33px',
                top: '3px',
                transition: 'left 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {languageMode === 'tamil' ? 'த' : 'EN'}
              </div>
            </div>
          </div>
          
          {/* User Info for Mobile */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(135deg, #C8102E, #A00020)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}>
                  {(user.fullName || user.username || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {user.fullName || user.username}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    {t.welcome}
                  </div>
                </div>
              </div>
              <button
                onClick={onLogout}
                style={{
                  background: 'transparent',
                  border: '1px solid #F4A900',
                  borderRadius: '4px',
                  color: '#F4A900',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {t.logout}
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(244,169,0,0.5); }
          50% { box-shadow: 0 0 40px rgba(244,169,0,0.8), 0 0 60px rgba(244,169,0,0.3); }
        }
      `}</style>
    </header>
  );
};

function NavButton({ label, isActive, onClick, isMobile }) {
  return (
    <button
      onClick={onClick}
      style={{
        color: isActive ? '#fff' : 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        padding: isMobile ? '12px 16px' : '8px 16px',
        borderRadius: '4px',
        fontSize: isMobile ? '16px' : '13px',
        fontWeight: '600',
        letterSpacing: '1px',
        transition: 'all 0.3s',
        border: isActive ? 'none' : '1px solid transparent',
        background: isActive ? '#C8102E' : 'transparent',
        cursor: 'pointer',
        width: isMobile ? '100%' : 'auto',
        textAlign: isMobile ? 'left' : 'center',
        minHeight: isMobile ? '44px' : 'auto', // Touch-friendly height on mobile
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.color = '#F4A900';
          e.target.style.borderColor = 'rgba(244,169,0,0.3)';
          e.target.style.background = 'rgba(244,169,0,0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.color = 'rgba(255,255,255,0.85)';
          e.target.style.borderColor = 'transparent';
          e.target.style.background = 'transparent';
        }
      }}
    >
      {label}
    </button>
  );
}

export default Header;
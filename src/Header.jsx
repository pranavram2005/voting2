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
      brandTagline: "தமிழக வெற்றி கழகம்",
      homeNav: "🏠 முகப்பு",
      dashboardNav: "📊 களப்பலகை",
      votersNav: "👥 வாக்காளர் தரவு",
      addBoothAgentNav: "👤 பூத் ஏஜெண்ட் சேர்க்கவும்",
      addWardAgentNav: "🏷️ வார்டு ஏஜெண்ட் சேர்க்கவும்",
      addZonalAgentNav: "🧭 மண்டல ஏஜெண்ட் சேர்க்கவும்",
      confirmationsNav: "✅ வாக்கு உறுதிப்பாடு",
      welcome: "வரவேற்கிறோம்",
      settings: "அமைப்புகள்",
      logout: "வெளியேறு",
      languageToggle: "🌐 EN",
      menu: "மெனு"
    },
    english: {
      brandName: "TVK",
      brandTagline: "Tamilaga Vetri Kazhagam",
      homeNav: "🏠 Home",
      dashboardNav: "📊 Dashboard",
      votersNav: "👥 Voter Data",
      addBoothAgentNav: "👤 Add Booth Agent",
      addWardAgentNav: "🏷️ Add Ward Agent",
      addZonalAgentNav: "🧭 Add Zonal Agent",
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
      {/* Top Bar: Confidential left, user/language right */}
      <div style={{
        width: '100%',
        background: 'rgba(200,16,46,0.4)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: isMobile ? '11px' : '14px',
        fontWeight: 500,
        padding: isMobile ? '6px 8px' : '7px 40px 7px 24px',
        letterSpacing: '1px',
        borderBottom: '2px solid #F4A900',
        boxShadow: '0 2px 8px rgba(20,58,33,0.08)'
      }}>
        <div style={{ color: '#F4A900', fontWeight: 700, letterSpacing: '1.2px', fontSize: isMobile ? '10px' : '12px' }}>
          CONFIDENTIAL · SAIDAPET AC 23 · TVK 2026 · FIELD INTELLIGENCE
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '8px' : '18px' }}>
          {/* Language Toggle - pill style */}
          <div
            onClick={onToggleLanguage}
            style={{
              background: '#fff',
              borderRadius: '18px',
              border: '2px solid #F4A900',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '13px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(244,169,0,0.08)',
              height: '32px',
            }}
          >
            <span style={{
              background: languageMode === 'tamil' ? '#F4A900' : 'transparent',
              color: languageMode === 'tamil' ? '#143821' : '#143821',
              padding: '6px 18px',
              transition: 'background 0.2s',
              fontWeight: languageMode === 'tamil' ? 800 : 600,
              borderRight: '1.5px solid #F4A900',
              letterSpacing: '1px',
            }}>த</span>
            <span style={{
              background: languageMode === 'english' ? '#F4A900' : 'transparent',
              color: languageMode === 'english' ? '#143821' : '#143821',
              padding: '6px 18px',
              transition: 'background 0.2s',
              fontWeight: languageMode === 'english' ? 800 : 600,
              letterSpacing: '1px',
            }}>EN</span>
          </div>
          {/* User Avatar */}
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F4A900, #143821)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#143821', fontWeight: 'bold', fontSize: '15px', border: '2px solid #F4A900' }}>
                {(user.fullName || user.username || 'S').charAt(0).toUpperCase()}
              </div>
              <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>Welcome Super Administrator</div>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
              <span onClick={onLogout} style={{ cursor: 'pointer', marginLeft: '8px', color: '#F4A900', fontWeight: 700 }}>{t.logout}</span>
            </div>
          )}
        </div>
      </div>
      {/* Main Navbar/Logo Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '8px 6px' : '16px 40px',
          gap: isMobile ? '8px' : '0',
        }}
      >
        {/* Logo Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '12px' : '20px',
          minWidth: 'fit-content'
        }}>
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            background: 'radial-gradient(circle, #F4A900 0%, #C8860A 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: isMobile ? '14px' : '18px',
            boxShadow: '0 0 12px rgba(244,169,0,0.4)',
            border: '2px solid rgba(255,255,255,0.18)',
            position: 'relative',
            animation: 'pulse-glow 3s ease-in-out infinite'
          }}>
            ☀️
          </div>
          <div>
            <h1 style={{
              fontSize: isMobile ? '15px' : '20px',
              letterSpacing: isMobile ? '1.2px' : '2px',
              color: '#F4A900',
              lineHeight: '1',
              fontWeight: 'bold',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              margin: 0
            }}>
              {t.brandName}
            </h1>
            <p style={{
              fontSize: isMobile ? '7px' : '9px',
              color: 'rgba(255,255,255,0.7)',
              letterSpacing: isMobile ? '0.5px' : '1px',
              marginTop: '2px',
              margin: 0,
              display: isMobile ? 'none' : 'block' // Hide tagline on very small screens
            }}>
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Main Navigation Bar: Only show on desktop/tablet, hide on mobile */}
        {!isMobile && (
          <nav
            style={{
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              fontSize: '8px',
              overflowX: 'visible',
              width: 'auto',
              paddingBottom: 0,
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
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
                  label={t.addWardAgentNav}
                  isActive={currentPage === 'addWardAgent'}
                  onClick={() => onNavigate('addWardAgent')}
                  isMobile={false}
                />
                <NavButton
                  label={t.addZonalAgentNav}
                  isActive={currentPage === 'addZonalAgent'}
                  onClick={() => onNavigate('addZonalAgent')}
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
        )}

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
        color: 'rgba(255,255,255,0.85)',
        textDecoration: 'none',
        padding: isMobile ? '12px 16px' : '3px 12px',
        borderRadius: '4px',
        fontSize: isMobile ? '16px' : '11.5px',
        fontWeight: '600',
        letterSpacing: '1px',
        transition: 'all 0.3s',
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        width: isMobile ? '100%' : 'auto',
        textAlign: isMobile ? 'left' : 'center',
        minHeight: isMobile ? '44px' : 'auto', // Touch-friendly height on mobile
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.target.style.color = '#F4A900';
        e.target.style.background = 'rgba(244,169,0,0.05)';
      }}
      onMouseLeave={(e) => {
        e.target.style.color = 'rgba(255,255,255,0.85)';
        e.target.style.background = 'transparent';
      }}
    >
      <span style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        {label}
        {isActive && (
          <span
            style={{
              display: 'block',
              height: '3px',
              borderRadius: '2px',
              background: 'linear-gradient(90deg, #F4A900 60%, #C8102E 100%)',
              marginTop: '2px',
              width: '100%',
              position: 'absolute',
              left: 0,
              bottom: isMobile ? '-6px' : '-7px',
              zIndex: 2,
            }}
          />
        )}
      </span>
    </button>
  );
}

export default Header;
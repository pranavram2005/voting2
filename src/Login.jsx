import React, { useState, useEffect } from 'react';
import tvkImage from './assets/TVK2.png'; 

const Login = ({ onLogin, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.username === 'admin' && formData.password === 'admin123') {
      const adminUser = {
        id: 'admin', username: 'admin',
        fullName: 'Super Administrator',
        email: 'admin@tvk.org.in', role: 'super_admin',
      };
      setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        onLogin(adminUser);
        setLoading(false);
      }, 1000);
      return;
    }

    const boothAgents = JSON.parse(localStorage.getItem('boothAgents') || '[]');
    const boothAgent = boothAgents.find(a =>
      a.username === formData.username && a.password === formData.password && a.isActive
    );

    if (boothAgent) {
      const agentUser = {
        id: boothAgent.id, username: boothAgent.username,
        fullName: `Booth Agent - ${boothAgent.boothNumber}`, email: '',
        role: 'booth_agent', boothNumber: boothAgent.boothNumber,
        phoneNumber: boothAgent.phoneNumber,
      };
      setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify(agentUser));
        onLogin(agentUser);
        setLoading(false);
      }, 1000);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === formData.username && u.password === formData.password);

    setTimeout(() => {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --gold: #F4A900;
          --gold-dim: rgba(244,169,0,0.15);
          --gold-glow: rgba(244,169,0,0.35);
          --red: #C8102E;
          --red-dim: rgba(200,16,46,0.15);
          --bg-dark: #0A0A0A;
          --bg-card: #111111;
          --bg-input: #161616;
          --text-primary: #F0F0F0;
          --text-muted: #888;
          --border: rgba(244,169,0,0.25);
          --font-display: 'Rajdhani', sans-serif;
          --font-body: 'DM Sans', sans-serif;
        }

        .tvk-login-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          background: var(--bg-dark);
          font-family: var(--font-body);
          overflow: hidden;
          position: relative;
        }

        /* Subtle noise texture overlay */
        .tvk-login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* ── LEFT PANEL ─────────────────────────────── */
        .tvk-left {
          flex: 1.3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 40px;
          position: relative;
          background: #0D0D0D;
          border-right: 1px solid var(--border);
          z-index: 1;
          gap: 28px;
        }

        .tvk-left::after {
          content: '';
          position: absolute;
          right: -1px;
          top: 15%;
          height: 70%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, var(--gold), transparent);
          pointer-events: none;
        }

        /* Corner accent */
        .tvk-corner {
          position: absolute;
          width: 60px;
          height: 60px;
          border-color: var(--gold);
          border-style: solid;
          opacity: 0.4;
        }
        .tvk-corner-tl { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
        .tvk-corner-br { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }

        .tvk-brand-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .tvk-brand-eyebrow {
          font-family: var(--font-display);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 4px;
          color: var(--gold);
          text-transform: uppercase;
          opacity: 0.7;
        }

        .tvk-brand-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.5vw, 30px);
          font-weight: 700;
          color: #fff;
          letter-spacing: 1.5px;
          text-align: center;
          line-height: 1.2;
        }

        .tvk-brand-title span {
          color: var(--gold);
        }

        .tvk-image-wrap {
          width: 100%;
          max-width: 440px;
          position: relative;
        }

        .tvk-image-wrap::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 18px;
          background: linear-gradient(135deg, var(--gold), transparent 60%, var(--red) 100%);
          z-index: 0;
          opacity: 0.5;
        }

        .tvk-image-wrap img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 16px;
          position: relative;
          z-index: 1;
          object-fit: contain;
          background: #fff;
        }

        .tvk-left-footer {
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 1px;
          text-align: center;
          font-family: var(--font-display);
          text-transform: uppercase;
        }

        /* ── RIGHT PANEL ─────────────────────────────── */
        .tvk-right {
          flex: 1;
          min-width: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
          z-index: 1;
          position: relative;
        }

        .tvk-card {
          width: 100%;
          max-width: 400px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 40px 36px;
          position: relative;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(20px)'};
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        /* Card top accent bar */
        .tvk-card::before {
          content: '';
          position: absolute;
          top: 0; left: 20px; right: 20px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          border-radius: 2px;
        }

        .tvk-card-header {
          margin-bottom: 32px;
        }

        .tvk-card-eyebrow {
          font-family: var(--font-display);
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold);
          opacity: 0.8;
          margin-bottom: 8px;
        }

        .tvk-card-title {
          font-family: var(--font-display);
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          line-height: 1.2;
          margin-bottom: 8px;
        }

        .tvk-card-subtitle {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .tvk-divider {
          height: 1px;
          background: var(--border);
          margin: 0 0 28px 0;
        }

        /* ── FORM ─────────────────────────────── */
        .tvk-field {
          margin-bottom: 20px;
        }

        .tvk-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 8px;
          font-family: var(--font-display);
        }

        .tvk-input-wrap {
          position: relative;
        }

        .tvk-input {
          width: 100%;
          padding: 12px 16px;
          background: var(--bg-input);
          border: 1px solid rgba(244,169,0,0.2);
          border-radius: 8px;
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          -webkit-appearance: none;
        }

        .tvk-input::placeholder {
          color: var(--text-muted);
          font-size: 14px;
        }

        .tvk-input:focus {
          border-color: var(--gold);
          background: #1A1A1A;
          box-shadow: 0 0 0 3px var(--gold-dim);
        }

        .tvk-input.has-toggle {
          padding-right: 46px;
        }

        .tvk-toggle-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 4px;
          font-size: 16px;
          line-height: 1;
          transition: color 0.2s;
        }
        .tvk-toggle-btn:hover { color: var(--gold); }

        /* ── ERROR ─────────────────────────────── */
        .tvk-error {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px;
          background: var(--red-dim);
          border: 1px solid rgba(200,16,46,0.3);
          border-radius: 8px;
          color: #FF4D6A;
          font-size: 13px;
          margin-bottom: 20px;
          animation: shake 0.3s ease;
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        /* ── SUBMIT BUTTON ─────────────────────────────── */
        .tvk-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg, var(--gold) 0%, #E09800 50%, var(--red) 100%);
          background-size: 200% 100%;
          background-position: left;
          color: #0A0A0A;
          font-family: var(--font-display);
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 8px;
          transition: background-position 0.4s ease, opacity 0.2s, transform 0.15s;
          position: relative;
          overflow: hidden;
        }

        .tvk-submit:not(:disabled):hover {
          background-position: right;
          transform: translateY(-1px);
        }

        .tvk-submit:not(:disabled):active {
          transform: translateY(0);
        }

        .tvk-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Loading spinner */
        .tvk-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #0A0A0A;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .tvk-card-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.5px;
          line-height: 1.6;
        }

        .tvk-card-footer span {
          color: var(--gold);
          opacity: 0.7;
        }

        /* ════════════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
           ════════════════════════════════════════════════ */

        /* Tablet landscape / small desktop: ≤ 1024px */
        @media (max-width: 1024px) {
          .tvk-left { padding: 36px 28px; }
          .tvk-card { padding: 32px 28px; }
          .tvk-image-wrap { max-width: 360px; }
        }

        /* Tablet portrait: ≤ 768px — stack vertically */
        @media (max-width: 768px) {
          .tvk-login-root {
            flex-direction: column;
            overflow-y: auto;
            overflow-x: hidden;
          }

          .tvk-left {
            flex: none;
            width: 100%;
            padding: 28px 20px 24px;
            border-right: none;
            border-bottom: 1px solid var(--border);
            gap: 18px;
          }

          /* Hide glow line on mobile */
          .tvk-left::after { display: none; }

          .tvk-corner { display: none; }

          .tvk-image-wrap {
            max-width: 280px;
            margin: 0 auto;
          }

          .tvk-brand-title {
            font-size: 22px;
          }

          .tvk-right {
            flex: none;
            width: 100%;
            padding: 28px 20px 40px;
            align-items: flex-start;
          }

          .tvk-card {
            max-width: 100%;
            padding: 28px 24px;
          }
        }

        /* Small mobile: ≤ 480px */
        @media (max-width: 480px) {
          .tvk-left {
            padding: 20px 16px 18px;
            gap: 14px;
          }

          .tvk-image-wrap {
            max-width: 220px;
          }

          .tvk-image-wrap::before { opacity: 0.35; }

          .tvk-brand-eyebrow { letter-spacing: 2px; }

          .tvk-brand-title { font-size: 18px; }

          .tvk-left-footer { display: none; }

          .tvk-right {
            padding: 20px 12px 32px;
          }

          .tvk-card {
            padding: 24px 16px;
            border-radius: 12px;
          }

          .tvk-card-title { font-size: 20px; }
          .tvk-card-subtitle { font-size: 12px; }

          .tvk-input {
            font-size: 16px; /* prevent iOS zoom on focus */
            padding: 13px 14px;
          }

          .tvk-submit {
            font-size: 14px;
            padding: 15px;
          }
        }

        /* Extra small: ≤ 360px */
        @media (max-width: 360px) {
          .tvk-card { padding: 20px 12px; }
          .tvk-image-wrap { max-width: 180px; }
          .tvk-card-header { margin-bottom: 20px; }
          .tvk-field { margin-bottom: 16px; }
        }

        /* Landscape phone: short + wide */
        @media (max-height: 500px) and (orientation: landscape) {
          .tvk-login-root { flex-direction: row; overflow-y: auto; }
          .tvk-left {
            flex: 0 0 240px;
            min-height: 100vh;
            border-right: 1px solid var(--border);
            border-bottom: none;
            padding: 20px 16px;
            gap: 14px;
          }
          .tvk-image-wrap { max-width: 180px; }
          .tvk-brand-title { font-size: 16px; }
          .tvk-left-footer { display: none; }
          .tvk-right { padding: 20px 16px; align-items: flex-start; }
          .tvk-card { padding: 24px 20px; }
        }
      `}</style>

      <div className="tvk-login-root">
        {/* ── LEFT PANEL ── */}
        <div className="tvk-left">
          <div className="tvk-corner tvk-corner-tl" />
          <div className="tvk-corner tvk-corner-br" />

          <div className="tvk-brand-badge">
            <span className="tvk-brand-eyebrow">Tamil Vettri Kazhagam</span>
            <h1 className="tvk-brand-title">
              <span>TVK</span> Electoral<br />Control Panel
            </h1>
          </div>

          <div className="tvk-image-wrap">
            {/* Replace src below with your actual tvkImage import */}
            <img
              src={tvkImage}
              alt="TVK Org Chart"
            />
          </div>

          <p className="tvk-left-footer">
            2026 Voter Analytics &amp; Field Operations
          </p>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="tvk-right">
          <div className="tvk-card">
            <div className="tvk-card-header">
              <p className="tvk-card-eyebrow">Secure Access</p>
              <h2 className="tvk-card-title">Sign In to<br />Your Panel</h2>
              <p className="tvk-card-subtitle">
                Authorized personnel only · 2026 elections
              </p>
            </div>

            <div className="tvk-divider" />

            <form onSubmit={handleSubmit} noValidate>
              {error && (
                <div className="tvk-error">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}

              <div className="tvk-field">
                <label htmlFor="username" className="tvk-label">Username / Email</label>
                <div className="tvk-input-wrap">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your TVK login ID"
                    className="tvk-input"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              <div className="tvk-field">
                <label htmlFor="password" className="tvk-label">Password</label>
                <div className="tvk-input-wrap">
                  <input
                    type={showPass ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your secure password"
                    className="tvk-input has-toggle"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="tvk-toggle-btn"
                    onClick={() => setShowPass(p => !p)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="tvk-submit"
                disabled={loading}
              >
                {loading ? (
                  <><span className="tvk-spinner" />Authorizing…</>
                ) : (
                  'Login to TVK Panel'
                )}
              </button>
            </form>

            <div className="tvk-card-footer">
              <span>🔒</span> Encrypted connection · Authorized use only
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

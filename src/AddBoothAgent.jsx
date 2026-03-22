import React, { useState, useEffect } from 'react';

const AddBoothAgent = ({ languageMode, user, onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    boothNumber: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [boothAgents, setBoothAgents] = useState([]);
  const [availableBooths, setAvailableBooths] = useState([]);

  // Translation texts
  const translations = {
    tamil: {
      title: "புதிய பூத் ஏஜெண்ட் சேர்க்கவும்",
      subtitle: "பூத் ஏஜெண்ட்டிற்கான புதிய கணக்கை உருவாக்கவும்",
      username: "பயனர்பெயர்",
      usernamePlaceholder: "பூத் ஏஜெண்ட் பயனர்பெயர் உள்ளிடவும்",
      boothNumber: "பூத் எண்",
      boothNumberPlaceholder: "பூத் எண் உள்ளிடவும் (उदा: 242)",
      phoneNumber: "தொலைபேசி எண்",
      phoneNumberPlaceholder: "10 இலக்க தொலைபேசி எண்",
      password: "கடவுச்சொல்",
      passwordPlaceholder: "பாதுகாப்பான கடவுச்சொல்",
      confirmPassword: "கடவுச்சொல் உறுதிப்படுத்தவும்",
      confirmPasswordPlaceholder: "கடவுச்சொல்லை மீண்டும் உள்ளிடவும்",
      createAgent: "பூத் ஏஜெண்ட் உருவாக்கவும்",
      creating: "உருவாக்குகிறது...",
      existingAgents: "ஏற்கனவே உள்ள பூத் ஏஜெண்ட்கள்",
      agentCreated: "பூத் ஏஜெண்ட் வெற்றிகரமாக உருவாக்கப்பட்டது!",
      backToDashboard: "களப்பலகைக்கு திரும்பு",
      noAgents: "இன்னும் பூத் ஏஜெண்ட்கள் இல்லை",
      booth: "பூத்",
      phone: "தொலைபேசி",
      created: "உருவாக்கப்பட்டது",
      active: "செயல்பாட்டில்",
      status: "நிலை"
    },
    english: {
      title: "Add New Booth Agent",
      subtitle: "Create a new account for booth agent",
      username: "Username",
      usernamePlaceholder: "Enter booth agent username",
      boothNumber: "Booth Number",
      boothNumberPlaceholder: "Enter booth number (e.g: 242)",
      phoneNumber: "Phone Number",
      phoneNumberPlaceholder: "10-digit phone number",
      password: "Password",
      passwordPlaceholder: "Secure password",
      confirmPassword: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter password",
      createAgent: "Create Booth Agent",
      creating: "Creating...",
      existingAgents: "Existing Booth Agents",
      agentCreated: "Booth Agent created successfully!",
      backToDashboard: "Back to Dashboard",
      noAgents: "No booth agents yet",
      booth: "Booth",
      phone: "Phone",
      created: "Created",
      active: "Active",
      status: "Status"
    }
  };

  const t = translations[languageMode];

  // Load existing booth agents on component mount
  useEffect(() => {
    const agents = JSON.parse(localStorage.getItem('boothAgents') || '[]');
    setBoothAgents(agents);

    // Load available booth numbers from stored voter data if present
    try {
      const rawData = localStorage.getItem('voterData');
      if (rawData) {
        const parsed = JSON.parse(rawData);
        const booths = Array.from(new Set(parsed.map(item => item.BOOTH).filter(b => b !== undefined && b !== null)))
          .sort((a, b) => Number(a) - Number(b))
          .map(b => String(b));
        setAvailableBooths(booths);
      }
    } catch (e) {
      // If anything goes wrong, silently fall back to manual entry
      setAvailableBooths([]);
    }
  }, []);

  // Check if user is super admin
  useEffect(() => {
    if (!user || user.role !== 'super_admin') {
      onNavigate('home');
    }
  }, [user, onNavigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (!formData.boothNumber.trim()) {
      setError('Booth number is required');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }

    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    if (!formData.password) {
      setError('Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check if username already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const existingBoothAgents = JSON.parse(localStorage.getItem('boothAgents') || '[]');

    if (existingUsers.find(u => u.username === formData.username.trim()) ||
        existingBoothAgents.find(a => a.username === formData.username.trim()) ||
        formData.username.trim() === 'admin') {
      setError('Username already exists');
      return false;
    }

    // Check if booth number already assigned
    if (existingBoothAgents.find(a => a.boothNumber === formData.boothNumber.trim())) {
      setError('Booth number already assigned to another agent');
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Create new booth agent
    const newAgent = {
      id: `agent_${Date.now()}`,
      username: formData.username.trim(),
      boothNumber: formData.boothNumber.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      password: formData.password, // In production, this should be hashed
      role: 'booth_agent',
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      isActive: true
    };

    // Save to localStorage
    const existingAgents = JSON.parse(localStorage.getItem('boothAgents') || '[]');
    const updatedAgents = [...existingAgents, newAgent];
    localStorage.setItem('boothAgents', JSON.stringify(updatedAgents));

    setTimeout(() => {
      setBoothAgents(updatedAgents);
      setSuccess(t.agentCreated);
      setFormData({
        username: '',
        boothNumber: '',
        phoneNumber: '',
        password: '',
        confirmPassword: ''
      });
      setLoading(false);
    }, 1000);
  };

  if (!user || user.role !== 'super_admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D0D 0%, #1A0A0A 50%, #2A0A0A 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid rgba(200,16,46,0.2)'
        }}>
          <h1 style={{
            color: '#F4A900',
            fontSize: '28px',
            fontWeight: 'bold',
            margin: '0 0 8px 0',
            textAlign: 'center'
          }}>
            {t.title}
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.7)',
            fontSize: '16px',
            margin: 0,
            textAlign: 'center'
          }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          '@media (max-width: 768px)': {
            gridTemplateColumns: '1fr'
          }
        }}>
          {/* Add Agent Form */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(200,16,46,0.2)'
          }}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{
                  background: 'rgba(200,16,46,0.1)',
                  border: '1px solid #C8102E',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#C8102E',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid #4CAF50',
                  borderRadius: '6px',
                  padding: '12px',
                  marginBottom: '16px',
                  color: '#4CAF50',
                  fontSize: '14px'
                }}>
                  {success}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#F4A900',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {t.username}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder={t.usernamePlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#F4A900',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {t.boothNumber}
                </label>
                {availableBooths.length > 0 ? (
                  <select
                    name="boothNumber"
                    value={formData.boothNumber}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                    required
                  >
                    <option value="">{t.boothNumberPlaceholder}</option>
                    {availableBooths.map(booth => (
                      <option key={booth} value={booth}>{booth}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="boothNumber"
                    value={formData.boothNumber}
                    onChange={handleChange}
                    placeholder={t.boothNumberPlaceholder}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    required
                  />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#F4A900',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t.phoneNumberPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  color: '#F4A900',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {t.password}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t.passwordPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  color: '#F4A900',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '6px'
                }}>
                  {t.confirmPassword}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t.confirmPasswordPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: loading ? 'rgba(200,16,46,0.5)' : '#C8102E',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: '16px'
                }}
              >
                {loading ? t.creating : t.createAgent}
              </button>

              <button
                type="button"
                onClick={() => onNavigate('dashboard')}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'transparent',
                  color: '#F4A900',
                  border: '1px solid #F4A900',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {t.backToDashboard}
              </button>
            </form>
          </div>

          {/* Existing Agents */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(200,16,46,0.2)'
          }}>
            <h3 style={{
              color: '#F4A900',
              fontSize: '20px',
              fontWeight: 'bold',
              margin: '0 0 16px 0'
            }}>
              {t.existingAgents}
            </h3>

            {boothAgents.length === 0 ? (
              <p style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '14px',
                textAlign: 'center',
                margin: '40px 0'
              }}>
                {t.noAgents}
              </p>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {boothAgents.map((agent) => (
                  <div
                    key={agent.id}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '12px',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <h4 style={{
                        color: '#fff',
                        fontSize: '16px',
                        fontWeight: '600',
                        margin: 0
                      }}>
                        {agent.username}
                      </h4>
                      <span style={{
                        padding: '4px 8px',
                        background: agent.isActive ? 'rgba(76,175,80,0.2)' : 'rgba(255,193,7,0.2)',
                        color: agent.isActive ? '#4CAF50' : '#FFC107',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {t.active}
                      </span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '8px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{t.booth}: </span>
                        <span style={{ color: '#F4A900', fontWeight: '600' }}>{agent.boothNumber}</span>
                      </div>
                      <div>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>{t.phone}: </span>
                        <span style={{ color: '#fff' }}>{agent.phoneNumber}</span>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.5)'
                    }}>
                      {t.created}: {new Date(agent.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AddBoothAgent;
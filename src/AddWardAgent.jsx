import React, { useEffect, useState } from 'react';
import voteData from './voting/output.jsx';

const getInitialFormState = () => ({
  name: '',
  wardNumber: '',
  phoneNumber: '',
  youtubeLink: '',
  websiteLink: '',
  donationAmount: '',
  othersField: ''
});

// Helper: Compute booths 1-8 for Ward 1, 9-16 for Ward 2, etc.
const computeBoothsForWard = (wardNumber) => {
  const ward = Number(wardNumber);
  if (!wardNumber || ward < 1) return [];
  const startBooth = (ward - 1) * 8 + 1;
  const endBooth = ward * 8;
  return Array.from({ length: 8 }, (_, i) => String(startBooth + i));
};

const AddWardAgent = ({ languageMode, user, onNavigate }) => {
  const [formData, setFormData] = useState(getInitialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [wardAgents, setWardAgents] = useState([]);
  const [availableWards, setAvailableWards] = useState([]);
  const [editingAgentId, setEditingAgentId] = useState(null);

  const translations = {
    tamil: {
      title: 'புதிய வார்டு ஏஜெண்ட் சேர்க்கவும்',
      subtitle: 'வார்டு ஏஜெண்ட் விவரங்களை பதிவு செய்யவும்',
      name: 'பெயர்',
      namePlaceholder: 'வார்டு ஏஜெண்ட் பெயர் உள்ளிடவும்',
      wardNumber: 'வார்டு எண்',
      wardPlaceholder: 'வார்டு எண்ணை தேர்ந்தெடுக்கவும்',
      boothsUndertaking: 'பூத் பொறுப்புகள்',
      boothPlaceholder: 'இந்த வார்டில் 5 முதல் 8 பூத் தேர்ந்தெடுக்கவும்',
      phoneNumber: 'தொலைபேசி எண்',
      phonePlaceholder: '10 இலக்க தொலைபேசி எண்',
      youtubeLink: 'YouTube இணைப்பு',
      youtubePlaceholder: 'YouTube இணைப்பு (விருப்பம்)',
      websiteLink: 'இணையதள இணைப்பு',
      websitePlaceholder: 'இணையதள URL (விருப்பம்)',
      donationAmount: 'நன்கொடை தொகை',
      donationPlaceholder: 'நன்கொடை தொகை (விருப்பம்)',
      othersField: 'மற்ற விவரங்கள்',
      othersPlaceholder: 'கூடுதல் குறிப்புகள் / மற்ற தகவல்கள்',
      optional: '(விருப்பம்)',
      createAgent: 'வார்டு ஏஜெண்ட் சேமிக்கவும்',
      updateAgent: 'வார்டு ஏஜெண்ட் புதுப்பிக்கவும்',
      creating: 'சேமிக்கிறது...',
      updating: 'புதுப்பிக்கிறது...',
      existingAgents: 'இருக்கும் வார்டு ஏஜெண்ட்கள்',
      noAgents: 'இன்னும் வார்டு ஏஜெண்ட்கள் இல்லை',
      active: 'செயல்பாட்டில்',
      backToDashboard: 'களப்பலகைக்கு திரும்பு',
      edit: 'திருத்து',
      delete: 'நீக்கு',
      cancelEditing: 'திருத்தலை ரத்து செய்',
      editingMode: 'நீங்கள் தற்போது ஒரு வார்டு ஏஜெண்டை திருத்துகிறீர்கள்',
      agentCreated: 'வார்டு ஏஜெண்ட் வெற்றிகரமாக சேர்க்கப்பட்டது!',
      agentUpdated: 'வார்டு ஏஜெண்ட் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      agentDeleted: 'வார்டு ஏஜெண்ட் நீக்கப்பட்டது.',
      deleteConfirm: 'இந்த வார்டு ஏஜெண்டை நீக்க விரும்புகிறீர்களா?'
    },
    english: {
      title: 'Add New Ward Agent',
      subtitle: 'Register details for a ward agent',
      name: 'Name',
      namePlaceholder: 'Enter ward agent name',
      wardNumber: 'Ward Number',
      wardPlaceholder: 'Select ward number',
      boothsUndertaking: 'Booths Undertaking',
      boothPlaceholder: 'Select 5 to 8 booths under this ward',
      phoneNumber: 'Phone Number',
      phonePlaceholder: '10-digit phone number',
      youtubeLink: 'YouTube Link',
      youtubePlaceholder: 'YouTube URL (optional)',
      websiteLink: 'Website Link',
      websitePlaceholder: 'Website URL (optional)',
      donationAmount: 'Donation Amount',
      donationPlaceholder: 'Donation amount (optional)',
      othersField: 'Others Field',
      othersPlaceholder: 'Additional notes / other details',
      optional: '(Optional)',
      createAgent: 'Create Ward Agent',
      updateAgent: 'Update Ward Agent',
      creating: 'Creating...',
      updating: 'Updating...',
      existingAgents: 'Existing Ward Agents',
      noAgents: 'No ward agents yet',
      active: 'Active',
      backToDashboard: 'Back to Dashboard',
      edit: 'Edit',
      delete: 'Delete',
      cancelEditing: 'Cancel Editing',
      editingMode: 'You are editing an existing ward agent',
      agentCreated: 'Ward agent created successfully!',
      agentUpdated: 'Ward agent updated successfully!',
      agentDeleted: 'Ward agent removed.',
      deleteConfirm: 'Are you sure you want to delete this ward agent?'
    }
  };

  const t = translations[languageMode] || translations.english;
  const isEditing = Boolean(editingAgentId);

  const isValidHttpUrl = (value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    const agents = JSON.parse(localStorage.getItem('wardAgents') || '[]');
    setWardAgents(Array.isArray(agents) ? agents : []);

    const wards = Array.from(
      new Set((voteData || []).map((item) => item && item.SECTION).filter((w) => w !== undefined && w !== null && w !== ''))
    )
      .map((w) => String(w))
      .sort((a, b) => Number(a) - Number(b));

    setAvailableWards(wards);
  }, []);

  useEffect(() => {
    if (!user) {
      onNavigate('home');
    }
  }, [user, onNavigate]);

  const resetForm = () => {
    setFormData(getInitialFormState());
    setEditingAgentId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (agent) => {
    setFormData({
      name: agent.name || '',
      wardNumber: agent.wardNumber || '',
      phoneNumber: agent.phoneNumber || '',
      youtubeLink: agent.youtubeLink || '',
      websiteLink: agent.websiteLink || '',
      donationAmount:
        agent.donationAmount !== null && agent.donationAmount !== undefined && agent.donationAmount !== ''
          ? String(agent.donationAmount)
          : '',
      othersField: agent.othersField || ''
    });
    setEditingAgentId(agent.id);
    setError('');
    setSuccess('');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };



  const handleDelete = (agentId) => {
    const confirmDeletion = typeof window !== 'undefined' ? window.confirm(t.deleteConfirm) : true;
    if (!confirmDeletion) return;

    const existingAgents = JSON.parse(localStorage.getItem('wardAgents') || '[]');
    const updatedAgents = existingAgents.filter((agent) => agent.id !== agentId);
    localStorage.setItem('wardAgents', JSON.stringify(updatedAgents));
    setWardAgents(updatedAgents);

    if (editingAgentId === agentId) {
      resetForm();
    }

    setSuccess(t.agentDeleted);
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }

    if (!formData.wardNumber.trim()) {
      setError('Ward number is required');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      setError('Phone number is required');
      return false;
    }

    if (!/^\d{10}$/.test(formData.phoneNumber.trim())) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    const trimmedWard = formData.wardNumber.trim();
    const existingAgents = JSON.parse(localStorage.getItem('wardAgents') || '[]');

    const wardTaken = existingAgents.some(
      (agent) => String(agent.wardNumber) === trimmedWard && agent.id !== editingAgentId
    );

    if (wardTaken) {
      setError('This ward already has an assigned ward agent');
      return false;
    }

    if (formData.youtubeLink.trim() && !isValidHttpUrl(formData.youtubeLink.trim())) {
      setError('Please enter a valid YouTube link');
      return false;
    }

    if (formData.websiteLink.trim() && !isValidHttpUrl(formData.websiteLink.trim())) {
      setError('Please enter a valid website link');
      return false;
    }

    if (formData.donationAmount.trim()) {
      const amount = Number(formData.donationAmount);
      if (Number.isNaN(amount) || amount < 0) {
        setError('Donation amount must be a positive number');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const existingAgents = JSON.parse(localStorage.getItem('wardAgents') || '[]');

    if (editingAgentId) {
      const boothsUndertaking = computeBoothsForWard(formData.wardNumber.trim());
      const updatedAgents = existingAgents.map((agent) => {
        if (agent.id !== editingAgentId) {
          return agent;
        }
        return {
          ...agent,
          name: formData.name.trim(),
          wardNumber: formData.wardNumber.trim(),
          boothsUndertaking: boothsUndertaking,
          phoneNumber: formData.phoneNumber.trim(),
          youtubeLink: formData.youtubeLink.trim() || null,
          websiteLink: formData.websiteLink.trim() || null,
          donationAmount: formData.donationAmount.trim() ? Number(formData.donationAmount) : null,
          othersField: formData.othersField.trim() || null,
          updatedAt: new Date().toISOString()
        };
      });

      localStorage.setItem('wardAgents', JSON.stringify(updatedAgents));

      setTimeout(() => {
        setWardAgents(updatedAgents);
        setSuccess(t.agentUpdated);
        resetForm();
        setLoading(false);
      }, 500);

      return;
    }

    const boothsUndertaking = computeBoothsForWard(formData.wardNumber.trim());
    const newAgent = {
      id: `ward_agent_${Date.now()}`,
      role: 'ward_agent',
      name: formData.name.trim(),
      wardNumber: formData.wardNumber.trim(),
      boothsUndertaking: boothsUndertaking,
      phoneNumber: formData.phoneNumber.trim(),
      youtubeLink: formData.youtubeLink.trim() || null,
      websiteLink: formData.websiteLink.trim() || null,
      donationAmount: formData.donationAmount.trim() ? Number(formData.donationAmount) : null,
      othersField: formData.othersField.trim() || null,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
      isActive: true
    };

    const updatedAgents = [...existingAgents, newAgent];
    localStorage.setItem('wardAgents', JSON.stringify(updatedAgents));

    setTimeout(() => {
      setWardAgents(updatedAgents);
      setSuccess(t.agentCreated);
      resetForm();
      setLoading(false);
    }, 700);
  };

  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0D0D0D 0%, #1A0A0A 50%, #2A0A0A 100%)',
        padding: '20px'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: '1px solid rgba(200,16,46,0.2)'
          }}
        >
          <h1 style={{ color: '#F4A900', fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>
            {t.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', margin: 0, textAlign: 'center' }}>
            {t.subtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(200,16,46,0.2)'
            }}
          >
            <form onSubmit={handleSubmit}>
              {error && (
                <div
                  style={{
                    background: 'rgba(200,16,46,0.1)',
                    border: '1px solid #C8102E',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '16px',
                    color: '#C8102E',
                    fontSize: '14px'
                  }}
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  style={{
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid #4CAF50',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '16px',
                    color: '#4CAF50',
                    fontSize: '14px'
                  }}
                >
                  {success}
                </div>
              )}

              {isEditing && (
                <div
                  style={{
                    background: 'rgba(244,169,0,0.1)',
                    border: '1px solid rgba(244,169,0,0.6)',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '16px',
                    color: '#F4A900',
                    fontSize: '13px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span>{t.editingMode}</span>
                  <button
                    type="button"
                    onClick={resetForm}
                    style={{
                      background: 'transparent',
                      color: '#F4A900',
                      border: '1px solid rgba(244,169,0,0.8)',
                      borderRadius: '4px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {t.cancelEditing}
                  </button>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  {t.name}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
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
                <label style={{ display: 'block', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  {t.wardNumber}
                </label>
                <select
                  name="wardNumber"
                  value={formData.wardNumber}
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
                  <option value="">{t.wardPlaceholder}</option>
                  {availableWards.map((ward) => (
                    <option key={ward} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>
              </div>

              {formData.wardNumber && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Booths Covered (Auto-mapped)
                  </label>
                  <div
                    style={{
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '6px',
                      padding: '12px',
                      background: 'rgba(255,255,255,0.05)',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
                      gap: '8px'
                    }}
                  >
                    {computeBoothsForWard(formData.wardNumber).map((booth) => (
                      <div
                        key={booth}
                        style={{
                          padding: '8px',
                          background: 'rgba(244,169,0,0.15)',
                          border: '1px solid rgba(244,169,0,0.4)',
                          borderRadius: '4px',
                          color: '#F4A900',
                          fontSize: '13px',
                          fontWeight: '600',
                          textAlign: 'center'
                        }}
                      >
                        {booth}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '6px', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                    Booth assignments are automatically determined by ward number
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder={t.phonePlaceholder}
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
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>{t.youtubeLink}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>{t.optional}</span>
                </label>
                <input
                  type="url"
                  name="youtubeLink"
                  value={formData.youtubeLink}
                  onChange={handleChange}
                  placeholder={t.youtubePlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>{t.websiteLink}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>{t.optional}</span>
                </label>
                <input
                  type="url"
                  name="websiteLink"
                  value={formData.websiteLink}
                  onChange={handleChange}
                  placeholder={t.websitePlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>{t.donationAmount}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>{t.optional}</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name="donationAmount"
                  value={formData.donationAmount}
                  onChange={handleChange}
                  placeholder={t.donationPlaceholder}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between', color: '#F4A900', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  <span>{t.othersField}</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '400' }}>{t.optional}</span>
                </label>
                <textarea
                  name="othersField"
                  value={formData.othersField}
                  onChange={handleChange}
                  placeholder={t.othersPlaceholder}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
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
                {loading ? (isEditing ? t.updating : t.creating) : (isEditing ? t.updateAgent : t.createAgent)}
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

          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid rgba(200,16,46,0.2)'
            }}
          >
            <h3 style={{ color: '#F4A900', fontSize: '20px', fontWeight: 'bold', margin: '0 0 16px 0' }}>
              {t.existingAgents}
            </h3>

            {wardAgents.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textAlign: 'center', margin: '40px 0' }}>
                {t.noAgents}
              </p>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                {wardAgents.map((agent) => (
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <h4 style={{ color: '#fff', fontSize: '16px', fontWeight: '600', margin: 0 }}>{agent.name}</h4>
                      <span
                        style={{
                          padding: '4px 8px',
                          background: agent.isActive ? 'rgba(76,175,80,0.2)' : 'rgba(255,193,7,0.2)',
                          color: agent.isActive ? '#4CAF50' : '#FFC107',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {t.active}
                      </span>
                    </div>

                    <div style={{ fontSize: '14px', color: '#fff', marginBottom: '6px' }}>
                      Ward: <span style={{ color: '#F4A900', fontWeight: '600' }}>{agent.wardNumber || '-'}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#fff', marginBottom: '6px' }}>
                      Booths: <span style={{ color: '#F4A900', fontWeight: '600' }}>{(agent.boothsUndertaking || []).join(', ') || '-'}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#fff', marginBottom: '6px' }}>
                      Phone: {agent.phoneNumber || '-'}
                    </div>
                    {agent.othersField && (
                      <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
                        Others: {agent.othersField}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                      <button
                        type="button"
                        onClick={() => handleEdit(agent)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          background: 'rgba(244,169,0,0.18)',
                          color: '#F4A900',
                          border: '1px solid rgba(244,169,0,0.5)',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {t.edit}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(agent.id)}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          background: 'rgba(200,16,46,0.14)',
                          color: '#FF6B6B',
                          border: '1px solid rgba(200,16,46,0.5)',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWardAgent;

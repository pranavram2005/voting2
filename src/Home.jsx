import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import voteData from './voting/output.jsx';

export default function HomePage({ languageMode = 'tamil' }) {
  const navigate = useNavigate();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [confirmationStats, setConfirmationStats] = useState({
    totalVoters: 0,
    totalConfirmed: 0,
    confirmationPercent: 0,
    perAgent: {}
  });

  // Translation texts
  const translations = {
    tamil: {
      alertMessage: "பெயர் அல்லது EPIC எண் உள்ளிடுங்கள்",
      tvkDescription: "தமிழக வெற்றி கழகம் (TVK) 2026 சட்டமன்றத் தேர்தலில் அனைத்து 234 தொகுதிகளிலும் போட்டியிட தயாராகி வருகிறது. வாக்காளர் தரவு பகுப்பாய்வு மற்றும் தொகுதி ஒழுங்கமைப்பு மூலம் மக்களுக்கான வெற்றியை நோக்கி முன்னேறுகிறோம்.",
      voterVerification: "வாக்காளர் சரிபார்ப்பு",
      totalVoters: "மொத்த வாக்காளர்கள்",
      maleVoters: "ஆண் வாக்காளர்கள்",
      femaleVoters: "பெண் வாக்காளர்கள்",
      youthVoters: "இளைஞர் வாக்காளர்கள்",
      voterAnalysis: "📊 வாக்காளர் பகுப்பாய்வு",
      genderWiseAnalysis: "பாலினவாரியான வாக்காளர் பகுப்பு",
      ageWiseAnalysis: "வயதுவாரியான வாக்காளர் பகுப்பு",
      voterSearchTool: "🔍 வாக்காளர் தேடல் கருவி",
      searchTitle: "வாக்காளர் சரிபார்ப்பு / வாக்காளர் பட்டியல் தேடல்",
      searchSubtitle: "உங்கள் பெயர் வாக்காளர் பட்டியலில் உள்ளதா என சரிபார்க்கவும் | Verify your name in the Electoral Roll",
      selectDistrict: "மாவட்டம் தேர்வு செய்யவும் / Select District",
      selectConstituency: "தொகுதி தேர்வு செய்யவும் / Select Constituency",
      nameLabel: "பெயர் (Name)",
      namePlaceholder: "உங்கள் பெயர் உள்ளிடவும் / Enter your name",
      epicLabel: "EPIC / வாக்காளர் எண்",
      epicPlaceholder: "EPIC எண் உள்ளிடவும் / Enter EPIC number",
      searchButton: "🔍 தேடல் / Search",
      foundInList: "வாக்காளர் பட்டியலில் கண்டறியப்பட்டது!",
      voterServices: "வாக்காளர் சேவைகள்",
      voterRegistration: "வாக்காளர் பதிவு",
      nameVerification: "பெயர் சரிபார்ப்பு",
      dataAnalysis: "தரவு பகுப்பாய்வு",
      electionStats: "🗳️ தேர்தல் புள்ளிவிவரங்கள் 2026",
      assemblySeats: "சட்டமன்ற தொகுதிகள்",
      districts: "மாவட்டங்கள்",
      avgTurnout: "சராசரி வாக்கு சதவீதம்",
      tnElections: "2026 தமிழ்நாடு தேர்தல்",
      registrationDeadline: "வாக்காளர் பதிவு கடைசி நாள்: மார்ச் 15, 2026",
      copyright: "© 2026 தமிழக வெற்றி கழகம் (TVK). அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
      dataSource: "தேர்தல் தரவுகள்: தேர்தல் ஆணையம் | தமிழ்நாடு தலைமை தேர்தல் அதிகாரி | ஒரு மக்கள் இயக்கம்",
      electoralRoll: "தேர்தல் பட்டியல்",
      tvkPolicies: "🎯 TVK கொள்கைகள் & இலக்குகள்",
      foundInRoll2026: "தேர்தல் பட்டியலில் கண்டறியப்பட்டது — 2026",
      tamilnaduTitle: "தமிழகத்தின்",
      victoryJourney: "வெற்றி பயணம்",
      missionStatement: "▶ TVK · 2026 தேர்தல் இலக்கு",
      powerTagline: "மக்கள் சக்தியால் வெற்றி — Victory through People's Power",
      educationTitle: "கல்வி சமத்துவம்",
      educationDesc: "அரசுப் பள்ளிகளில் தரமான கல்வி, ஆங்கில வழிக் கல்வி, ஆராய்ச்சி மானியங்கள் மற்றும் உயர்கல்வி உதவித்தொகை.",
      womenTitle: "பெண் சக்தியாக்கம்",
      womenDesc: "பெண்களுக்கு 40% இட ஒதுக்கீடு, தொழில்முனைவோர் மானியம், பாதுகாப்பு மற்றும் சுய உதவிக் குழுக்கள் விரிவாக்கம்.",
      farmerTitle: "விவசாயி நலன்",
      farmerDesc: "விவசாய கடன் தள்ளுபடி, நியாயமான MSP விலை, சொட்டு நீர்ப்பாசனம், இயற்கை விவசாயம் ஊக்கம்.",
      industryTitle: "தொழில் வளர்ச்சி",
      industryDesc: "IT பூங்காக்கள், ஸ்டார்ட்அப் சுற்றுச்சூழல், திறன் மேம்பாடு மற்றும் வேலைவாய்ப்பு உருவாக்கம்.",
      healthcareTitle: "இலவச சுகாதாரம்",
      healthcareDesc: "அனைவருக்கும் இலவச மருத்துவம், ஆரம்ப சுகாதார மேம்பாடு, மருந்துகள் இலவச விநியோகம்.",
      environmentTitle: "சுற்றுச்சூழல் பாதுகாப்பு",
      environmentDesc: "புதுப்பிக்கத்தக்க ஆற்றல், காவேரி பாதுகாப்பு, மரம் நடுதல் இயக்கம், கடல் வளம் பாதுகாப்பு.",
      tvkTagline: "தமிழக வெற்றி கழகம்",
      footerDescription: "மக்களின் குரலை பிரதிநிதித்துவப்படுத்தும் இந்த தளம் 2026 தேர்தலில் TVK வெற்றிக்காக அர்ப்பணிக்கப்பட்டுள்ளது. உங்கள் வாக்கு மாற்றத்தை உருவாக்கும்.",
      womenLabel: "பெண்கள்",
      menLabel: "ஆண்கள்", 
      othersLabel: "மற்றவர்",
      partyInfo: "கட்சி தகவல்",
      aboutTVK: "TVK பற்றி", 
      leaderMessage: "தலைவர் செய்தி",
      policyStatement: "கொள்கை அறிக்கை",
      memberRegistration: "உறுப்பினர் பதிவு",
      contact: "தொடர்பு",
      epicDownload: "EPIC கார்டு பதிவிறக்கம்",
      boothSearch: "வாக்குச்சாவடி தேடல்",
      tvkHeadquarters: "📍 TVK தலைமையகம்",
      tvkPhone: "📞 1800-TVK-2026",
      tvkEmail: "📧 info@tvk.org.in", 
      tvkTwitter: "🐦 Twitter/X: @TVKOfficial",
      tickerText: "தமிழக வெற்றி கழகம் — TVK OFFICIAL PORTAL — 2026 சட்டமன்ற தேர்தல்கள்",
      districtStrength: "மாவட்ட வாரியான TVK வலிமை"
    },
    english: {
      alertMessage: "Please enter Name or EPIC number",
      tvkDescription: "Tamilaga Vetri Kazhagam (TVK) is preparing to contest in all 234 constituencies in the 2026 Assembly elections. Through voter data analysis and constituency organization, we are moving towards victory for the people.",
      voterVerification: "Voter Verification",
      totalVoters: "Total Voters",
      maleVoters: "Male Voters", 
      femaleVoters: "Female Voters",
      youthVoters: "Youth Voters",
      voterAnalysis: "📊 Voter Analysis",
      genderWiseAnalysis: "Gender-wise Voter Distribution",
      ageWiseAnalysis: "Age-wise Voter Distribution", 
      voterSearchTool: "🔍 Voter Search Tool",
      searchTitle: "Voter Verification / Electoral Roll Search",
      searchSubtitle: "Verify your name in the Electoral Roll",
      selectDistrict: "Select District",
      selectConstituency: "Select Constituency",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      epicLabel: "EPIC / Voter ID",
      epicPlaceholder: "Enter EPIC number",
      searchButton: "🔍 Search",
      foundInList: "Found in Electoral Roll!",
      voterServices: "Voter Services",
      voterRegistration: "Voter Registration", 
      nameVerification: "Name Verification",
      dataAnalysis: "Data Analysis",
      electionStats: "🗳️ Election Statistics 2026",
      assemblySeats: "Assembly Seats",
      districts: "Districts", 
      avgTurnout: "Average Voter Turnout",
      tnElections: "2026 Tamil Nadu Elections",
      registrationDeadline: "Voter Registration Deadline: March 15, 2026",
      copyright: "© 2026 Tamilaga Vetri Kazhagam (TVK). All rights reserved.",
      dataSource: "Electoral data sourced from ECI | Tamil Nadu CEO | A People's Movement",
      electoralRoll: "ELECTORAL ROLL",
      tvkPolicies: "🎯 TVK Policies & Goals",
      foundInRoll2026: "Found in Electoral Roll — 2026",
      tamilnaduTitle: "Tamil Nadu's",
      victoryJourney: "Victory Journey", 
      missionStatement: "▶ TVK · 2026 ELECTION MISSION",
      powerTagline: "Victory through People's Power — மக்கள் சக்தியால் வெற்றி",
      educationTitle: "Educational Equity", 
      educationDesc: "Quality education in government schools, English medium education, research grants and higher education scholarships.",
      womenTitle: "Women Empowerment",
      womenDesc: "40% reservation for women, entrepreneurship grants, safety and expansion of self-help groups.",
      farmerTitle: "Farmer Welfare",
      farmerDesc: "Farm loan waiver, fair MSP prices, drip irrigation, organic farming promotion.", 
      industryTitle: "Industrial Development",
      industryDesc: "IT parks, startup ecosystem, skill development and job creation.",
      healthcareTitle: "Free Healthcare",
      healthcareDesc: "Free medical care for all, primary healthcare improvement, free medicine distribution.",
      environmentTitle: "Environmental Protection", 
      environmentDesc: "Renewable energy, Kaveri protection, tree planting movement, marine conservation.",
      tvkTagline: "Tamilaga Vetri Kazhagam",
      footerDescription: "This platform representing the people's voice is dedicated to TVK's victory in the 2026 elections. Your vote will create change.", 
      womenLabel: "Women",
      menLabel: "Men",
      othersLabel: "Others",
      partyInfo: "Party Information",
      aboutTVK: "About TVK",
      leaderMessage: "Leader's Message", 
      policyStatement: "Policy Statement",
      memberRegistration: "Member Registration",
      contact: "Contact",
      epicDownload: "EPIC Card Download",
      boothSearch: "Polling Station Search",
      tvkHeadquarters: "📍 TVK Headquarters", 
      tvkPhone: "📞 1800-TVK-2026",
      tvkEmail: "📧 info@tvk.org.in",
      tvkTwitter: "🐦 Twitter/X: @TVKOfficial",
      tickerText: "தமிழக வெற்றி கழகம் — TVK OFFICIAL PORTAL — 2026 ASSEMBLY ELECTIONS",
      districtStrength: "District-wise TVK Strength"
    }
  };

  const t = translations[languageMode];

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [voterName, setVoterName] = useState('');
  const [voterEpic, setVoterEpic] = useState('');
  const [showResult, setShowResult] = useState(false);

  const constituencies = {
    'Chennai': ['Chennai Central','Chennai North','Chennai South','Perambur','Kolathur'],
    'Coimbatore': ['Coimbatore North','Coimbatore South','Kinathukadavu','Pollachi'],
    'Madurai': ['Madurai East','Madurai West','Madurai North','Sholavandan'],
    'Trichy': ['Trichy West','Trichy East','Srirangam','Lalgudi'],
    'Salem': ['Salem North','Salem South','Omalur','Mettur'],
    'Vellore': ['Vellore','Anaikattu','Kilvaithinankuppam'],
    'Tirunelveli': ['Tirunelveli','Ambasamudram','Nanguneri'],
    'Thanjavur': ['Thanjavur','Papanasam','Kumbakonam'],
    'Erode': ['Erode East','Erode West','Bhavani','Anthiyur'],
    'Villupuram': ['Villupuram','Tindivanam','Kallakurichi']
  };

  const searchVoter = () => {
    if (!voterName && !voterEpic) {
      alert(t.alertMessage);
      return;
    }
    setShowResult(true);
  };

  const districts = [
    { name: 'Chennai', strength: '42.3%', votes: '42' },
    { name: 'கோயம்புத்தூர் (Coimbatore)', strength: '38.7%', votes: '39' },
    { name: 'மதுரை (Madurai)', strength: '35.2%', votes: '35' },
    { name: 'திருச்சி (Trichy)', strength: '31.8%', votes: '32' },
    { name: 'சேலம் (Salem)', strength: '28.4%', votes: '28' },
    { name: 'திருநெல்வேலி (Tirunelveli)', strength: '26.1%', votes: '26' },
    { name: 'வேலூர் (Vellore)', strength: '33.5%', votes: '34' }
  ];

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.role === 'super_admin') {
          setIsSuperAdmin(true);
        }
      }
    } catch (e) {
      setIsSuperAdmin(false);
    }

    try {
      const allVoteData = voteData || [];
      const rawChecklists = localStorage.getItem('voterChecklists');
      const parsedChecklists = rawChecklists ? JSON.parse(rawChecklists) : {};
      const confirmedEntries = Object.entries(parsedChecklists).filter(([, info]) => info && info.confirmed);

      const totalVoters = allVoteData.length || 0;
      const totalConfirmed = confirmedEntries.length;
      const confirmationPercent = totalVoters > 0 ? (totalConfirmed / totalVoters) * 100 : 0;

      const perAgentMap = {};
      confirmedEntries.forEach(([, info]) => {
        const agent = info.confirmedBy || 'Unknown';
        if (!perAgentMap[agent]) {
          perAgentMap[agent] = {
            count: 0,
            boothNumbers: new Set()
          };
        }
        perAgentMap[agent].count += 1;
        if (info.boothNumber) {
          perAgentMap[agent].boothNumbers.add(String(info.boothNumber));
        }
      });

      const perAgent = Object.fromEntries(
        Object.entries(perAgentMap).map(([agent, info]) => [
          agent,
          {
            count: info.count,
            boothNumbers: Array.from(info.boothNumbers || [])
          }
        ])
      );

      setConfirmationStats({
        totalVoters,
        totalConfirmed,
        confirmationPercent,
        perAgent
      });
    } catch (e) {
      setConfirmationStats({
        totalVoters: 0,
        totalConfirmed: 0,
        confirmationPercent: 0,
        perAgent: {}
      });
    }
  }, []);

  return (
    <div className="home-container" style={{
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: '#0D0D0D',
      color: '#FFF8F0',
      overflow: 'hidden'
    }}>
      {/* Header Top */}
      <div className="ticker-header" style={{
        background: '#C8102E',
        textAlign: 'center',
        padding: 'clamp(4px, 2vw, 8px)',
        fontSize: 'clamp(10px, 2.5vw, 14px)',
        letterSpacing: 'clamp(1px, 0.5vw, 3px)',
        fontWeight: '700',
        color: '#fff'
      }}>
        {t.tickerText}
      </div>

      {/* Ticker */}
      <div className="news-ticker-container" style={{
        background: 'rgba(200,16,46,0.1)',
        borderBottom: '1px solid rgba(200,16,46,0.2)',
        overflow: 'hidden',
        padding: 'clamp(6px, 1.5vw, 10px) 0'
      }}>
        <div className="ticker-content" style={{
          display: 'flex',
          animation: 'ticker 35s linear infinite',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ 
            padding: 'clamp(0px, 2vw, 0px) clamp(20px, 5vw, 40px)', 
            fontSize: 'clamp(10px, 2.2vw, 14px)' 
          }}>
            🗳️ <strong style={{color: '#F4A900'}}>{t.tnElections}</strong> — {t.registrationDeadline}
          </span>
          <span style={{ 
            padding: 'clamp(0px, 2vw, 0px) clamp(20px, 5vw, 40px)', 
            fontSize: 'clamp(10px, 2.2vw, 14px)' 
          }}>
            📊 <strong style={{color: '#F4A900'}}>6.23 Crore</strong> Registered Voters in Tamil Nadu
          </span>
          <span style={{ 
            padding: 'clamp(0px, 2vw, 0px) clamp(20px, 5vw, 40px)', 
            fontSize: 'clamp(10px, 2.2vw, 14px)' 
          }}>
            🏛️ <strong style={{color: '#F4A900'}}>234 Constituencies</strong> across 38 Districts
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="hero-section" style={{
        minHeight: 'clamp(70vh, 90vh, 100vh)',
        background: 'radial-gradient(ellipse at 20% 50%, rgba(200,16,46,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(244,169,0,0.08) 0%, transparent 50%), linear-gradient(180deg, #0D0D0D 0%, #1A0505 100%)',
        display: 'grid',
        gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr',
        alignItems: 'center',
        padding: 'clamp(20px, 8vw, 80px) clamp(15px, 6vw, 60px)',
        gap: 'clamp(30px, 8vw, 60px)',
        position: 'relative'
      }}>
        <div className="hero-content" style={{ 
          position: 'relative', 
          zIndex: 2,
          textAlign: window.innerWidth <= 768 ? 'center' : 'left'
        }}>
          <div className="mission-badge" style={{
            display: 'inline-block',
            background: 'rgba(200,16,46,0.2)',
            border: '1px solid #C8102E',
            color: '#F4A900',
            padding: 'clamp(4px, 1vw, 8px) clamp(12px, 3vw, 16px)',
            borderRadius: '20px',
            fontSize: 'clamp(10px, 2vw, 14px)',
            letterSpacing: 'clamp(1px, 0.5vw, 3px)',
            fontWeight: '700',
            marginBottom: 'clamp(16px, 4vw, 24px)'
          }}>
            {t.missionStatement}
          </div>
          
          <h2 className="hero-title" style={{
            fontSize: 'clamp(28px, 8vw, 52px)',
            lineHeight: '1.2',
            color: '#fff',
            marginBottom: 'clamp(8px, 2vw, 12px)',
            fontWeight: 'bold'
          }}>
            {t.tamilnaduTitle}<br/><span style={{color: '#F4A900'}}>{t.victoryJourney}</span>
          </h2>
          
          <p className="hero-subtitle" style={{
            fontSize: 'clamp(14px, 3.5vw, 18px)',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: 'clamp(12px, 2.5vw, 16px)',
            fontStyle: 'italic'
          }}>
            {t.powerTagline}
          </p>
          
          <p className="hero-description" style={{
            fontSize: 'clamp(12px, 2.8vw, 15px)',
            color: 'rgba(255,255,255,0.6)',
            lineHeight: '1.8',
            marginBottom: 'clamp(24px, 6vw, 36px)',
            maxWidth: window.innerWidth <= 768 ? '100%' : '480px'
          }}>
            {t.tvkDescription}
          </p>
          
          <div className="hero-buttons" style={{ 
            display: 'flex', 
            gap: 'clamp(12px, 3vw, 16px)', 
            flexWrap: 'wrap',
            justifyContent: window.innerWidth <= 768 ? 'center' : 'flex-start'
          }}>
            <button 
              className="cta-button" 
              style={{
                background: 'linear-gradient(135deg, #C8102E, #A00020)',
                color: '#fff',
                border: 'none',
                padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
                borderRadius: '4px',
                fontSize: 'clamp(12px, 2.5vw, 16px)',
                fontWeight: '700',
                cursor: 'pointer',
                letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                textTransform: 'uppercase',
                boxShadow: '0 4px 20px rgba(200,16,46,0.4)',
                minHeight: '44px',
                minWidth: window.innerWidth <= 768 ? '100%' : 'auto',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 32px rgba(200,16,46,0.6)';
                e.target.style.background = 'linear-gradient(135deg, #E01B3A, #C8102E)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 20px rgba(200,16,46,0.4)';
                e.target.style.background = 'linear-gradient(135deg, #C8102E, #A00020)';
              }}
              onClick={() => {
                document.getElementById('voter-search-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t.voterVerification}
            </button>
            <button 
              style={{
                background: 'transparent',
                color: '#F4A900',
                border: '2px solid #F4A900',
                padding: 'clamp(10px, 2.5vw, 12px) clamp(24px, 6vw, 30px)',
                borderRadius: '4px',
                fontSize: 'clamp(12px, 2.5vw, 14px)',
                fontWeight: '700',
                cursor: 'pointer',
                letterSpacing: 'clamp(1px, 0.3vw, 2px)',
                minHeight: '44px',
                minWidth: window.innerWidth <= 768 ? '100%' : 'auto',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#F4A900';
                e.target.style.color = '#000';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 16px rgba(244,169,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#F4A900';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              onClick={() => navigate('/dashboard')}
            >
              தரவு பகুப்பாய்வு
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '32px',
            backdropFilter: 'blur(10px)'
          }}>
            <h3 style={{
              fontSize: '13px',
              letterSpacing: '3px',
              color: '#F4A900',
              marginBottom: '24px',
              textTransform: 'uppercase'
            }}>
                            {t.electionStats}
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <StatCard value="6.23Cr" label={t.totalVoters} />
              <StatCard value="234" label={t.assemblySeats} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <StatCard value="38" label={t.districts} />
              <StatCard value="68%" label={t.avgTurnout} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <StatCard value="3.18Cr" label={t.femaleVoters} />
              <StatCard value="1.2Cr" label={t.youthVoters} />
            </div>
          </div>
        </div>
      </section>

      {isSuperAdmin && (
        <section style={{
          padding: '32px 24px',
          background: 'rgba(255,255,255,0.01)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}>
          <div style={{
            maxWidth: '1080px',
            margin: '0 auto'
          }}>
            <h2 style={{
              fontSize: '20px',
              color: '#F4A900',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>✅</span>
              <span>TVK Victory</span>
            </h2>

            <div style={{
              marginBottom: '20px',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(244,169,0,0.3)',
              background: 'rgba(244,169,0,0.05)'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: window.innerWidth <= 768 ? 'column' : 'row',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    Total voters in database
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {confirmationStats.totalVoters.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                    Confirmed by booth agents
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    {confirmationStats.totalConfirmed.toLocaleString()} ({confirmationStats.confirmationPercent.toFixed(1)}%)
                  </div>
                </div>
              </div>
              <div style={{
                width: '100%',
                height: '16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${confirmationStats.confirmationPercent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #2ECC71, #27AE60, #2ECC71)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            <div style={{
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)'
            }}>
              <h3 style={{
                fontSize: '16px',
                marginBottom: '10px',
                color: '#F4A900'
              }}>
                Per Booth Agent Summary
              </h3>
              {Object.keys(confirmationStats.perAgent).length === 0 ? (
                <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>
                  No confirmed votes recorded yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px'
                  }}>
                    <thead>
                      <tr style={{
                        background: 'rgba(255,255,255,0.06)',
                        borderBottom: '1px solid rgba(255,255,255,0.15)'
                      }}>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Agent</th>
                        <th style={{ padding: '8px', textAlign: 'left' }}>Booth(s)</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Confirmed Votes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(confirmationStats.perAgent).map(([agent, info]) => (
                        <tr key={agent} style={{
                          borderBottom: '1px solid rgba(255,255,255,0.06)'
                        }}>
                          <td style={{ padding: '8px' }}>{agent}</td>
                          <td style={{ padding: '8px' }}>{(info.boothNumbers || []).join(', ') || '-'}</td>
                          <td style={{ padding: '8px', textAlign: 'right' }}>
                            {info.count.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Voter Analysis Section */}
      <section style={{
        padding: '80px 60px',
        background: 'rgba(255,255,255,0.01)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '50px'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(200,16,46,0.6), transparent)'
          }}></div>
          <h2 style={{
            fontSize: '32px',
            letterSpacing: '4px',
            color: '#F4A900',
            whiteSpace: 'nowrap',
            fontWeight: 'bold'
          }}>
            {t.voterAnalysis}
          </h2>
          <span style={{
            background: '#C8102E',
            color: '#fff',
            fontSize: '10px',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '2px',
            fontWeight: '700'
          }}>
            LIVE DATA
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to left, rgba(200,16,46,0.6), transparent)'
          }}></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', marginBottom: '30px' }}>
          {/* District Strength */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '28px'
          }}>
            <div style={{
              fontSize: '12px',
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.5)',
              textTransform: 'uppercase',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <div style={{
                width: '4px',
                height: '14px',
                background: '#C8102E',
                borderRadius: '2px'
              }}></div>
              {t.districtStrength}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {districts.map((district, index) => (
                <DistrictBar key={index} {...district} />
              ))}
            </div>
          </div>

          {/* Gender & Age Charts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <GenderChart t={t} />
            <AgeChart t={t} />
          </div>
        </div>
      </section>

      {/* Voter Search Section */}
      <VoterSearchSection 
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedConstituency={selectedConstituency}
        setSelectedConstituency={setSelectedConstituency}
        voterName={voterName}
        setVoterName={setVoterName}
        voterEpic={voterEpic}
        setVoterEpic={setVoterEpic}
        constituencies={constituencies}
        searchVoter={searchVoter}
        showResult={showResult}
        t={t}
      />

      {/* Key Issues Section */}
      <IssuesSection t={t} />

      {/* Footer */}
      <FooterSection t={t} />

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

// Reusable Components
function StatCard({ value, label }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: 'clamp(16px, 4vw, 20px)',
      borderRadius: '10px',
      textAlign: 'center'
    }}>
      <div style={{
        fontSize: 'clamp(24px, 6vw, 36px)',
        color: '#F4A900',
        lineHeight: '1',
        fontWeight: 'bold',
        marginBottom: 'clamp(8px, 2vw, 12px)'
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 'clamp(10px, 2.5vw, 11px)',
        color: 'rgba(255,255,255,0.5)',
        marginTop: '4px',
        letterSpacing: '1px'
      }}>
        {label}
      </div>
    </div>
  );
}

function DistrictBar({ name, strength, votes }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '4px' }}>
        <span style={{ fontSize: 'clamp(11px, 2.5vw, 13px)', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{name}</span>
        <span style={{ fontSize: 'clamp(10px, 2vw, 12px)', color: '#F4A900', fontWeight: '700' }}>{strength}</span>
      </div>
      <div style={{
        height: '8px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${votes}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #C8102E, #FF4060)',
          borderRadius: '4px',
          transition: 'width 1.5s ease-out'
        }}></div>
      </div>
    </div>
  );
}

function GenderChart({ t }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: 'clamp(20px, 5vw, 28px)'
    }}>
      <div style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        letterSpacing: 'clamp(2px, 1vw, 3px)',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        marginBottom: 'clamp(16px, 4vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '4px',
          height: '14px',
          background: '#C8102E',
          borderRadius: '2px'
        }}></div>
        {t.genderWiseAnalysis}
      </div>
      
      <div style={{ display: 'flex', gap: 'clamp(16px, 4vw, 30px)', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ position: 'relative', width: 'clamp(80px, 20vw, 100px)', height: 'clamp(80px, 20vw, 100px)', flexShrink: 0 }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: 'clamp(18px, 5vw, 24px)',
              color: '#fff',
              lineHeight: '1',
              fontWeight: 'bold'
            }}>6.23</div>
            <div style={{
              fontSize: 'clamp(7px, 2vw, 9px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: '1px'
            }}>CRORE</div>
          </div>
        </div>
        
        <div style={{ flex: 1, width: '100%' }}>
          <GenderRow color="#E91E8C" label={t.womenLabel} value="3.18Cr" percentage="51.1%" />
          <GenderRow color="#3498DB" label={t.menLabel} value="3.04Cr" percentage="48.8%" />
          <GenderRow color="rgba(255,255,255,0.3)" label={t.othersLabel} value="6,240" percentage="0.1%" />
        </div>
      </div>
    </div>
  );
}

function GenderRow({ color, label, value, percentage }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 'clamp(8px, 2vw, 12px) 0',
      borderBottom: '1px solid rgba(255,255,255,0.06)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'clamp(11px, 2.5vw, 13px)' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }}></div>
        {label}
      </div>
      <div style={{textAlign: 'right'}}>
        <div style={{ fontSize: 'clamp(14px, 3vw, 16px)', color: '#F4A900', fontWeight: 'bold' }}>{value}</div>
        <div style={{ fontSize: 'clamp(9px, 2vw, 11px)', color: 'rgba(255,255,255,0.4)' }}>{percentage}</div>
      </div>
    </div>
  );
}

function AgeChart({ t }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ageData = [
    { range: '18-25', value: '1.2Cr', height: '60%' },
    { range: '26-35', value: '1.8Cr', height: '90%' },
    { range: '36-45', value: '1.5Cr', height: '75%' },
    { range: '46-55', value: '0.9Cr', height: '45%' },
    { range: '56-65', value: '0.53Cr', height: '26%' },
    { range: '65+', value: '0.31Cr', height: '15%' }
  ];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: 'clamp(20px, 5vw, 28px)'
    }}>
      <div style={{
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        letterSpacing: 'clamp(2px, 1vw, 3px)',
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase',
        marginBottom: 'clamp(16px, 4vw, 20px)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <div style={{
          width: '4px',
          height: '14px',
          background: '#C8102E',
          borderRadius: '2px'
        }}></div>
        {t.ageWiseAnalysis}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'clamp(8px, 2vw, 12px)', height: 'clamp(100px, 25vw, 120px)', paddingTop: '10px' }}>
        {ageData.map((age, index) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(4px, 1vw, 6px)', height: '100%' }}>
            <div style={{ fontSize: 'clamp(9px, 2vw, 11px)', color: 'rgba(255,255,255,0.8)', fontWeight: '700' }}>{age.value}</div>
            <div style={{
              width: '100%',
              height: age.height,
              borderRadius: '4px 4px 0 0',
              background: 'linear-gradient(180deg, #F4A900, rgba(244,169,0,0.4))',
              marginTop: 'auto'
            }}></div>
            <div style={{ fontSize: 'clamp(8px, 1.8vw, 10px)', color: 'rgba(255,255,255,0.5)' }}>{age.range}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VoterSearchSection({ selectedDistrict, setSelectedDistrict, selectedConstituency, setSelectedConstituency, voterName, setVoterName, voterEpic, setVoterEpic, constituencies, searchVoter, showResult, t }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="voter-search-section" style={{
      padding: isMobile ? 'clamp(40px, 8vw, 60px) clamp(15px, 4vw, 20px)' : 'clamp(60px, 10vw, 80px) clamp(40px, 8vw, 60px)',
      background: 'rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '10px' : '20px',
        marginBottom: isMobile ? '30px' : '50px',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        justifyContent: 'center'
      }}>
        <div style={{
          flex: isMobile ? 'none' : 1,
          height: '1px',
          background: 'linear-gradient(to right, rgba(200,16,46,0.6), transparent)',
          display: isMobile ? 'none' : 'block'
        }}></div>
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 32px)',
          letterSpacing: 'clamp(2px, 1vw, 4px)',
          color: '#F4A900',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {t.voterSearchTool}
        </h2>
        <span style={{
          background: '#C8102E',
          color: '#fff',
          fontSize: 'clamp(8px, 2vw, 10px)',
          padding: 'clamp(3px, 1vw, 3px) clamp(8px, 2vw, 10px)',
          borderRadius: '20px',
          letterSpacing: 'clamp(1px, 0.5vw, 2px)',
          fontWeight: '700'
        }}>
          {t.electoralRoll}
        </span>
        <div style={{
          flex: isMobile ? 'none' : 1,
          height: '1px',
          background: 'linear-gradient(to left, rgba(200,16,46,0.6), transparent)',
          display: isMobile ? 'none' : 'block'
        }}></div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(200,16,46,0.08), rgba(244,169,0,0.04))',
        border: '1px solid rgba(200,16,46,0.2)',
        borderRadius: '16px',
        padding: isMobile ? 'clamp(20px, 5vw, 30px)' : 'clamp(30px, 6vw, 40px)'
      }}>
        <h3 style={{
          fontSize: 'clamp(18px, 4vw, 24px)',
          letterSpacing: 'clamp(1px, 0.5vw, 3px)',
          color: '#F4A900',
          marginBottom: 'clamp(8px, 2vw, 8px)',
          fontWeight: 'bold',
          textAlign: isMobile ? 'center' : 'left'
        }}>{t.searchTitle}</h3>
        <p style={{ 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: 'clamp(11px, 2.5vw, 13px)', 
          marginBottom: 'clamp(20px, 5vw, 24px)',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {t.searchSubtitle}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr) auto',
          gap: isMobile ? 'clamp(16px, 4vw, 20px)' : '12px',
          alignItems: 'end'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 'clamp(1px, 0.5vw, 2px)',
              textTransform: 'uppercase'
            }}>மாவட்டம் (District)</label>
            <select 
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
                color: '#fff',
                fontSize: 'clamp(12px, 2.5vw, 13px)',
                minHeight: '44px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(244,169,0,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              <option value="">{t.selectDistrict}</option>
              {Object.keys(constituencies).map(district => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 'clamp(1px, 0.5vw, 2px)',
              textTransform: 'uppercase'
            }}>தொகுதி (Constituency)</label>
            <select 
              value={selectedConstituency}
              onChange={(e) => setSelectedConstituency(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
                color: '#fff',
                fontSize: 'clamp(12px, 2.5vw, 13px)',
                minHeight: '44px',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(244,169,0,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
              }}
            >
              <option value="">{t.selectConstituency}</option>
              {(constituencies[selectedDistrict] || []).map(constituency => (
                <option key={constituency} value={constituency}>{constituency}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 'clamp(1px, 0.5vw, 2px)',
              textTransform: 'uppercase'
            }}>{t.nameLabel}</label>
            <input 
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              placeholder={t.namePlaceholder}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
                color: '#fff',
                fontSize: '16px', // Fixed at 16px to prevent iOS zoom
                minHeight: '44px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(244,169,0,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: 'clamp(10px, 2vw, 11px)',
              color: 'rgba(255,255,255,0.5)',
              letterSpacing: 'clamp(1px, 0.5vw, 2px)',
              textTransform: 'uppercase'
            }}>{t.epicLabel}</label>
            <input 
              type="text"
              value={voterEpic}
              onChange={(e) => setVoterEpic(e.target.value)}
              placeholder={t.epicPlaceholder}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '6px',
                padding: 'clamp(8px, 2vw, 10px) clamp(12px, 3vw, 14px)',
                color: '#fff',
                fontSize: '16px', // Fixed at 16px to prevent iOS zoom
                minHeight: '44px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(244,169,0,0.5)';
                e.target.style.background = 'rgba(255,255,255,0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)';
                e.target.style.background = 'rgba(255,255,255,0.06)';
              }}
            />
          </div>

          <button 
            onClick={searchVoter}
            style={{
              background: 'linear-gradient(135deg, #C8102E, #A00020)',
              color: '#fff',
              border: 'none',
              padding: 'clamp(10px, 2.5vw, 12px) clamp(20px, 5vw, 24px)',
              borderRadius: '4px',
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: 'clamp(1px, 0.5vw, 2px)',
              whiteSpace: 'nowrap',
              minHeight: '48px',
              minWidth: isMobile ? '100%' : 'auto',
              transition: 'all 0.3s ease',
              marginTop: isMobile ? '10px' : '0'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #E01B3A, #C8102E)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 24px rgba(200,16,46,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #C8102E, #A00020)';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            {t.searchButton}
          </button>
        </div>

        {showResult && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(46,204,113,0.3)',
            borderRadius: '12px',
            padding: isMobile ? 'clamp(20px, 5vw, 24px)' : 'clamp(24px, 5vw, 28px)',
            marginTop: 'clamp(16px, 4vw, 20px)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              marginBottom: '20px',
              flexDirection: isMobile ? 'column' : 'row',
              textAlign: isMobile ? 'center' : 'left'
            }}>
              <div style={{
                width: 'clamp(32px, 8vw, 40px)',
                height: 'clamp(32px, 8vw, 40px)',
                background: 'rgba(46,204,113,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(16px, 4vw, 20px)'
              }}>✓</div>
              <div>
                <div style={{ 
                  fontSize: 'clamp(12px, 3vw, 14px)', 
                  fontWeight: '700', 
                  color: '#2ECC71' 
                }}>
                  {t.foundInList}
                </div>
                <div style={{ 
                  fontSize: 'clamp(10px, 2.5vw, 12px)', 
                  color: 'rgba(255,255,255,0.5)' 
                }}>
                  {t.foundInRoll2026}
                </div>
              </div>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'repeat(4, 1fr)',
              gap: isMobile ? '16px' : '20px'
            }}>
              <VoterInfoItem label="பெயர் (Name)" value={voterName || 'Sample Voter'} />
              <VoterInfoItem label="EPIC எண்" value={voterEpic || 'TN/01/234/567890'} />
              <VoterInfoItem label="வாக்குச்சாவடி" value={`வாக்குச்சாவடி ${Math.floor(Math.random() * 300 + 1)}`} />
              <VoterInfoItem label="தொகுதி" value={selectedConstituency || selectedDistrict || 'Chennai'} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}


function VoterInfoItem({ label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.05)',
      padding: 'clamp(12px, 3vw, 16px)',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        fontSize: 'clamp(9px, 2vw, 10px)',
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 'clamp(1px, 0.5vw, 2px)',
        textTransform: 'uppercase',
        marginBottom: 'clamp(4px, 1vw, 4px)'
      }}>{label}</div>
      <div style={{ 
        fontSize: 'clamp(14px, 3vw, 16px)', 
        color: '#fff', 
        fontWeight: '700',
        wordBreak: 'break-all'
      }}>{value}</div>
    </div>
  );
}

function IssuesSection({ t }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const issues = [
    { icon: '🎓', title: t.educationTitle, desc: t.educationDesc },
    { icon: '👩‍💼', title: t.womenTitle, desc: t.womenDesc },
    { icon: '🌾', title: t.farmerTitle, desc: t.farmerDesc },
    { icon: '🏗️', title: t.industryTitle, desc: t.industryDesc },
    { icon: '🏥', title: t.healthcareTitle, desc: t.healthcareDesc },
    { icon: '🌿', title: t.environmentTitle, desc: t.environmentDesc }
  ];

  return (
    <section style={{ padding: isMobile ? 'clamp(40px, 8vw, 60px) clamp(15px, 4vw, 20px)' : 'clamp(60px, 10vw, 80px) clamp(40px, 8vw, 60px)' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '10px' : '20px',
        marginBottom: isMobile ? '30px' : '50px',
        justifyContent: 'center'
      }}>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to right, rgba(200,16,46,0.6), transparent)',
          display: isMobile ? 'none' : 'block'
        }}></div>
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 32px)',
          letterSpacing: 'clamp(2px, 1vw, 4px)',
          color: '#F4A900',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          {t.tvkPolicies}
        </h2>
        <div style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(to left, rgba(200,16,46,0.6), transparent)',
          display: isMobile ? 'none' : 'block'
        }}></div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(clamp(280px, 80vw, 350px), 1fr))',
        gap: 'clamp(20px, 5vw, 30px)',
        justifyContent: 'center'
      }}>
        {issues.map((issue, index) => (
          <IssueCard key={index} {...issue} />
        ))}
      </div>
    </section>
  );
}

function IssueCard({ icon, title, desc }) {
  return (
    <div style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding: 'clamp(20px, 5vw, 24px)',
      transition: 'all 0.3s ease',
      cursor: 'default'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.borderColor = 'rgba(244,169,0,0.5)';
      e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <span style={{ fontSize: 'clamp(24px, 6vw, 32px)' }}>{icon}</span>
        <h3 style={{
          fontSize: 'clamp(16px, 4vw, 18px)',
          color: '#fff',
          fontWeight: '700',
          margin: 0
        }}>{title}</h3>
      </div>
      <p style={{
        fontSize: 'clamp(12px, 3vw, 14px)',
        color: 'rgba(255,255,255,0.7)',
        lineHeight: '1.7',
        margin: 0
      }}>{desc}</p>
    </div>
  );
}

function FooterSection({ t }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={{
      background: '#0A0A0A',
      borderTop: '1px solid rgba(200,16,46,0.3)',
      padding: isMobile ? 'clamp(30px, 8vw, 40px) clamp(15px, 4vw, 20px)' : 'clamp(40px, 8vw, 50px) clamp(40px, 8vw, 60px) 30px'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr',
        gap: 'clamp(30px, 8vw, 40px)',
        marginBottom: 'clamp(30px, 8vw, 40px)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: 'clamp(32px, 8vw, 40px)',
              height: 'clamp(32px, 8vw, 40px)',
              background: '#F4A900',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'clamp(16px, 4vw, 20px)'
            }}>☀️</div>
            <div>
              <div style={{
                fontSize: 'clamp(18px, 5vw, 22px)',
                letterSpacing: 'clamp(2px, 1vw, 3px)',
                color: '#F4A900',
                fontWeight: 'bold'
              }}>TVK</div>
              <div style={{
                fontSize: 'clamp(8px, 2vw, 10px)',
                color: 'rgba(255,255,255,0.4)',
                letterSpacing: '1px'
              }}>{ t.tvkTagline}</div>
            </div>
          </div>
          <p style={{
            fontSize: 'clamp(11px, 2.5vw, 13px)',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: '1.8'
          }}>
            {t.footerDescription}
          </p>
        </div>
        
        <FooterColumn title={t.voterServices}>
          <FooterLink text={t.voterRegistration} />
          <FooterLink text={t.nameVerification} />
          <FooterLink text={t.epicDownload} />
          <FooterLink text={t.boothSearch} />
        </FooterColumn>
        
        <FooterColumn title={t.partyInfo}>
          <FooterLink text={t.aboutTVK} />
          <FooterLink text={t.leaderMessage} />
          <FooterLink text={t.policyStatement} />
          <FooterLink text={t.memberRegistration} />
        </FooterColumn>
        
        <FooterColumn title={t.contact}>
          <FooterLink text={t.tvkHeadquarters} />
          <FooterLink text={t.tvkPhone} />
          <FooterLink text={t.tvkEmail} />
          <FooterLink text={t.tvkTwitter} />
        </FooterColumn>
      </div>
      
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: 'clamp(20px, 5vw, 24px)',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 'clamp(10px, 2.5vw, 12px)',
        color: 'rgba(255,255,255,0.3)',
        gap: isMobile ? '8px' : '0'
      }}>
        <div>{t.copyright}</div>
        <div>{t.dataSource}</div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }) {
  return (
    <div>
      <h4 style={{
        fontSize: 'clamp(10px, 2.5vw, 11px)',
        letterSpacing: 'clamp(2px, 1vw, 3px)',
        color: '#F4A900',
        textTransform: 'uppercase',
        marginBottom: 'clamp(12px, 3vw, 16px)'
      }}>
        {title}
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 2vw, 10px)' }}>
        {children}
      </div>
    </div>
  );
}

function FooterLink({ text }) {
  return (
    <a href="#" style={{
      fontSize: 'clamp(11px, 2.5vw, 13px)',
      color: 'rgba(255,255,255,0.5)',
      textDecoration: 'none',
      transition: 'color 0.3s'
    }}
    onMouseOver={(e) => e.target.style.color = '#fff'}
    onMouseOut={(e) => e.target.style.color = 'rgba(255,255,255,0.5)'}
    >
      {text}
    </a>
  );
}
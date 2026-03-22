import React, { useState, useEffect } from 'react';
import data from "./voting/output.jsx"; // Import the combined data from output.jsx

// Combine all voting data into one array
const allVoteData = [
  ...data
];

const Dashboard = ({ user, languageMode }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Translation texts
  const translations = {
    tamil: {
      constituencies: "தொகுதிகள்",
      booths: "வாக்குச்சாவடிகள்",
      wards: "வார்டுகள்",
      nagars: "நகரங்கள்",
      streets: "தெருக்கள்",
      voters: "வாக்காளர்கள்",
      gender: "பாலினம்",
      male: "ஆண்",
      female: "பெண்",
      transgender: "திருநங்கை",
      voterAgeGraph: "வாக்காளர் வயது வரைபடம்",
      noOfVoters: "வாக்காளர்களின் எண்ணிக்கை"
    },
    english: {
      constituencies: "Constituencies",
      booths: "Booths", 
      wards: "Wards",
      nagars: "Nagars",
      streets: "Streets",
      voters: "Voters",
      gender: "Gender",
      male: "Male",
      female: "Female",
      transgender: "Transgender",
      voterAgeGraph: "Voter Age Graph",
      noOfVoters: "No. of Voters"
    }
  };

  const t = translations[languageMode];

  const [stats, setStats] = useState({
    totalVoters: 0,
    constituencies: 0,
    wards: 0,
    taluks: 0,
    booths: 0,
    streets: 0,
    maleVoters: 0,
    femaleVoters: 0,
    transgenderVoters: 0,
    ageGroups: {
      '18-20': 0,
      '21-25': 0,
      '26-40': 0,
      '41-50': 0,
      '51-70+': 0
    },
    confirmedCount: 0,
    confirmationPercent: 0
  });

  useEffect(() => {
    calculateStats();
  }, [user]); // Add user as dependency to recalculate when user changes

  const calculateStats = () => {
    // For dashboard counts and confirmation percentage, always use full dataset
    const filteredData = allVoteData || [];

    const constituencies = new Set();
    const wards = new Set();
    const taluks = new Set();
    const booths = new Set();
    const streets = new Set();

    let maleCount = 0;
    let femaleCount = 0;
    let transgenderCount = 0;

    const ageGroups = {
      '18-20': 0,
      '21-25': 0,
      '26-40': 0,
      '41-50': 0,
      '51-70+': 0
    };

    filteredData.forEach(voter => {
      // Map to new schema field names from output.jsx
      const constituency = voter["AC_NAME"];
      const ward = voter["SECTION"]; // numeric/ward section
      const booth = voter["BOOTH"];
      const street = voter["SECTION_NAME"]; // street / nagar

      // Count unique locations
      if (constituency) constituencies.add(constituency);
      if (ward !== undefined && ward !== null && ward !== "") wards.add(ward);
      if (constituency) taluks.add(constituency); // Using constituency as taluk placeholder
      if (booth) booths.add(booth);
      if (street) streets.add(street);

      // Count gender from GENDER field (English/Tamil variations)
      const genderRaw = String(voter["GENDER"] || "").trim().toLowerCase();
      if (genderRaw === "female" || genderRaw === "f" || genderRaw.includes("பெண்")) {
        femaleCount++;
      } else if (genderRaw === "other" || genderRaw.includes("trans") || genderRaw.includes("திருநங்கை")) {
        transgenderCount++;
      } else if (genderRaw) {
        // Treat all other non-empty values as male (e.g., "male", "m")
        maleCount++;
      }

      // Count age groups from AGE field
      const age = parseInt(voter["AGE"], 10);
      if (age >= 18 && age <= 20) ageGroups['18-20']++;
      else if (age >= 21 && age <= 25) ageGroups['21-25']++;
      else if (age >= 26 && age <= 40) ageGroups['26-40']++;
      else if (age >= 41 && age <= 50) ageGroups['41-50']++;
      else if (age >= 51) ageGroups['51-70+']++;
    });

    // Load confirmation data from localStorage
    let confirmedCount = 0;
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('voterChecklists');
        const parsed = raw ? JSON.parse(raw) : {};
        confirmedCount = Object.values(parsed).filter((info) => info && info.confirmed).length;
      }
    } catch (e) {
      confirmedCount = 0;
    }

    const confirmationPercent = filteredData.length > 0
      ? (confirmedCount / filteredData.length) * 100
      : 0;

    setStats({
      totalVoters: filteredData.length,
      constituencies: constituencies.size,
      wards: wards.size,
      taluks: taluks.size,
      booths: booths.size,
      streets: streets.size,
      nagars: streets.size,
      maleVoters: maleCount,
      femaleVoters: femaleCount,
      transgenderVoters: transgenderCount,
      ageGroups,
      confirmedCount,
      confirmationPercent
    });
  };

  const StatCard = ({ number, label, color = '#666', bgColor = '#ffffff', borderColor, variant }) => (
    <div 
      className={`stat-card ${variant === 'compact' ? 'compact' : variant === 'large' ? 'large' : ''}`} 
      style={{ 
        backgroundColor: bgColor, 
        borderColor: borderColor ?? color,
        padding: isMobile ? 'clamp(12px, 3vw, 16px)' : 'clamp(16px, 4vw, 24px)',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="stat-number" style={{ color, fontSize: 'clamp(24px, 6vw, 40px)', fontWeight: 'bold' }}>{number.toLocaleString()}</div>
      <div className="stat-label" style={{ color, fontSize: 'clamp(10px, 2.5vw, 12px)', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</div>
    </div>
  );

  const GenderStat = ({ imageSrc, count, label }) => (
    <div className="gender-stat" style={{
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '12px' : '20px',
      background: 'rgba(255,255,255,0.05)',
      padding: 'clamp(12px, 3vw, 16px)',
      borderRadius: '12px',
      flex: 1
    }}>
      <div className="gender-icon" style={{
        width: 'clamp(40px, 10vw, 50px)',
        height: 'clamp(40px, 10vw, 50px)',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img src={imageSrc} alt={label} style={{ width: '60%', height: '60%', objectFit: 'contain' }} />
      </div>
      <div className="gender-info">
        <div className="gender-count" style={{ fontSize: 'clamp(18px, 5vw, 24px)', fontWeight: 'bold', color: '#fff' }}>{count.toLocaleString()}</div>
        <div className="gender-label" style={{ fontSize: 'clamp(10px, 2.5vw, 12px)', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>{label}</div>
      </div>
    </div>
  );

  const maxAgeCount = Math.max(...Object.values(stats.ageGroups || {}), 0);
  const midAgeCount = Math.round(maxAgeCount / 2);

  return (
    <div className="dashboard-container" style={{
      padding: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(20px, 5vw, 40px)',
      // Nudge the content closer to the left edge on desktop
      paddingLeft: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(8px, 2.5vw, 18px)',
      background: 'var(--tvk-dark)',
      color: 'var(--tvk-cream)'
    }}>

      {/* Overall confirmation progress for super admin */}
      {user && user.role === 'super_admin' && (
        <div style={{
          marginBottom: isMobile ? '16px' : '24px',
          padding: isMobile ? '12px' : '16px',
          borderRadius: '12px',
          border: '1px solid rgba(244,169,0,0.4)',
          background: 'rgba(244,169,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '8px',
            marginBottom: '8px'
          }}>
            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>
              Overall Vote Confirmation Progress
            </div>
            <div style={{ fontSize: '14px', color: '#F4A900', fontWeight: '700' }}>
              {stats.confirmedCount.toLocaleString()} / {stats.totalVoters.toLocaleString()} voters confirmed ({stats.confirmationPercent.toFixed(1)}%)
            </div>
          </div>
          <div style={{
            width: '100%',
            height: '16px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${stats.confirmationPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2ECC71, #27AE60, #2ECC71)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      <div className="stats-grid" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: isMobile ? 'clamp(12px, 3vw, 16px)' : 'clamp(16px, 4vw, 24px)',
        marginBottom: isMobile ? 'clamp(20px, 5vw, 30px)' : 'clamp(30px, 6vw, 40px)'
      }}>
        <StatCard 
          number={stats.constituencies} 
          label={t.constituencies}
          color="#e74c3c" 
          bgColor="rgba(231, 76, 60, 0.1)"
          borderColor="#e74c3c"
        />
        <StatCard 
          number={stats.booths} 
          label={t.booths}
          color="#d68910" 
          bgColor="rgba(214, 137, 16, 0.1)"
          borderColor="#d68910"
        />
        <StatCard 
          number={stats.wards} 
          label={t.wards}
          color="#27ae60" 
          bgColor="rgba(39, 174, 96, 0.1)"
          borderColor="#27ae60"
        />
        <StatCard 
          number={stats.taluks} 
          label={t.nagars}
          color="#2980b9" 
          bgColor="rgba(41, 128, 185, 0.1)"
          borderColor="#2980b9"
        />
       
        <StatCard 
          number={stats.streets} 
          label={t.streets}
          color="#8e44ad" 
          bgColor="rgba(142, 68, 173, 0.1)"
          borderColor="#8e44ad"
        />
        <StatCard 
          number={stats.totalVoters} 
          label={t.voters}
          color="#f1c40f" 
          bgColor="rgba(241, 196, 15, 0.1)"
          borderColor="#f1c40f"
        />
      </div>

      <div className="dashboard-content" style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr',
        gap: isMobile ? 'clamp(20px, 5vw, 30px)' : 'clamp(40px, 7vw, 64px)'
      }}>
        <div className="gender-section" style={{
          background: 'rgba(255,255,255,0.03)',
          padding: 'clamp(20px, 5vw, 28px)',
          // Pull gender cards closer to the left edge on desktop
          paddingLeft: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(8px, 2.5vw, 16px)',
          borderRadius: '12px'
        }}>
          <h3 style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>{t.gender}</h3>
          <div className="gender-stats" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <GenderStat 
              imageSrc="/i2.png" 
              count={stats.maleVoters} 
              label={t.male}
            />
            <GenderStat 
              imageSrc="/i3.png" 
              count={stats.femaleVoters} 
              label={t.female}
            />
            <GenderStat 
              imageSrc="/i4.png" 
              count={stats.transgenderVoters} 
              label={t.transgender}
            />
          </div>
        </div>

        <div className="chart-section" style={{
          background: 'rgba(255,255,255,0.03)',
          padding: 'clamp(20px, 5vw, 28px)',
          borderRadius: '12px',
          // Push the age graph further to the right on desktop
          marginLeft: isMobile ? 0 : 'clamp(16px, 4vw, 40px)'
        }}>
          <h3 style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginBottom: '20px'
          }}>{t.voterAgeGraph}</h3>
          <div className="age-chart" style={{ height: isMobile ? '200px' : '250px' }}>
            <div className="chart-container" style={{ display: 'flex', height: '100%' }}>
              <div className="y-axis" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                fontSize: 'clamp(9px, 2vw, 10px)',
                color: 'rgba(255,255,255,0.4)',
                paddingRight: '10px',
                textAlign: 'right'
              }}>
                <span>{maxAgeCount.toLocaleString()}</span>
                <span>{midAgeCount.toLocaleString()}</span>
                <span>0</span>
              </div>
              <div className="chart-area" style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 10px' }}>
                {Object.entries(stats.ageGroups).map(([range, count]) => {
                  const height = maxAgeCount > 0 ? (count / maxAgeCount) * 100 : 0;
                  return (
                    <div key={range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{
                        fontSize: 'clamp(8px, 2vw, 9px)',
                        color: 'rgba(255,255,255,0.85)',
                        marginBottom: '4px'
                      }}>
                        {count.toLocaleString()}
                      </div>
                      <div style={{
                        width: '70%',
                        height: `${height}%`,
                        background: 'linear-gradient(180deg, #3498db, rgba(52, 152, 219, 0.3))',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.5s ease-out'
                      }}></div>
                      <div style={{
                        fontSize: 'clamp(9px, 2vw, 10px)',
                        color: 'rgba(255,255,255,0.6)',
                        marginTop: '6px',
                        whiteSpace: 'nowrap'
                      }}>{range}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: 'clamp(9px, 2vw, 10px)',
              color: 'rgba(255,255,255,0.6)',
              textAlign: 'right'
            }}>
              {t.noOfVoters}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-info" style={{
        marginTop: 'clamp(20px, 5vw, 30px)',
        textAlign: 'center',
        fontSize: 'clamp(11px, 2.5vw, 13px)',
        color: 'rgba(255,255,255,0.4)'
      }}>
        <p className="dashboard-note">
          Use the navigation menu above to switch between Dashboard and Voters Data views.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import vote_AC002283 from "./voting/AC002283_with_roof";
import vote_AC002284 from "./voting/AC002284_with_roof";
import vote_AC005242 from "./voting/AC005242_with_roof";
import vote_AC005243 from "./voting/AC005243_with_roof";
import vote_AC005244 from "./voting/AC005244_with_roof";
import vote_AC005245 from "./voting/AC005245_with_roof";
import vote_AC005246 from "./voting/AC005246_with_roof";
import vote_AC005247 from "./voting/AC005247_with_roof";
import vote_AC005248 from "./voting/AC005248_with_roof";
import vote_AC005249 from "./voting/AC005249_with_roof";
import vote_AC005250 from "./voting/AC005250_with_roof";
import vote_AC005251 from "./voting/AC005251_with_roof";
import vote_AC005252 from "./voting/AC005252_with_roof";
import vote_AC005253 from "./voting/AC005253_with_roof";
import vote_AC005254 from "./voting/AC005254_with_roof";
import vote_AC005255 from "./voting/AC005255_with_roof";
import vote_AC005256 from "./voting/AC005256_with_roof";
import vote_AC005257 from "./voting/AC005257_with_roof";
import vote_AC005258 from "./voting/AC005258_with_roof";
import vote_AC005259 from "./voting/AC005259_with_roof";
import vote_AC005260 from "./voting/AC005260_with_roof";

// Combine all voting data into one array
const allVoteData = [
  ...vote_AC002283,
  ...vote_AC002284,
  ...vote_AC005242,
  ...vote_AC005243,
  ...vote_AC005244,
  ...vote_AC005245,
  ...vote_AC005246,
  ...vote_AC005247,
  ...vote_AC005248,
  ...vote_AC005249,
  ...vote_AC005250,
  ...vote_AC005251,
  ...vote_AC005252,
  ...vote_AC005253,
  ...vote_AC005254,
  ...vote_AC005255,
  ...vote_AC005256,
  ...vote_AC005257,
  ...vote_AC005258,
  ...vote_AC005259,
  ...vote_AC005260,
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
    }
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
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

    allVoteData.forEach(voter => {
      // Count unique locations
      if (voter.Constituency) constituencies.add(voter.Constituency);
      if (voter.Ward) wards.add(voter.Ward);
      if (voter.Constituency) taluks.add(voter.Constituency); // Using constituency as taluk
      if (voter.Part) booths.add(voter.Part);
      if (voter.Division) streets.add(voter.Division);

      // Count gender
      if (voter.Gender === 'ஆண்') maleCount++;
      else if (voter.Gender === 'பெண்') femaleCount++;
      else transgenderCount++;

      // Count age groups
      const age = parseInt(voter.Age);
      if (age >= 18 && age <= 20) ageGroups['18-20']++;
      else if (age >= 21 && age <= 25) ageGroups['21-25']++;
      else if (age >= 26 && age <= 40) ageGroups['26-40']++;
      else if (age >= 41 && age <= 50) ageGroups['41-50']++;
      else if (age >= 51) ageGroups['51-70+']++;
    });

    setStats({
      totalVoters: allVoteData.length,
      constituencies: constituencies.size,
      wards: wards.size,
      taluks: taluks.size,
      booths: booths.size,
      streets: streets.size,
      nagars: streets.size,
      maleVoters: maleCount,
      femaleVoters: femaleCount,
      transgenderVoters: transgenderCount,
      ageGroups
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

  return (
    <div className="dashboard-container" style={{
      padding: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(20px, 5vw, 40px)',
      background: 'var(--tvk-dark)',
      color: 'var(--tvk-cream)'
    }}>

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
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: isMobile ? 'clamp(20px, 5vw, 30px)' : 'clamp(24px, 5vw, 32px)'
      }}>
        <div className="gender-section" style={{
          background: 'rgba(255,255,255,0.03)',
          padding: 'clamp(20px, 5vw, 28px)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)'
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
          border: '1px solid rgba(255,255,255,0.08)'
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
                <span>{Math.max(...Object.values(stats.ageGroups)).toLocaleString()}</span>
                <span>0</span>
              </div>
              <div className="chart-area" style={{ flex: 1, borderLeft: '1px solid rgba(255,255,255,0.2)', borderBottom: '1px solid rgba(255,255,255,0.2)', position: 'relative', display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', padding: '0 10px' }}>
                {Object.entries(stats.ageGroups).map(([range, count]) => {
                  const maxAge = Math.max(...Object.values(stats.ageGroups));
                  const height = maxAge > 0 ? (count / maxAge) * 100 : 0;
                  return (
                    <div key={range} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
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
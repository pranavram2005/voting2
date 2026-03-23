import React, { useState, useEffect, useMemo, useRef } from "react";
import data from "./voting/output.jsx"; // Import the combined data from output.jsx
import "./styles.css";

// TVK Theme Helper Components
const TVKFilterGroup = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{
      color: 'rgba(255,255,255,0.8)',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {label}
    </label>
    {children}
  </div>
);

const TVKMultiSelect = ({ options, selected, onChange }) => (
  <div style={{
    maxHeight: '120px',
    overflowY: 'auto',
    padding: '8px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '6px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '8px'
  }}>
    {options.map(option => (
      <label key={option} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.9)',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => e.target.style.background = 'rgba(244,169,0,0.1)'}
      onMouseLeave={(e) => e.target.style.background = 'transparent'}
      >
        <input
          type="checkbox"
          checked={selected.includes(option)}
          onChange={() => onChange(option)}
          style={{
            accentColor: '#C8102E'
          }}
        />
        {option}
      </label>
    ))}
  </div>
);

const tvkInputStyle = {
  background: 'rgba(0,0,0,0.4)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '6px',
  padding: '10px 12px',
  color: '#FFF8F0',
  fontSize: '13px',
  width: '100%',
  transition: 'all 0.3s',
  outline: 'none'
};

const tvkSelectStyle = {
  ...tvkInputStyle,
  cursor: 'pointer'
};

// Table Styles
const tvkTableHeaderStyle = {
  padding: '16px 12px',
  textAlign: 'left',
  fontWeight: '700',
  fontSize: '12px',
  color: '#F4A900',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  borderRight: '1px solid rgba(255,255,255,0.1)'
};

const tvkTableCellStyle = {
  padding: '12px',
  borderRight: '1px solid rgba(255,255,255,0.05)',
  fontSize: '12px',
  color: 'rgba(255,255,255,0.9)'
};

// Pagination Button Component
const TVKPaginationButton = ({ onClick, disabled, label }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '10px 16px',
      background: disabled ? 
        'rgba(100,100,100,0.3)' : 
        'linear-gradient(135deg, rgba(244,169,0,0.2), rgba(244,169,0,0.1))',
      border: disabled ? 
        '1px solid rgba(100,100,100,0.5)' : 
        '1px solid rgba(244,169,0,0.3)',
      borderRadius: '8px',
      color: disabled ? 'rgba(255,255,255,0.3)' : '#F4A900',
      fontSize: '12px',
      fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s',
      letterSpacing: '0.5px'
    }}
    onMouseEnter={(e) => {
      if (!disabled) {
        e.target.style.background = 'linear-gradient(135deg, rgba(244,169,0,0.3), rgba(244,169,0,0.15))';
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = '0 4px 12px rgba(244,169,0,0.2)';
      }
    }}
    onMouseLeave={(e) => {
      if (!disabled) {
        e.target.style.background = 'linear-gradient(135deg, rgba(244,169,0,0.2), rgba(244,169,0,0.1))';
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }
    }}
  >
    {label}
  </button>
);

// Modal Detail Field Component  
const TVKDetailField = ({ label, value, highlight = false }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  }}>
    <label style={{
      color: 'rgba(255,255,255,0.7)',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    }}>
      {label}
    </label>
    <div style={{
      background: highlight ? 'rgba(244,169,0,0.2)' : 'rgba(0,0,0,0.3)',
      border: highlight ? '1px solid rgba(244,169,0,0.4)' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: '6px',
      padding: '10px 12px',
      color: highlight ? '#F4A900' : '#FFF8F0',
      fontSize: '13px',
      fontWeight: highlight ? '600' : 'normal',
      fontFamily: highlight ? 'monospace' : 'inherit'
    }}>
      {value || 'N/A'}
    </div>
  </div>
);

// Make inputs and selects focus with TVK theme
const focusStyle = `
  input:focus, select:focus {
    border-color: #F4A900 !important;
    box-shadow: 0 0 0 2px rgba(244,169,0,0.2) !important;
  }
  
  input::placeholder {
    color: rgba(255,255,255,0.4) !important;
  }
`;

// Inject focus styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = focusStyle;
  document.head.appendChild(styleSheet);
}

// Combine all voting data into one array (from JSON)
const allVoteData = data;

const PARTY_OPTIONS = [
  "DMK",
  "AIADMK",
  "BJP",
  "INC",
  "PMK",
  "DMDK",
  "NTK",
  "AMMK",
  "Independent",
  "Others"
];

const SimpleJsonViewer = ({ languageMode, onToggleLanguage, user }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const tableRef = useRef(null);
  const printPreviewRef = useRef(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [data, setData] = useState([]);
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showRoofMembers, setShowRoofMembers] = useState(false);
  const [roofMembers, setRoofMembers] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [voterChecklist, setVoterChecklist] = useState({
    needs: "",
    needsOther: "",
    phone: "",
    confirmed: false,
    votedParty: "",
  });
  const [checklistSavedMessage, setChecklistSavedMessage] = useState("");
  const [checklistMap, setChecklistMap] = useState({});
  const [hoveredRowIndex, setHoveredRowIndex] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  
  const [filters, setFilters] = useState({
    constituency: "",
    villages: [], // Street (SECTION_NAME)
    streets: [],  // (no longer used UI-wise)
    booths: [],   // Booth (Part)
    wards: [],    // Ward
    voterId: "",
    houseNo: "",
    serialNo: "",
    name: "",
    relation: "",
    relativeName: "",
    ageFrom: "",
    ageTo: "",
    gender: "",
    pdfNo: "",
    oneRoof: "",
    oneRoofRunning: "",
  });
  const [suggestions, setSuggestions] = useState({
    names: [],
    pdfNos: [],
  });

  useEffect(() => {
    // Filter data based on user role
    let filteredData = allVoteData;

    if (user && user.role === 'booth_agent' && user.boothNumber) {
      // For booth agents, only show data from their assigned booth (based on BOOTH)
      filteredData = allVoteData.filter(voter =>
        voter.BOOTH && voter.BOOTH.toString() === user.boothNumber.toString()
      );
    }

    setData(filteredData);

    // Initialize suggestions from filtered data (use NAME_EN and SECTION as substitutes)
    const names = [...new Set(filteredData.map(item => item.NAME_EN))].filter(n => n).sort();
    const pdfNos = [...new Set(filteredData.map(item => item.SECTION))].filter(p => p).sort();
    setSuggestions({ names, pdfNos });
  }, [user]); // Add user as dependency

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const loadChecklists = () => {
      try {
        const stored = localStorage.getItem("voterChecklists");
        setChecklistMap(stored ? JSON.parse(stored) : {});
      } catch (err) {
        setChecklistMap({});
      }
    };

    loadChecklists();
    window.addEventListener("storage", loadChecklists);

    return () => {
      window.removeEventListener("storage", loadChecklists);
    };
  }, []);

  // Load checklist info whenever a voter is selected
  useEffect(() => {
    if (!selectedVoter || !selectedVoter["EPIC"]) {
      setVoterChecklist({ needs: "", needsOther: "", phone: "", confirmed: false, votedParty: "" });
      setChecklistSavedMessage("");
      return;
    }

    const epic = String(selectedVoter["EPIC"]);
    const existing = checklistMap[epic] || {};
    setVoterChecklist({
      needs: existing.needs || "",
      needsOther: existing.needsOther || "",
      phone: existing.phone || "",
      confirmed: !!existing.confirmed,
      votedParty: existing.votedParty || "",
    });
    setChecklistSavedMessage("");
  }, [selectedVoter, checklistMap]);

  const columns = useMemo(() => {
    if (data.length === 0) return [];
    // Define the order of columns (One Roof fields moved to the right, IS_DELETED removed)
    const orderedColumns = [
      "S.No",
      "SECTION",
      "BOOTH",
      "EPIC",
      "HOUSE",
      "NAME_T",
      "AGE",
      "GENDER",
      "MOBILE",
      "One Roof",
      "One Roof Running Number"
    ];

    const columnsToExclude = new Set([
      "Photo",
      "SECTION_NAME",
      "AC_NAME",
      "SL",
      "R_TYPE",
      "R_Name",
      "REL_EN",
      "DOB",
      "BOOTH NAME",
      "BOOTH NAME TAMIL",
      "IS_DELETED"
    ]);

    const availableColumns = Object.keys(data[0]).filter(col => !columnsToExclude.has(col));
    
    // Return columns in the specified order, then any additional columns
    const result = orderedColumns.filter(col => availableColumns.includes(col));
    const additional = availableColumns.filter(col => !orderedColumns.includes(col));
    
    return [
      ...result,
      ...additional,
      "SUPPORTED_PARTY"
    ];
  }, [data]);

  const normalizeRelationType = (relationType) => {
    if (!relationType) return "";
    const normalized = relationType.trim();
    // Normalize father relations to full version
    if (normalized === "தந்தையின் பெயர்" || normalized === "தந்தையின்") {
      return "தந்தையின் பெயர்";
    }
    // Normalize husband relations to full version
    if (normalized === "கணவர் பெயர்" || normalized === "கணவர்") {
      return "கணவர் பெயர்";
    }
    return normalized;
  };

  const normalizeGender = (gender) => {
    if (!gender) return "ஆண்";
    const g = gender.trim().toLowerCase();
    // Female variations
    if (g.includes("பெண்") || g.includes("female") || g.includes("f") || g.includes("woman") || g.includes("பெ")) {
      return "பெண்";
    }
    // Default to Male for all other cases
    return "ஆண்";
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(data.map((item) => item[key]))];
    return values.filter((v) => v !== undefined && v !== null && v !== "").sort();
  };

  const getUniqueRelationTypes = () => {
    const values = [...new Set(data.map((item) => normalizeRelationType(item["R_TYPE"])))];
    return values.filter((v) => v !== undefined && v !== null && v !== "").sort();
  };

  // Cascading filter options - each filter shows only values that exist in data matching other selected filters
  const availableFilterOptions = useMemo(() => {
    // Helper to filter data by specific filters (excluding one filter type)
    const filterDataExcluding = (excludeFilter) => {
      return data.filter((item) => {
        return (
          (excludeFilter === 'constituency' || filters.constituency === "" || item["AC_NAME"] === filters.constituency) &&
          (excludeFilter === 'villages' || filters.villages.length === 0 || filters.villages.includes(item["SECTION_NAME"])) &&
          (excludeFilter === 'streets' || filters.streets.length === 0 || filters.streets.includes(item["HOUSE"])) &&
          (excludeFilter === 'booths' || filters.booths.length === 0 || filters.booths.includes(item["BOOTH"])) &&
          (excludeFilter === 'wards' || filters.wards.length === 0 || filters.wards.includes(item["SECTION"]))
        );
      });
    };

    const getUniqueFromFiltered = (filteredData, key) => {
      const values = [...new Set(filteredData.map((item) => item[key]))];
      return values.filter((v) => v !== undefined && v !== null && v !== "").sort();
    };

    return {
      constituencies: getUniqueFromFiltered(filterDataExcluding('constituency'), "AC_NAME"),
      villages: getUniqueFromFiltered(filterDataExcluding('villages'), "SECTION_NAME"),
      booths: getUniqueFromFiltered(filterDataExcluding('booths'), "BOOTH"),
      wards: getUniqueFromFiltered(filterDataExcluding('wards'), "SECTION"),
    };
  }, [data, filters.constituency, filters.villages, filters.streets, filters.booths, filters.wards]);

  // Auto-clear invalid selections when available options change
  useEffect(() => {
    let needsUpdate = false;
    const newFilters = { ...filters };

    // Check constituency
    if (filters.constituency && !availableFilterOptions.constituencies.includes(filters.constituency)) {
      newFilters.constituency = "";
      needsUpdate = true;
    }

    // Check villages (nagar)
    const validVillages = filters.villages.filter(v => availableFilterOptions.villages.includes(v));
    if (validVillages.length !== filters.villages.length) {
      newFilters.villages = validVillages;
      needsUpdate = true;
    }

    // Check booths
    const validBooths = filters.booths.filter(b => availableFilterOptions.booths.includes(b));
    if (validBooths.length !== filters.booths.length) {
      newFilters.booths = validBooths;
      needsUpdate = true;
    }

    // Check wards
    const validWards = filters.wards.filter(w => availableFilterOptions.wards.includes(w));
    if (validWards.length !== filters.wards.length) {
      newFilters.wards = validWards;
      needsUpdate = true;
    }

    if (needsUpdate) {
      setFilters(newFilters);
    }
  }, [availableFilterOptions]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return (
        // Constituency filter
        (filters.constituency === "" || item["AC_NAME"] === filters.constituency) &&
        // Village filter (multiple selection)
        (filters.villages.length === 0 || filters.villages.includes(item["SECTION_NAME"])) &&
        // Booth filter (multiple selection) using BOOTH
        (filters.booths.length === 0 || filters.booths.includes(item["BOOTH"])) &&
        // Ward filter (multiple selection) using numeric SECTION
        (filters.wards.length === 0 || filters.wards.includes(item["SECTION"])) &&
        // Voter ID filter (substring match, case-insensitive) using EPIC
        (filters.voterId === "" || String(item["EPIC"]).trim().toLowerCase().includes(filters.voterId.trim().toLowerCase())) &&
        // House No filter (exact match) using HOUSE
        (filters.houseNo === "" || String(item["HOUSE"]).toLowerCase() === filters.houseNo.toLowerCase()) &&
        // Serial No filter (exact match)
        (filters.serialNo === "" || String(item["S.No"]) === String(Number(filters.serialNo) - 1)) &&
        // Name filter (text search) using English name
        (filters.name === "" || String(item["NAME_EN"]).toLowerCase().includes(filters.name.toLowerCase())) &&
        // Relation filter (with normalization) using R_TYPE
        (filters.relation === "" || normalizeRelationType(item["R_TYPE"]) === normalizeRelationType(filters.relation)) &&
        // Relative Name filter (shown only when relation selected) using R_Name
        (filters.relativeName === "" || String(item["R_Name"]).toLowerCase().includes(filters.relativeName.toLowerCase())) &&
        // Age range filter
        (filters.ageFrom === "" || Number(item["AGE"]) >= Number(filters.ageFrom)) &&
        (filters.ageTo === "" || Number(item["AGE"]) <= Number(filters.ageTo)) &&
        // Gender filter (with normalization)
        (filters.gender === "" || normalizeGender(item["GENDER"]) === filters.gender) &&
        // PDF No filter exact match (using SECTION as a stand-in)
        (filters.pdfNo === "" || String(item["SECTION"]).toLowerCase() === filters.pdfNo.toLowerCase()) &&
        // One Roof filter (exact match)
        (filters.oneRoof === "" || String(item["One Roof"]) === filters.oneRoof) &&
        // One Roof Running Number filter (exact match)
        (filters.oneRoofRunning === "" || String(item["One Roof Running Number"]) === filters.oneRoofRunning)
      );
    });
  }, [data, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: prev[filterName].includes(value)
        ? prev[filterName].filter(item => item !== value)
        : [...prev[filterName], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      constituency: "",
      villages: [],
      streets: [],
      booths: [],
      wards: [],
      voterId: "",
      houseNo: "",
      serialNo: "",
      name: "",
      relation: "",
      relativeName: "",
      ageFrom: "",
      ageTo: "",
      gender: "",
      pdfNo: "",
      oneRoof: "",
      oneRoofRunning: "",
    });
    // Also clear selection when clearing filters
    setSelectedRowIndex(null);
    setSelectedVoter(null);
  };

  const handleRowClick = (voter, index) => {
    setSelectedVoter(voter);
    setSelectedRowIndex(index);
    setShowDetailView(true);
  };

  const handleChecklistFieldChange = (field, value) => {
    setVoterChecklist((prev) => ({ ...prev, [field]: value }));
    setChecklistSavedMessage("");
  };

  const handleSaveChecklist = () => {
    if (!selectedVoter || !selectedVoter["EPIC"]) return;
    try {
      const epic = String(selectedVoter["EPIC"]);
      const stored = typeof window !== "undefined" ? localStorage.getItem("voterChecklists") : null;
      const all = stored ? JSON.parse(stored) : {};
      const updated = {
        ...(all[epic] || {}),
        needs: voterChecklist.needs || "",
        needsOther: voterChecklist.needsOther || "",
        phone: voterChecklist.phone || "",
        confirmed: !!voterChecklist.confirmed,
        votedParty: voterChecklist.votedParty || "",
        confirmedBy: user && user.username ? user.username : (user && user.fullName) || "Unknown",
        confirmedAt: new Date().toISOString(),
        boothNumber: user && user.boothNumber ? user.boothNumber : null,
      };
      all[epic] = updated;
      if (typeof window !== "undefined") {
        localStorage.setItem("voterChecklists", JSON.stringify(all));
      }
      setChecklistMap(all);
      setChecklistSavedMessage("Saved successfully");
    } catch (e) {
      setChecklistSavedMessage("Could not save, please try again");
    }
  };

  const closeDetailView = () => {
    setShowDetailView(false);
    setSelectedVoter(null);
    // Keep the row selected even after closing modal
    // setSelectedRowIndex(null); // Uncomment this if you want to deselect on close
  };

  const handleRoofClick = (roofNumber) => {
    const members = data
      .filter(voter => voter["One Roof"] === roofNumber)
      .sort((a, b) => Number(a["One Roof Running Number"]) - Number(b["One Roof Running Number"]));
    setRoofMembers(members);
    setShowRoofMembers(true);
  };

  const closeRoofView = () => {
    setShowRoofMembers(false);
    setRoofMembers([]);
  };

  const handleElectoralIdClick = (voterId) => {
    // Open electoral details or external link
    window.open(`https://electoralsearch.in/search?id=${voterId}`, '_blank');
  };

  // Translation text content
  const translations = {
    tamil: {
      title: "👥 வாக்காளர் தரவுத்தள பகுப்பாய்வு",
      liveDatabase: "நேரலை தரவுத்தளம்",
      showing: "காண்பிக்கப்படுகிறது",
      voters: "வாக்காளர்கள்",
      from: "இலிருந்து",
      totalRecords: "மொத்த பதிவுகள்",
      advancedSearch: "மேம்பட்ட தேடல் வடிகட்டிகள்",
      locationFilters: "இடம் வடிகட்டிகள்",
      constituency: "தொகுதி",
      selectConstituency: "தொகுதியைத் தேர்ந்தெடுக்கவும்",
      booth: "வாக்குச்சாவடி (பகுதி) - பல தேர்வுகள்",
      ward: "வார்டு - பல தேர்வுகள்",
      village: "கிராமம் - பல தேர்வுகள்",
      street: "தெரு - பல தேர்வுகள்",
      personalFilters: "👤 தனிப்பட்ட வடிகட்டிகள்",
      voterIdSearch: "வாக்காளர் அடையாள எண்",
      houseNumber: "வீட்டு எண்",
      serialNumber: "வரிசை எண்",
      nameSearch: "பெயர் தேடல்",
      relationFilter: "உறவு வடிகட்டி",
      relativeNameSearch: "உறவினர் பெயர் தேடல்",
      ageRange: "வயது வரம்பு",
      fromAge: "இருந்து",
      toAge: "வரை",
      genderFilter: "பாலின வடிகட்டி",
      allGenders: "அனைத்து பாலினங்களும்",
      male: "ஆண்",
      female: "பெண்",
      clearAll: "🗑️ அனைத்தையும் அழிக்கவும்",
      voterData: "📊 வாக்காளர் பட்டியல்",
      records: "பதிவுகள்",
      show: "📄 காண்பி:",
      perPage: "ஒரு பக்கத்திற்கு",
      page: "📍 பக்கம்",
      of: "இன்",
      first: "⏮ முதல்",
      prev: "◀ முந்தைய",
      next: "அடுத்த ▶", 
      last: "கடைசி ⏭",
      goTo: "செல்:",
      serialNo: "வ.எண்.",
      electoralId: "வாக்காளர் அடையாள எண்",
      name: "பெயர்",
      relation: "உறவு",
      relativeName: "உறவினர் பெயர்",
      age: "வயது",
      gender: "பாலினம்",
      address: "முகவரி",
      voterDetails: "🗳️ வாக்காளர் விவரங்கள்",
      electoralInfo: "📋 தேர்தல் தகவல்",
      electoralNumber: "வாக்காளர் எண்",
      boothPart: "வாக்குச்சாவடி / பகுதி",
      personalInfo: "👤 தனிப்பட்ட தகவல்",
      relationType: "உறவு வகை",
      addressInfo: "🏠 முகவரி தகவல்",
      doorNumber: "கதவு எண்",
      divisionStreet: "பிரிவு / தெரு",
      print: "அச்சிடு",
      languageToggle: "🌐 EN"
    },
    english: {
      title: "👥 Voter Database Analysis",
      liveDatabase: "LIVE DATABASE", 
      showing: "Showing",
      voters: "voters",
      from: "from",
      totalRecords: "total records",
      advancedSearch: " Advanced Search Filters",
      locationFilters: " Location Filters",
      constituency: "Constituency",
      selectConstituency: "Select Constituency",
      booth: "Booth (Part) - Multiple Selection",
      ward: "Section - Multiple Selection", 
      village: "Street - Multiple Selection",
      personalFilters: "Personal Filters",
      voterIdSearch: "Voter ID Search",
      houseNumber: "House Number",
      serialNumber: "Serial Number",
      nameSearch: "Name Search",
      relationFilter: "Relation Filter",
      relativeNameSearch: "Relative Name Search",
      ageRange: "Age Range",
      fromAge: "From",
      toAge: "To", 
      genderFilter: "Gender Filter",
      allGenders: "All Genders",
      male: "Male",
      female: "Female",
      clearAll: "🗑️ Clear All",
      voterData: "📊 VOTER DATA",
      records: "Records",
      show: "📄 Show:",
      perPage: "per page",
      page: "📍 Page",
      of: "of",
      first: "⏮ First",
      prev: "◀ Prev", 
      next: "Next ▶",
      last: "Last ⏭",
      goTo: "Go to:",
      serialNo: "S.No",
      electoralId: "Electoral ID",
      name: "Name",
      relation: "Relation",
      relativeName: "Relative Name",
      age: "Age",
      gender: "G",
      address: "Address",
      voterDetails: "🗳️ VOTER DETAILS", 
      electoralInfo: "📋 Electoral Information",
      electoralNumber: "Electoral Number",
      boothPart: "Booth / Part",
      personalInfo: "👤 Personal Information",
      relationType: "Relation Type",
      addressInfo: "🏠 Address Information",
      doorNumber: "Door Number",
      divisionStreet: "Division / Street",
      print: "Print",
      languageToggle: "🌐 தமிழ்"
    }
  };

  const t = translations[languageMode];
  const openPrintPreview = () => {
    setShowPrintPreview(true);
  };

  const handleDownloadPdf = async () => {
    try {
      if (!printPreviewRef.current) return;
      const html2pdf = (await import("html2pdf.js")).default;

      const opt = {
        margin: 0.5,
        filename: "voters-table.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "landscape" }
      };

      html2pdf().set(opt).from(printPreviewRef.current).save();
    } catch (e) {
      window.print();
    }
  };

  return (
    <div style={{
      background: '#0D0D0D',
      color: '#FFF8F0',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(200,16,46,0.08), rgba(244,169,0,0.04))',
        border: '1px solid rgba(200,16,46,0.2)',
        borderRadius: '16px',
        padding: isMobile ? 'clamp(20px, 5vw, 30px)' : '40px',
        margin: isMobile ? '15px' : '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? '10px' : '20px',
          marginBottom: '20px',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to right, rgba(200,16,46,0.6), transparent)',
            display: isMobile ? 'none' : 'block'
          }}></div>
          <h1 style={{
            fontSize: isMobile ? 'clamp(20px, 6vw, 24px)' : '32px',
            letterSpacing: 'clamp(2px, 1vw, 4px)',
            color: '#F4A900',
            fontWeight: 'bold',
            margin: 0,
            textAlign: 'center'
          }}>
            {t.title}
          </h1>
          <span style={{
            background: '#C8102E',
            color: '#fff',
            fontSize: 'clamp(8px, 2vw, 10px)',
            padding: '3px 10px',
            borderRadius: '20px',
            letterSpacing: '2px',
            fontWeight: '700'
          }}>
            {t.liveDatabase}
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: 'linear-gradient(to left, rgba(200,16,46,0.6), transparent)',
            display: isMobile ? 'none' : 'block'
          }}></div>
        </div>
        <p style={{
          textAlign: 'center',
          color: 'rgba(255,255,255,0.7)',
          fontSize: isMobile ? 'clamp(11px, 2.5vw, 13px)' : '14px',
          margin: 0
        }}>
          {t.showing} {filteredData.length.toLocaleString()} {t.voters} {t.from} {data.length.toLocaleString()} {t.totalRecords}
        </p>
      </div>

      {/* Filters Section */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: isMobile ? 'clamp(20px, 5vw, 24px)' : '32px',
        margin: isMobile ? '15px' : '20px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#F4A900',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '4px',
            height: '18px',
            background: '#C8102E',
            borderRadius: '2px'
          }}></div>
          🔍 {t.advancedSearch}
        </div>

        {/* Location Filters Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: isMobile ? '20px' : '30px',
          marginBottom: '24px',
          padding: isMobile ? '20px' : '24px',
          background: 'rgba(200,16,46,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(200,16,46,0.1)'
        }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ 
              color: '#F4A900', 
              fontSize: 'clamp(13px, 3vw, 14px)', 
              fontWeight: '600', 
              margin: 0,
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              📍 {t.locationFilters}
            </h3>
            
            {/* Constituency */}
            <TVKFilterGroup label={`1. ${t.constituency}`}>
              <select 
                name="constituency" 
                value={filters.constituency} 
                onChange={handleFilterChange}
                style={tvkSelectStyle}
              >
                <option value="">{t.selectConstituency}</option>
                {availableFilterOptions.constituencies.map(val => 
                  <option key={val} value={val}>{val}</option>
                )}
              </select>
            </TVKFilterGroup>
            
            {/* Booth Filter */}
            <TVKFilterGroup label={`2. ${t.booth}`}>
              <TVKMultiSelect 
                options={availableFilterOptions.booths}
                selected={filters.booths}
                onChange={(value) => handleMultiSelectChange('booths', value)}
              />
            </TVKFilterGroup>

            {/* Ward Filter */}
            <TVKFilterGroup label={`3. ${t.ward}`}>
              <TVKMultiSelect 
                options={availableFilterOptions.wards}
                selected={filters.wards}
                onChange={(value) => handleMultiSelectChange('wards', value)}
              />
            </TVKFilterGroup>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ height: isMobile ? '0' : '24px' }}></div> {/* Spacer */}
            
            {/* Street Filter (using SECTION_NAME) */}
            <TVKFilterGroup label={`4. ${t.village}`}>
              <TVKMultiSelect 
                options={availableFilterOptions.villages}
                selected={filters.villages}
                onChange={(value) => handleMultiSelectChange('villages', value)}
              />
            </TVKFilterGroup>
          </div>
        </div>

        {/* Search Filters Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px',
          padding: isMobile ? '20px' : '24px',
          background: 'rgba(244,169,0,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(244,169,0,0.1)'
        }}>
          <div style={{
            gridColumn: '1 / -1',
            color: '#F4A900',
            fontSize: 'clamp(13px, 3vw, 14px)',
            fontWeight: '600',
            marginBottom: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            👤 {t.personalFilters}
          </div>

          <TVKFilterGroup label={t.voterIdSearch}>
            <input
              type="text"
              style={tvkInputStyle}
              placeholder={t.voterIdSearch}
              name="voterId"
              value={filters.voterId}
              onChange={handleFilterChange}
            />
          </TVKFilterGroup>

          <TVKFilterGroup label="House No">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search House No"
              name="houseNo"
              value={filters.houseNo}
              onChange={handleFilterChange}
            />
          </TVKFilterGroup>

          <TVKFilterGroup label="Serial No">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search Serial No"
              name="serialNo"
              value={filters.serialNo}
              onChange={handleFilterChange}
            />
          </TVKFilterGroup>

          <TVKFilterGroup label="Name (Auto Complete)">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search Name"
              name="name"
              value={filters.name}
              onChange={handleFilterChange}
              list="names-list"
            />
            <datalist id="names-list">
              {suggestions.names
                .filter(name => name.toLowerCase().includes(filters.name.toLowerCase()))
                .slice(0, 20)
                .map(name => (
                  <option key={name} value={name} />
                ))}
            </datalist>
          </TVKFilterGroup>
        </div>

        {/* Additional Filters Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '24px',
          padding: isMobile ? '20px' : '24px',
          background: 'rgba(255,255,255,0.02)',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{
            gridColumn: '1 / -1',
            color: '#F4A900',
            fontSize: 'clamp(13px, 3vw, 14px)',
            fontWeight: '600',
            marginBottom: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            📋 Demographics & Relations
          </div>

          <TVKFilterGroup label="Relation">
            <select 
              name="relation" 
              value={filters.relation} 
              onChange={handleFilterChange}
              style={tvkSelectStyle}
            >
              <option value="">Select Relation</option>
              {getUniqueRelationTypes().map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </TVKFilterGroup>

          {filters.relation && (
            <TVKFilterGroup label="Relative Name">
              <input
                type="text"
                style={tvkInputStyle}
                placeholder="Search Relative Name"
                name="relativeName"
                value={filters.relativeName}
                onChange={handleFilterChange}
              />
            </TVKFilterGroup>
          )}

          <TVKFilterGroup label="Age Range">
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="number"
                style={{...tvkInputStyle, width: '45%'}}
                placeholder="From"
                name="ageFrom"
                value={filters.ageFrom}
                onChange={handleFilterChange}
              />
              <span style={{ color: '#F4A900', fontSize: '12px' }}>to</span>
              <input
                type="number"
                style={{...tvkInputStyle, width: '45%'}}
                placeholder="To"
                name="ageTo"
                value={filters.ageTo}
                onChange={handleFilterChange}
              />
            </div>
          </TVKFilterGroup>

          <TVKFilterGroup label="Gender">
            <select 
              name="gender" 
              value={filters.gender} 
              onChange={handleFilterChange}
              style={tvkSelectStyle}
            >
              <option value="">Select Gender</option>
              <option value="ஆண்">ஆண் (Male)</option>
              <option value="பெண்">பெண் (Female)</option>
            </select>
          </TVKFilterGroup>
        </div>

        {/* One Roof Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr auto',
          gap: '20px',
          alignItems: 'end',
          padding: isMobile ? '20px' : '24px',
          background: 'rgba(46,204,113,0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(46,204,113,0.1)'
        }}>
          <div style={{
            gridColumn: '1 / -1',
            color: '#F4A900',
            fontSize: 'clamp(13px, 3vw, 14px)',
            fontWeight: '600',
            marginBottom: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            🏠 Family Grouping
          </div>

          <TVKFilterGroup label="One Roof">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search One Roof"
              name="oneRoof"
              value={filters.oneRoof}
              onChange={handleFilterChange}
            />
          </TVKFilterGroup>

          <TVKFilterGroup label="One Roof Running Number">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search Running Number"
              name="oneRoofRunning"
              value={filters.oneRoofRunning}
              onChange={handleFilterChange}
            />
          </TVKFilterGroup>

          <TVKFilterGroup label="PDF Page">
            <input
              type="text"
              style={tvkInputStyle}
              placeholder="Search PDF No"
              name="pdfNo"
              value={filters.pdfNo}
              onChange={handleFilterChange}
              list="pdf-list"
            />
            <datalist id="pdf-list">
              {suggestions.pdfNos
                .filter(pdf => String(pdf).toLowerCase().includes(filters.pdfNo.toLowerCase()))
                .slice(0, 20)
                .map(pdf => (
                  <option key={pdf} value={pdf} />
                ))}
            </datalist>
          </TVKFilterGroup>

          <button 
            onClick={clearFilters}
            style={{
              background: 'linear-gradient(135deg, #C8102E, #A00020)',
              color: '#fff',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              boxShadow: '0 4px 15px rgba(200,16,46,0.3)',
              transition: 'all 0.3s',
              width: isMobile ? '100%' : 'auto',
              marginTop: isMobile ? '10px' : '0'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(200,16,46,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(200,16,46,0.3)';
            }}
          >
            {t.clearAll}
          </button>
        </div>
      </div>

      {/* Data Results Table */}
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        margin: '20px',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Table Header */}
        <div style={{
          background: 'linear-gradient(135deg, #C8102E, #A00020)',
          padding: isMobile ? '15px' : '20px',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: '10px'
          }}>
            <h2 style={{
              color: '#FFF8F0',
              fontSize: isMobile ? '18px' : '20px',
              fontWeight: 'bold',
              margin: 0,
              letterSpacing: '2px',
              textAlign: 'center'
            }}>
              {t.voterData}
            </h2>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '12px',
                padding: '8px 16px',
                borderRadius: '20px',
                letterSpacing: '1px',
                fontWeight: '700'
              }}>
                {paginatedData.length} {t.of} {filteredData.length} {t.records}
              </div>
              <button
                onClick={openPrintPreview}
                style={{
                  background: 'linear-gradient(135deg, #F4A900, #FFD700)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 3px 8px rgba(244,169,0,0.3)',
                  transition: 'all 0.3s',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 5px 12px rgba(244,169,0,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 3px 8px rgba(244,169,0,0.3)';
                }}
              >
                <span style={{ fontSize: '12px' }}>🖨️</span>
                {t.print}
              </button>
            </div>
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-1px',
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #F4A900, #FFD700, #F4A900)'
          }}></div>
        </div>

        {/* Compact Pagination Controls */}
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: isMobile ? '15px' : '12px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '15px',
          fontSize: '12px'
        }}>
          {/* Items Per Page */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px'
            }}>
              {t.show}
            </span>
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: '#FFF8F0',
                fontSize: '11px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
            <span style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '11px'
            }}>
              {t.perPage}
            </span>
          </div>

          {/* Page Info */}
          <div style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '11px',
            fontWeight: '500',
            textAlign: 'center'
          }}>
            {t.page} {currentPage} {t.of} {totalPages}
            <span style={{
              color: 'rgba(255,255,255,0.5)',
              marginLeft: '8px',
              display: isMobile ? 'block' : 'inline',
              marginTop: isMobile ? '4px' : '0'
            }}>({startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length})</span>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => goToPage(1)} 
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: currentPage === 1 ? 'rgba(255,255,255,0.4)' : '#FFF8F0',
                fontSize: '10px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t.first}
            </button>
            <button 
              onClick={() => goToPage(currentPage - 1)} 
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: currentPage === 1 ? 'rgba(255,255,255,0.4)' : '#FFF8F0',
                fontSize: '10px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t.prev}
            </button>
            <button 
              onClick={() => goToPage(currentPage + 1)} 
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : '#FFF8F0',
                fontSize: '10px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t.next}
            </button>
            <button 
              onClick={() => goToPage(totalPages)} 
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '4px',
                padding: '4px 8px',
                color: currentPage === totalPages ? 'rgba(255,255,255,0.4)' : '#FFF8F0',
                fontSize: '10px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t.last}
            </button>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginLeft: isMobile ? '0' : '8px',
              marginTop: isMobile ? '8px' : '0'
            }}>
              <span style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '10px'
              }}>
                {t.goTo}
              </span>
              <input 
                type="number" 
                min="1" 
                max={totalPages}
                value={currentPage}
                onChange={(e) => goToPage(Number(e.target.value))}
                style={{ 
                  width: '40px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  padding: '3px 5px',
                  color: '#FFF8F0',
                  fontSize: '10px',
                  textAlign: 'center',
                  outline: 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div style={{ 
          overflowX: 'auto', 
          WebkitOverflowScrolling: 'touch',
          background: 'rgba(0,0,0,0.1)',
          borderRadius: '8px',
          margin: isMobile ? '15px' : '20px',
          border: '1px solid rgba(255,255,255,0.08)'
        }} ref={tableRef}>
          <table style={{
            width: '100%',
            minWidth: '1200px', // Force scroll on smaller screens
            borderCollapse: 'collapse',
            color: '#FFF8F0',
            fontSize: 'clamp(12px, 1.5vw, 14px)',
          }}>
            <thead>
              <tr style={{
                background: 'rgba(255,255,255,0.08)',
                borderBottom: '1px solid rgba(255,255,255,0.15)'
              }}>
                {columns.map(header => (
                  <th 
                    key={header} 
                    style={{
                      ...tvkTableHeaderStyle,
                      padding: isMobile ? '10px 8px' : '12px 15px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {t[header] || header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((row, index) => {
                const rowEpic = row && row["EPIC"] ? String(row["EPIC"]) : null;
                const rowChecklist = rowEpic ? checklistMap[rowEpic] : null;
                const rowConfirmed = Boolean(rowChecklist && rowChecklist.confirmed);
                const agentLabel = rowChecklist && rowChecklist.confirmedBy ? `Confirmed by ${rowChecklist.confirmedBy}` : 'Confirmed';
                const baseBackground = rowConfirmed ? 'rgba(46,204,113,0.18)' : 'transparent';
                const hoverBackground = rowConfirmed ? 'rgba(46,204,113,0.32)' : 'rgba(255,255,255,0.05)';

                return (
                  <tr 
                    key={row.id || index} 
                    onClick={() => handleRowClick(row, index)}
                    style={{
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      background: baseBackground,
                    }}
                    onMouseEnter={(e) => {
                      setHoveredRowIndex(index);
                      e.currentTarget.style.background = hoverBackground;
                    }} 
                    onMouseLeave={(e) => {
                      setHoveredRowIndex((prev) => (prev === index ? null : prev));
                      e.currentTarget.style.background = baseBackground;
                    }}
                    title={rowConfirmed ? agentLabel : undefined}
                  >
                    {columns.map((header, colIndex) => (
                      (() => {
                        if (header === "SUPPORTED_PARTY") {
                          const partyLabel = rowChecklist && rowChecklist.votedParty ? rowChecklist.votedParty : "-";
                          return (
                            <td
                              key={header}
                              style={{
                                ...tvkTableCellStyle,
                                padding: isMobile ? '10px 8px' : '12px 15px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                maxWidth: '200px',
                                fontWeight: rowChecklist && rowChecklist.votedParty ? 600 : 'normal',
                                color: rowChecklist && rowChecklist.votedParty ? '#F4A900' : 'rgba(255,255,255,0.75)'
                              }}
                            >
                              {partyLabel}
                            </td>
                          );
                        }

                        return (
                      <td 
                        key={header} 
                        style={{
                          ...tvkTableCellStyle,
                          padding: isMobile ? '10px 8px' : '12px 15px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '200px',
                          position: rowConfirmed && colIndex === 0 ? 'relative' : undefined
                        }}
                      >
                        {row[header]}
                        {rowConfirmed && colIndex === 0 && hoveredRowIndex === index && (
                          <span
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: isMobile ? '4px' : '12px',
                              background: 'rgba(46,204,113,0.95)',
                              color: '#041c10',
                              borderRadius: '999px',
                              padding: '2px 10px',
                              fontSize: '10px',
                              fontWeight: 600,
                              letterSpacing: '0.5px',
                              boxShadow: '0 4px 10px rgba(46,204,113,0.35)'
                            }}
                          >
                            {agentLabel}
                          </span>
                        )}
                        </td>
                        );
                      })()
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: isMobile ? '40px 20px' : '60px 20px',
            color: 'rgba(255,255,255,0.5)',
            background: 'rgba(0,0,0,0.1)',
            margin: isMobile ? '0 15px 15px' : '0 20px 20px',
            borderRadius: '0 0 8px 8px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: 'none',
            marginTop: '-20px'
          }}>
            <h3 style={{
              fontSize: isMobile ? '18px' : '24px',
              fontWeight: '600',
              color: 'rgba(255,255,255,0.8)'
            }}>{t.noResults}</h3>
            <p style={{
              marginTop: '10px',
              fontSize: isMobile ? '13px' : '15px',
            }}>{t.noResultsMessage}</p>
          </div>
        )}
      </div>

      {/* Print Preview Overlay with Excel-style table */}
      {showPrintPreview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 2000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px'
          }}
          onClick={() => setShowPrintPreview(false)}
        >
          <div
            ref={printPreviewRef}
            style={{
              backgroundColor: '#ffffff',
              color: '#000000',
              maxWidth: '1200px',
              maxHeight: '90vh',
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: '10px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                background: '#f5f5f5'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '14px' }}>
                {t.voterData} – {filteredData.length.toLocaleString()} {t.records}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleDownloadPdf}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    background: '#2ecc71',
                    border: '1px solid #27ae60',
                    color: '#ffffff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setShowPrintPreview(false)}
                  style={{
                    padding: '6px 10px',
                    fontSize: '12px',
                    background: '#e0e0e0',
                    border: '1px solid #bbb',
                    color: '#333',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Close
                </button>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                padding: '12px'
              }}
            >
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  tableLayout: 'fixed',
                  fontSize: '10px',
                  fontFamily: 'system-ui, -apple-system, sans-serif'
                }}
              >
                <thead>
                  <tr>
                    {columns.map((header) => (
                      <th
                        key={header}
                        style={{
                          border: '1px solid #999',
                          padding: '4px 6px',
                          textAlign: 'left',
                          backgroundColor: '#f2f2f2',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {t[header] || header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, rowIndex) => (
                    <tr key={row.id || rowIndex}>
                      {columns.map((header) => (
                        <td
                          key={header}
                          style={{
                            border: '1px solid #ddd',
                            padding: '3px 6px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <p className="entry-count">
        Showing <b>{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</b> of <b>{filteredData.length}</b> filtered entries (Total: {data.length})
        {data.length > 0 && (
          <span style={{marginLeft: '20px', fontSize: '14px', color: '#888'}}>
            Columns: {columns.length}
          </span>
        )}
        {selectedRowIndex !== null && selectedVoter && (
          <span style={{marginLeft: '20px', fontSize: '16px', color: '#000', fontWeight: 'bold'}}>
            Selected: {selectedVoter["NAME_EN"]} (ID: {selectedVoter["EPIC"]})
            <button 
              onClick={() => {setSelectedRowIndex(null); setSelectedVoter(null);}} 
              style={{
                marginLeft: '10px', 
                padding: '4px 8px', 
                fontSize: '12px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Clear Selection
            </button>
          </span>
        )}
      </p>

      {/* Voter Detail Modal */}
      {showDetailView && selectedVoter && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(15px)'
        }} onClick={closeDetailView}>
          <div style={{
            background: 'linear-gradient(145deg, #0D0D0D, #1a1a1a)',
            border: '2px solid rgba(200,16,46,0.3)',
            borderRadius: '20px',
            width: '95%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflow: 'hidden',
            color: '#FFF8F0',
            boxShadow: '0 25px 50px rgba(200,16,46,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #C8102E, #A00020)',
              padding: '24px 32px',
              borderRadius: '18px 18px 0 0',
              position: 'relative',
              borderBottom: '3px solid #F4A900'
            }}>
              <h2 style={{
                color: '#FFF8F0',
                fontSize: '22px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '1px'
              }}>
                {t.voterDetail}
              </h2>
              <button style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#FFF8F0',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'scale(1)';
              }}
              onClick={closeDetailView}>×</button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px',
              maxHeight: 'calc(90vh - 100px)',
              overflow: 'auto'
            }}>
              {/* Booth Agent Checklist Section */}
              {user && user.role === 'booth_agent' && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(244,169,0,0.3)',
                  background: 'rgba(244,169,0,0.06)'
                }}>
                  <h3 style={{
                    color: '#F4A900',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>✅</span> Voter Needs & Confirmation
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <label style={{
                        display: 'block',
                        marginBottom: '6px',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>Needs</label>
                      <select
                        value={voterChecklist.needs}
                        onChange={(e) => {
                          const value = e.target.value;
                          handleChecklistFieldChange('needs', value);
                          if (value !== 'Others') {
                            handleChecklistFieldChange('needsOther', '');
                          }
                        }}
                        style={tvkSelectStyle}
                      >
                        <option value="">Select Need</option>
                        <option value="Medical needs">Medical needs</option>
                        <option value="Education support">Education support</option>
                        <option value="Job oppuritnites">Job oppuritnites</option>
                        <option value="Agriculture Support">Agriculture Support</option>
                        <option value="Marriage Assitance">Marriage Assitance</option>
                        <option value="Basic Needs">Basic Needs</option>
                        <option value="Health Care">Health Care</option>
                        <option value="Financial Needs">Financial Needs</option>
                        <option value="Others">Others</option>
                      </select>
                      {voterChecklist.needs === 'Others' && (
                        <input
                          type="text"
                          value={voterChecklist.needsOther}
                          onChange={(e) => handleChecklistFieldChange('needsOther', e.target.value)}
                          placeholder="Enter other specific needs"
                          style={{
                            ...tvkInputStyle,
                            marginTop: '8px'
                          }}
                        />
                      )}
                      <label style={{
                        display: 'block',
                        margin: '16px 0 6px',
                        fontSize: '12px',
                        color: 'rgba(255,255,255,0.7)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>Voted Party</label>
                      <select
                        value={voterChecklist.votedParty}
                        onChange={(e) => handleChecklistFieldChange('votedParty', e.target.value)}
                        style={tvkSelectStyle}
                      >
                        <option value="">Select Party</option>
                        {PARTY_OPTIONS.map((party) => (
                          <option key={party} value={party}>{party}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{
                          display: 'block',
                          marginBottom: '6px',
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.7)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>Phone Number</label>
                        <input
                          type="tel"
                          value={voterChecklist.phone}
                          onChange={(e) => handleChecklistFieldChange('phone', e.target.value)}
                          placeholder="Enter contact number"
                          style={tvkInputStyle}
                        />
                      </div>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: 'rgba(255,255,255,0.9)'
                      }}>
                        <input
                          type="checkbox"
                          checked={voterChecklist.confirmed}
                          onChange={(e) => handleChecklistFieldChange('confirmed', e.target.checked)}
                          style={{ accentColor: '#2ECC71' }}
                        />
                        Mark vote as confirmed
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      onClick={handleSaveChecklist}
                      style={{
                        background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Save Checklist
                    </button>
                    {checklistSavedMessage && (
                      <span style={{
                        fontSize: '12px',
                        color: checklistSavedMessage.includes('Saved') ? '#2ECC71' : '#E74C3C'
                      }}>
                        {checklistSavedMessage}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Personal Information Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  color: '#F4A900',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(244,169,0,0.3)',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>👤</span> {t.personalInfo || "Personal Information"}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '15px' : '20px'
                }}>
                  {['NAME_EN', 'AGE', 'GENDER', 'R_TYPE', 'R_Name'].map(key => (
                    selectedVoter[key] && (
                      <div key={key} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #F4A900'
                      }}>
                        <strong style={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>{t[key] || key}:</strong>
                        <span style={{
                          fontSize: '15px',
                          color: '#FFF8F0',
                          wordBreak: 'break-word',
                          fontWeight: '500'
                        }}>{selectedVoter[key]}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Electoral Information Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  color: '#F4A900',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(244,169,0,0.3)',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>📋</span> {t.electoralInfo || "Electoral Information"}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '15px' : '20px'
                }}>
                  {['EPIC', 'S.No', 'AC_NAME', 'BOOTH', 'SECTION', 'SL'].map(key => (
                    selectedVoter[key] && (
                      <div key={key} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #C8102E'
                      }}>
                        <strong style={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>{t[key] || key}:</strong>
                        <span style={{
                          fontSize: '15px',
                          color: '#FFF8F0',
                          wordBreak: 'break-word',
                          fontWeight: '500'
                        }}>{selectedVoter[key]}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Address & Family Section */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  color: '#F4A900',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                  borderBottom: '1px solid rgba(244,169,0,0.3)',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span>🏠</span> {t.addressInfo || "Address & Family"}
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                  gap: isMobile ? '15px' : '20px'
                }}>
                  {['HOUSE', 'SECTION_NAME', 'BOOTH NAME', 'BOOTH NAME TAMIL', 'One Roof', 'One Roof Running Number'].map(key => (
                    selectedVoter[key] && (
                      <div key={key} style={{
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px',
                        borderRadius: '6px',
                        borderLeft: '3px solid #2ECC71'
                      }}>
                        <strong style={{
                          display: 'block',
                          color: 'rgba(255,255,255,0.6)',
                          fontSize: '12px',
                          marginBottom: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}>{t[key] || key}:</strong>
                        <span style={{
                          fontSize: '15px',
                          color: '#FFF8F0',
                          wordBreak: 'break-word',
                          fontWeight: '500'
                        }}>{selectedVoter[key]}</span>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Other Information Section (Catch-all) */}
              {Object.keys(selectedVoter).filter(key => !['NAME_EN', 'AGE', 'GENDER', 'R_TYPE', 'R_Name', 'EPIC', 'S.No', 'AC_NAME', 'BOOTH', 'SECTION', 'SL', 'HOUSE', 'SECTION_NAME', 'BOOTH NAME', 'BOOTH NAME TAMIL', 'One Roof', 'One Roof Running Number'].includes(key)).length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{
                    color: '#F4A900',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    borderBottom: '1px solid rgba(244,169,0,0.3)',
                    paddingBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>ℹ️</span> {t.otherInfo || "Other Information"}
                  </h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: isMobile ? '15px' : '20px'
                  }}>
                    {Object.entries(selectedVoter)
                      .filter(([key]) => !['NAME_EN', 'AGE', 'GENDER', 'R_TYPE', 'R_Name', 'EPIC', 'S.No', 'AC_NAME', 'BOOTH', 'SECTION', 'SL', 'HOUSE', 'SECTION_NAME', 'BOOTH NAME', 'BOOTH NAME TAMIL', 'One Roof', 'One Roof Running Number'].includes(key))
                      .map(([key, value]) => (
                        <div key={key} style={{
                          background: 'rgba(255,255,255,0.03)',
                          padding: '12px',
                          borderRadius: '6px',
                          borderLeft: '3px solid #888'
                        }}>
                          <strong style={{
                            display: 'block',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '12px',
                            marginBottom: '4px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                          }}>{t[key] || key}:</strong>
                          <span style={{
                            fontSize: '15px',
                            color: '#FFF8F0',
                            wordBreak: 'break-word',
                            fontWeight: '500'
                          }}>{value}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              <div style={{
                marginTop: isMobile ? '25px' : '30px',
                display: 'flex',
                justifyContent: 'center',
                gap: '15px'
              }}>
                <button 
                  onClick={() => {
                    const roofNumber = selectedVoter['One Roof'];
                    if (roofNumber) {
                      handleRoofClick(roofNumber);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #F4A900, #FFD700)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    opacity: selectedVoter['One Roof'] ? 1 : 0.5,
                    pointerEvents: selectedVoter['One Roof'] ? 'auto' : 'none',
                    boxShadow: '0 4px 15px rgba(244,169,0,0.3)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(244,169,0,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(244,169,0,0.3)';
                  }}
                >
                  {t.viewFamily}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Family Members Modal */}
      {showRoofMembers && roofMembers.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '20px',
          backdropFilter: 'blur(15px)'
        }} onClick={closeRoofView}>
          <div style={{
            background: 'linear-gradient(145deg, #0D0D0D, #1a1a1a)',
            border: '2px solid rgba(46,204,113,0.3)',
            borderRadius: '20px',
            width: '95%',
            maxWidth: '1000px',
            maxHeight: '90vh',
            overflow: 'hidden',
            color: '#FFF8F0',
            boxShadow: '0 25px 50px rgba(46,204,113,0.3)'
          }} onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #2ECC71, #27AE60)',
              padding: '24px 32px',
              borderRadius: '18px 18px 0 0',
              position: 'relative',
              borderBottom: '3px solid #F4A900'
            }}>
              <h2 style={{
                color: '#FFF8F0',
                fontSize: '22px',
                fontWeight: 'bold',
                margin: 0,
                letterSpacing: '1px'
              }}>
                👨‍👩‍👧‍👦 குடும்ப உறுப்பினர்கள் ({roofMembers.length} members under same roof)
              </h2>
              <button style={{
                position: 'absolute',
                top: '16px',
                right: '20px',
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                color: '#FFF8F0',
                fontSize: '24px',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'scale(1)';
              }}
              onClick={closeRoofView}>×</button>
            </div>

            {/* Modal Content */}
            <div style={{
              padding: '24px',
              maxHeight: 'calc(90vh - 100px)',
              overflow: 'auto'
            }}>
              
              {/* Family Members Table */}
              <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(46,204,113,0.2), rgba(46,204,113,0.1))',
                  display: 'grid',
                  gridTemplateColumns: '80px 140px 1fr 120px 60px 80px 100px',
                  gap: '12px',
                  padding: '16px 20px',
                  fontWeight: '700',
                  fontSize: '12px',
                  color: '#2ECC71',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderBottom: '2px solid rgba(46,204,113,0.3)'
                }}>
                  <div>S.No</div>
                  <div>Electoral ID</div>
                  <div>Name / பெயர்</div>
                  <div>Relation</div>
                  <div>Age</div>
                  <div>Gender</div>
                  <div>Action</div>
                </div>

                {/* Table Body */}
                {roofMembers.map((member, index) => (
                  <div key={index} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 140px 1fr 120px 60px 80px 100px',
                    gap: '12px',
                    padding: '16px 20px',
                    fontSize: '13px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(46,204,113,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                  >
                    <div style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {member["S.No"]}
                    </div>
                    <div 
                      style={{
                        color: '#F4A900',
                        fontFamily: 'monospace',
                        fontWeight: '600',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleElectoralIdClick(member["EPIC"])}
                    >
                      {member["EPIC"]}
                    </div>
                    <div style={{ 
                      color: '#FFF8F0',
                      fontWeight: '600'
                    }}>
                      {member["NAME_EN"]}
                    </div>
                    <div style={{ 
                      color: 'rgba(255,255,255,0.8)',
                      fontStyle: 'italic' 
                    }}>
                      {member["R_TYPE"]}
                    </div>
                    <div style={{ 
                      color: 'rgba(255,255,255,0.9)',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {member["AGE"]}
                    </div>
                    <div style={{ 
                      color: normalizeGender(member["GENDER"]) === "ஆண்" ? '#87CEEB' : '#FFB6C1',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      {normalizeGender(member["GENDER"]) === "ஆண்" ? "M" : "F"}
                    </div>
                    <div>
                      <button 
                        style={{
                          background: 'linear-gradient(135deg, #C8102E, #A00020)',
                          color: '#FFF8F0',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          letterSpacing: '0.5px'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(200,16,46,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                        onClick={() => {
                          setSelectedVoter(member);
                          setShowRoofMembers(false);
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleJsonViewer;

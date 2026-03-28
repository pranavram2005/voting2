import React, { useEffect, useMemo, useState } from "react";
import data from "./voting/output.jsx";

const allVoteData = data;

const ConfirmationsAdmin = ({ user, languageMode }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  const [checklists, setChecklists] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedVoterEpic, setSelectedVoterEpic] = useState(null);
  const [boothAgents, setBoothAgents] = useState([]);
  const [wardAgents, setWardAgents] = useState([]);
  const [zonalAgents, setZonalAgents] = useState([]);
  const [isSuperAdminOpen, setIsSuperAdminOpen] = useState(true);
  // Only one open at a time (accordion)
  const [expandedZonal, setExpandedZonal] = useState(null);
  const [expandedWard, setExpandedWard] = useState(null);

  const fieldLabels = {
    NAME_EN: "Voter Name",
    AGE: "Age",
    GENDER: "Gender",
    R_TYPE: "Relation Type",
    R_Name: "Relation Name",
    "S.No": "Serial No",
    AC_NAME: "Constituency",
    BOOTH: "Booth",
    SECTION: "Ward / Section",
    SL: "SL No",
    HOUSE: "House No",
    SECTION_NAME: "Street / Nagar",
    "BOOTH NAME": "Booth Name (EN)",
    "BOOTH NAME TAMIL": "Booth Name (Tamil)",
    "One Roof": "One Roof",
    "One Roof Running Number": "Roof Running No",
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  useEffect(() => {
    const loadChecklists = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("voterChecklists");
        const parsed = raw ? JSON.parse(raw) : {};
        setChecklists(parsed);
      } catch (e) {
        setChecklists({});
      }
    };
    loadChecklists();

    // Listen for changes from other tabs/windows
    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadChecklists);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", loadChecklists);
      }
    };
  }, []);

  useEffect(() => {
    const loadAgents = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("boothAgents");
        const parsed = raw ? JSON.parse(raw) : [];
        setBoothAgents(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        setBoothAgents([]);
      }
    };
    loadAgents();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadAgents);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", loadAgents);
      }
    };
  }, []);

  useEffect(() => {
    const loadWardAgents = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("wardAgents");
        const parsed = raw ? JSON.parse(raw) : [];
        setWardAgents(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        setWardAgents([]);
      }
    };

    loadWardAgents();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadWardAgents);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", loadWardAgents);
      }
    };
  }, []);

  useEffect(() => {
    const loadZonalAgents = () => {
      try {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("zonalAgents");
        const parsed = raw ? JSON.parse(raw) : [];
        setZonalAgents(Array.isArray(parsed) ? parsed : []);
      } catch (err) {
        setZonalAgents([]);
      }
    };

    loadZonalAgents();

    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadZonalAgents);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", loadZonalAgents);
      }
    };
  }, []);

  const epicToVoterMap = useMemo(() => {
    const map = {};
    allVoteData.forEach((voter) => {
      if (voter["EPIC"]) {
        map[String(voter["EPIC"])] = voter;
      }
    });
    return map;
  }, []);

  const confirmedEntries = useMemo(
    () =>
      Object.entries(checklists).filter(([, info]) => info && info.confirmed),
    [checklists]
  );

  const normalizeLookupValue = (value) => {
    if (value === undefined || value === null) return "";
    return String(value).trim();
  };

  const boothToWardMap = useMemo(() => {
    const map = {};
    allVoteData.forEach((voter) => {
      const boothKey = normalizeLookupValue(voter && voter["BOOTH"]);
      const wardValue = normalizeLookupValue(voter && voter["SECTION"]);
      if (boothKey && wardValue && !map[boothKey]) {
        map[boothKey] = wardValue;
      }
    });
    return map;
  }, []);

  const wardAgentByWardMap = useMemo(() => {
    const map = {};
    wardAgents.forEach((agent) => {
      if (!agent || !agent.wardNumber) return;
      const key = normalizeLookupValue(agent.wardNumber);
      if (!key || map[key]) return;
      map[key] = agent;
    });
    return map;
  }, [wardAgents]);

  const zonalAgentByWardMap = useMemo(() => {
    const map = {};
    zonalAgents.forEach((agent) => {
      if (!agent) return;
      const wards = Array.isArray(agent.wardsUndertaking) ? agent.wardsUndertaking : [];
      wards.forEach((ward) => {
        const key = normalizeLookupValue(ward);
        if (!key || map[key]) return;
        map[key] = agent;
      });
    });
    return map;
  }, [zonalAgents]);

  const totalVoters = allVoteData.length;
  const totalConfirmed = confirmedEntries.length;
  const confirmationPercent = totalVoters > 0 ? (totalConfirmed / totalVoters) * 100 : 0;

  const perAgent = useMemo(() => {
    const result = {};
    confirmedEntries.forEach(([epic, info]) => {
      const agent = info.confirmedBy || "Unknown";
      const voter = epicToVoterMap[epic] || {};
      const boothValue = normalizeLookupValue(info.boothNumber || voter["BOOTH"]);
      const wardValue = normalizeLookupValue(boothToWardMap[boothValue] || voter["SECTION"]);
      const wardAgent = wardAgentByWardMap[wardValue];
      const zonalAgent = zonalAgentByWardMap[wardValue];

      if (!result[agent]) {
        result[agent] = {
          count: 0,
          boothNumbers: new Set(),
          wards: new Set(),
          wardAgents: new Set(),
          zonalAgents: new Set(),
        };
      }

      result[agent].count += 1;
      if (boothValue) {
        result[agent].boothNumbers.add(boothValue);
      }
      if (wardValue) {
        result[agent].wards.add(wardValue);
      }
      if (wardAgent && wardAgent.name) {
        result[agent].wardAgents.add(wardAgent.name);
      }
      if (zonalAgent && zonalAgent.name) {
        result[agent].zonalAgents.add(zonalAgent.name);
      }
    });
    return result;
  }, [confirmedEntries, epicToVoterMap, boothToWardMap, wardAgentByWardMap, zonalAgentByWardMap]);

  const zonalHierarchy = useMemo(() => {
    // Build full tree from zonalAgents, wardAgents, boothAgents
    const hierarchy = {};
    // Map for quick lookup
    const wardAgentMap = {};
    wardAgents.forEach((wa) => {
      if (wa && wa.wardNumber) wardAgentMap[String(wa.wardNumber)] = wa;
    });
    const boothAgentMap = {};
    boothAgents.forEach((ba) => {
      if (ba && ba.boothNumber) boothAgentMap[String(ba.boothNumber)] = ba;
    });

    // Build tree from zonalAgents
    zonalAgents.forEach((zonal) => {
      const zonalName = zonal.name || "Unnamed Zonal";
      if (!hierarchy[zonalName]) {
        hierarchy[zonalName] = { wards: {}, count: 0 };
      }
      (zonal.wardsUndertaking || []).forEach((wardNum) => {
        const wardKey = String(wardNum);
        const wardAgent = wardAgentMap[wardKey];
        if (!hierarchy[zonalName].wards[wardKey]) {
          hierarchy[zonalName].wards[wardKey] = {
            wardAgentName: (wardAgent && wardAgent.name) || "-",
            booths: {},
            count: 0,
          };
        }
        // Booths for this ward
        let boothNumbers = [];
        if (wardAgent && Array.isArray(wardAgent.boothsUndertaking)) {
          boothNumbers = wardAgent.boothsUndertaking.map(String);
        } else {
          // fallback: try to find booth agents with this ward
          boothNumbers = boothAgents.filter((ba) => String(ba.wardNumber) === wardKey).map((ba) => String(ba.boothNumber));
        }
        boothNumbers.forEach((boothNum) => {
          if (!hierarchy[zonalName].wards[wardKey].booths[boothNum]) {
            const boothAgent = boothAgentMap[boothNum];
            hierarchy[zonalName].wards[wardKey].booths[boothNum] = {
              boothAgents: boothAgent ? [boothAgent.username] : [],
              count: 0,
            };
          }
        });
      });
    });

    // Now, add confirmed counts and agents
    confirmedEntries.forEach(([epic, info]) => {
      const voter = epicToVoterMap[epic] || {};
      const boothValue = normalizeLookupValue(info.boothNumber || voter["BOOTH"]);
      const wardValue = normalizeLookupValue(boothToWardMap[boothValue] || voter["SECTION"]);
      const zonalAgent = zonalAgentByWardMap[wardValue];
      const zonalName = (zonalAgent && zonalAgent.name) || "Unmapped Zonal";
      const wardKey = wardValue || "Unmapped Ward";
      const boothKey = boothValue || "Unmapped Booth";
      const boothAgent = info.confirmedBy || "Unknown";

      if (!hierarchy[zonalName]) {
        hierarchy[zonalName] = { wards: {}, count: 0 };
      }
      if (!hierarchy[zonalName].wards[wardKey]) {
        hierarchy[zonalName].wards[wardKey] = {
          wardAgentName: (wardAgentMap[wardKey] && wardAgentMap[wardKey].name) || "-",
          booths: {},
          count: 0,
        };
      }
      if (!hierarchy[zonalName].wards[wardKey].booths[boothKey]) {
        hierarchy[zonalName].wards[wardKey].booths[boothKey] = {
          boothAgents: [],
          count: 0,
        };
      }
      hierarchy[zonalName].count += 1;
      hierarchy[zonalName].wards[wardKey].count += 1;
      hierarchy[zonalName].wards[wardKey].booths[boothKey].count += 1;
      // Add booth agent if not already present
      if (!hierarchy[zonalName].wards[wardKey].booths[boothKey].boothAgents.includes(boothAgent)) {
        hierarchy[zonalName].wards[wardKey].booths[boothKey].boothAgents.push(boothAgent);
      }
    });

    return hierarchy;
  }, [zonalAgents, wardAgents, boothAgents, confirmedEntries, epicToVoterMap, boothToWardMap, zonalAgentByWardMap]);

  const toggleZonal = (zonalName) => {
    setExpandedZonal((prev) => (prev === zonalName ? null : zonalName));
    setExpandedWard(null); // close any open ward when switching zonal
  };

  const toggleWard = (zonalName, wardName) => {
    const wardKey = `${zonalName}__${wardName}`;
    setExpandedWard((prev) => (prev === wardKey ? null : wardKey));
  };

  const selectedAgentEntries = useMemo(() => {
    if (!selectedAgent) return [];
    return confirmedEntries.filter(([, info]) => (info && (info.confirmedBy || "Unknown")) === selectedAgent);
  }, [confirmedEntries, selectedAgent]);

  const agentInfoMap = useMemo(() => {
    const map = {};
    boothAgents.forEach((agent) => {
      if (agent && agent.username) {
        map[agent.username] = agent;
      }
    });
    return map;
  }, [boothAgents]);

  const selectedVoter = useMemo(() => {
    if (!selectedVoterEpic) return null;
    return epicToVoterMap[selectedVoterEpic] || null;
  }, [selectedVoterEpic, epicToVoterMap]);

  const selectedChecklist = useMemo(() => {
    if (!selectedVoterEpic) return null;
    return checklists[selectedVoterEpic] || null;
  }, [selectedVoterEpic, checklists]);
  
  const selectedAgentInfo = useMemo(() => {
    if (!selectedAgent) return null;
    return agentInfoMap[selectedAgent] || null;
  }, [selectedAgent, agentInfoMap]);

  const selectedAgentHierarchy = useMemo(() => {
    if (!selectedAgent) {
      return {
        boothNumbers: [],
        wards: [],
        wardAgents: [],
        zonalAgents: [],
      };
    }

    const info = perAgent[selectedAgent];
    if (!info) {
      return {
        boothNumbers: [],
        wards: [],
        wardAgents: [],
        zonalAgents: [],
      };
    }

    return {
      boothNumbers: Array.from(info.boothNumbers || []),
      wards: Array.from(info.wards || []),
      wardAgents: Array.from(info.wardAgents || []),
      zonalAgents: Array.from(info.zonalAgents || []),
    };
  }, [selectedAgent, perAgent]);

  if (!user || user.role !== "super_admin") {
    return (
      <div style={{ padding: 24, color: "#fff" }}>
        Access restricted: this page is only for super admin.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: isMobile ? "16px" : "32px",
        background: "#0D0D0D",
        minHeight: "100vh",
        color: "#FFF8F0",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {!selectedAgent ? (
        <>
          <h1
            style={{
              fontSize: isMobile ? "20px" : "26px",
              color: "#F4A900",
              marginBottom: "16px",
            }}
          >
            ✅ Vote Confirmations Overview
          </h1>

          {/* Overall Progress */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(244,169,0,0.3)",
              background: "rgba(244,169,0,0.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "space-between",
                gap: "12px",
                marginBottom: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Total voters in database
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {totalVoters.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Confirmed by booth agents
                </div>
                <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {totalConfirmed.toLocaleString()} (
                  {confirmationPercent.toFixed(1)}%)
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${confirmationPercent}%`,
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #2ECC71, #27AE60, #2ECC71)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Hierarchy Summary */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#F4A900",
              }}
            >
              Zonal {'>'} Ward {'>'} Booth Hierarchy
            </h2>
            {Object.keys(zonalHierarchy).length === 0 ? (
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                No confirmed votes recorded yet.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: "14px",
                    overflow: "hidden",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                    boxShadow: "0 8px 22px rgba(0,0,0,0.22)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setIsSuperAdminOpen((prev) => !prev)}
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      padding: isMobile ? "10px" : "12px 14px",
                      border: "none",
                      cursor: "pointer",
                      background: "linear-gradient(90deg, rgba(76,175,80,0.2), rgba(76,175,80,0.1))",
                      color: "#C8F7D1",
                      fontWeight: "700",
                      fontSize: isMobile ? "13px" : "14px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                      <span style={{ fontSize: "15px" }}>Root</span>
                      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Super Admin</span>
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                      <span
                        style={{
                          background: "rgba(158,232,182,0.18)",
                          border: "1px solid rgba(158,232,182,0.45)",
                          color: "#9EE8B6",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        {`${totalConfirmed.toLocaleString()} confirmed`}
                      </span>
                      <span style={{ fontSize: "12px", color: "#9EE8B6" }}>{isSuperAdminOpen ? "Hide" : "Show"}</span>
                    </span>
                  </button>

                  {isSuperAdminOpen && (
                    <div style={{ padding: isMobile ? "8px" : "10px" }}>
                      {Object.entries(zonalHierarchy)
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([zonalName, zonalInfo]) => {
                          const isZonalOpen = expandedZonal === zonalName;
                          return (
                            <div
                              key={zonalName}
                              style={{
                                border: "1px solid rgba(255,255,255,0.14)",
                                borderRadius: "12px",
                                background: "rgba(255,255,255,0.025)",
                                overflow: "hidden",
                                marginBottom: "8px",
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => toggleZonal(zonalName)}
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  gap: "10px",
                                  padding: isMobile ? "9px 10px" : "10px 12px",
                                  border: "none",
                                  cursor: "pointer",
                                  background: "linear-gradient(90deg, rgba(244,169,0,0.16), rgba(244,169,0,0.07))",
                                  color: "#F4A900",
                                  fontWeight: "700",
                                  textAlign: "left",
                                }}
                              >
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                  <span style={{ fontSize: "14px" }}>Z</span>
                                  <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{zonalName}</span>
                                </span>
                                <span style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                  <span
                                    style={{
                                      background: "rgba(255,226,154,0.15)",
                                      border: "1px solid rgba(255,226,154,0.45)",
                                      color: "#FFE29A",
                                      borderRadius: "999px",
                                      padding: "2px 8px",
                                      fontSize: "12px",
                                      fontWeight: 700,
                                    }}
                                  >
                                    {`${zonalInfo.count.toLocaleString()}`}
                                  </span>
                                  <span style={{ color: "#FFE29A", fontSize: "12px" }}>{isZonalOpen ? "Hide" : "Show"}</span>
                                </span>
                              </button>

                              {isZonalOpen && (
                                <div style={{ padding: isMobile ? "8px" : "8px 10px", display: "flex", flexDirection: "column", gap: "10px" }}>
                                  {Object.entries(zonalInfo.wards)
                                    .sort(([a], [b]) => String(a).localeCompare(String(b), undefined, { numeric: true }))
                                    .map(([wardName, wardInfo]) => {
                                      const wardKey = `${zonalName}__${wardName}`;
                                      const isWardOpen = expandedWard === wardKey;
                                      return (
                                        <div
                                          key={wardKey}
                                          style={{
                                            borderLeft: "2px solid rgba(244,169,0,0.42)",
                                            marginLeft: "8px",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          <button
                                            type="button"
                                            onClick={() => toggleWard(zonalName, wardName)}
                                            style={{
                                              width: "100%",
                                              display: "flex",
                                              justifyContent: "space-between",
                                              alignItems: "center",
                                              gap: "10px",
                                              border: "1px solid rgba(255,255,255,0.12)",
                                              borderRadius: "8px",
                                              background: "rgba(255,255,255,0.045)",
                                              padding: isMobile ? "8px" : "8px 10px",
                                              cursor: "pointer",
                                              color: "#FFE29A",
                                              textAlign: "left",
                                            }}
                                          >
                                            <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
                                              <span style={{ fontWeight: 700, color: "#FFE29A" }}>{`Ward ${wardName}`}</span>
                                              <span style={{ color: "rgba(255,255,255,0.78)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {`Agent: ${wardInfo.wardAgentName || "-"}`}
                                              </span>
                                            </span>
                                            <span style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                                              <span
                                                style={{
                                                  background: "rgba(233,252,235,0.12)",
                                                  border: "1px solid rgba(233,252,235,0.4)",
                                                  color: "#E9FCEB",
                                                  borderRadius: "999px",
                                                  padding: "2px 8px",
                                                  fontSize: "12px",
                                                  fontWeight: 700,
                                                }}
                                              >
                                                {wardInfo.count.toLocaleString()}
                                              </span>
                                              <span style={{ color: "#E9FCEB", fontSize: "12px" }}>{isWardOpen ? "Hide" : "Show"}</span>
                                            </span>
                                          </button>

                                          {isWardOpen && (
                                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                                              {Object.entries(wardInfo.booths)
                                                .sort(([a], [b]) => String(a).localeCompare(String(b), undefined, { numeric: true }))
                                                .map(([boothName, boothInfo]) => (
                                                  <div
                                                    key={`${wardKey}-${boothName}`}
                                                    style={{
                                                      border: "1px solid rgba(255,255,255,0.12)",
                                                      borderLeft: "3px solid rgba(158,232,182,0.7)",
                                                      borderRadius: "8px",
                                                      marginLeft: "10px",
                                                      padding: isMobile ? "8px" : "8px 10px",
                                                      background: "rgba(255,255,255,0.03)",
                                                      color: "rgba(255,255,255,0.92)",
                                                      lineHeight: 1.4,
                                                      display: "flex",
                                                      justifyContent: "space-between",
                                                      alignItems: isMobile ? "flex-start" : "center",
                                                      flexDirection: isMobile ? "column" : "row",
                                                      gap: "6px",
                                                    }}
                                                  >
                                                    <span style={{ minWidth: 0 }}>
                                                      <span style={{ fontWeight: 700, color: "#D7F6E1" }}>{`Booth ${boothName}`}</span>
                                                      <span style={{ color: "rgba(255,255,255,0.72)", marginLeft: "8px" }}>
                                                        {`Agents: ${Array.from(boothInfo.boothAgents || []).join(", ") || "-"}`}
                                                      </span>
                                                    </span>
                                                    <span
                                                      style={{
                                                        background: "rgba(158,232,182,0.14)",
                                                        border: "1px solid rgba(158,232,182,0.45)",
                                                        color: "#9EE8B6",
                                                        borderRadius: "999px",
                                                        padding: "2px 8px",
                                                        fontSize: "12px",
                                                        fontWeight: 700,
                                                      }}
                                                    >
                                                      {`${boothInfo.count.toLocaleString()} confirmed`}
                                                    </span>
                                                  </div>
                                                ))}
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Per Agent Summary */}
          <div
            style={{
              marginBottom: "24px",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <h2
              style={{
                fontSize: "18px",
                marginBottom: "12px",
                color: "#F4A900",
              }}
            >
              Per Booth Agent Summary
            </h2>
            {Object.keys(perAgent).length === 0 ? (
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                No confirmed votes recorded yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <th style={{ padding: "8px", textAlign: "left" }}>Agent</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Zonal Agent</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Ward(s)</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Ward Agent</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Assigned Booth</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Links</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Booth(s) Confirmed</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Donation</th>
                      <th style={{ padding: "8px", textAlign: "right" }}>
                        Confirmed Votes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(perAgent).map(([agent, info]) => {
                      const boothList = Array.from(info.boothNumbers || []).join(", ") || "-";
                      const wardList = Array.from(info.wards || []).join(", ") || "-";
                      const wardAgentList = Array.from(info.wardAgents || []).join(", ") || "-";
                      const zonalAgentList = Array.from(info.zonalAgents || []).join(", ") || "-";
                      const agentDetails = agentInfoMap[agent] || {};
                      const primaryBooth = agentDetails.boothNumber || boothList;
                      const phoneNumber = agentDetails.phoneNumber || "-";
                      const donationValue = Number(agentDetails.donationAmount);
                      const donationDisplay =
                        agentDetails.donationAmount !== null && agentDetails.donationAmount !== undefined && agentDetails.donationAmount !== ""
                          ? (Number.isFinite(donationValue)
                              ? `Rs ${donationValue.toLocaleString()}`
                              : agentDetails.donationAmount)
                          : "-";
                      return (
                        <tr
                          key={agent}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setSelectedAgent(agent);
                            setSelectedVoterEpic(null);
                          }}
                        >
                          <td style={{ padding: "8px" }}>{agent}</td>
                          <td style={{ padding: "8px" }}>{zonalAgentList}</td>
                          <td style={{ padding: "8px" }}>{wardList}</td>
                          <td style={{ padding: "8px" }}>{wardAgentList}</td>
                          <td style={{ padding: "8px" }}>{primaryBooth || "-"}</td>
                          <td style={{ padding: "8px" }}>{phoneNumber}</td>
                          <td style={{ padding: "8px" }}>
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                              {agentDetails.youtubeLink && (
                                <a
                                  href={agentDetails.youtubeLink}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  style={{
                                    color: "#9AD5FF",
                                    fontSize: 12,
                                    textDecoration: "underline",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  YouTube
                                </a>
                              )}
                              {agentDetails.websiteLink && (
                                <a
                                  href={agentDetails.websiteLink}
                                  target="_blank"
                                  rel="noreferrer noopener"
                                  style={{
                                    color: "#9AD5FF",
                                    fontSize: 12,
                                    textDecoration: "underline",
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Website
                                </a>
                              )}
                              {!agentDetails.youtubeLink && !agentDetails.websiteLink && (
                                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>-</span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: "8px" }}>{boothList}</td>
                          <td style={{ padding: "8px" }}>{donationDisplay}</td>
                          <td style={{ padding: "8px", textAlign: "right" }}>
                            {info.count.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Agent-specific confirmed voters view */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <button
              onClick={() => {
                setSelectedAgent(null);
                setSelectedVoterEpic(null);
              }}
              style={{
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.4)",
                borderRadius: "6px",
                color: "#FFF8F0",
                padding: "6px 12px",
                fontSize: "13px",
                cursor: "pointer",
              }}
            >
              ← Back to overview
            </button>
            <h1
              style={{
                fontSize: isMobile ? "18px" : "22px",
                color: "#F4A900",
                margin: 0,
                flex: 1,
                textAlign: "center",
              }}
            >
              Agent: {selectedAgent} – Confirmed Voters
            </h1>
            <div style={{ width: 100 }} />
          </div>

          {selectedAgentInfo && (
            <div
              style={{
                marginBottom: "16px",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.03)",
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Assigned Booth</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentInfo.boothNumber || selectedAgentHierarchy.boothNumbers.join(", ") || "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Ward(s)</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentHierarchy.wards.join(", ") || "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Ward Agent</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentHierarchy.wardAgents.join(", ") || "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Zonal Agent</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentHierarchy.zonalAgents.join(", ") || "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Phone</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentInfo.phoneNumber || "-"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Status</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: selectedAgentInfo.isActive ? "#2ECC71" : "#FFC107" }}>
                  {selectedAgentInfo.isActive ? "Active" : "Inactive"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Donation</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {(() => {
                    const donationValue = Number(selectedAgentInfo.donationAmount);
                    if (selectedAgentInfo.donationAmount === null || selectedAgentInfo.donationAmount === undefined || selectedAgentInfo.donationAmount === "") {
                      return "-";
                    }
                    return Number.isFinite(donationValue)
                      ? `Rs ${donationValue.toLocaleString()}`
                      : selectedAgentInfo.donationAmount;
                  })()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Created At</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>
                  {selectedAgentInfo.createdAt ? new Date(selectedAgentInfo.createdAt).toLocaleDateString() : "-"}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: 1 }}>Links</div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {selectedAgentInfo.youtubeLink && (
                    <a
                      href={selectedAgentInfo.youtubeLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: "#9AD5FF", fontSize: 13, textDecoration: "underline" }}
                    >
                      YouTube
                    </a>
                  )}
                  {selectedAgentInfo.websiteLink && (
                    <a
                      href={selectedAgentInfo.websiteLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      style={{ color: "#9AD5FF", fontSize: 13, textDecoration: "underline" }}
                    >
                      Website
                    </a>
                  )}
                  {!selectedAgentInfo.youtubeLink && !selectedAgentInfo.websiteLink && (
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>-</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div
            style={{
              marginBottom: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                padding: "12px 18px",
                borderRadius: "10px",
                background: "rgba(39, 174, 96, 0.25)",
                border: "1px solid rgba(39, 174, 96, 0.8)",
                color: "#E8FFF1",
                fontSize: "16px",
                fontWeight: "600",
                minWidth: 160,
                textAlign: "right",
              }}
            >
              Total votes:
              <span
                style={{
                  marginLeft: 10,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FFFFFF",
                }}
              >
                {selectedAgentEntries.length}
              </span>
            </div>
          </div>

          <div
            style={{
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {selectedAgentEntries.length === 0 ? (
              <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                No voters have been marked as confirmed by this agent yet.
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "12px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        borderBottom: "1px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      <th style={{ padding: "8px", textAlign: "left" }}>EPIC</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Zonal</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Ward</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Ward Agent</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Booth</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Street</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Needs</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Party</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Phone</th>
                      <th style={{ padding: "8px", textAlign: "left" }}>Confirmed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAgentEntries.map(([epic, info]) => {
                      const voter = epicToVoterMap[epic] || {};
                      const boothValue = normalizeLookupValue(info.boothNumber || voter["BOOTH"]);
                      const wardValue = normalizeLookupValue(boothToWardMap[boothValue] || voter["SECTION"]);
                      const wardAgent = wardAgentByWardMap[wardValue];
                      const zonalAgent = zonalAgentByWardMap[wardValue];
                      const needsValue =
                        info.needs === "Others"
                          ? (info.needsOther || "Others")
                          : (info.needs || "-");
                      return (
                        <tr
                          key={epic}
                          style={{
                            borderBottom: "1px solid rgba(255,255,255,0.06)",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedVoterEpic(epic)}
                        >
                          <td style={{ padding: "8px", fontFamily: "monospace" }}>{epic}</td>
                          <td style={{ padding: "8px" }}>{voter["NAME_EN"] || "N/A"}</td>
                          <td style={{ padding: "8px" }}>{(zonalAgent && zonalAgent.name) || "-"}</td>
                          <td style={{ padding: "8px" }}>{wardValue || "-"}</td>
                          <td style={{ padding: "8px" }}>{(wardAgent && wardAgent.name) || "-"}</td>
                          <td style={{ padding: "8px" }}>{voter["BOOTH"] || boothValue || ""}</td>
                          <td style={{ padding: "8px" }}>{voter["SECTION_NAME"] || ""}</td>
                          <td style={{ padding: "8px", maxWidth: 260 }}>{needsValue}</td>
                          <td style={{ padding: "8px" }}>{info.votedParty || "-"}</td>
                          <td style={{ padding: "8px" }}>{info.phone || "-"}</td>
                          <td style={{ padding: "8px" }}>
                            {info.confirmedAt
                              ? new Date(info.confirmedAt).toLocaleString()
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Voter Detail Modal for selected agent view */}
      {selectedVoterEpic && selectedVoter && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.88)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setSelectedVoterEpic(null)}
        >
          <div
            style={{
              background: "linear-gradient(145deg, #0D0D0D, #1A1A1A)",
              borderRadius: 20,
              border: "2px solid rgba(244,169,0,0.5)",
              width: "95%",
              maxWidth: 800,
              maxHeight: "90vh",
              overflow: "hidden",
              color: "#FFF8F0",
              boxShadow: "0 24px 60px rgba(0,0,0,0.7)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              style={{
                background: "linear-gradient(135deg, #C8102E, #A00020)",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "2px solid #F4A900",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  🗳️ {selectedVoter["NAME_EN"] || "Voter Details"}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.8)",
                    marginTop: 4,
                  }}
                >
                  EPIC: <span style={{ fontFamily: "monospace" }}>{selectedVoter["EPIC"]}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedVoterEpic(null)}
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.7)",
                  borderRadius: "50%",
                  width: 34,
                  height: 34,
                  color: "#FFF8F0",
                  cursor: "pointer",
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            <div
              style={{
                padding: 20,
                maxHeight: "calc(90vh - 70px)",
                overflowY: "auto",
                background: "radial-gradient(circle at top, rgba(244,169,0,0.12), transparent)",
              }}
            >
              {/* Personal Info */}
              <div
                style={{
                  marginBottom: 18,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid rgba(244,169,0,0.4)",
                  background: "rgba(0,0,0,0.35)",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    color: "#F4A900",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Personal Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {["NAME_EN", "AGE", "GENDER", "R_TYPE", "R_Name"].map((key) => (
                    selectedVoter[key] && (
                      <div key={key} style={{ fontSize: 13 }}>
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: 2,
                            letterSpacing: 0.5,
                          }}
                        >
                          {fieldLabels[key] || key}
                        </div>
                        <div style={{ fontSize: 14, color: "#FFF" }}>{selectedVoter[key]}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Electoral Info */}
              <div
                style={{
                  marginBottom: 18,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    color: "#F4A900",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Electoral Information
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {["S.No", "AC_NAME", "BOOTH", "SECTION", "SL"].map((key) => (
                    selectedVoter[key] && (
                      <div key={key} style={{ fontSize: 13 }}>
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: 2,
                            letterSpacing: 0.5,
                          }}
                        >
                          {fieldLabels[key] || key}
                        </div>
                        <div style={{ fontSize: 14, color: "#FFF" }}>{selectedVoter[key]}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Address & Roof Info */}
              <div
                style={{
                  marginBottom: 18,
                  padding: 14,
                  borderRadius: 12,
                  border: "1px solid rgba(46,204,113,0.35)",
                  background: "rgba(0,0,0,0.3)",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    color: "#2ECC71",
                    marginBottom: 10,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  Address & Family
                </h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: 10,
                  }}
                >
                  {["HOUSE", "SECTION_NAME", "BOOTH NAME", "BOOTH NAME TAMIL", "One Roof", "One Roof Running Number"].map((key) => (
                    selectedVoter[key] && (
                      <div key={key} style={{ fontSize: 13 }}>
                        <div
                          style={{
                            fontSize: 11,
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.7)",
                            marginBottom: 2,
                            letterSpacing: 0.5,
                          }}
                        >
                          {fieldLabels[key] || key}
                        </div>
                        <div style={{ fontSize: 14, color: "#FFF" }}>{selectedVoter[key]}</div>
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Checklist Info */}
              {selectedChecklist && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 12,
                    border: "1px solid rgba(244,169,0,0.4)",
                    background: "rgba(244,169,0,0.08)",
                  }}
                >
                  <h3
                    style={{
                      fontSize: 14,
                      color: "#F4A900",
                      marginBottom: 10,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    Booth Agent Checklist
                  </h3>
                  <div style={{ fontSize: 13 }}>
                    {(() => {
                      const boothValue = normalizeLookupValue(selectedChecklist.boothNumber || selectedVoter["BOOTH"]);
                      const wardValue = normalizeLookupValue(boothToWardMap[boothValue] || selectedVoter["SECTION"]);
                      const wardAgent = wardAgentByWardMap[wardValue];
                      const zonalAgent = zonalAgentByWardMap[wardValue];

                      return (
                        <>
                          <div style={{ marginBottom: 4 }}>
                            <strong>Zonal Agent:</strong> {(zonalAgent && zonalAgent.name) || "-"}
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <strong>Ward:</strong> {wardValue || "-"}
                          </div>
                          <div style={{ marginBottom: 4 }}>
                            <strong>Ward Agent:</strong> {(wardAgent && wardAgent.name) || "-"}
                          </div>
                        </>
                      );
                    })()}
                    <div style={{ marginBottom: 4 }}>
                      <strong>Needs:</strong>{" "}
                      {selectedChecklist.needs === "Others"
                        ? (selectedChecklist.needsOther || "Others")
                        : (selectedChecklist.needs || "-")}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>Party:</strong> {selectedChecklist.votedParty || "-"}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>Phone:</strong> {selectedChecklist.phone || "-"}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>Confirmed:</strong> {selectedChecklist.confirmed ? "Yes" : "No"}
                    </div>
                    <div style={{ marginBottom: 4 }}>
                      <strong>Agent:</strong> {selectedChecklist.confirmedBy || "Unknown"}
                    </div>
                    <div>
                      <strong>Confirmed At:</strong>{" "}
                      {selectedChecklist.confirmedAt
                        ? new Date(selectedChecklist.confirmedAt).toLocaleString()
                        : "-"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ConfirmationsAdmin;

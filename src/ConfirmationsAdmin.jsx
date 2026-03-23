import React, { useEffect, useMemo, useState } from "react";
import data from "./voting/output.jsx";

const allVoteData = data;

const ConfirmationsAdmin = ({ user, languageMode }) => {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth <= 768 : false);
  const [checklists, setChecklists] = useState({});
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [selectedVoterEpic, setSelectedVoterEpic] = useState(null);
  const [boothAgents, setBoothAgents] = useState([]);

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

  const totalVoters = allVoteData.length;
  const totalConfirmed = confirmedEntries.length;
  const confirmationPercent = totalVoters > 0 ? (totalConfirmed / totalVoters) * 100 : 0;

  const perAgent = useMemo(() => {
    const result = {};
    confirmedEntries.forEach(([epic, info]) => {
      const agent = info.confirmedBy || "Unknown";
      if (!result[agent]) {
        result[agent] = {
          count: 0,
          boothNumbers: new Set(),
        };
      }
      result[agent].count += 1;
      if (info.boothNumber) {
        result[agent].boothNumbers.add(String(info.boothNumber));
      }
    });
    return result;
  }, [confirmedEntries]);

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
                  {selectedAgentInfo.boothNumber || "-"}
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
                          <td style={{ padding: "8px" }}>{voter["BOOTH"] || ""}</td>
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

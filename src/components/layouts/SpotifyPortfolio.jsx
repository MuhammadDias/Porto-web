import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../shared/SpotifyConstants";
import { SearchIcon, BellIcon, ChevronDownIcon, PlayIcon } from "../shared/SpotifyIcons";
import Sidebar, { NAV_ITEMS } from "./Sidebar";
import ProjectCard from "../projects/ProjectCard";
import AboutSection from "../sections/AboutSection";
import SkillsSection from "../sections/SkillsSection";
import ContactSection from "../sections/ContactSection";

import { supabase } from "../../supabase/client";
import { getProjects } from "../../supabase/projectApi";
import { getProfile } from "../../supabase/profileApi";
import { getSkills } from "../../supabase/skillsApi";
import { getTotalViews } from "../../supabase/viewApi";
import { checkIfLiked } from "../../supabase/likeApi";
import Tabs from "../shared/Tabs";

export default function SpotifyPortfolio() {
  const [activeNav, setActiveNav] = useState("home");
  const [searchVal, setSearchVal] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [filter, setFilter] = useState("All");
  const [activeSkillTab, setActiveSkillTab] = useState("All");
  const [activeSavedTab, setActiveSavedTab] = useState("All");


  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [totalViews, setTotalViews] = useState(0);

  const PROJECT_TABS = ["All", ...new Set(projects.map(p => (p.category || 'Uncategorized').trim()).filter(Boolean))];
  const SKILL_TABS = ["All", "Frontend", "Backend", "Design", "Tools"];
  const SAVED_TABS = ["All", "Liked"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        const [profData, projData, skillsData, viewsCount] = await Promise.all([
          getProfile(),
          getProjects(),
          getSkills(),
          getTotalViews(),
        ]);

        let enrichedProjects = projData || [];
        if (user) {
          enrichedProjects = await Promise.all(
            enrichedProjects.map(async (p) => {
              const liked = await checkIfLiked(user.id, p.id);
              return { ...p, liked };
            })
          );
        }

        setProfile(profData);
        setProjects(enrichedProjects);
        setSkills(skillsData || []);
        setTotalViews(viewsCount || 0);
      } catch (err) {
        console.error("Error fetching Spotify data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setMobileView(w < 600);
      setSidebarCollapsed(w < 860 && w >= 600);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (id === 'home' && scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    const element = document.getElementById(id);
    if (element && scrollRef.current) {
        // Adjust for sticky header
        const top = element.offsetTop - 80;
        scrollRef.current.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const filtered = projects.filter((p) => {
    const title = p.title || '';
    const subtitle = p.subtitle || p.description || '';
    const matchesSearch =
      title.toLowerCase().includes(searchVal.toLowerCase()) ||
      subtitle.toLowerCase().includes(searchVal.toLowerCase());
    const matchesFilter = filter === "All" || (p.category || '').toLowerCase().replace(/\s/g, '') === filter.toLowerCase().replace(/\s/g, '');
    return matchesSearch && matchesFilter;
  });

  const filteredSkills = skills.filter((s) =>
    activeSkillTab === "All" || (s.category || '').toLowerCase() === activeSkillTab.toLowerCase()
  );

  const savedProjects = projects.filter((p) => p.liked);
  const filteredSaved = activeSavedTab === "All" ? savedProjects : savedProjects;

  const initials = profile?.name ? profile.name.charAt(0) : "U";

  // Check section visibility on scroll to update active nav
  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    const sections = ['home', 'projects', 'about', 'skills', 'contact'];
    
    // Simple logic to find active section depending on scroll position
    for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec === 'home' && scrollTop < 300) {
            setActiveNav('home');
            break;
        }
        const el = document.getElementById(sec);
        if (el && scrollTop >= el.offsetTop - 200) {
            setActiveNav(sec);
            break;
        }
    }
  };

  if (loading) {
    return (
        <div style={{ background: COLORS.bg, height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.white }}>
            Loading Portfolio...
        </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #555; }
        html, body {
            margin: 0;
            padding: 0;
            height: 100%;
        }
      `}</style>

      <div
        ref={containerRef}
        style={{
          fontFamily: "'Sora', sans-serif",
          background: COLORS.bg,
          color: COLORS.white,
          height: "100vh",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Sidebar — hidden on mobile */}
          {!mobileView && (
            <Sidebar
              activeNav={activeNav}
              onNavClick={handleNavClick}
              collapsed={sidebarCollapsed}
              profile={profile}
              recentProjects={projects} // simplistic passing of all projects
            />
          )}

          {/* Main area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Top bar */}
            <div
              style={{
                height: "64px",
                background: "rgba(18,18,18,0.95)",
                backdropFilter: "blur(12px)",
                borderBottom: `1px solid ${COLORS.border}`,
                display: "flex",
                alignItems: "center",
                padding: "0 24px",
                gap: "16px",
                flexShrink: 0,
                position: "sticky",
                top: 0,
                zIndex: 10,
              }}
            >
              {/* Search */}
              <div
                style={{
                  flex: 1,
                  maxWidth: "480px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: searchFocused ? COLORS.accent : COLORS.muted,
                    transition: "color 0.2s",
                    pointerEvents: "none",
                  }}
                >
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search projects…"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  style={{
                    width: "100%",
                    height: "40px",
                    background: COLORS.bgCard,
                    border: `1px solid ${searchFocused ? COLORS.accent : "transparent"}`,
                    borderRadius: "24px",
                    padding: "0 16px 0 40px",
                    color: COLORS.white,
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxShadow: searchFocused ? `0 0 0 3px rgba(29,185,84,0.15)` : "none",
                  }}
                />
              </div>

              <div style={{ flex: 1 }} />

              {/* Notification bell */}
              <button
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.muted,
                  transition: "color 0.15s, background 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = COLORS.white;
                  e.currentTarget.style.background = COLORS.border;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = COLORS.muted;
                  e.currentTarget.style.background = COLORS.bgCard;
                }}
              >
                <BellIcon />
              </button>

              {/* User menu */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px 6px 6px",
                  background: COLORS.bgCard,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: "24px",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.border)}
                onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.bgCard)}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${COLORS.accent}, #17a844)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "11px",
                    color: COLORS.bg,
                    overflow: 'hidden'
                  }}
                >
                    {currentUser?.user_metadata?.avatar_url ? (
                        <img src={currentUser.user_metadata.avatar_url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                    ) : (
                        (currentUser?.email?.charAt(0) || initials).toUpperCase()
                    )}
                </div>
                {!mobileView && (
                  <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.white, maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentUser?.email ? currentUser.email.split('@')[0] : 'Guest'}
                  </span>
                )}
                <span style={{ color: COLORS.muted }}>
                  <ChevronDownIcon />
                </span>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: mobileView ? "20px 16px 80px" : "32px",
              }}
            >
              <div id="home">
                  {/* Hero section */}
                  <div
                    style={{
                      borderRadius: "16px",
                      background: `linear-gradient(135deg, #0d2b1a 0%, #121212 60%)`,
                      border: `1px solid rgba(29,185,84,0.15)`,
                      padding: mobileView ? "28px 20px" : "40px",
                      marginBottom: "32px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Decorative blobs */}
                    <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(29,185,84,0.06)", pointerEvents: "none" }} />
                    <div style={{ position: "absolute", bottom: "-60px", right: "80px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(29,185,84,0.04)", pointerEvents: "none" }} />

                    <div style={{ display: "flex", alignItems: "flex-end", gap: "20px", flexWrap: "wrap" }}>
                      <div
                        style={{
                          width: mobileView ? "64px" : "80px",
                          height: mobileView ? "64px" : "80px",
                          borderRadius: "12px",
                          background: `linear-gradient(135deg, ${COLORS.accent} 0%, #17a844 100%)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: mobileView ? "30px" : "36px",
                          flexShrink: 0,
                          boxShadow: `0 8px 32px rgba(29,185,84,0.3)`,
                          overflow: "hidden"
                        }}
                      >
                         {profile?.avatar_url ? (
                            <img src={profile.avatar_url} alt="" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                         ) : '👨‍💻'}
                      </div>
                      <div style={{ flex: 1, minWidth: "180px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: COLORS.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "6px" }}>
                          Portfolio
                        </div>
                        <h1 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: mobileView ? "28px" : "42px", color: COLORS.white, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: "8px" }}>
                          {profile?.name || "Developer"}
                        </h1>
                        <p style={{ fontSize: "14px", color: COLORS.muted, lineHeight: 1.6, maxWidth: "480px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {profile?.bio || "Welcome to my portfolio"} <br/>
                          {projects.length} projects · {totalViews} total views
                        </p>
                      </div>
                    </div>

                    {/* CTA buttons */}
                    <div style={{ marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
                      <button
                        onClick={() => handleNavClick("projects")}
                        style={{
                          height: "44px", padding: "0 28px", background: COLORS.accent, border: "none", borderRadius: "24px",
                          color: COLORS.bg, fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: "14px",
                          cursor: "pointer", letterSpacing: "-0.01em", transition: "background 0.15s, transform 0.1s",
                          display: "flex", alignItems: "center", gap: "8px",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = COLORS.accentHover; e.currentTarget.style.transform = "scale(1.02)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = COLORS.accent; e.currentTarget.style.transform = "scale(1)"; }}
                      >
                        <PlayIcon /> View All Work
                      </button>
                      <button
                        onClick={() => handleNavClick("contact")}
                        style={{
                          height: "44px", padding: "0 24px", background: "transparent", border: `1px solid rgba(255,255,255,0.3)`,
                          borderRadius: "24px", color: COLORS.white, fontFamily: "'Sora', sans-serif", fontWeight: 600,
                          fontSize: "14px", cursor: "pointer", transition: "border-color 0.15s, background 0.15s",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.6)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
                      >
                        Contact Me
                      </button>
                    </div>
                  </div>
              </div>

              <div id="projects" style={{ paddingTop: "64px", marginTop: "-64px" }}>
                  {/* Section header */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "22px", color: COLORS.white, letterSpacing: "-0.02em" }}>
                        Projects
                      </h2>
                      <p style={{ fontSize: "13px", color: COLORS.muted, marginTop: "2px" }}>
                        {filtered.length} of {projects.length} projects
                      </p>
                    </div>
                  </div>

                  {/* Category Tabs */}
                  <Tabs
                    tabs={PROJECT_TABS}
                    activeTab={filter}
                    setActiveTab={setFilter}
                  />

                  {/* Project grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: mobileView ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {filtered.length > 0 ? (
                      filtered.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} currentUser={currentUser} />
                      ))
                    ) : (
                      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px", color: COLORS.muted }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔍</div>
                        <div style={{ fontWeight: 700, fontSize: "16px", color: COLORS.white, marginBottom: "6px" }}>
                          No projects found
                        </div>
                        <div style={{ fontSize: "13px" }}>Try a different search or category</div>
                      </div>
                    )}
                  </div>
              </div>

              {/* Saved Section */}
              <div id="saved" style={{ paddingTop: "64px", marginTop: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "22px", color: COLORS.white, letterSpacing: "-0.02em" }}>
                      Saved Projects
                    </h2>
                  </div>
                  <div style={{ marginBottom: "20px" }}>
                    <Tabs tabs={SAVED_TABS} activeTab={activeSavedTab} setActiveTab={setActiveSavedTab} />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: mobileView ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(220px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {filteredSaved.length > 0 ? (
                      filteredSaved.map((project, i) => (
                        <ProjectCard key={`saved-${project.id}`} project={project} index={i} currentUser={currentUser} />
                      ))
                    ) : (
                      <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", background: COLORS.bgCard, borderRadius: '12px', border: `1px solid ${COLORS.border}` }}>
                        <p style={{ color: COLORS.muted, fontSize: '14px' }}>No saved projects yet. Click the heart icon to save!</p>
                      </div>
                    )}
                  </div>
              </div>

              {/* Stats strip */}
              <div style={{ marginTop: "40px", display: "grid", gridTemplateColumns: mobileView ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: "12px" }}>
                {[
                  { label: "Total Projects", value: projects.length.toString(), icon: "📁" },
                  { label: "Total Views", value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString(), icon: "👁️" },
                  { label: "Liked Projects", value: projects.filter(p => p.liked).length.toString(), icon: "💚" },
                  { label: "Years Active", value: "3+", icon: "🚀" },
                ].map((stat) => (
                  <div key={stat.label} style={{ background: COLORS.bgCard, borderRadius: "12px", padding: "20px", border: `1px solid ${COLORS.border}`, textAlign: "center" }}>
                    <div style={{ fontSize: "24px", marginBottom: "8px" }}>{stat.icon}</div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "22px", color: COLORS.white, letterSpacing: "-0.02em" }}>{stat.value}</div>
                    <div style={{ fontSize: "12px", color: COLORS.muted, marginTop: "4px" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              <AboutSection profile={profile} mobileView={mobileView} />
              
              <div style={{ paddingTop: "64px", marginTop: "32px", marginBottom: "-32px" }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "16px" }}>
                  <h2 style={{ fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: "22px", color: COLORS.white, letterSpacing: "-0.02em" }}>
                    Top Skills
                  </h2>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <Tabs tabs={SKILL_TABS} activeTab={activeSkillTab} setActiveTab={setActiveSkillTab} />
                </div>
              </div>
              <SkillsSection skills={filteredSkills} mobileView={mobileView} />

              <ContactSection mobileView={mobileView} />
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        {mobileView && (
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: "64px",
              background: "rgba(0,0,0,0.95)",
              backdropFilter: "blur(12px)",
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              zIndex: 100,
            }}
          >
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
              const active = activeNav === id;
              return (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: active ? COLORS.accent : COLORS.muted,
                    fontFamily: "'Sora', sans-serif",
                    fontSize: "10px",
                    fontWeight: active ? 700 : 500,
                    padding: "8px 16px",
                    transition: "color 0.15s",
                  }}
                >
                  <Icon />
                  {label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

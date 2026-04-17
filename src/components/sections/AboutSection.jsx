import React from 'react';
import { COLORS } from '../shared/SpotifyConstants';
import { FiCalendar, FiDownload, FiMail, FiMapPin, FiUser } from 'react-icons/fi';

const biodata = {
  name: 'Muhammad Dias Al Izzat',
  birthplace: 'Gresik',
  birthdate: '27 August 2005',
  status: 'Student',
  address: 'Sekargadung, Dukun, Gresik',
};

export default function AboutSection({ profile, mobileView }) {
  if (!profile) return null;

  return (
    <div style={{ marginBottom: "24px" }} id="about">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "24px",
          gap: "12px",
          marginTop: 0,
        }}
      >
        <h2
          style={{
            fontFamily: "'Sora', sans-serif",
            fontWeight: 800,
            fontSize: "22px",
            color: COLORS.white,
            letterSpacing: "-0.02em",
            marginTop: 0,
          }}
        >
          About You
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: mobileView ? "column" : "row",
          gap: mobileView ? "24px" : "40px",
          alignItems: mobileView ? "center" : "flex-start",
        }}
      >
        <div
          style={{
            width: mobileView ? "120px" : "180px",
            height: mobileView ? "120px" : "180px",
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: `linear-gradient(135deg, ${COLORS.accent}, #17a844)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: mobileView ? "48px" : "64px",
            color: COLORS.bg,
            fontWeight: 800,
          }}
        >
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            profile.name ? profile.name.charAt(0).toUpperCase() : "ME"
          )}
        </div>
        <div style={{ flex: 1, textAlign: mobileView ? "center" : "left" }}>
          <h3
            style={{
              fontFamily: "'Sora', sans-serif",
              fontWeight: 800,
              fontSize: mobileView ? "24px" : "32px",
              color: COLORS.white,
              marginBottom: "8px",
            }}
          >
            {biodata.name}
          </h3>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: COLORS.accent,
              marginBottom: "16px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            {biodata.status}
          </div>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: mobileView ? "1fr" : "1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
            textAlign: "left"
          }}>
            {Object.entries(biodata).map(([key, value]) => (
              <div key={key} style={{
                background: "rgba(255,255,255,0.03)",
                border: `1px solid rgba(255,255,255,0.05)`,
                borderRadius: "8px",
                padding: "12px",
              }}>
                <p style={{ fontSize: "10px", color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>
                  {key}
                </p>
                <p style={{ fontSize: "13px", color: COLORS.white }}>{value}</p>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
            justifyContent: mobileView ? "center" : "flex-start",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: COLORS.muted }}>
              <FiUser style={{ color: COLORS.white }} /> Frontend
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: COLORS.muted }}>
              <FiMapPin style={{ color: COLORS.white }} /> Gresik
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.03)", padding: "8px 12px", borderRadius: "8px", fontSize: "12px", color: COLORS.muted }}>
              <FiCalendar style={{ color: COLORS.white }} /> Since 2021
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: mobileView ? "center" : "flex-start", flexWrap: "wrap" }}>
            <a
              href="mailto:diasizzat222@gmail.com"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: COLORS.accent, color: COLORS.bg, border: "none",
                padding: "12px 24px", borderRadius: "24px", fontFamily: "'Sora', sans-serif",
                fontWeight: 700, fontSize: "13px", cursor: "pointer", textDecoration: "none"
              }}
            >
              <FiMail /> Contact Me
            </a>
            <a
              href="/CV DPR Fest.jpg"
              download="CV_Muhammad_Dias.jpg"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "transparent", color: COLORS.white, border: `1px solid ${COLORS.border}`,
                padding: "12px 24px", borderRadius: "24px", fontFamily: "'Sora', sans-serif",
                fontWeight: 600, fontSize: "13px", cursor: "pointer", textDecoration: "none"
              }}
            >
              <FiDownload /> Download CV
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

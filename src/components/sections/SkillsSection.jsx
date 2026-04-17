import React from 'react';
import { COLORS } from '../shared/SpotifyConstants';

export default function SkillsSection({ skills, mobileView }) {
  if (!skills || skills.length === 0) return null;

  return (
    <div style={{ marginBottom: "24px", marginTop: mobileView ? "24px" : "32px" }} id="skills">
      <div
        style={{
          display: "none",
        }}
      >
        {/* Title moved to parent wrapper in SpotifyPortfolio for tabs consistency */}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: mobileView ? "1fr" : "repeat(2, 1fr)",
          gap: mobileView ? "12px" : "16px",
        }}
      >
        {skills.map((skill, index) => (
          <div
            key={skill.id || index}
            style={{
              background: COLORS.bgCard,
              borderRadius: "12px",
              padding: mobileView ? "16px" : "20px",
              border: `1px solid ${COLORS.border}`,
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontWeight: 600, color: COLORS.white, fontSize: mobileView ? "14px" : "16px" }}>{skill.name}</span>
                <span style={{ color: COLORS.accent, fontSize: mobileView ? "12px" : "14px", fontWeight: 700 }}>{skill.level}%</span>
              </div>
              <div style={{ width: "100%", height: mobileView ? "6px" : "8px", background: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${skill.level}%`, height: "100%", background: COLORS.accent, borderRadius: "3px" }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { useGlow } from '../hooks/useGlow';

export const GlowSkillCard = ({ skill }) => {
  const glowRef = useGlow();

  return (
    <div
      ref={glowRef}
      className="glow-card group overflow-hidden rounded-xl border border-white/15 bg-black/50 p-5 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-white">{skill.name}</h3>
        <span className="text-sm text-slate-400">{skill.level || 0}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800">
        <div
          className="h-2 rounded-full bg-white transition-all duration-300 group-hover:bg-[#ff9a3c]"
          style={{ width: `${skill.level || 0}%` }}
        />
      </div>
    </div>
  );
};

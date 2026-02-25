import React from 'react';
import { useGlow } from '../hooks/useGlow';
import { useLanguage } from '../i18n';

export const GlowProjectCard = ({ project, onSelect }) => {
  const glowRef = useGlow();
  const { t } = useLanguage();

  return (
    <article
      ref={glowRef}
      className="glow-card group overflow-hidden rounded-xl border border-white/15 bg-black/50 transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="h-36 bg-slate-800">
        {project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
      </div>
      <div className="p-4">
        <p className="mb-1 text-xs uppercase tracking-[0.12em] text-slate-400">{project.category}</p>
        <h3 className="mb-2 font-medium text-white">{project.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-300">{project.description}</p>
        <button onClick={() => onSelect(project)} className="text-sm text-slate-100 transition-colors hover:text-[#ff9a3c]">
          {t('home.viewDetail')}
        </button>
      </div>
    </article>
  );
};

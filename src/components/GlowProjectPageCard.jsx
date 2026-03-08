import React from 'react';
import { FiExternalLink, FiGithub, FiInfo } from 'react-icons/fi';
import { useGlow } from '../hooks/useGlow';
import { useLanguage } from '../i18n';

// Helper function to parse tags, copied from Projects.jsx
const parseTags = (tags) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed;
    } catch (error) {
      return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
    }
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
};

export const GlowProjectPageCard = ({ project, onSelect }) => {
  const glowRef = useGlow();
  const { t } = useLanguage();

  return (
    <article
      ref={glowRef}
      className="glow-card project-card group overflow-hidden rounded-xl border border-white/25 bg-black/50 p-3 shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition-transform duration-300"
    >
      <div className="mb-4 h-56 overflow-hidden rounded-xl border border-white/20 bg-zinc-900 md:h-60">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : null}
      </div>

      <div className="p-1">
        <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
          {project.category || t('common.uncategorized')}
        </p>

        <h2 className="mb-2 text-2xl font-medium leading-tight text-white">{project.title}</h2>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-400">{project.description}</p>

        <div className="mb-5 flex flex-wrap gap-2">
          {parseTags(project.tags)
            .slice(0, 3)
            .map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-xs text-slate-500">
                #{tag}
              </span>
            ))}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <button onClick={(event) => onSelect(project, event)} className="project-action-primary inline-flex items-center gap-2 transition-colors">
            <FiInfo className="h-4 w-4" /> {t('projects.knowMore')}
          </button>
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
              <FiExternalLink className="h-4 w-4" /> {t('projects.live')}
            </a>
          )}
          {project.code && (
            <a href={project.code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-slate-400 transition-colors hover:text-white">
              <FiGithub className="h-4 w-4" /> {t('projects.code')}
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

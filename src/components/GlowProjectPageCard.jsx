import React, { useEffect, useState } from 'react';
import { FiExternalLink, FiGithub, FiInfo, FiHeart, FiBookmark, FiEye } from 'react-icons/fi';
import { useGlow } from '../hooks/useGlow';
import { useLanguage } from '../i18n';
import { supabase } from '../supabase/client';
import { toggleLike, toggleBookmark, checkIfLiked, checkIfBookmarked, getLikeCount, getViewCount } from '../supabase/api';
import toast from 'react-hot-toast';

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
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
      
      const [isLiked, isBookmarked, likes, views] = await Promise.all([
        checkIfLiked(currentUser?.id, project.id),
        checkIfBookmarked(currentUser?.id, project.id),
        getLikeCount(project.id),
        getViewCount(project.id)
      ]);

      setLiked(isLiked);
      setBookmarked(isBookmarked);
      setLikesCount(likes);
      setViewsCount(views);
    };
    init();
  }, [project.id]);

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Please login to like projects');
    try {
      const isLiked = await toggleLike(user.id, project.id);
      setLiked(isLiked);
      setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleBookmark = async (e) => {
    e.stopPropagation();
    if (!user) return toast.error('Please login to bookmark projects');
    try {
      const isBookmarked = await toggleBookmark(user.id, project.id);
      setBookmarked(isBookmarked);
      toast.success(isBookmarked ? 'Project bookmarked' : 'Bookmark removed');
    } catch (error) {
      toast.error('Action failed');
    }
  };

  return (
    <article
      ref={glowRef}
      className="glow-card project-card group relative overflow-hidden rounded-xl border border-white/25 bg-black/50 p-3 shadow-[0_10px_22px_rgba(0,0,0,0.22)] transition-transform duration-300"
    >
      {/* Overlay Actions */}
      <div className="absolute right-5 top-5 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button 
          onClick={handleLike} 
          className={`rounded-full p-2.5 backdrop-blur-md border border-white/10 transition-colors ${liked ? 'bg-red-500 text-white' : 'bg-black/60 text-white hover:bg-white/20'}`}
        >
          <FiHeart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
        </button>
        <button 
          onClick={handleBookmark} 
          className={`rounded-full p-2.5 backdrop-blur-md border border-white/10 transition-colors ${bookmarked ? 'bg-orange-500 text-white' : 'bg-black/60 text-white hover:bg-white/20'}`}
        >
          <FiBookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="mb-4 h-56 overflow-hidden rounded-xl border border-white/20 bg-zinc-900 md:h-60">
        {project.image_url ? (
          <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : null}
      </div>

      <div className="p-1">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a00]" />
            {project.category || t('common.uncategorized')}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><FiHeart className="h-3.5 w-3.5" /> {likesCount}</span>
            <span className="flex items-center gap-1.5"><FiEye className="h-3.5 w-3.5" /> {viewsCount}</span>
          </div>
        </div>

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

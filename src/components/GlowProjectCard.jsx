import React, { useEffect, useState } from 'react';
import { useGlow } from '../hooks/useGlow';
import { useLanguage } from '../i18n';
import { FiHeart, FiBookmark, FiEye } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import { toggleLike, toggleBookmark, checkIfLiked, checkIfBookmarked, getLikeCount, getViewCount } from '../supabase/api';
import toast from 'react-hot-toast';

export const GlowProjectCard = ({ project, onSelect }) => {
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
      className="glow-card project-card group relative overflow-hidden rounded-xl border border-white/25 bg-black/50 shadow-[0_10px_22px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="h-36 bg-slate-800">
        {project.image_url ? <img src={project.image_url} alt={project.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
      </div>
      
      <div className="absolute right-2 top-2 z-10 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <button 
          onClick={handleLike} 
          className={`rounded-full p-2 backdrop-blur-md transition-colors ${liked ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-white/20'}`}
        >
          <FiHeart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        </button>
        <button 
          onClick={handleBookmark} 
          className={`rounded-full p-2 backdrop-blur-md transition-colors ${bookmarked ? 'bg-orange-500 text-white' : 'bg-black/50 text-white hover:bg-white/20'}`}
        >
          <FiBookmark className={`h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{project.category}</p>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="flex items-center gap-1"><FiHeart className="h-3 w-3" /> {likesCount}</span>
            <span className="flex items-center gap-1"><FiEye className="h-3 w-3" /> {viewsCount}</span>
          </div>
        </div>
        <h3 className="mb-2 font-medium text-white">{project.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm text-slate-300">{project.description}</p>
        <button onClick={(event) => onSelect(project, event)} className="project-action-primary text-sm transition-colors hover:text-[#ff9a3c]">
          {t('home.viewDetail')}
        </button>
      </div>
    </article>
  );
};

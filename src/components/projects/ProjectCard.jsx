import React, { useState } from 'react';
import { COLORS } from '../shared/SpotifyConstants';
import { HeartIcon, EyeIcon, ExternalLinkIcon, GithubIcon, PlayIcon } from '../shared/SpotifyIcons';
import { toggleLike, checkIfLiked } from '../../supabase/likeApi';
import { incrementViews } from '../../supabase/viewApi';
import { supabase } from '../../supabase/client';
import { Rocket } from 'lucide-react';

export default function ProjectCard({ project, index, currentUser, mobileView, onSelect }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(project.liked || false);
  const [loadingLike, setLoadingLike] = useState(false);

  const formatViews = (count) => {
    if (!count && count !== 0) return '0';
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return String(count);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!currentUser) return; // Must be logged in
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      const result = await toggleLike(currentUser.id, project.id);
      setLiked(result);
    } catch (err) {
      console.error('Error toggling like:', err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleView = () => {
    incrementViews(project.id).catch(() => {});
    if (onSelect) onSelect(project);
  };

  const projectColor = project.color || '#1a3a2a';

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleView}
      style={{
        background: COLORS.bgCard,
        borderRadius: '12px',
        padding: mobileView ? "14px" : "16px",
        cursor: 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.6)' : 'none',
        position: 'relative',
        width: "100%",
        minWidth: 0,
        height: "auto",
        boxSizing: "border-box",
        animationDelay: `${index * 60}ms`,
        animation: 'fadeSlideIn 0.4s ease both',
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Thumbnail */}
      <div
        style={{
          width: '100%',
          height: mobileView ? "140px" : "180px",
          borderRadius: '8px',
          background: projectColor,
          marginBottom: '12px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {project.image_url ? (
          <img
            src={project.image_url}
            alt={project.title}
            style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
            }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Rocket size={52} color="rgba(255,255,255,0.3)" />
          </div>
        )}

        {/* Hover overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
          }}
        >
          <button
            style={{
              width: '44px', height: '44px', borderRadius: '50%', background: COLORS.accent,
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.8)',
              transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: `0 8px 24px rgba(29,185,84,0.4)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <PlayIcon />
          </button>
          {project.live_url && (
            <button
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.white,
                transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.8)',
                transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
              }}
              onClick={(e) => { e.stopPropagation(); window.open(project.live_url, '_blank'); }}
            >
              <ExternalLinkIcon />
            </button>
          )}
          {project.github_url && (
            <button
              style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: COLORS.white,
                transform: hovered ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.8)',
                transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
              }}
              onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
            >
              <GithubIcon />
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: mobileView ? "14px" : "16px", color: COLORS.white,
            marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {project.title}
          </div>
          <div style={{ 
            fontSize: '12px', 
            color: COLORS.muted, 
            maxHeight: "40px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: "1.4"
          }}>
            {project.description || project.subtitle || ''}
          </div>
        </div>
        <button
          onClick={handleLike}
          disabled={!currentUser}
          style={{
            background: 'none', border: 'none', cursor: currentUser ? 'pointer' : 'default',
            padding: '4px', color: liked ? COLORS.accent : COLORS.muted, flexShrink: 0,
            transition: 'color 0.2s, transform 0.15s',
            transform: liked ? 'scale(1.15)' : 'scale(1)',
            opacity: loadingLike ? 0.5 : 1,
          }}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* Footer meta */}
      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, color: COLORS.accent,
          background: 'rgba(29,185,84,0.12)', padding: '2px 8px',
          borderRadius: '20px', letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
          {project.category}
        </span>
        <span style={{ fontSize: '11px', color: COLORS.muted, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <EyeIcon />
          {formatViews(project.view_count)}
        </span>
      </div>
    </div>
  );
}

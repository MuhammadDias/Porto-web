import React from 'react';
import { COLORS } from '../shared/SpotifyConstants';
import { HomeIcon, GridIcon, BookmarkIcon, MailIcon, UserIcon, StarIcon } from '../shared/SpotifyIcons';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'projects', label: 'Projects', icon: GridIcon },
  { id: 'about', label: 'About', icon: UserIcon },
  { id: 'skills', label: 'Skills', icon: StarIcon },
  { id: 'contact', label: 'Contact', icon: MailIcon },
  { id: 'saved', label: 'Saved', icon: BookmarkIcon },
];

export { NAV_ITEMS };

export default function Sidebar({ activeNav, onNavClick, collapsed, profile, recentProjects }) {
  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ME';

  return (
    <div
      style={{
        width: collapsed ? '72px' : '240px',
        flexShrink: 0,
        background: '#000',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* Logo */}
      <div style={{ padding: collapsed ? '24px 16px' : '24px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%', background: COLORS.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px',
        }}>
          ⚡
        </div>
        {!collapsed && (
          <span style={{
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '18px',
            color: COLORS.white, letterSpacing: '-0.02em', whiteSpace: 'nowrap',
          }}>
            devfolio
          </span>
        )}
      </div>

      {/* Nav */}
      <nav style={{ padding: '8px 0', flex: 1 }}>
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id;
          return (
            <button
              key={id}
              onClick={() => onNavClick(id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px',
                padding: '12px 24px', background: 'none', border: 'none', cursor: 'pointer',
                color: active ? COLORS.white : COLORS.muted,
                fontFamily: "'Sora', sans-serif", fontWeight: active ? 700 : 500,
                fontSize: '14px', letterSpacing: '-0.01em',
                borderLeft: active ? `3px solid ${COLORS.accent}` : '3px solid transparent',
                transition: 'all 0.15s ease', whiteSpace: 'nowrap', textAlign: 'left',
              }}
            >
              <span style={{ flexShrink: 0, opacity: active ? 1 : 0.7 }}>
                <Icon />
              </span>
              {!collapsed && label}
            </button>
          );
        })}
      </nav>

      {/* Recent Projects */}
      {!collapsed && recentProjects && recentProjects.length > 0 && (
        <div style={{ padding: '0 16px 16px' }}>
          <div style={{
            fontSize: '11px', fontWeight: 700, color: COLORS.muted,
            textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 12px',
          }}>
            Recently viewed
          </div>
          {recentProjects.slice(0, 3).map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '8px',
                borderRadius: '6px', cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.bgCard)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: '36px', height: '36px', borderRadius: '4px',
                background: item.color || '#1a3a2a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '16px', flexShrink: 0,
                overflow: 'hidden',
              }}>
                {item.image_url
                  ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (item.emoji || '🚀')
                }
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: COLORS.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '11px', color: COLORS.muted }}>Project</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile at bottom */}
      <div style={{
        padding: collapsed ? '16px 12px' : '16px 24px',
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex', alignItems: 'center', gap: '12px',
      }}>
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.name}
            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
          />
        ) : (
          <div style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${COLORS.accent}, #17a844)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Sora', sans-serif", fontWeight: 800, fontSize: '14px',
            color: COLORS.bg, flexShrink: 0, letterSpacing: '-0.02em',
          }}>
            {initials}
          </div>
        )}
        {!collapsed && (
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: COLORS.white, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile?.name || 'Owner'}
            </div>
            <div style={{ fontSize: '11px', color: COLORS.muted }}>
              {profile?.role || 'Developer'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

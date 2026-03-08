import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiMonitor, FiMoon, FiSun, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import { useLanguage } from '../i18n';
import { useTheme } from '../theme';

const navItems = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.projects', path: '/projects' },
  { key: 'nav.contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const { mode, setModeManual } = useTheme();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (!mobileMenuRef.current) return;
      if (!mobileMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isMenuVisible = isOpen;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/85 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="text-2xl font-medium lowercase tracking-tight text-white md:text-[2.2rem]" style={{ fontFamily: "'Poppins', sans-serif" }}>
          dayess
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-pill rounded-full px-4 py-1.5 text-sm uppercase tracking-wide transition-colors ${
                location.pathname === item.path ? 'nav-pill-active' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <div className="hidden items-center gap-2 md:flex">
            <button onClick={() => setLang('id')} className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.1em] transition-colors ${lang === 'id' ? 'border-white/60 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
              ID
            </button>
            <button onClick={() => setLang('en')} className={`rounded-full border px-2 py-0.5 text-xs uppercase tracking-[0.1em] transition-colors ${lang === 'en' ? 'border-white/60 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
              EN
            </button>
            <div className="flex items-center gap-1 rounded-full border border-white/20 px-1 py-1">
              <button onClick={() => setModeManual('system')} className={`rounded-full p-1.5 transition-colors ${mode === 'system' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'}`} aria-label="Use system theme">
                <FiMonitor className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setModeManual('light')} className={`rounded-full p-1.5 transition-colors ${mode === 'light' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'}`} aria-label="Use light theme">
                <FiSun className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setModeManual('dark')} className={`rounded-full p-1.5 transition-colors ${mode === 'dark' ? 'bg-white/15 text-white' : 'text-zinc-400 hover:text-white'}`} aria-label="Use dark theme">
                <FiMoon className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div ref={mobileMenuRef} className="relative justify-self-end md:hidden">
            <button onClick={() => setIsOpen((prev) => !prev)} className="rounded-full border border-white/20 p-2.5 text-zinc-200 transition-colors hover:border-white/45 hover:text-white" aria-label="Toggle menu">
              {isMenuVisible ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>

            {isMenuVisible && (
              <div className="mobile-dropdown absolute right-0 top-[calc(100%+10px)] w-56 rounded-xl border border-white/20 bg-black/95 p-3 shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
                {/* Language Switcher (Mobile) */}
                <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                  <button onClick={() => setLang('id')} className={`flex-1 rounded-lg border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${lang === 'id' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    ID
                  </button>
                  <button onClick={() => setLang('en')} className={`flex-1 rounded-lg border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${lang === 'en' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    EN
                  </button>
                </div>
                <div className="mb-3 grid grid-cols-3 gap-2 border-b border-white/10 pb-3">
                  <button onClick={() => setModeManual('system')} className={`rounded-lg border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${mode === 'system' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    Sys
                  </button>
                  <button onClick={() => setModeManual('light')} className={`rounded-lg border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${mode === 'light' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    Light
                  </button>
                  <button onClick={() => setModeManual('dark')} className={`rounded-lg border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${mode === 'dark' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    Dark
                  </button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenu}
                      className={`block rounded-lg border px-3 py-2 text-sm uppercase tracking-[0.12em] transition-colors ${location.pathname === item.path ? 'nav-pill-active border-white/45 text-white' : 'border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'}`}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>

                {user && (
                  <div className="mt-3 space-y-2 border-t border-white/15 pt-3">
                    <Link to="/admin" onClick={closeMenu} className="block rounded-lg border border-white/10 px-3 py-2 text-sm uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
                      {t('nav.dashboard')}
                    </Link>
                    <button onClick={handleLogout} className="block w-full rounded-lg border border-white/10 px-3 py-2 text-left text-sm uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:border-white/30 hover:text-red-300">
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

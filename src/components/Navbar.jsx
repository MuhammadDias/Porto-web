import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { supabase } from '../supabase/client';
import { useLanguage } from '../i18n';

const navItems = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.projects', path: '/projects' },
  { key: 'nav.contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => {
    setIsOpen(false);
    setIsHoveringMenu(false);
  };

  const isMenuVisible = isOpen || isHoveringMenu;

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
              className={`rounded-full px-4 py-1.5 text-sm uppercase tracking-wide transition-colors ${
                location.pathname === item.path ? 'bg-white/10 text-white' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
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
          </div>

          {/* Mobile Menu Button */}
          <div className="relative justify-self-end md:hidden" onMouseEnter={() => setIsHoveringMenu(true)} onMouseLeave={() => setIsHoveringMenu(false)}>
            <button onClick={() => setIsOpen((prev) => !prev)} className="rounded-full border border-white/20 p-2.5 text-zinc-200 transition-colors hover:border-white/45 hover:text-white" aria-label="Toggle menu">
              {isMenuVisible ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
            </button>

            {isMenuVisible && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-56 border border-white/20 bg-black/95 p-3 shadow-[0_12px_24px_rgba(0,0,0,0.45)]">
                {/* Language Switcher (Mobile) */}
                <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
                  <button onClick={() => setLang('id')} className={`flex-1 border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${lang === 'id' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    ID
                  </button>
                  <button onClick={() => setLang('en')} className={`flex-1 border px-2.5 py-1 text-xs uppercase tracking-[0.14em] transition-colors ${lang === 'en' ? 'border-white/70 text-white' : 'border-white/20 text-zinc-400 hover:border-white/40 hover:text-white'}`}>
                    EN
                  </button>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMenu}
                      className={`block border px-3 py-2 text-sm uppercase tracking-[0.12em] transition-colors ${location.pathname === item.path ? 'border-white/45 text-white' : 'border-white/10 text-zinc-300 hover:border-white/30 hover:text-white'}`}
                    >
                      {t(item.key)}
                    </Link>
                  ))}
                </div>

                {user && (
                  <div className="mt-3 space-y-2 border-t border-white/15 pt-3">
                    <Link to="/admin" onClick={closeMenu} className="block border border-white/10 px-3 py-2 text-sm uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:border-white/30 hover:text-white">
                      {t('nav.dashboard')}
                    </Link>
                    <button onClick={handleLogout} className="block w-full border border-white/10 px-3 py-2 text-left text-sm uppercase tracking-[0.12em] text-zinc-300 transition-colors hover:border-white/30 hover:text-red-300">
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

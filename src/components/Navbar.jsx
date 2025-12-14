import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiUser } from 'react-icons/fi';
import { supabase } from '../supabase/client';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    window.addEventListener('scroll', handleScroll);
    getUser();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/');
  };

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-2x1 glass-effect py-3 : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold gradient-text">
            Portfolio
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} to={item.path} className={`relative px-1 py-2 text-sm font-medium transition-colors ${location.pathname === item.path ? 'text-cyan-400' : 'text-slate-300 hover:text-cyan-400'}`}>
                {item.name}
                {location.pathname === item.path && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500" />}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin" className="btn-secondary text-sm px-4 py-2">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="text-sm text-slate-400 hover:text-red-400 transition-colors">
                  Logout
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors">
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div initial={false} animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }} className="md:hidden overflow-hidden">
          <div className="pt-4 pb-3 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              {user ? (
                <>
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-cyan-400 hover:bg-cyan-500/10">
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10"
                  >
                    Logout
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

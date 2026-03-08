import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DStatusLoader from './components/DStatusLoader';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import ProjectCategory from './pages/ProjectCategory';
import Project from './pages/Project';
import StatusPage from './pages/StatusPage';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './admin/ProtectedRoute';
import Login from './admin/Login';
import TestDither from './pages/TestDither';
import { LanguageProvider, useLanguage } from './i18n';
import { ThemeProvider, useTheme } from './theme';
import './index.css';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/AnimatedPage';
import ErrorPage from './components/ErrorPage';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [booting, setBooting] = useState(true);
  const [loaderSpeedMs, setLoaderSpeedMs] = useState(1100);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    let delay = 350;
    let speed = 1200;
    if (!navigator.onLine) {
      delay = 1300;
      speed = 1600;
    } else if (connection) {
      const type = connection.effectiveType || '';
      if (connection.saveData) {
        delay = 1200;
        speed = 1500;
      } else if (type.includes('2g')) {
        delay = 1400;
        speed = 1700;
      } else if (type.includes('3g') || (connection.rtt && connection.rtt > 250)) {
        delay = 900;
        speed = 1200;
      } else {
        delay = 160;
        speed = 700;
      }
    } else {
      delay = 220;
      speed = 800;
    }

    setLoaderSpeedMs(speed);
    const timer = window.setTimeout(() => setBooting(false), delay);
    return () => window.clearTimeout(timer);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen px-4">
        <DStatusLoader fullScreen label={t('common.loadingContent')} speedMs={loaderSpeedMs} />
      </div>
    );
  }

  return (
    <div className="app-shell min-h-screen flex flex-col">
      {!isAdminPage && <Navbar />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AnimatedPage><Home /></AnimatedPage>} />
            <Route path="/about" element={<AnimatedPage><About /></AnimatedPage>} />
            <Route path="/projects" element={<AnimatedPage><Projects /></AnimatedPage>} />
            <Route path="/projects/:category" element={<AnimatedPage><ProjectCategory /></AnimatedPage>} />
            <Route path="/project" element={<AnimatedPage><Project /></AnimatedPage>} />
            <Route path="/contact" element={<AnimatedPage><Contact /></AnimatedPage>} />
            <Route path="/offline" element={<AnimatedPage><StatusPage code="OFFLINE" title={t('status.offlineTitle')} message={t('status.offlineMessage')} retryLabel={t('status.retry')} homeLabel={t('common.backHome')} /></AnimatedPage>} />
            <Route path="/405" element={<ErrorPage code="405" />} />
            <Route path="/500" element={<ErrorPage code="500" />} />
            <Route path="/admin/login" element={<AnimatedPage><Login /></AnimatedPage>} />
            <Route path="/test" element={<AnimatedPage><TestDither /></AnimatedPage>} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AnimatedPage><AdminDashboard /></AnimatedPage>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorPage code="404" />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: theme === 'light' ? '#ffffff' : '#000000',
            color: theme === 'light' ? '#0f172a' : '#ffffff',
            border: theme === 'light' ? '2px solid rgba(15,23,42,0.25)' : '2px solid rgba(255,255,255,0.65)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <AppContent />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

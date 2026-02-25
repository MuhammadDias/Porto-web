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
import './index.css';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/AnimatedPage';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const { t } = useLanguage();
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
      <div className="min-h-screen bg-black px-4">
        <DStatusLoader fullScreen label={t('common.loadingContent')} speedMs={loaderSpeedMs} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
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
            <Route path="/404" element={<AnimatedPage><StatusPage code="404" title={t('status.notFoundTitle')} message={t('status.notFoundMessage')} retryLabel={t('status.retry')} homeLabel={t('common.backHome')} /></AnimatedPage>} />
            <Route path="/405" element={<AnimatedPage><StatusPage code="405" title={t('status.methodTitle')} message={t('status.methodMessage')} retryLabel={t('status.retry')} homeLabel={t('common.backHome')} /></AnimatedPage>} />
            <Route path="/500" element={<AnimatedPage><StatusPage code="500" title={t('status.serverTitle')} message={t('status.serverMessage')} retryLabel={t('status.retry')} homeLabel={t('common.backHome')} /></AnimatedPage>} />
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
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#000000',
            color: '#ffffff',
            border: '2px solid rgba(255,255,255,0.65)',
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AppContent />
      </Router>
    </LanguageProvider>
  );
}

export default App;

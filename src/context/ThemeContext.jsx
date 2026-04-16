import React, { createContext, useContext, useEffect, useState } from 'react';
import { getActiveTheme } from '../supabase/api';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [activeTheme, setActiveTheme] = useState("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initTheme = async () => {
      try {
        const dbTheme = await getActiveTheme();
        console.log("DB Theme:", dbTheme);
        console.log("Local Theme:", localStorage.getItem("theme"));

        if (dbTheme && dbTheme !== 'default') {
          // Trust DB as source of truth
          setActiveTheme(dbTheme);
          localStorage.setItem("theme", dbTheme);
        } else if (dbTheme === 'default') {
          // Explicitly set to default (user chose it)
          setActiveTheme("default");
          localStorage.setItem("theme", "default");
        } else {
          // No DB data — fall back to localStorage
          const local = localStorage.getItem("theme") || "default";
          setActiveTheme(local);
        }
      } catch (err) {
        console.error('Error fetching theme:', err);
        const local = localStorage.getItem("theme") || "default";
        setActiveTheme(local);
      }
      setLoading(false);
    };

    initTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);

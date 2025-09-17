import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context with a null default
const ThemeContext = createContext(null);

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null || context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(prev => !prev),
    colors: {
      primary: isDarkMode ? 'from-gray-950 via-black to-gray-900' : 'from-slate-50 via-white to-gray-100',
      textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
      navbar: isDarkMode ? 'bg-gradient-to-r from-gray-900 via-black to-gray-800' : 'bg-white border-b border-gray-200 shadow-sm',
      textAccent: isDarkMode ? 'text-yellow-400' : 'text-blue-600',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
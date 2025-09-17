import React, { createContext, useContext, useEffect, useState } from 'react';

// Create theme context with default value to avoid null errors
const ThemeContext = createContext({
  isDarkMode: true,
  toggleTheme: () => {},
  colors: {}
});

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  console.log('useTheme hook called, context:', context);
  
  // If context is the default empty object, we might be outside provider
  if (!context.colors || Object.keys(context.colors).length === 0) {
    console.error('useTheme called outside ThemeProvider or provider not ready');
    // Return a safe default instead of throwing
    return {
      isDarkMode: true,
      toggleTheme: () => {},
      colors: {
        primary: 'from-gray-950 via-black to-gray-900',
        textPrimary: 'text-white',
        navbar: 'bg-gradient-to-r from-gray-900 via-black to-gray-800',
        textAccent: 'text-yellow-400',
        textSecondary: 'text-gray-300'
      }
    };
  }
  
  return context;
};

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? savedTheme === 'dark' : true;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return true;
    }
  });

  console.log('ThemeProvider initialized with isDarkMode:', isDarkMode);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Theme configuration object
  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      // Background colors
      primary: isDarkMode ? 'from-gray-950 via-black to-gray-900' : 'from-slate-50 via-white to-gray-100',
      secondary: isDarkMode ? 'bg-gray-800/90' : 'bg-slate-100/90',
      tertiary: isDarkMode ? 'bg-black' : 'bg-white',
      
      // Text colors
      textPrimary: isDarkMode ? 'text-white' : 'text-gray-900',
      textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      textAccent: isDarkMode ? 'text-yellow-400' : 'text-blue-600',
      
      // Movie card specific text colors (for cards with image backgrounds)
      movieCardText: isDarkMode ? 'text-white' : 'text-white',
      movieCardTextSecondary: isDarkMode ? 'text-gray-200' : 'text-gray-200',
      
      // Watchlist specific text colors (for solid background cards)
      watchlistText: isDarkMode ? 'text-white' : 'text-gray-900',
      watchlistTextSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
      
      // Border colors
      border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
      borderHover: isDarkMode ? 'border-yellow-400' : 'border-blue-400',
      
      // Button colors
      buttonPrimary: isDarkMode ? 'bg-yellow-400 hover:bg-yellow-500 text-black' : 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonSecondary: isDarkMode ? 'bg-gray-700 hover:bg-gray-800 text-white' : 'bg-slate-200 hover:bg-slate-300 text-gray-900',
      buttonDanger: isDarkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white',
      
      // Card colors
      card: isDarkMode ? 'bg-gray-800/90 border-gray-700' : 'bg-white border-gray-200 shadow-lg',
      cardHover: isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-black/30',
      
      // Input colors
      input: isDarkMode ? 'bg-gray-800/90 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500',
      inputFocus: isDarkMode ? 'focus:ring-yellow-400 focus:border-yellow-400' : 'focus:ring-blue-500 focus:border-blue-500',
      
      // Navbar colors
      navbar: isDarkMode ? 'bg-gradient-to-r from-gray-900 via-black to-gray-800' : 'bg-white border-b border-gray-200 shadow-sm',
      navbarText: isDarkMode ? 'text-gray-200' : 'text-gray-700',
      navbarHover: isDarkMode ? 'hover:bg-yellow-400 hover:text-black' : 'hover:bg-blue-600 hover:text-white',
    }
  };

  // Save theme preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  }, [isDarkMode]);

  // Apply theme class to document body
  useEffect(() => {
    try {
      document.documentElement.classList.toggle('dark', isDarkMode);
      document.body.className = isDarkMode ? 'dark' : 'light';
    } catch (error) {
      console.warn('Error applying theme to document:', error);
    }
  }, [isDarkMode]);

  console.log('ThemeProvider rendering with theme:', theme);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Watchlist Context for managing movie watchlist state
 * Provides persistent storage and consistent state management across components
 */
const WatchlistContext = createContext({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
  toggleWatchlist: () => {},
  getWatchlistCount: () => 0,
  clearWatchlist: () => {},
  isLoading: false,
});

/**
 * Custom hook to use watchlist context
 * Provides error handling and fallback values
 */
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  
  if (!context) {
    console.error('useWatchlist must be used within a WatchlistProvider');
    // Return safe fallback values
    return {
      watchlist: [],
      addToWatchlist: () => {},
      removeFromWatchlist: () => {},
      isInWatchlist: () => false,
      toggleWatchlist: () => {},
      getWatchlistCount: () => 0,
      clearWatchlist: () => {},
      isLoading: false,
    };
  }
  
  return context;
};

/**
 * LocalStorage utility functions
 */
const STORAGE_KEY = 'imdb_clone_watchlist';

const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving watchlist to localStorage:', error);
    return false;
  }
};

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading watchlist from localStorage:', error);
    return [];
  }
};

/**
 * Movie data normalization utility
 * Ensures consistent movie object structure
 */
const normalizeMovieData = (movie) => {
  if (!movie || !movie.id) {
    console.warn('Invalid movie data provided:', movie);
    return null;
  }

  return {
    id: movie.id,
    title: movie.title || movie.name || 'Unknown Title',
    poster_path: movie.poster_path || null,
    backdrop_path: movie.backdrop_path || null,
    overview: movie.overview || 'No description available',
    release_date: movie.release_date || movie.first_air_date || null,
    vote_average: movie.vote_average || 0,
    vote_count: movie.vote_count || 0,
    genre_ids: movie.genre_ids || [],
    popularity: movie.popularity || 0,
    adult: movie.adult || false,
    original_language: movie.original_language || 'en',
    original_title: movie.original_title || movie.original_name || movie.title,
    video: movie.video || false,
    // Add metadata for watchlist management
    addedToWatchlist: new Date().toISOString(),
    watchlistId: `${movie.id}_${Date.now()}`, // Unique identifier for watchlist entry
  };
};

/**
 * WatchlistProvider Component
 * Manages global watchlist state with persistence and error handling
 */
export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const loadWatchlist = async () => {
      setIsLoading(true);
      try {
        const savedWatchlist = loadFromStorage();
        setWatchlist(savedWatchlist);
        console.log('Watchlist loaded:', savedWatchlist.length, 'items');
      } catch (error) {
        console.error('Error loading watchlist:', error);
        setWatchlist([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadWatchlist();
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const saved = saveToStorage(watchlist);
      if (saved) {
        console.log('Watchlist saved:', watchlist.length, 'items');
      }
    }
  }, [watchlist, isLoading]);

  /**
   * Add movie to watchlist
   * @param {Object} movie - Movie object to add
   * @returns {boolean} - Success status
   */
  const addToWatchlist = useCallback((movie) => {
    const normalizedMovie = normalizeMovieData(movie);
    
    if (!normalizedMovie) {
      console.error('Cannot add invalid movie to watchlist');
      return false;
    }

    setWatchlist(prevWatchlist => {
      // Check if movie already exists
      const existingIndex = prevWatchlist.findIndex(item => item.id === normalizedMovie.id);
      
      if (existingIndex !== -1) {
        console.log('Movie already in watchlist:', normalizedMovie.title);
        return prevWatchlist; // No change needed
      }

      const newWatchlist = [...prevWatchlist, normalizedMovie];
      console.log('Added to watchlist:', normalizedMovie.title);
      return newWatchlist;
    });

    return true;
  }, []);

  /**
   * Remove movie from watchlist
   * @param {number|string} movieId - ID of movie to remove
   * @returns {boolean} - Success status
   */
  const removeFromWatchlist = useCallback((movieId) => {
    if (!movieId) {
      console.error('Cannot remove movie: invalid ID');
      return false;
    }

    setWatchlist(prevWatchlist => {
      const newWatchlist = prevWatchlist.filter(movie => movie.id !== movieId);
      const removedCount = prevWatchlist.length - newWatchlist.length;
      
      if (removedCount > 0) {
        console.log('Removed from watchlist:', movieId);
      } else {
        console.log('Movie not found in watchlist:', movieId);
      }
      
      return newWatchlist;
    });

    return true;
  }, []);

  /**
   * Check if movie is in watchlist
   * @param {number|string} movieId - ID of movie to check
   * @returns {boolean} - Whether movie is in watchlist
   */
  const isInWatchlist = useCallback((movieId) => {
    if (!movieId) return false;
    return watchlist.some(movie => movie.id === movieId);
  }, [watchlist]);

  /**
   * Toggle movie in/out of watchlist
   * @param {Object} movie - Movie object to toggle
   * @returns {boolean} - New watchlist status (true = added, false = removed)
   */
  const toggleWatchlist = useCallback((movie) => {
    if (!movie || !movie.id) {
      console.error('Cannot toggle invalid movie in watchlist');
      return false;
    }

    const inWatchlist = isInWatchlist(movie.id);
    
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      return false;
    } else {
      addToWatchlist(movie);
      return true;
    }
  }, [isInWatchlist, addToWatchlist, removeFromWatchlist]);

  /**
   * Get total count of movies in watchlist
   * @returns {number} - Count of movies in watchlist
   */
  const getWatchlistCount = useCallback(() => {
    return watchlist.length;
  }, [watchlist]);

  /**
   * Clear entire watchlist
   * @returns {boolean} - Success status
   */
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
    console.log('Watchlist cleared');
    return true;
  }, []);

  // Context value with all watchlist operations
  const contextValue = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
    getWatchlistCount,
    clearWatchlist,
    isLoading,
  };

  return (
    <WatchlistContext.Provider value={contextValue}>
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistContext;
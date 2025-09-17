// TMDB API Configuration
export const TMDB_CONFIG = {
  API_KEY: import.meta.env.VITE_TMDB_API_KEY,
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/original',
  
  // API Endpoints
  ENDPOINTS: {
    TRENDING_MOVIES: '/trending/movie/day',
    NOW_PLAYING: '/movie/now_playing',
    MOVIE_DETAILS: (id) => `/movie/${id}`,
    MOVIE_CREDITS: (id) => `/movie/${id}/credits`,
    MOVIE_VIDEOS: (id) => `/movie/${id}/videos`,
    MOVIE_SIMILAR: (id) => `/movie/${id}/similar`,
    SEARCH_MOVIES: '/search/movie'
  },
  
  // Helper function to build API URLs
  buildUrl: (endpoint, params = {}) => {
    const url = new URL(`${TMDB_CONFIG.BASE_URL}${endpoint}`);
    url.searchParams.set('api_key', TMDB_CONFIG.API_KEY);
    url.searchParams.set('language', 'en-US');
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value.toString());
      }
    });
    
    return url.toString();
  },
  
  // Helper function to build image URLs
  getImageUrl: (path, size = 'original') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
};

// Validate that API key is available
if (!TMDB_CONFIG.API_KEY) {
  console.error('❌ TMDB API key is missing. Please set VITE_TMDB_API_KEY in your .env file or Netlify environment variables');
  console.log('ℹ️ For local development: Create a .env file with VITE_TMDB_API_KEY=your_key_here');
  console.log('ℹ️ For Netlify: Add VITE_TMDB_API_KEY in Site settings → Environment variables');
} else {
  console.log('✅ TMDB API key loaded successfully');
  // Only show first and last 4 characters for security
  const maskedKey = TMDB_CONFIG.API_KEY.substring(0, 4) + '...' + TMDB_CONFIG.API_KEY.slice(-4);
  console.log(`🔑 API Key: ${maskedKey}`);
}

// Helper function for safe JSON parsing
export const safeJsonParse = async (response) => {
  try {
    const text = await response.text();
    if (!text.trim()) {
      throw new Error('Empty response');
    }
    return JSON.parse(text);
  } catch (error) {
    console.error('JSON parsing error:', error);
    throw new Error(`Failed to parse API response: ${error.message}`);
  }
};

// Helper function for safe API calls
export const safeFetch = async (url) => {
  try {
    console.log('Making API call to:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return await safeJsonParse(response);
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};
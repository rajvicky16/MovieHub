// API Test Utility
import { TMDB_CONFIG, safeFetch } from '../config/tmdb';

export const testTMDBAPI = async () => {
  console.log('🧪 Testing TMDB API...');
  
  try {
    // Test 1: Check API key
    if (!TMDB_CONFIG.API_KEY) {
      throw new Error('API key is missing');
    }
    console.log('✅ API key found');

    // Test 2: Test trending movies endpoint
    const trendingUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.TRENDING_MOVIES);
    console.log('🌐 Testing trending movies URL:', trendingUrl);
    
    const trendingData = await safeFetch(trendingUrl);
    console.log('✅ Trending movies API working. Found', trendingData.results?.length || 0, 'movies');

    // Test 3: Test a specific movie details
    if (trendingData.results?.length > 0) {
      const firstMovie = trendingData.results[0];
      const movieUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_DETAILS(firstMovie.id));
      console.log('🎬 Testing movie details URL:', movieUrl);
      
      const movieData = await safeFetch(movieUrl);
      console.log('✅ Movie details API working for:', movieData.title);

      // Test 4: Test movie videos
      const videosUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS(firstMovie.id));
      console.log('🎥 Testing movie videos URL:', videosUrl);
      
      const videosData = await safeFetch(videosUrl);
      console.log('✅ Movie videos API working. Found', videosData.results?.length || 0, 'videos');
    }

    console.log('🎉 All API tests passed!');
    return { success: true, message: 'All APIs working correctly' };
    
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    return { 
      success: false, 
      message: error.message,
      details: {
        apiKey: !!TMDB_CONFIG.API_KEY,
        baseUrl: TMDB_CONFIG.BASE_URL,
        error: error.toString()
      }
    };
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  testTMDBAPI();
}
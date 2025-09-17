import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { TMDB_CONFIG, safeFetch } from '../config/tmdb';
import WatchlistButton from './WatchlistButton';
import CastList from './CastList';
import MovieStats from './MovieStats';
import VideoPlayer, { useVideoPlayer } from './VideoPlayer';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors, isDarkMode } = useTheme();
  const { isOpen, currentVideo, openVideo, closeVideo } = useVideoPlayer();
  
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) {
        setError('Movie ID not provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch movie details
        const movieUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_DETAILS(id));
        const movieData = await safeFetch(movieUrl);

        // Fetch movie credits
        const creditsUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_CREDITS(id));
        let creditsData = { cast: [] };
        try {
          creditsData = await safeFetch(creditsUrl);
        } catch (creditsError) {
          console.warn('Failed to fetch credits:', creditsError.message);
        }

        // Fetch movie videos (trailers)
        const videosUrl = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS(id));
        let trailerData = null;
        try {
          const videosData = await safeFetch(videosUrl);
          // Find the best trailer (YouTube, official trailer preferred)
          trailerData = videosData.results?.find(video => 
            video.type === 'Trailer' && 
            video.site === 'YouTube' && 
            video.official === true
          ) || videosData.results?.find(video => 
            video.type === 'Trailer' && 
            video.site === 'YouTube'
          ) || videosData.results?.find(video => 
            video.site === 'YouTube'
          );
        } catch (videosError) {
          console.warn('Failed to fetch videos:', videosError.message);
        }

        setMovie(movieData);
        setCast(creditsData.cast || []);
        setTrailer(trailerData);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        console.error('Movie ID:', id);
        console.error('API Key available:', !!TMDB_CONFIG.API_KEY);
        setError(err.message || 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Handle Watch Now button click
  const handleWatchNow = () => {
    if (trailer) {
      openVideo({
        videoKey: trailer.key,
        movieTitle: movie.title,
        platform: trailer.site || 'YouTube'
      });
    } else {
      // Show alert if no trailer is available
      alert(`Sorry, no trailer is available for "${movie.title}" at the moment.`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${colors.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className={`${colors.textSecondary} text-xl`}>Loading movie details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className={`min-h-screen bg-gradient-to-b ${colors.primary} flex items-center justify-center`}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className={`${colors.textSecondary} text-6xl mb-4`}>🎬</div>
          <h2 className={`text-2xl font-bold ${colors.watchlistText} mb-4`}>
            {error || 'Movie Not Found'}
          </h2>
          <p className={`${colors.watchlistTextSecondary} mb-6`}>
            We couldn't load the movie details. Please try again or go back to browse more movies.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className={`${colors.buttonSecondary} px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
            >
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className={`${colors.buttonPrimary} px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
            >
              Browse Movies
            </button>
          </div>
        </div>
      </div>
    );
  }

  const backdropImage = movie.backdrop_path
    ? TMDB_CONFIG.getImageUrl(movie.backdrop_path)
    : movie.poster_path
    ? TMDB_CONFIG.getImageUrl(movie.poster_path)
    : 'https://via.placeholder.com/1920x1080?text=No+Image';

  return (
    <div className={`min-h-screen bg-gradient-to-b ${colors.primary}`}>
      {/* Hero Section with Backdrop */}
      <div className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={backdropImage}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
            style={{ 
              filter: isDarkMode ? "contrast(1.1) brightness(0.7)" : "contrast(1.2) brightness(0.5)",
              opacity: isDarkMode ? 0.9 : 0.8
            }}
          />
          
          {/* Enhanced gradient overlays */}
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/95 via-black/50 to-black/20' : 'bg-gradient-to-t from-slate-900/95 via-slate-700/60 to-slate-500/30'}`}></div>
          <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-black/40 via-transparent to-black/40' : 'bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50'}`}></div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className={`absolute top-6 left-6 z-30 backdrop-blur-sm ${isDarkMode ? 'bg-black/60 text-white hover:bg-yellow-400 hover:text-black border-white/20 hover:border-yellow-400' : 'bg-white/80 text-gray-900 hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'} rounded-full p-3 transition-all duration-300 shadow-2xl border focus:outline-none`}
          aria-label="Go back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Movie Poster */}
            <div className="flex-shrink-0">
              <div className="w-64 sm:w-80 lg:w-96 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src={
                    movie.poster_path
                      ? TMDB_CONFIG.getImageUrl(movie.poster_path, 'w500')
                      : 'https://via.placeholder.com/500x750?text=No+Poster'
                  }
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/500x750?text=No+Poster';
                  }}
                />
              </div>
            </div>

            {/* Movie Information */}
            <div className="flex-1 text-center lg:text-left">
              {/* Title */}
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold ${colors.movieCardText} drop-shadow-2xl mb-4 leading-tight`}>
                {movie.title}
              </h1>

              {/* Tagline */}
              {movie.tagline && (
                <p className={`text-lg sm:text-xl ${colors.movieCardTextSecondary} italic mb-6 max-w-3xl`}>
                  "{movie.tagline}"
                </p>
              )}

              {/* Overview */}
              <p className={`text-base sm:text-lg ${colors.movieCardTextSecondary} leading-relaxed mb-8 max-w-4xl`}>
                {movie.overview || 'No description available.'}
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mb-8">
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl mr-2">⭐</span>
                  <span className={`font-bold ${colors.movieCardText} text-lg`}>
                    {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                  </span>
                </div>
                <div className={`${colors.movieCardTextSecondary}`}>
                  {movie.release_date && new Date(movie.release_date).getFullYear()}
                </div>
                {movie.runtime && (
                  <div className={`${colors.movieCardTextSecondary}`}>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleWatchNow}
                  className={`${colors.buttonDanger} px-8 py-4 text-lg font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden group`}
                >
                  <div className="relative flex items-center gap-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                    Watch {trailer ? 'Trailer' : 'Now'}
                  </div>
                  {/* Pulse effect for trailer availability */}
                  {trailer && (
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  )}
                </button>

                <WatchlistButton 
                  movie={movie}
                  variant="outline"
                  size="large"
                  className={`backdrop-blur-sm border-white/30 hover:border-white/50 text-white ${colors.cardHover} px-8 py-4 text-lg rounded-xl shadow-2xl transition-all duration-300`}
                  onToggle={(newStatus) => {
                    console.log(`Movie ${newStatus ? 'added to' : 'removed from'} watchlist:`, movie.title);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Movie Statistics */}
        <MovieStats movie={movie} />

        {/* Cast Section */}
        <CastList cast={cast} title="Cast & Crew" />

        {/* Similar Movies - Placeholder for future implementation */}
        {/* You can add similar movies section here if needed */}
      </div>
      
      {/* Video Player Modal */}
      <VideoPlayer
        isOpen={isOpen}
        onClose={closeVideo}
        videoKey={currentVideo?.videoKey}
        movieTitle={currentVideo?.movieTitle}
        platform={currentVideo?.platform}
      />
    </div>
  );
};

export default MovieDetails;
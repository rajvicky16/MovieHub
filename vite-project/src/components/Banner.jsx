
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { TMDB_CONFIG, safeFetch } from "../config/tmdb";
import WatchlistButton from "./WatchlistButton";
import VideoPlayer, { useVideoPlayer } from "./VideoPlayer";

function Banner() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [movieTrailers, setMovieTrailers] = useState({});
  const { colors, isDarkMode } = useTheme();
  const { isOpen, currentVideo, openVideo, closeVideo } = useVideoPlayer();


  useEffect(() => {
    async function fetchMovies() {
      try {
        const url = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.TRENDING_MOVIES);
        const data = await safeFetch(url);
        
        const moviesList = data.results?.slice(0, 5) || [];
        setMovies(moviesList);
        
        // Fetch trailers for each movie
        if (moviesList.length > 0) {
          fetchTrailersForMovies(moviesList);
        }
      } catch (err) {
        console.error('Error fetching movies:', err);
        setMovies([]);
      }
    }
    fetchMovies();
  }, []);

  // Function to fetch trailers for movies
  const fetchTrailersForMovies = async (moviesList) => {
    const trailerData = {};
    
    for (const movie of moviesList) {
      try {
        const url = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.MOVIE_VIDEOS(movie.id));
        const data = await safeFetch(url);
        
        // Find the best trailer (YouTube, official trailer preferred)
        const trailer = data.results?.find(video => 
          video.type === 'Trailer' && 
          video.site === 'YouTube' && 
          video.official === true
        ) || data.results?.find(video => 
          video.type === 'Trailer' && 
          video.site === 'YouTube'
        ) || data.results?.find(video => 
          video.site === 'YouTube'
        );
        
        if (trailer) {
          trailerData[movie.id] = trailer;
        }
      } catch (error) {
        console.log(`No trailer found for ${movie.title}`);
      }
    }
    
    setMovieTrailers(trailerData);
  };

  // Handle Watch Now button click
  const handleWatchNow = () => {
    const movie = movies[current];
    const trailer = movieTrailers[movie.id];
    
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

  // Auto-slide effect
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [movies, current]);

  // Carousel navigation
  const nextSlide = () => setCurrent((prev) => (prev + 1) % movies.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + movies.length) % movies.length);

  if (movies.length === 0) {
    return (
      <div className="relative h-[70vh] flex items-center justify-center bg-gray-900 text-white">
        <span className="text-xl">Loading movies...</span>
      </div>
    );
  }

  const movie = movies[current];
  const bgImage = movie?.backdrop_path
    ? TMDB_CONFIG.getImageUrl(movie.backdrop_path)
    : "https://webneel.com/wnet/file/images/11-16/8-xmen-movie-poster-design.jpg";

  return (
    <div className={`relative w-full min-h-[400px] h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] flex items-center justify-center transition-all duration-1000 ${isDarkMode ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-slate-200 to-slate-400'} overflow-hidden`}>
      {/* Movie Image with enhanced overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bgImage}
          alt={movie.title}
          className="w-full h-full object-cover object-center transition-all duration-1000"
          style={{ 
            filter: isDarkMode ? "contrast(1.1) brightness(0.8)" : "contrast(1.2) brightness(0.6)",
            opacity: isDarkMode ? 0.9 : 0.7
          }}
        />
        {/* Enhanced gradient overlay */}
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-black/90 via-black/40 to-transparent' : 'bg-gradient-to-t from-slate-900/90 via-slate-600/60 to-transparent'}`}></div>
        <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-r from-black/30 via-transparent to-black/30' : 'bg-gradient-to-r from-slate-900/40 via-transparent to-slate-900/40'}`}></div>
      </div>

      {/* Main content container */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row items-center justify-between h-full min-h-[350px] py-4 sm:py-6 md:py-8">
        {/* Navigation buttons */}
        <button
          className={`absolute left-2 sm:left-4 md:relative md:left-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/60 text-white hover:bg-yellow-400 hover:text-black border-white/20 hover:border-yellow-400' : 'bg-white/80 text-gray-900 hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'} rounded-full p-2 sm:p-3 md:p-4 lg:p-5 transition-all duration-300 shadow-2xl border z-30 select-none focus:outline-none`}
          onClick={prevSlide}
          aria-label="Previous movie"
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Content section */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 max-w-4xl lg:max-w-5xl">
          {/* Movie title */}
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold ${colors.movieCardText} drop-shadow-2xl mb-3 sm:mb-4 md:mb-6 leading-tight tracking-tight text-center px-2`}>
            {movie.title}
          </h1>
          
          {/* Movie overview */}
          <p className={`${colors.movieCardTextSecondary} text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl max-w-2xl md:max-w-3xl lg:max-w-4xl leading-relaxed mb-4 sm:mb-6 md:mb-8 line-clamp-3 md:line-clamp-4 font-medium px-2`}>
            {movie.overview}
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 lg:gap-6 justify-center mb-4 sm:mb-6 md:mb-8 w-full max-w-md sm:max-w-none">
            <button 
              onClick={handleWatchNow}
              className={`${colors.buttonDanger} px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl rounded-xl font-bold shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto relative overflow-hidden group`}
            >
              <div className="relative flex items-center gap-2 sm:gap-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                </svg>
                Watch {movieTrailers[movies[current]?.id] ? 'Trailer' : 'Now'}
              </div>
              {/* Pulse effect for trailer availability */}
              {movieTrailers[movies[current]?.id] && (
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              )}
            </button>
            <WatchlistButton 
              movie={movie}
              variant="outline"
              size="large"
              className={`backdrop-blur-sm border-white/30 hover:border-white/50 text-white ${colors.cardHover} px-6 sm:px-8 md:px-10 lg:px-12 py-3 sm:py-4 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl rounded-xl shadow-2xl w-full sm:w-auto transition-all duration-300`}
              onToggle={(newStatus) => {
                console.log(`Movie ${newStatus ? 'added to' : 'removed from'} watchlist:`, movie.title);
              }}
            />
          </div>
          
          {/* Enhanced carousel indicators */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 flex-wrap">
            {movies.map((_, idx) => (
              <button
                key={idx}
                className={`transition-all duration-300 rounded-full focus:outline-none select-none ${
                  idx === current
                    ? `w-6 sm:w-8 md:w-10 lg:w-12 h-2 sm:h-3 md:h-4 lg:h-5 ${isDarkMode ? 'bg-yellow-400' : 'bg-blue-600'} shadow-lg scale-110`
                    : `w-2 sm:w-3 md:w-4 lg:w-5 h-2 sm:h-3 md:h-4 lg:h-5 ${isDarkMode ? 'bg-white/50 hover:bg-white/70' : 'bg-gray-300 hover:bg-gray-100'}`
                }`}
                onClick={() => setCurrent(idx)}
                aria-label={`Go to movie ${idx + 1}`}
                onMouseDown={(e) => e.preventDefault()}
              />
            ))}
          </div>
        </div>

        {/* Next button */}
        <button
          className={`absolute right-2 sm:right-4 md:relative md:right-0 backdrop-blur-sm ${isDarkMode ? 'bg-black/60 text-white hover:bg-yellow-400 hover:text-black border-white/20 hover:border-yellow-400' : 'bg-white/80 text-gray-900 hover:bg-blue-600 hover:text-white border-gray-300 hover:border-blue-600'} rounded-full p-2 sm:p-3 md:p-4 lg:p-5 transition-all duration-300 shadow-2xl border z-30 select-none focus:outline-none`}
          onClick={nextSlide}
          aria-label="Next movie"
          onMouseDown={(e) => e.preventDefault()}
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
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
}

export default Banner;
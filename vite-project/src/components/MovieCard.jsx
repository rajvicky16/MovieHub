import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import { TMDB_CONFIG } from "../config/tmdb";
import WatchlistButton from "./WatchlistButton";

function MovieCard({ movieObj }) {
  const { colors } = useTheme();
  const { isInWatchlist } = useWatchlist();
  const navigate = useNavigate();
  
  // Handle cases where movieObj might be undefined or have different prop names
  const movie = movieObj || {};
  const title = movie.title || movie.name || 'Unknown Title';
  const posterPath = movie.poster_path;
  const inWatchlist = movie.id ? isInWatchlist(movie.id) : false;
  
  const imageUrl = posterPath 
    ? TMDB_CONFIG.getImageUrl(posterPath)
    : 'https://via.placeholder.com/260x360?text=No+Image';
    
  const handleDetailsClick = () => {
    if (movie.id) {
      navigate(`/movie/${movie.id}`);
    } else {
      console.error('Movie ID not available for navigation');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full sm:w-[180px] md:w-[220px] lg:w-[240px] xl:w-[260px] p-2 m-2">
      <div
        className={`relative h-[260px] sm:h-[240px] md:h-[260px] lg:h-[300px] w-full rounded-2xl overflow-hidden shadow-lg group ${colors.card} transform transition-all duration-300 hover:scale-105`}
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Watchlist Indicator */}
        {inWatchlist && (
          <div className="absolute top-3 right-3 z-10">
            <div className="bg-yellow-500 text-black rounded-full p-1.5 shadow-lg">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Movie Title */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
          <span className={`block ${colors.movieCardText} text-base sm:text-lg md:text-xl font-semibold text-center truncate`}>
            {title}
          </span>
        </div>

        {/* Hover Overlay with Buttons */}
        <div className={`absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4`}>
          {/* Details Button */}
          <button 
            onClick={handleDetailsClick}
            className={`${colors.buttonPrimary} font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          >
            Details
          </button>

          {/* Watchlist Button */}
          <WatchlistButton 
            movie={movie}
            variant="default"
            size="medium"
            onToggle={(newStatus) => {
              console.log(`Movie ${newStatus ? 'added to' : 'removed from'} watchlist:`, title);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
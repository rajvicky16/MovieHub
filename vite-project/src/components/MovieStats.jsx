import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * GenreTag Component - Individual genre badge
 */
const GenreTag = ({ genre }) => {
  const { colors } = useTheme();
  
  return (
    <span className={`inline-block ${colors.secondary} ${colors.watchlistText} px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2`}>
      {genre.name}
    </span>
  );
};

/**
 * MovieStats Component - Displays movie statistics and information
 */
const MovieStats = ({ movie }) => {
  const { colors } = useTheme();
  
  if (!movie) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
  };

  const formatReleaseDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className={`${colors.card} rounded-lg p-6 mb-8`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Rating */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-yellow-500 text-2xl mr-2">⭐</span>
            <span className={`text-2xl font-bold ${colors.watchlistText}`}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </span>
          </div>
          <p className={`text-sm ${colors.watchlistTextSecondary}`}>
            Rating ({movie.vote_count?.toLocaleString() || 0} votes)
          </p>
        </div>

        {/* Release Date */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${colors.watchlistText} mb-2`}>
            {formatReleaseDate(movie.release_date)}
          </div>
          <p className={`text-sm ${colors.watchlistTextSecondary}`}>Release Date</p>
        </div>

        {/* Runtime */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${colors.watchlistText} mb-2`}>
            {formatRuntime(movie.runtime)}
          </div>
          <p className={`text-sm ${colors.watchlistTextSecondary}`}>Runtime</p>
        </div>

        {/* Budget */}
        <div className="text-center">
          <div className={`text-lg font-semibold ${colors.watchlistText} mb-2`}>
            {formatCurrency(movie.budget)}
          </div>
          <p className={`text-sm ${colors.watchlistTextSecondary}`}>Budget</p>
        </div>
      </div>

      {/* Genres */}
      {movie.genres && movie.genres.length > 0 && (
        <div className="mt-6">
          <h4 className={`text-lg font-semibold ${colors.watchlistText} mb-3`}>Genres</h4>
          <div className="flex flex-wrap">
            {movie.genres.map((genre) => (
              <GenreTag key={genre.id} genre={genre} />
            ))}
          </div>
        </div>
      )}

      {/* Production Companies */}
      {movie.production_companies && movie.production_companies.length > 0 && (
        <div className="mt-6">
          <h4 className={`text-lg font-semibold ${colors.watchlistText} mb-3`}>Production</h4>
          <p className={`${colors.watchlistTextSecondary}`}>
            {movie.production_companies.slice(0, 3).map(company => company.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default MovieStats;
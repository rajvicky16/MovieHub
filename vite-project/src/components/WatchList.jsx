import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import { TMDB_CONFIG } from "../config/tmdb";
import WatchlistButton from "./WatchlistButton";

function WatchList() {
  const { colors } = useTheme();
  const { watchlist, removeFromWatchlist, getWatchlistCount, isLoading } = useWatchlist();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // recent, title, rating

  // Filter watchlist based on search query
  const filteredMovies = watchlist.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort movies based on selected criteria
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "rating":
        return (b.vote_average || 0) - (a.vote_average || 0);
      case "recent":
      default:
        return new Date(b.addedToWatchlist) - new Date(a.addedToWatchlist);
    }
  });

  const handleRemoveFromWatchlist = (movieId, movieTitle) => {
    removeFromWatchlist(movieId);
    console.log(`Removed "${movieTitle}" from watchlist`);
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatRating = (rating) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  if (isLoading) {
    return (
      <div className={`w-full min-h-screen bg-gradient-to-b ${colors.primary} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className={`${colors.textSecondary} text-lg`}>Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${colors.primary} px-4 py-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${colors.textAccent} drop-shadow-lg mb-2`}>
            My Watchlist
          </h1>
          <p className={`${colors.textSecondary} text-lg`}>
            {getWatchlistCount() === 0 
              ? "Your watchlist is empty" 
              : `You have ${getWatchlistCount()} movie${getWatchlistCount() !== 1 ? 's' : ''} saved`
            }
          </p>
        </div>

        {/* Search and Filter Controls */}
        {getWatchlistCount() > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-auto">
            {/* Search Input */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className={`h-5 w-5 ${colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search your watchlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${colors.border} ${colors.input} ${colors.inputFocus} transition-all duration-200`}
              />
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${colors.border} ${colors.input} ${colors.inputFocus} transition-all duration-200 min-w-[150px]`}
            >
              <option value="recent">Recently Added</option>
              <option value="title">Title A-Z</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        )}

        {/* Watchlist Content */}
        {sortedMovies.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <svg className={`mx-auto h-16 w-16 ${colors.textSecondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM6 6v12h12V6H6zm3-2V3h6v1H9z" />
              </svg>
            </div>
            <h3 className={`text-xl font-semibold ${colors.watchlistText} mb-2`}>
              {getWatchlistCount() === 0 ? 'Your watchlist is empty' : 'No movies match your search'}
            </h3>
            <p className={`${colors.textSecondary} mb-6`}>
              {getWatchlistCount() === 0 
                ? 'Start adding movies to your watchlist from the Movies page!' 
                : 'Try adjusting your search terms or filter criteria'
              }
            </p>
            {getWatchlistCount() === 0 && (
              <a 
                href="/" 
                className={`inline-flex items-center gap-2 ${colors.buttonPrimary} px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Browse Movies
              </a>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden rounded-lg shadow-lg">
              <table className={`w-full ${colors.tertiary}`}>
                <thead className={`${colors.secondary}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold ${colors.watchlistText} uppercase tracking-wide`}>
                      Movie
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${colors.watchlistText} uppercase tracking-wide`}>
                      Rating
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${colors.watchlistText} uppercase tracking-wide`}>
                      Release Date
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${colors.watchlistText} uppercase tracking-wide`}>
                      Added
                    </th>
                    <th className={`px-6 py-4 text-center text-sm font-semibold ${colors.watchlistText} uppercase tracking-wide`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${colors.border}`}>
                  {sortedMovies.map((movie) => (
                    <tr key={movie.id} className={`hover:${colors.secondary} transition-colors duration-200`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            className="w-12 h-18 object-cover rounded-lg mr-4 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                            src={
                              movie.poster_path
                                ? TMDB_CONFIG.getImageUrl(movie.poster_path, 'w92')
                                : 'https://via.placeholder.com/92x138?text=No+Image'
                            }
                            alt={movie.title}
                            title={`Click to view details for ${movie.title}`}
                            onClick={() => handleMovieClick(movie.id)}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/92x138?text=No+Image';
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <h4 
                              className={`text-lg font-semibold ${colors.watchlistText} mb-1 truncate cursor-pointer hover:${colors.accent} transition-colors duration-200`}
                              title={`Click to view details for ${movie.title}`}
                              onClick={() => handleMovieClick(movie.id)}
                            >
                              {movie.title}
                            </h4>
                            <p className={`${colors.watchlistTextSecondary} text-sm line-clamp-2`}>
                              {movie.overview && movie.overview.length > 100 
                                ? movie.overview.substring(0, 100) + '...' 
                                : movie.overview || 'No description available'
                              }
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <span className="text-yellow-500 text-lg mr-1">⭐</span>
                          <span className={`font-medium ${colors.watchlistText}`}>
                            {formatRating(movie.vote_average)}
                          </span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center ${colors.watchlistText}`}>
                        {formatDate(movie.release_date)}
                      </td>
                      <td className={`px-6 py-4 text-center ${colors.watchlistTextSecondary} text-sm`}>
                        {formatDate(movie.addedToWatchlist)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleMovieClick(movie.id)}
                            className={`${colors.buttonSecondary} px-3 py-1 text-sm rounded-md font-medium transition-all duration-200 hover:scale-105`}
                            title="View movie details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <WatchlistButton
                            movie={movie}
                            variant="default"
                            size="small"
                            showText={false}
                            showIcon={true}
                            onToggle={() => {
                              console.log(`Removed "${movie.title}" from watchlist`);
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {sortedMovies.map((movie) => (
                <div key={movie.id} className={`${colors.tertiary} rounded-lg shadow-lg p-4`}>
                  <div className="flex items-start space-x-4">
                    <img
                      className="w-20 h-30 object-cover rounded-lg shadow-md flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-200"
                      src={
                        movie.poster_path
                          ? TMDB_CONFIG.getImageUrl(movie.poster_path, 'w154')
                          : 'https://via.placeholder.com/154x231?text=No+Image'
                      }
                      alt={movie.title}
                      title={`Click to view details for ${movie.title}`}
                      onClick={() => handleMovieClick(movie.id)}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/154x231?text=No+Image';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 
                        className={`text-lg font-semibold ${colors.watchlistText} mb-2 line-clamp-2 cursor-pointer hover:${colors.accent} transition-colors duration-200`}
                        title={`Click to view details for ${movie.title}`}
                        onClick={() => handleMovieClick(movie.id)}
                      >
                        {movie.title}
                      </h4>
                      <div className="flex items-center mb-2 text-sm">
                        <span className="text-yellow-500 mr-1">⭐</span>
                        <span className={`font-medium ${colors.watchlistText} mr-4`}>
                          {formatRating(movie.vote_average)}
                        </span>
                        <span className={`${colors.watchlistTextSecondary}`}>
                          {formatDate(movie.release_date)}
                        </span>
                      </div>
                      <p className={`${colors.watchlistTextSecondary} text-sm mb-3 line-clamp-3`}>
                        {movie.overview && movie.overview.length > 120 
                          ? movie.overview.substring(0, 120) + '...' 
                          : movie.overview || 'No description available'
                        }
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`${colors.watchlistTextSecondary} text-xs`}>
                          Added {formatDate(movie.addedToWatchlist)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMovieClick(movie.id)}
                            className={`${colors.buttonSecondary} px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 hover:scale-105`}
                          >
                            View Details
                          </button>
                          <WatchlistButton
                            movie={movie}
                            variant="default"
                            size="small"
                            onToggle={() => {
                              console.log(`Removed "${movie.title}" from watchlist`);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default WatchList;
import React, { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';

/**
 * Reusable WatchlistButton Component
 * Provides consistent watchlist toggle functionality across different components
 */
const WatchlistButton = ({ 
  movie, 
  variant = 'default', 
  size = 'medium',
  className = '',
  showIcon = true,
  showText = true,
  onToggle = null // Optional callback for custom handling
}) => {
  const { isInWatchlist, toggleWatchlist, isLoading } = useWatchlist();
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if movie is currently in watchlist
  const inWatchlist = movie ? isInWatchlist(movie.id) : false;

  // Handle button click
  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!movie || isLoading || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const newStatus = toggleWatchlist(movie);
      
      // Call optional callback with new status
      if (onToggle) {
        onToggle(newStatus, movie);
      }

      // Small delay for visual feedback
      await new Promise(resolve => setTimeout(resolve, 150));
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get button styling based on variant
  const getButtonStyles = () => {
    const baseStyles = 'font-bold transition-all duration-300 focus:outline-none focus:ring-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    // Size variants
    const sizeStyles = {
      small: 'px-3 py-1.5 text-sm rounded-md',
      medium: 'px-4 py-2 text-sm sm:text-base rounded-lg',
      large: 'px-6 py-3 text-base sm:text-lg rounded-xl',
    };

    // Style variants
    const variantStyles = {
      default: inWatchlist 
        ? `${colors.buttonDanger} hover:scale-105 focus:ring-red-400`
        : `${colors.buttonSecondary} hover:scale-105 focus:ring-gray-400`,
      primary: inWatchlist
        ? `${colors.buttonDanger} hover:scale-105 focus:ring-red-400`
        : `${colors.buttonPrimary} hover:scale-105 focus:ring-yellow-400`,
      outline: inWatchlist
        ? `border-2 border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white focus:ring-red-400`
        : `border-2 border-gray-500 text-gray-500 bg-transparent hover:bg-gray-500 hover:text-white focus:ring-gray-400`,
      ghost: inWatchlist
        ? `text-red-500 bg-transparent hover:bg-red-500/10 focus:ring-red-400`
        : `text-gray-500 bg-transparent hover:bg-gray-500/10 focus:ring-gray-400`,
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  };

  // Get button text
  const getButtonText = () => {
    if (isProcessing) {
      return inWatchlist ? 'Removing...' : 'Adding...';
    }
    return inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist';
  };

  // Get icon component
  const getIcon = () => {
    if (isProcessing) {
      return (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    }

    if (inWatchlist) {
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
      </svg>
    );
  };

  // Don't render if no movie data
  if (!movie) {
    return null;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || isProcessing}
      className={getButtonStyles()}
      aria-label={getButtonText()}
      title={getButtonText()}
    >
      {showIcon && getIcon()}
      {showText && (
        <span className="whitespace-nowrap">
          {getButtonText()}
        </span>
      )}
    </button>
  );
};

export default WatchlistButton;
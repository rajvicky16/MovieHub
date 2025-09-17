import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * VideoPlayer Component - Professional video player with modal overlay
 * Supports YouTube trailers with responsive design and controls
 */
const VideoPlayer = ({ 
  isOpen, 
  onClose, 
  videoKey, 
  movieTitle = 'Movie Trailer',
  platform = 'YouTube' 
}) => {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset states when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isOpen, videoKey]);

  if (!isOpen) return null;

  // Handle video load success
  const handleVideoLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Handle video load error
  const handleVideoError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate video URL based on platform
  const getVideoUrl = () => {
    if (!videoKey) return '';
    
    switch (platform.toLowerCase()) {
      case 'youtube':
        return `https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0`;
      case 'vimeo':
        return `https://player.vimeo.com/video/${videoKey}?autoplay=1`;
      default:
        return '';
    }
  };

  const videoUrl = getVideoUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
        aria-label="Close video player"
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl mx-4 aspect-video bg-black rounded-xl overflow-hidden shadow-2xl transform transition-all duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 ${colors.secondary} text-white hover:bg-red-600 rounded-full p-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-400`}
          aria-label="Close video"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Title */}
        <div className={`absolute top-4 left-4 z-10 ${colors.secondary} rounded-lg px-4 py-2`}>
          <h3 className={`font-semibold ${colors.movieCardText} text-sm sm:text-base`}>
            {movieTitle} - Trailer
          </h3>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading trailer...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center max-w-md mx-4">
              <div className="text-red-500 text-6xl mb-4">🎥</div>
              <h3 className="text-xl font-bold text-white mb-4">
                Trailer Not Available
              </h3>
              <p className="text-gray-300 mb-6">
                Sorry, we couldn't load the trailer for this movie. It might not be available or there could be a connection issue.
              </p>
              <button
                onClick={onClose}
                className={`${colors.buttonPrimary} px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Video Player */}
        {videoUrl && !hasError && (
          <iframe
            src={videoUrl}
            title={`${movieTitle} Trailer`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleVideoLoad}
            onError={handleVideoError}
          />
        )}

        {/* No Video Available */}
        {!videoUrl && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center max-w-md mx-4">
              <div className="text-gray-500 text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-4">
                No Trailer Available
              </h3>
              <p className="text-gray-300 mb-6">
                Unfortunately, there's no trailer available for this movie at the moment.
              </p>
              <button
                onClick={onClose}
                className={`${colors.buttonSecondary} px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105`}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Custom hook for managing video player state
 */
export const useVideoPlayer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);

  const openVideo = (videoData) => {
    setCurrentVideo(videoData);
    setIsOpen(true);
  };

  const closeVideo = () => {
    setIsOpen(false);
    // Delay clearing video data to allow for smooth closing animation
    setTimeout(() => {
      setCurrentVideo(null);
    }, 300);
  };

  return {
    isOpen,
    currentVideo,
    openVideo,
    closeVideo
  };
};

export default VideoPlayer;
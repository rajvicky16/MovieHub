import React from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * CastCard Component - Displays individual cast member information
 */
const CastCard = ({ actor }) => {
  const { colors } = useTheme();
  
  if (!actor) return null;

  return (
    <div className={`${colors.card} rounded-lg shadow-lg overflow-hidden min-w-[140px] flex-shrink-0 transform transition-all duration-300 hover:scale-105 ${colors.cardHover}`}>
      <div className="aspect-[2/3] relative">
        <img
          src={
            actor.profile_path
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : 'https://via.placeholder.com/185x278?text=No+Photo'
          }
          alt={actor.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/185x278?text=No+Photo';
          }}
        />
      </div>
      <div className="p-3">
        <h4 className={`font-semibold text-sm ${colors.watchlistText} mb-1 line-clamp-2`}>
          {actor.name}
        </h4>
        <p className={`text-xs ${colors.watchlistTextSecondary} line-clamp-2`}>
          {actor.character}
        </p>
      </div>
    </div>
  );
};

/**
 * CastList Component - Displays horizontal scrollable list of cast members
 */
const CastList = ({ cast, title = "Cast" }) => {
  const { colors } = useTheme();
  
  if (!cast || cast.length === 0) return null;

  return (
    <div className="mb-8">
      <h3 className={`text-2xl font-bold ${colors.watchlistText} mb-4`}>
        {title}
      </h3>
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {cast.slice(0, 10).map((actor) => (
            <CastCard key={actor.id} actor={actor} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CastList;
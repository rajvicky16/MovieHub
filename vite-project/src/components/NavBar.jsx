import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors } = useTheme();
  const { getWatchlistCount } = useWatchlist();
  const watchlistCount = getWatchlistCount();
  
  return (
    <nav className={`w-full ${colors.navbar} shadow-lg px-2 sm:px-4 md:px-10 py-2 flex items-center justify-between sticky top-0 z-50`}>
      {/* Left Section: Logo & Brand */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <img className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-lg" src={logo} alt="Logo" />
        <span className={`${colors.textAccent} font-extrabold text-lg sm:text-2xl tracking-wide font-sans drop-shadow-lg`}>MovieHub</span>
      </div>

      {/* Hamburger for mobile */}
      <button
        className={`sm:hidden flex items-center px-2 py-1 ${colors.textAccent} focus:outline-none`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Toggle menu"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Right Section: Theme Toggle & Links */}
      <div className={`flex-col sm:flex-row flex items-center sm:space-x-6 space-y-2 sm:space-y-0 absolute sm:static top-full left-0 w-full sm:w-auto ${colors.secondary} sm:bg-transparent shadow-lg sm:shadow-none px-4 sm:px-0 py-2 sm:py-0 transition-all duration-300 ${menuOpen ? 'flex' : 'hidden sm:flex'}`}>
        {/* Mobile Theme Toggle */}
        <div className="sm:hidden mb-2">
          <ThemeToggle />
        </div>
        
        {/* Desktop Theme Toggle */}
        <div className="hidden sm:flex items-center">
          <ThemeToggle />
        </div>
        
        <Link
          to="/"
          className={`px-4 py-2 rounded-md ${colors.navbarText} font-semibold ${colors.navbarHover} transition-all duration-200 shadow-sm w-full sm:w-auto text-center`}
          onClick={() => setMenuOpen(false)}
        >
          Movies
        </Link>
        <Link
          to="/watchlist"
          className={`relative px-4 py-2 rounded-md ${colors.navbarText} font-semibold ${colors.navbarHover} transition-all duration-200 shadow-sm w-full sm:w-auto text-center flex items-center justify-center gap-2`}
          onClick={() => setMenuOpen(false)}
        >
          Watchlist
          {watchlistCount > 0 && (
            <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {watchlistCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default NavBar;
import React, { useEffect, useState } from "react";
import Banner from "./Banner";
import MovieCard from "./MovieCard";
import axios from "axios";
import Pagination from "./Pagination";
import { useTheme } from "../context/ThemeContext";
import { TMDB_CONFIG } from "../config/tmdb";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [maxPage , setMaxPage] = useState(null);
  const { colors } = useTheme();

  function pageNext() {
    if(page<maxPage){
    setPage(page + 1);
    }
    
  }

  function pagePrevious() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  useEffect(() => {
    async function fetchMovies() {
      try {
        const url = TMDB_CONFIG.buildUrl(TMDB_CONFIG.ENDPOINTS.NOW_PLAYING, { page });
        const response = await axios.get(url);

        setMovies(response.data?.results || []);
        setMaxPage(response.data?.total_pages || 1);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setMovies([]);
        setMaxPage(1);
      }
    }

    fetchMovies();
  }, [page]);

  console.log(movies);

  return (
    <div className={`w-full min-h-screen bg-gradient-to-b ${colors.primary}`}>
      <Banner />
      <div className={`text-2xl md:text-3xl font-bold text-center m-5 ${colors.textAccent} drop-shadow-lg`}>
        <h1>Trending Movies</h1>
      </div>
      <div className="flex flex-wrap justify-center gap-6 md:gap-8 px-2 md:px-8 py-4">
        {movies &&
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movieObj={movie}
            />
          ))}
      </div>
      <Pagination
        prevFn={pagePrevious}
        nextFn={pageNext}
        pageNo={page}
        maxPage={maxPage}
        onPageChange={setPage}
      />
    </div>
  );
}

export default Movies;
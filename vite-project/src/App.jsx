import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Movies from './components/Movies';
import WatchList from './components/WatchList';
import MovieDetails from './components/MovieDetails';
import { ThemeProvider } from './context/ThemeContext';
import { WatchlistProvider } from './context/WatchlistContext';
import './utils/apiTest'; // This will auto-run API tests in development

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <WatchlistProvider>
          <BrowserRouter>
            <div className='bg-black'>
              <NavBar />
            </div>
            <Routes>
              <Route path='/' element={<Movies />} />
              <Route path='/watchlist' element={<WatchList />} />
              <Route path='/movie/:id' element={<MovieDetails />} />
            </Routes>
          </BrowserRouter>
        </WatchlistProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;

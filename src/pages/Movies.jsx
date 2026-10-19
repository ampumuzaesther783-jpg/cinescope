import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import {
  fetchPopularMovies,
  fetchMoviesByGenre,
  GENRES,
} from '../services/tmdb';

const QUICK_FILTERS = [
  { label: 'Popular', id: null },
  { label: 'Action', id: GENRES.ACTION },
  { label: 'Comedy', id: GENRES.COMEDY },
  { label: 'Drama', id: GENRES.DRAMA },
  { label: 'Horror', id: GENRES.HORROR },
  { label: 'Sci-Fi', id: GENRES.SCI_FI },
  { label: 'Thriller', id: GENRES.THRILLER },
];

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadMovies = async (genreId = null, pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = genreId
        ? await fetchMoviesByGenre(genreId, pageNum)
        : await fetchPopularMovies(pageNum);
      setMovies(data.results);
      setTotalPages(data.totalPages);
      setPage(data.page);
    } catch (err) {
      console.error(err);
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies(activeFilter, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeFilter, page]);

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
        Movies
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Browse popular movies or filter by genre
      </Typography>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 4,
          flexWrap: 'wrap',
          gap: 1,
          '& > *': { mb: '8px !important' },
        }}
      >
        {QUICK_FILTERS.map((f) => (
          <Chip
            key={f.label}
            label={f.label}
            onClick={() => handleFilterChange(f.id)}
            color={activeFilter === f.id ? 'primary' : 'default'}
            variant={activeFilter === f.id ? 'filled' : 'outlined'}
            sx={{ fontWeight: 500 }}
          />
        ))}
      </Stack>

      {loading && <LoadingSpinner message="Loading movies..." />}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => loadMovies(activeFilter, page)}
        />
      )}

      {!loading && !error && movies.length === 0 && (
        <Typography color="text.secondary" textAlign="center" py={6}>
          No movies found for this filter.
        </Typography>
      )}

      {!loading && !error && movies.length > 0 && (
        <>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(4, 1fr)',
                lg: 'repeat(5, 1fr)',
                xl: 'repeat(6, 1fr)',
              },
              gap: 2.5,
            }}
          >
            {movies.map((movie) => (
              <Box key={movie.id} sx={{ maxWidth: 200, mx: 'auto', width: '100%' }}>
                <MovieCard item={{ ...movie, media_type: 'movie' }} />
              </Box>
            ))}
          </Box>

          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={handlePageChange}
          />
        </>
      )}
    </Container>
  );
}

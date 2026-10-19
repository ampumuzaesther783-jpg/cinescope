import { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import MovieRow from '../components/MovieRow';
import ErrorMessage from '../components/ErrorMessage';
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  fetchMoviesByGenre,
  GENRES,
} from '../services/tmdb';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [trend, popMovies, action, popTV] = await Promise.all([
        fetchTrending('all', 'week'),
        fetchPopularMovies(),
        fetchMoviesByGenre(GENRES.ACTION),
        fetchPopularTV(),
      ]);
      setTrending(trend);
      setPopularMovies(popMovies.results);
      setActionMovies(action.results);
      setPopularTV(popTV.results);
    } catch (err) {
      console.error(err);
      setError(
        'Failed to load content. Please check your API key and internet connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <ErrorMessage message={error} onRetry={loadData} />
      </Container>
    );
  }

  return (
    <Box>
      {/* Hero section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a0505 0%, #0a0a0a 50%, #0a0a12 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          py: { xs: 4, md: 6 },
          mb: 4,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            fontWeight={800}
            sx={{
              letterSpacing: '-0.03em',
              mb: 1,
              fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
            }}
          >
            Discover Your Next Favourite
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 520, fontSize: { xs: 14, md: 16 } }}
          >
            Explore trending movies, popular series, and curated collections — all powered by live data.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <MovieRow title="Trending This Week" items={trending} loading={loading} />
        <MovieRow title="Popular Movies" items={popularMovies} loading={loading} />
        <MovieRow title="Action Movies" items={actionMovies} loading={loading} />
        <MovieRow title="Popular TV Shows" items={popularTV} loading={loading} />
      </Container>
    </Box>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import { searchMulti } from '../services/tmdb';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalPages(1);
      return;
    }

    const doSearch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchMulti(query, page);
        setResults(data.results);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error(err);
        setError('Search failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    doSearch();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [query, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
        Search Results
      </Typography>
      {query && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Showing results for “{query}”
        </Typography>
      )}

      {loading && <LoadingSpinner message="Searching..." />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && query && results.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 10 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No matches found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different title or check the spelling.
          </Typography>
        </Box>
      )}

      {!loading && !error && !query && (
        <Typography color="text.secondary" textAlign="center" py={6}>
          Enter a search term above to find movies and TV shows.
        </Typography>
      )}

      {!loading && !error && results.length > 0 && (
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
            {results.map((item) => (
              <Box
                key={`${item.id}-${item.media_type}`}
                sx={{ maxWidth: 200, mx: 'auto', width: '100%' }}
              >
                <MovieCard item={item} />
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

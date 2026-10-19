import {
  Box,
  Container,
  Typography,
  Button,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import MovieCard from '../components/MovieCard';
import { useWatchlist } from '../context/WatchlistContext';
import { useNavigate } from 'react-router-dom';

export default function Watchlist() {
  const { watchlist } = useWatchlist();
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 1, letterSpacing: '-0.02em' }}>
        My Watchlist
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        {watchlist.length === 0
          ? 'Your saved movies and TV shows will appear here'
          : `${watchlist.length} item${watchlist.length !== 1 ? 's' : ''} saved`}
      </Typography>

      {watchlist.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            py: 10,
            gap: 2,
          }}
        >
          <BookmarkBorderIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
          <Typography color="text.secondary" variant="h6">
            Your watchlist is empty
          </Typography>
          <Typography color="text.secondary" variant="body2" textAlign="center" maxWidth={360}>
            Browse movies and TV shows, then click the bookmark icon to save them for later.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Discover Content
          </Button>
        </Box>
      ) : (
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
          {watchlist.map((item) => (
            <Box key={`${item.id}-${item.media_type}`} sx={{ maxWidth: 200, mx: 'auto', width: '100%' }}>
              <MovieCard item={item} />
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

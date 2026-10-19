import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Stack,
  Skeleton,
  Rating,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {
  fetchMovieDetails,
  fetchTVDetails,
  getImageUrl,
} from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';
import ErrorMessage from '../components/ErrorMessage';

const PLACEHOLDER =
  'https://via.placeholder.com/400x600/1a1a1a/666666?text=No+Poster';

export default function Details() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const result =
          type === 'tv' ? await fetchTVDetails(id) : await fetchMovieDetails(id);
        setData(result);
      } catch (err) {
        console.error(err);
        setError('Failed to load details. This title may not exist.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [type, id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Skeleton variant="rectangular" height={40} width={120} sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: { xs: '100%', md: 320 },
              aspectRatio: '2/3',
              borderRadius: 3,
              flexShrink: 0,
            }}
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton height={48} width="70%" />
            <Skeleton height={24} width="40%" sx={{ mt: 1 }} />
            <Skeleton height={20} width="30%" sx={{ mt: 2 }} />
            <Skeleton height={100} sx={{ mt: 3 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage message={error || 'Not found'} onRetry={() => navigate(-1)} />
      </Container>
    );
  }

  const title = data.title || data.name;
  const year = (data.release_date || data.first_air_date || '').slice(0, 4);
  const overview = data.overview || 'No overview available.';
  const rating = data.vote_average ? data.vote_average / 2 : 0;
  const genres = data.genres || [];
  const poster = data.poster_path
    ? getImageUrl(data.poster_path, 'w500')
    : PLACEHOLDER;
  const backdrop = data.backdrop_path
    ? getImageUrl(data.backdrop_path, 'w1280')
    : null;
  const mediaType = type === 'tv' ? 'tv' : 'movie';
  const inList = isInWatchlist(Number(id), mediaType);
  const runtime =
    type === 'tv'
      ? data.number_of_seasons
        ? `${data.number_of_seasons} Season${data.number_of_seasons > 1 ? 's' : ''}`
        : null
      : data.runtime
      ? `${data.runtime} min`
      : null;

  // Find the best official trailer
  const trailer = data.videos?.results?.find(
    (v) =>
      v.site === 'YouTube' &&
      (v.type === 'Trailer' || v.type === 'Teaser') &&
      v.official
  ) || data.videos?.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  const trailerUrl = trailer
    ? `https://www.youtube.com/watch?v=${trailer.key}`
    : null;

  const handleToggle = () => {
    toggleWatchlist({
      id: Number(id),
      title,
      name: title,
      poster_path: data.poster_path,
      media_type: mediaType,
      vote_average: data.vote_average,
      release_date: data.release_date || data.first_air_date,
    });
  };

  return (
    <Box>
      {backdrop && (
        <Box
          sx={{
            height: { xs: 180, sm: 260, md: 340 },
            backgroundImage: `linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.3) 100%), url(${backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            mb: -8,
          }}
        />
      )}

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative' }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: 'text.secondary' }}
        >
          Back
        </Button>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 5 },
            alignItems: { xs: 'center', md: 'flex-start' },
          }}
        >
          <Box
            component="img"
            src={poster}
            alt={title}
            sx={{
              width: { xs: 220, sm: 260, md: 300 },
              borderRadius: 3,
              boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
              flexShrink: 0,
            }}
          />

          <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                letterSpacing: '-0.03em',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.6rem' },
                mb: 1,
              }}
            >
              {title}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}
            >
              {year && (
                <Typography variant="body1" color="text.secondary">
                  {year}
                </Typography>
              )}
              {runtime && (
                <>
                  <Typography color="text.secondary">·</Typography>
                  <Typography variant="body1" color="text.secondary">
                    {runtime}
                  </Typography>
                </>
              )}
              <Typography color="text.secondary">·</Typography>
              <Chip
                label={mediaType === 'tv' ? 'TV Series' : 'Movie'}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              sx={{ mb: 2.5 }}
            >
              <Rating
                value={rating}
                precision={0.5}
                readOnly
                emptyIcon={<StarIcon style={{ opacity: 0.3 }} fontSize="inherit" />}
              />
              <Typography variant="body1" fontWeight={600}>
                {data.vote_average ? data.vote_average.toFixed(1) : 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                / 10
              </Typography>
            </Stack>

            {genres.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mb: 3,
                  flexWrap: 'wrap',
                  gap: 1,
                  justifyContent: { xs: 'center', md: 'flex-start' },
                }}
              >
                {genres.map((g) => (
                  <Chip key={g.id} label={g.name} size="small" />
                ))}
              </Stack>
            )}

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ mb: 4 }}
              justifyContent={{ xs: 'center', md: 'flex-start' }}
            >
              <Button
                variant={inList ? 'outlined' : 'contained'}
                color="primary"
                startIcon={inList ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                onClick={handleToggle}
              >
                {inList ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>

              {trailerUrl && (
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<PlayArrowIcon />}
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch Trailer
                </Button>
              )}
            </Stack>

            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
              Overview
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ lineHeight: 1.7, maxWidth: 640 }}
            >
              {overview}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

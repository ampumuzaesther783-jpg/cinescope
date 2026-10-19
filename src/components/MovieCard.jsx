import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Skeleton,
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import StarIcon from '@mui/icons-material/Star';
import { getImageUrl } from '../services/tmdb';
import { useWatchlist } from '../context/WatchlistContext';

const PLACEHOLDER =
  'https://via.placeholder.com/300x450/1a1a1a/666666?text=No+Poster';

export default function MovieCard({ item }) {
  const navigate = useNavigate();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!item) return null;

  const title = item.title || item.name || 'Unknown';
  const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A';
  const poster = imgError || !item.poster_path ? PLACEHOLDER : getImageUrl(item.poster_path, 'w342');
  const inList = isInWatchlist(item.id, mediaType);

  const handleClick = () => {
    navigate(`/${mediaType}/${item.id}`);
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    toggleWatchlist({ ...item, media_type: mediaType });
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        width: '100%',
        maxWidth: 200,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'transparent',
        boxShadow: 'none',
        '&:hover .overlay': { opacity: 1 },
        '&:hover .poster': { transform: 'scale(1.05)' },
      }}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
        {!imgLoaded && !imgError && (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={0}
            sx={{ paddingTop: '150%', position: 'absolute', top: 0, left: 0 }}
          />
        )}
        <CardMedia
          component="img"
          image={poster}
          alt={title}
          className="poster"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          sx={{
            width: '100%',
            aspectRatio: '2/3',
            objectFit: 'cover',
            borderRadius: 2,
            transition: 'transform 0.35s ease',
            display: imgLoaded || imgError ? 'block' : 'none',
          }}
        />

        {/* Overlay on hover */}
        <Box
          className="overlay"
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 50%)',
            opacity: 0,
            transition: 'opacity 0.25s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            p: 1.5,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            <StarIcon sx={{ fontSize: 16, color: '#f5c518' }} />
            <Typography variant="caption" fontWeight={600}>
              {rating}
            </Typography>
          </Box>
        </Box>

        {/* Watchlist button */}
        <Tooltip title={inList ? 'Remove from Watchlist' : 'Add to Watchlist'}>
          <IconButton
            size="small"
            onClick={handleWatchlist}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: inList ? 'primary.main' : 'white',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.85)' },
              zIndex: 2,
            }}
          >
            {inList ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
      </Box>

      <CardContent sx={{ px: 0.5, pt: 1.2, pb: '8px !important' }}>
        <Typography
          variant="body2"
          fontWeight={600}
          noWrap
          title={title}
          sx={{ lineHeight: 1.3 }}
        >
          {title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {year || '—'} · {mediaType === 'tv' ? 'TV' : 'Movie'}
        </Typography>
      </CardContent>
    </Card>
  );
}

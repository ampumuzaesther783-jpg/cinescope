import { Box, Typography, IconButton, Skeleton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useRef } from 'react';
import MovieCard from './MovieCard';

export default function MovieRow({ title, items, loading }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -amount : amount,
        behavior: 'smooth',
      });
    }
  };

  if (!loading && (!items || items.length === 0)) return null;

  return (
    <Box sx={{ mb: 5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
          {title}
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 0.5 }}>
          <IconButton size="small" onClick={() => scroll('left')} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}>
            <ChevronLeftIcon />
          </IconButton>
          <IconButton size="small" onClick={() => scroll('right')} sx={{ bgcolor: 'rgba(255,255,255,0.06)' }}>
            <ChevronRightIcon />
          </IconButton>
        </Box>
      </Box>

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          pb: 1,
          mx: -1,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
          scrollbarWidth: 'none',
        }}
      >
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Box key={i} sx={{ minWidth: 160, maxWidth: 180, flexShrink: 0 }}>
                <Skeleton variant="rectangular" sx={{ aspectRatio: '2/3', borderRadius: 2 }} />
                <Skeleton width="80%" sx={{ mt: 1 }} />
                <Skeleton width="50%" />
              </Box>
            ))
          : items.map((item) => (
              <Box
                key={`${item.id}-${item.media_type || item.title || item.name}`}
                sx={{
                  minWidth: { xs: 140, sm: 160, md: 180 },
                  maxWidth: { xs: 140, sm: 160, md: 180 },
                  flexShrink: 0,
                  scrollSnapAlign: 'start',
                }}
              >
                <MovieCard item={item} />
              </Box>
            ))}
      </Box>
    </Box>
  );
}

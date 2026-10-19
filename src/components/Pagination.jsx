import { Box, Pagination as MuiPagination, useMediaQuery, useTheme } from '@mui/material';

export default function Pagination({ page, totalPages, onChange }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!totalPages || totalPages <= 1) return null;

  // TMDB allows max 500 pages
  const safeTotal = Math.min(totalPages, 500);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 5,
        mb: 2,
      }}
    >
      <MuiPagination
        count={safeTotal}
        page={page}
        onChange={(_, value) => onChange(value)}
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={1}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        sx={{
          '& .MuiPaginationItem-root': {
            color: 'text.secondary',
            '&.Mui-selected': {
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
            },
          },
        }}
      />
    </Box>
  );
}

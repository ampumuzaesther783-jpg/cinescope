import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CloseIcon from '@mui/icons-material/Close';

const navItems = [
  { label: 'Home', path: '/', icon: <HomeIcon /> },
  { label: 'Movies', path: '/movies', icon: <MovieIcon /> },
  { label: 'TV Shows', path: '/tv', icon: <TvIcon /> },
  { label: 'My Watchlist', path: '/watchlist', icon: <BookmarkIcon /> },
];

export default function Navbar({ onSearch }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      if (onSearch) onSearch(query.trim());
    }
  };

  const handleNav = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 2, py: 1 }}>
          {isMobile && (
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo / Brand */}
          <Box
            onClick={() => navigate('/')}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              mr: { md: 3 },
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1.5,
                background: 'linear-gradient(135deg, #e50914, #b20710)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 18,
                color: 'white',
              }}
            >
              C
            </Box>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.03em' }}
            >
              CineScope
            </Typography>
          </Box>

          {/* Desktop Nav */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {navItems.map((item) => (
                <ListItemButton
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 0.8,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.15),
                      color: 'primary.main',
                    },
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: 500, fontSize: 14 }}
                  />
                </ListItemButton>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          {isMobile ? (
            <IconButton color="inherit" onClick={() => setSearchOpen(!searchOpen)}>
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          ) : (
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha('#fff', 0.08),
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                width: 280,
                transition: 'all 0.2s',
                '&:focus-within': {
                  bgcolor: alpha('#fff', 0.12),
                  width: 320,
                },
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                placeholder="Search movies & TV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ color: 'inherit', flex: 1, fontSize: 14 }}
              />
            </Box>
          )}
        </Toolbar>

        {/* Mobile search bar */}
        {isMobile && searchOpen && (
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              px: 2,
              pb: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha('#fff', 0.08),
                borderRadius: 2,
                px: 1.5,
                py: 0.8,
                flex: 1,
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
              <InputBase
                autoFocus
                placeholder="Search movies & TV..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ color: 'inherit', flex: 1, fontSize: 14 }}
              />
            </Box>
          </Box>
        )}
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260 } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, #e50914, #b20710)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 18,
            }}
          >
            C
          </Box>
          <Typography variant="h6" fontWeight={700}>
            CineScope
          </Typography>
        </Box>
        <List sx={{ px: 1 }}>
          {navItems.map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => handleNav(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.main',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
}

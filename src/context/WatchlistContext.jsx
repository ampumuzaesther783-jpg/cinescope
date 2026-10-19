import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WatchlistContext = createContext(null);

const STORAGE_KEY = 'cinescope_watchlist';

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((item) => {
    setWatchlist((prev) => {
      const exists = prev.some(
        (w) => w.id === item.id && w.media_type === (item.media_type || (item.title ? 'movie' : 'tv'))
      );
      if (exists) return prev;
      return [
        ...prev,
        {
          id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          media_type: item.media_type || (item.title ? 'movie' : 'tv'),
          vote_average: item.vote_average,
          release_date: item.release_date || item.first_air_date,
        },
      ];
    });
  }, []);

  const removeFromWatchlist = useCallback((id, mediaType) => {
    setWatchlist((prev) =>
      prev.filter((item) => !(item.id === id && item.media_type === mediaType))
    );
  }, []);

  const isInWatchlist = useCallback(
    (id, mediaType) => {
      return watchlist.some((item) => item.id === id && item.media_type === mediaType);
    },
    [watchlist]
  );

  const toggleWatchlist = useCallback(
    (item) => {
      const mediaType = item.media_type || (item.title ? 'movie' : 'tv');
      if (isInWatchlist(item.id, mediaType)) {
        removeFromWatchlist(item.id, mediaType);
      } else {
        addToWatchlist({ ...item, media_type: mediaType });
      }
    },
    [addToWatchlist, removeFromWatchlist, isInWatchlist]
  );

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}

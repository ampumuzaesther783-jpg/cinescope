import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
console.log('TMDB API Key:', API_KEY); // Log the API key to verify it's being read correctly
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// Helper for poster/backdrop URLs
export const getImageUrl = (path, size = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE}/${size}${path}`;
};

// Homepage / discovery endpoints
export const fetchTrending = async (mediaType = 'all', timeWindow = 'week') => {
  const { data } = await api.get(`/trending/${mediaType}/${timeWindow}`);
  return data.results;
};

export const fetchPopularMovies = async (page = 1) => {
  const { data } = await api.get('/movie/popular', { params: { page } });
  return { results: data.results, totalPages: data.total_pages, page: data.page };
};

export const fetchPopularTV = async (page = 1) => {
  const { data } = await api.get('/tv/popular', { params: { page } });
  return { results: data.results, totalPages: data.total_pages, page: data.page };
};

export const fetchMoviesByGenre = async (genreId, page = 1) => {
  const { data } = await api.get('/discover/movie', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  });
  return { results: data.results, totalPages: data.total_pages, page: data.page };
};

export const fetchTVByGenre = async (genreId, page = 1) => {
  const { data } = await api.get('/discover/tv', {
    params: { with_genres: genreId, page, sort_by: 'popularity.desc' },
  });
  return { results: data.results, totalPages: data.total_pages, page: data.page };
};

// Search
export const searchMulti = async (query, page = 1) => {
  if (!query?.trim()) return { results: [], totalPages: 0, page: 1 };
  const { data } = await api.get('/search/multi', {
    params: { query: query.trim(), page, include_adult: false },
  });
  const results = data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  );
  return { results, totalPages: data.total_pages, page: data.page };
};

// Details
export const fetchMovieDetails = async (id) => {
  const { data } = await api.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
};

export const fetchTVDetails = async (id) => {
  const { data } = await api.get(`/tv/${id}`, {
    params: { append_to_response: 'credits,videos' },
  });
  return data;
};

// Genres
export const fetchMovieGenres = async () => {
  const { data } = await api.get('/genre/movie/list');
  return data.genres;
};

export const fetchTVGenres = async () => {
  const { data } = await api.get('/genre/tv/list');
  return data.genres;
};

// Common genre IDs for quick filters
export const GENRES = {
  ACTION: 28,
  COMEDY: 35,
  DRAMA: 18,
  HORROR: 27,
  SCI_FI: 878,
  THRILLER: 53,
  ANIMATION: 16,
  DOCUMENTARY: 99,
};

# CineScope – Movie Discovery Web Application

A modern, responsive movie and TV show discovery application built with **React**, **Vite**, and **Material UI**. Inspired by MovieBox / Netflix-style interfaces.

## Features

- **Homepage** with multiple content rows: Trending, Popular Movies, Action Movies, Popular TV Shows
- **Live data** from The Movie Database (TMDB) API
- **Search** movies and TV shows by title with loading / empty / error states
- **Details page** for each title (poster, overview, rating, genres, release year, runtime/seasons)
- **Navigation**: Home · Movies · TV Shows · My Watchlist (React Router)
- **Genre filters** on Movies and TV Shows pages
- **Watchlist** with add / remove, persisted in `localStorage`
- **Fully responsive** (desktop, tablet, mobile) with adaptive navigation and poster grids
- **Pagination** on Movies, TV Shows and Search pages
- **Official trailers** (YouTube links) on the Details page when available
- Dark theme, smooth hover effects, professional branding

## Tech Stack

| Technology       | Purpose                          |
|------------------|----------------------------------|
| React 18         | UI library                       |
| Vite             | Build tool & dev server          |
| Material UI (MUI)| Component library & theming      |
| React Router v6  | Client-side routing              |
| Axios            | HTTP client for TMDB API         |
| localStorage     | Watchlist persistence            |

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### 1. Clone & Install

```bash
cd movie-discovery
npm install
```

### 2. API Key (Required)

1. Create a free account at [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Go to Settings → API and request an API key
3. Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

4. Paste your key:

```
VITE_TMDB_API_KEY=your_actual_api_key_here
```

> Never commit your real `.env` file. The `.gitignore` already excludes it.

### 3. Run Locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
movie-discovery/
├── public/
├── src/
│   ├── components/       # Reusable UI pieces
│   │   ├── Navbar.jsx
│   │   ├── MovieCard.jsx
│   │   ├── MovieRow.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ErrorMessage.jsx
│   ├── pages/            # Route-level pages
│   │   ├── Home.jsx
│   │   ├── Movies.jsx
│   │   ├── TVShows.jsx
│   │   ├── Watchlist.jsx
│   │   ├── Search.jsx
│   │   └── Details.jsx
│   ├── context/
│   │   └── WatchlistContext.jsx
│   ├── services/
│   │   └── tmdb.js       # API calls
│   ├── theme.js          # MUI dark theme
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── index.html
├── package.json
└── vite.config.js
```

## API Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Data and images provided by [The Movie Database](https://www.themoviedb.org/).

## Deployment

Recommended platforms:

- **Vercel**: `vercel` or connect GitHub repo
- **Netlify**: drag-and-drop `dist` folder or Git integration

Remember to set the `VITE_TMDB_API_KEY` environment variable in your hosting dashboard.

## Assignment Compliance

This project implements every compulsory requirement from the Practical Assignment brief:

- Vite + React (JSX)
- Material UI components (AppBar, Drawer, Card, Typography, etc.)
- React Router navigation
- useState / useEffect
- Live REST API (TMDB)
- Search with proper states
- Details view
- Category/genre filters
- Watchlist + localStorage
- Responsive design
- Error / loading / missing-poster handling
- Clean component structure + README

## License

Educational project – for coursework use.

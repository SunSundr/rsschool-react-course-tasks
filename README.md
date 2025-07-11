# TMDB Movie•Searcher

A React application built with Class components for searching movies using The Movie Database ([TMDB](https://www.themoviedb.org)) API.

🔗 **[Live Demo](https://tmdbmoviesearcher.netlify.app)**

## Overview

This application was created as part of the RS School React course task: [Class Components](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/class-components.md)

## Features

- **Movie Search**: Search for movies in the TMDB database
- **Detailed View**: Click on any movie card to view detailed information in a modal
- **Load More Results**: "Show More" button to load additional results (20 results per request)
- **Persistent Search**: Automatically saves and restores search queries using localStorage
- **Loading States**: Loading spinner during data fetching
- **Error Handling**: Error boundary with fallback UI and reset functionality
- **Responsive Design**: Adaptive layout for different screen sizes
- **Empty States**: User-friendly messages when no results are found

## Technology Stack

- **React** with Class Components (no hooks)
- **TypeScript** for type safety
- **CSS Modules** for styling (no external CSS frameworks)
- **Vite** for build tooling

## API Access

The application uses TMDB API through a proxy server: [TMDB-backend](https://github.com/SunSundr/TMDB-backend/tree/develop)

For development mode with direct TMDB access (not necessary):

1. Copy `.env.example` to `.env`
2. Add your TMDB API key as `VITE_TMDB_API_ACCESS_KEY`
3. The application automatically switches to direct API access when a valid key is provided in development mode (DEV)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Architecture

- **Class Components Only**: All components use class-based architecture for state management and lifecycle methods
- **No Hooks**: Adheres to class component patterns without using React hooks
- **Error Boundary**: Application-wide error handling with recovery mechanism
- **CSS Modules**: Scoped styling without external frameworks
- **TypeScript**: Full type coverage for better development experience

## Limitations

- Configured for `en_US` locale only
- No direct DOM manipulations within React components
- Minimal external dependencies (React only)
- Class components used exclusively for state and lifecycle management

## Testing Error Handling

An error test button is located in the footer (bottom-right corner) to demonstrate the error boundary functionality.

# TMDB Movie•Searcher

A React application built with functional components and hooks for searching movies using The Movie Database ([TMDB](https://www.themoviedb.org)) API.

🔗 **[Live Demo](https://tmdbmoviesearcher.netlify.app)**

## Overview

This application was created as part of the RS School React course task: [State Management and Context API](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/state-management.md)

## Features

- **Movie Search**: Search for movies in the TMDB database
- **Detailed View**: Click on any movie card to view detailed information with routing
- **Pagination**: Navigate through multiple pages of results
- **Persistent Search**: Automatically saves and restores search queries using localStorage
- **Video Selection**: Select multiple video cards and download CSV of selected items (comma-separated)
- **Theme Switching**: Toggle between dark and light themes with automatic system preference detection
- **Loading States**: Loading spinner during data fetching
- **Error Handling**: Error boundary with fallback UI and reset functionality
- **Responsive Design**: Adaptive layout for different screen sizes
- **Empty States**: User-friendly messages when no results are found
- **Routing**: React Router for navigation between pages and detailed views

## Technology Stack

- **React** with Functional Components and Hooks
- **React Router** for client-side routing
- **Zustand** for state management
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

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build
```

## Architecture

- **Functional Components**: All components use functional architecture with React hooks
- **State Management**: Zustand store with video and theme slices for global state
- **React Hooks**: useState, useEffect, useContext, and custom hooks for local state management
- **React Router**: Client-side routing with nested routes and outlet patterns
- **Theme System**: Automatic detection of system preference using `matchMedia('(prefers-color-scheme: dark)')`, with localStorage persistence for user selections
- **Error Boundary**: Application-wide error handling with recovery mechanism
- **CSS Modules**: Scoped styling without external frameworks
- **TypeScript**: Full type coverage for better development experience

## Testing

- **Vitest**: Test runner integrated with Vite
- **React Testing Library**: Component testing with user-centric approach
- **JSDOM**: Browser-like environment for tests
- **Test Location**: All tests are in the `src/__tests__` folder
- **Coverage**: Istanbul coverage reports with thresholds (80% statements, 50% branches/functions/lines)

## Limitations

- Configured for `en_US` locale only
- No direct DOM manipulations within React components
- Minimal external dependencies (React and React Router)
- Functional components with hooks used exclusively for state and lifecycle management

## Testing Error Handling

An error test button is located in the footer (bottom-right corner) to demonstrate the error boundary functionality.

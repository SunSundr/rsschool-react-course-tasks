# TMDB Movie•Searcher

A Next.js application with server-side rendering for searching movies using The Movie Database ([TMDB](https://www.themoviedb.org)) API.

🔗 **[Live Demo](https://tmdbmoviesearcher.netlify.app)**

## Overview

This application was created as part of the RS School React course task: [Next.js. Server Side Rendering](https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/nextjs-ssr-ssg.md)

## Features

- **Movie Search**: Search for movies in the TMDB database
- **Detailed View**: Click on any movie card to view detailed information with routing
- **Pagination**: Navigate through multiple pages of results
- **Persistent Search**: Search queries preserved in URL parameters (search_query)
- **Video Selection**: Select multiple video cards and download CSV of selected items (comma-separated)
- **Theme Switching**: Toggle between dark and light themes with automatic system preference detection
- **Server-Side Rendering**: Fast initial page loads with pre-rendered content
- **Internationalization**: Multi-language support (English, Russian, Ukrainian)
- **Loading States**: Loading spinner during data fetching
- **Error Handling**: Error boundary with fallback UI and reset functionality
- **Responsive Design**: Adaptive layout for different screen sizes
- **Empty States**: User-friendly messages when no results are found
- **Routing**: Next.js App Router for navigation between pages and detailed views

## Technology Stack

- **Next.js** with App Router and Server Components
- **React** with Functional Components and Hooks
- **Server-Side Rendering** for optimal performance
- **Zustand** for client-side state management
- **next-intl** for internationalization
- **TypeScript** for type safety
- **CSS Modules** for styling (no external CSS frameworks)

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

- **Server Components**: Next.js server components for optimal performance
- **Client Components**: React functional components with hooks for interactivity
- **Server-Side Rendering**: Pre-rendered pages with dynamic data fetching
- **State Management**: Zustand store with video and theme slices for client-side global state
- **App Router**: Next.js file-based routing with layouts and nested routes
- **Theme System**: Automatic detection of system preference with localStorage persistence
- **Internationalization**: next-intl for multi-language support with URL-based locale routing
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

- Server-side CSV generation required for task compliance
- No direct DOM manipulations within React components
- Minimal external dependencies (Next.js ecosystem)
- Functional components with hooks used exclusively for state and lifecycle management

## Testing Error Handling

An error test button is located in the footer (bottom-right corner) to demonstrate the error boundary functionality.

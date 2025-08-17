'use client';

import ErrorBoundary from './ErrorBoundary';

interface ErrorBoundaryNextProps {
  children: React.ReactNode;
}

export default function ErrorBoundaryNext({ children }: ErrorBoundaryNextProps) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defaultQueries } from './settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: defaultQueries,
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

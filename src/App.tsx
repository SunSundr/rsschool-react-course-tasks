import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RouterErrorFallback } from './components/ErrorBoundary/RouterErrorFallback';
import { Layout } from './components/Layout/Layout';
import { MainComponent } from './components/MainComponent/MainComponent';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouterErrorFallback />,
    children: [
      {
        path: '/',
        element: <MainComponent />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

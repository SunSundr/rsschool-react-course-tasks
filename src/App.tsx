import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RouterErrorFallback } from './components/ErrorBoundary/RouterErrorFallback';
import { Layout } from './components/Layout/Layout';
import { AboutPage } from './pages/About/AboutPage';
import { DetailPage } from './pages/DetailPage/DetailPage';
import { MainPage } from './pages/MainPage/MainPage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    errorElement: <RouterErrorFallback />,
    children: [
      {
        path: '/',
        element: <MainPage />,
        children: [
          {
            path: 'detailed/:id',
            element: <DetailPage />,
          },
        ],
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

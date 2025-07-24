import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { DetailPage } from './pages/DetailPage/DetailPage';
import { MainPage } from './pages/MainPage/MainPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
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
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

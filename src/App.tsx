import { JSX } from 'react';
import Layout from './components/Layout/Layout';
import MainPage from './pages/MainPage/MainPage';

function App(): JSX.Element {
  return (
    <Layout>
      <MainPage />
    </Layout>
  );
}

export default App;

import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Main } from './components/Main/Main';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

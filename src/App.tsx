import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { MainComponent } from './components/MainComponent/MainComponent';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainComponent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

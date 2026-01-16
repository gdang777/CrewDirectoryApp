import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import PropertiesPage from './pages/PropertiesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/city/:cityCode" element={<CityPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
      </Routes>
    </Router>
  );
}

export default App;

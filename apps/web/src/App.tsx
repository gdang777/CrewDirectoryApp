import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import PropertiesPage from './pages/PropertiesPage';
import AuthPage from './pages/AuthPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import AllCitiesPage from './pages/AllCitiesPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cities" element={<AllCitiesPage />} />
        <Route path="/city/:cityCode" element={<CityPage />} />
        <Route path="/place/:placeId" element={<PlaceDetailsPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/auth" element={<AuthPage />} />
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCities } from '../hooks/useCities';
import AddCityModal from '../components/AddCityModal';
import Navbar from '../components/Navbar';
import apiService from '../services/api';
import './AllCitiesPage.css';

// City images mapping
const cityImages: Record<string, string> = {
  CPH: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=400&h=300&fit=crop',
  BKK: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop',
  DXB: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
  JFK: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
  LHR: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
  NRT: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
  SIN: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop',
  CDG: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
};

const defaultImage =
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=300&fit=crop';

const AllCitiesPage = () => {
  const { cities, loading, error, refetch } = useCities();
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddCity = async (cityData: {
    name: string;
    country: string;
    code: string;
  }) => {
    await apiService.createCity(cityData);
    refetch(); // Refresh the cities list
  };

  return (
    <div className="all-cities-page">
      {/* Navigation */}
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <header className="cities-header">
        <h1>All Layover Cities</h1>
        <p>
          Explore crew recommendations in {cities.length} destinations worldwide
        </p>
        <button className="add-city-btn" onClick={() => setShowAddModal(true)}>
          + Add New City
        </button>
      </header>

      {/* Content */}
      <main className="cities-main">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading cities from database...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            <div className="cities-stats">
              <span className="stat-badge">📍 {cities.length} Cities</span>
              <span className="stat-badge">✈️ Crew Verified</span>
            </div>

            <div className="cities-grid">
              {cities.map((city) => (
                <Link
                  key={city.id}
                  to={`/city/${city.code}`}
                  className="city-card"
                >
                  <div
                    className="city-image"
                    style={{
                      backgroundImage: `url(${cityImages[city.code] || defaultImage})`,
                    }}
                  >
                    <div className="city-overlay">
                      <span className="city-code">{city.code}</span>
                    </div>
                  </div>
                  <div className="city-info">
                    <h3>{city.name}</h3>
                    <p>{city.country}</p>
                    <span className="view-link">View Places →</span>
                  </div>
                </Link>
              ))}
            </div>

            {cities.length === 0 && (
              <div className="empty-state">
                <p>No cities found in the database.</p>
                <button onClick={() => setShowAddModal(true)}>
                  Add Your First City
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="cities-footer">
        <p>© 2026 Crew Lounge. All rights reserved.</p>
      </footer>

      {/* Add City Modal */}
      {showAddModal && (
        <AddCityModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddCity}
        />
      )}
    </div>
  );
};

export default AllCitiesPage;

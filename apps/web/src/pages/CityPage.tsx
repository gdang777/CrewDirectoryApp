import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService, { Place, PlaceCategory, City } from '../services/api';
import PlaceCard from '../components/PlaceCard';
import AddPlaceModal from '../components/AddPlaceModal';
import ShoppingSection from '../components/ShoppingSection';
import MapComponent from '../components/MapComponent';
import CityChatList from '../components/CityChatList';
import Navbar from '../components/Navbar';

import './CityPage.css';

const categories: {
  key: PlaceCategory | 'guide' | 'chat';
  label: string;
  icon: string;
}[] = [
  { key: 'eat', label: 'Eat', icon: '🍽️' },
  { key: 'drink', label: 'Drink', icon: '🍸' },
  { key: 'shop', label: 'Shop', icon: '🛍️' },
  { key: 'visit', label: 'Visit', icon: '📍' },
  { key: 'guide', label: 'Best Buys', icon: '💎' },
  { key: 'chat', label: 'Chats', icon: '💬' },
];

// City images mapping
const cityImages: Record<string, string> = {
  CPH: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&h=400&fit=crop',
  BKK: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&h=400&fit=crop',
  DXB: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=400&fit=crop',
  JFK: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=400&fit=crop',
  LHR: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=400&fit=crop',
};

const CityPage = () => {
  const { cityCode } = useParams<{ cityCode: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [city, setCity] = useState<City | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<
    PlaceCategory | 'guide' | 'chat'
  >('eat');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    loadData();
  }, [cityCode]);

  const loadData = async () => {
    if (!cityCode) return;
    try {
      setLoading(true);
      const [cityData, placesData] = await Promise.all([
        apiService.getCityByCode(cityCode.toUpperCase()),
        apiService.getPlaces({ cityCode: cityCode.toUpperCase() }),
      ]);
      setCity(cityData);
      setPlaces(placesData);
    } catch (err) {
      console.error('Failed to load city data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!isAuthenticated) {
      if (confirm('You need to be signed in to add a place. Go to login?')) {
        navigate('/auth');
      }
      return;
    }
    setShowAddModal(true);
  };

  const handlePlaceAdded = () => {
    loadData(); // Refresh list
    setShowAddModal(false);
  };

  const handleVote = async (placeId: string, value: 1 | -1) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      const result = await apiService.votePlace(placeId, value);
      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? { ...p, upvotes: result.upvotes, downvotes: result.downvotes }
            : p
        )
      );
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (loading) {
    return (
      <div className="city-page loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!city) {
    return (
      <div className="city-page not-found">
        <h1>City not found</h1>
        <Link to="/">← Back to Cities</Link>
      </div>
    );
  }

  const filteredPlaces = places.filter((p) => p.category === activeCategory);
  const cityImage =
    cityImages[city.code] ||
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=400&fit=crop';

  return (
    <div className="city-page">
      <Navbar />
      <header
        className="city-header"
        style={{ backgroundImage: `url(${cityImage})` }}
      >
        <div className="header-overlay">
          <Link to="/" className="back-link">
            ← All Cities
          </Link>
          <div className="city-title">
            <span className="city-code-badge">{city.code}</span>
            <h1>{city.name}</h1>
            <p>{city.country}</p>
          </div>
        </div>
      </header>

      <nav className="category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`tab ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span className="tab-icon">{cat.icon}</span>
            <span className="tab-label">{cat.label}</span>
            <span className="tab-count">
              {places.filter((p) => p.category === cat.key).length}
            </span>
          </button>
        ))}
      </nav>

      <main className="places-section">
        <div className="places-header">
          <div className="header-left">
            <h2>
              {categories.find((c) => c.key === activeCategory)?.icon}{' '}
              {categories.find((c) => c.key === activeCategory)?.label}
            </h2>
          </div>

          <div className="header-right">
            {activeCategory !== 'guide' && (
              <div className="view-toggle">
                <button
                  className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
                <button
                  className={`toggle-btn ${viewMode === 'map' ? 'active' : ''}`}
                  onClick={() => setViewMode('map')}
                >
                  Map
                </button>
              </div>
            )}
            <button className="add-place-btn" onClick={handleAddClick}>
              + Add Place
            </button>
          </div>
        </div>

        {activeCategory === 'guide' ? (
          <ShoppingSection cityCode={city.code} />
        ) : activeCategory === 'chat' ? (
          <CityChatList cityCode={city.code} />
        ) : viewMode === 'map' ? (
          <MapComponent places={filteredPlaces} city={city} />
        ) : filteredPlaces.length === 0 ? (
          <div className="empty-state">
            <p>No places yet in this category.</p>
            <button className="empty-hint-btn" onClick={handleAddClick}>
              Be the first to add one!
            </button>
          </div>
        ) : (
          <div className="places-grid">
            {filteredPlaces
              .sort(
                (a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes)
              )
              .map((place) => (
                <PlaceCard key={place.id} place={place} onVote={handleVote} />
              ))}
          </div>
        )}
      </main>

      {showAddModal && (
        <AddPlaceModal
          cityId={city.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={handlePlaceAdded}
        />
      )}
    </div>
  );
};

export default CityPage;

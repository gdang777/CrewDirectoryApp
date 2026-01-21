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

import ItineraryGeneratorModal from '../components/ItineraryGeneratorModal';
import LoadingSpinner from '../components/LoadingSpinner';
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
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<
    'rating' | 'newest' | 'oldest' | 'popular'
  >('rating');

  useEffect(() => {
    loadData();
  }, [cityCode, activeCategory, searchQuery, minRating, sortBy]);

  const loadData = async () => {
    if (!cityCode) return;
    try {
      setLoading(true);
      const [cityData, placesData] = await Promise.all([
        apiService.getCityByCode(cityCode.toUpperCase()),
        apiService.getPlaces({
          cityCode: cityCode.toUpperCase(),
          category:
            activeCategory === 'guide' || activeCategory === 'chat'
              ? undefined
              : activeCategory,
          search: searchQuery || undefined,
          minRating: minRating > 0 ? minRating : undefined,
          sortBy,
        }),
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
      setShowSignInModal(true);
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
    return <LoadingSpinner />;
  }

  if (!city) {
    return (
      <div className="city-page not-found">
        <h1>City not found</h1>
        <Link to="/">← Back to Cities</Link>
      </div>
    );
  }

  // No need for client-side filtering anymore - backend handles it
  const displayPlaces =
    activeCategory === 'guide' || activeCategory === 'chat' ? [] : places;
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
          <button
            className="ai-itinerary-btn"
            onClick={() => setShowItineraryModal(true)}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(118, 75, 162, 0.4)',
              transition: 'transform 0.2s',
            }}
          >
            <span>✨</span> Plan My Layover
          </button>
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
              {cat.key === activeCategory ? places.length : 0}
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
            {activeCategory !== 'guide' && activeCategory !== 'chat' && (
              <>
                {/* Search Input */}
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search places..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Rating Filter */}
                <select
                  className="filter-select"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                >
                  <option value={0}>All Ratings</option>
                  <option value={4}>4+ Stars</option>
                  <option value={3}>3+ Stars</option>
                  <option value={2}>2+ Stars</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  className="filter-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | 'rating'
                        | 'newest'
                        | 'oldest'
                        | 'popular'
                    )
                  }
                >
                  <option value="rating">Top Rated</option>
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </>
            )}

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
          <MapComponent places={displayPlaces} city={city} />
        ) : displayPlaces.length === 0 ? (
          <div className="empty-state">
            <p>No places found.</p>
            <button className="empty-hint-btn" onClick={handleAddClick}>
              Be the first to add one!
            </button>
          </div>
        ) : (
          <div className="places-grid">
            {displayPlaces.map((place) => (
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

      {showItineraryModal && (
        <ItineraryGeneratorModal
          cityCode={city.code}
          cityName={city.name}
          onClose={() => setShowItineraryModal(false)}
        />
      )}

      {/* Sign-in Required Modal */}
      {showSignInModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowSignInModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            className="signin-modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🔐</div>
            <h2
              style={{
                color: '#fff',
                marginBottom: '12px',
                fontSize: '1.5rem',
              }}
            >
              Sign In Required
            </h2>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '30px',
                lineHeight: 1.6,
              }}
            >
              You need to be signed in to add a place. Join our crew community
              to share your favorite spots!
            </p>
            <div
              style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}
            >
              <button
                onClick={() => setShowSignInModal(false)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'all 0.2s',
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={() => navigate('/auth')}
                style={{
                  padding: '12px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #00c6ff, #0072ff)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CityPage;

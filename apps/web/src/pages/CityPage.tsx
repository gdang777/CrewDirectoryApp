import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getCityByCode,
  getPlacesByCity,
  mockPlaces,
  Place,
  PlaceCategory,
} from '../data/mockData';
import PlaceCard from '../components/PlaceCard';
import AddPlaceModal from '../components/AddPlaceModal';
import './CityPage.css';

const categories: { key: PlaceCategory; label: string; icon: string }[] = [
  { key: 'eat', label: 'Eat', icon: '🍽️' },
  { key: 'drink', label: 'Drink', icon: '🍸' },
  { key: 'shop', label: 'Shop', icon: '🛍️' },
  { key: 'visit', label: 'Visit', icon: '📍' },
];

const CityPage = () => {
  const { cityCode } = useParams<{ cityCode: string }>();
  const city = getCityByCode(cityCode || '');
  const [activeCategory, setActiveCategory] = useState<PlaceCategory>('eat');
  const [showAddModal, setShowAddModal] = useState(false);
  const [places, setPlaces] = useState<Place[]>(() =>
    getPlacesByCity(cityCode || '')
  );

  if (!city) {
    return (
      <div className="city-page not-found">
        <h1>City not found</h1>
        <Link to="/">← Back to Cities</Link>
      </div>
    );
  }

  const filteredPlaces = places.filter((p) => p.category === activeCategory);

  const handleAddPlace = (
    newPlace: Omit<Place, 'id' | 'upvotes' | 'downvotes' | 'createdAt'>
  ) => {
    const place: Place = {
      ...newPlace,
      id: String(Date.now()),
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    };
    mockPlaces.push(place);
    setPlaces([...places, place]);
    setShowAddModal(false);
  };

  const handleVote = (placeId: string, value: 1 | -1) => {
    setPlaces((prev) =>
      prev.map((p) => {
        if (p.id === placeId) {
          return value === 1
            ? { ...p, upvotes: p.upvotes + 1 }
            : { ...p, downvotes: p.downvotes + 1 };
        }
        return p;
      })
    );
  };

  return (
    <div className="city-page">
      <header
        className="city-header"
        style={{ backgroundImage: `url(${city.imageUrl})` }}
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
          </button>
        ))}
      </nav>

      <main className="places-section">
        <div className="places-header">
          <h2>
            {categories.find((c) => c.key === activeCategory)?.icon}{' '}
            {categories.find((c) => c.key === activeCategory)?.label}
          </h2>
          <button
            className="add-place-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Add Place
          </button>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="empty-state">
            <p>No places yet in this category.</p>
            <button onClick={() => setShowAddModal(true)}>
              Be the first to add one!
            </button>
          </div>
        ) : (
          <div className="places-list">
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
          cityCode={city.code}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPlace}
        />
      )}
    </div>
  );
};

export default CityPage;

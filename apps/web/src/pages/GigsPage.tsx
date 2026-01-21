import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService, { City } from '../services/api';
import GigCard, { Gig } from '../components/GigCard';
import AddGigModal from '../components/AddGigModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './GigsPage.css';

const categories = [
  'all',
  'hospitality',
  'retail',
  'events',
  'services',
  'other',
];

const GigsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeCategory, searchTerm]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gigsData, citiesData] = await Promise.all([
        apiService.getGigs({
          category: activeCategory !== 'all' ? activeCategory : undefined,
          search: searchTerm || undefined,
          sortBy: 'newest',
        }),
        apiService.getCities(),
      ]);
      setGigs(gigsData);
      setCities(citiesData);
    } catch (error) {
      console.error('Failed to load gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    setShowAddModal(true);
  };

  return (
    <div className="gigs-page">
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ✈️ Crew Lounge
          </Link>
          <div className="nav-links">
            <Link to="/">🏠 Home</Link>
            <Link to="/cities">✈️ Cities</Link>
            <Link to="/properties">🏠 Properties</Link>
            <Link to="/gigs" className="active">
              💼 Gigs
            </Link>
          </div>
          <Link to="/auth" className="nav-cta">
            Sign In
          </Link>
        </div>
      </nav>

      <header className="page-header">
        <div className="header-container">
          <h1>Aviation Gigs in Canada</h1>
          <p>
            Find work opportunities in Canadian layover cities • Connect with
            local businesses
          </p>
        </div>
      </header>

      <section className="filters-section">
        <div className="filters-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search gigs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="add-gig-btn" onClick={handleAddClick}>
            + Post a Gig
          </button>
        </div>

        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`category-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="gigs-section">
        <div className="gigs-container">
          {loading ? (
            <LoadingSpinner />
          ) : gigs.length === 0 ? (
            <div className="empty-state">
              <p>No gigs found. Be the first to post one!</p>
              <button onClick={handleAddClick}>Post a Gig</button>
            </div>
          ) : (
            <div className="gigs-grid">
              {gigs.map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </div>
      </section>

      {showAddModal && (
        <AddGigModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            loadData();
          }}
          cities={cities.filter((city) => city.country === 'Canada')}
        />
      )}

      {showSignInPrompt && (
        <div className="sign-in-prompt-overlay">
          <div className="sign-in-prompt-modal">
            <div className="prompt-icon">🔐</div>
            <h2>Sign In Required</h2>
            <p>You need to be signed in to post a gig.</p>
            <div className="prompt-actions">
              <button
                className="prompt-btn primary"
                onClick={() => {
                  setShowSignInPrompt(false);
                  navigate('/auth');
                }}
              >
                Sign In
              </button>
              <button
                className="prompt-btn secondary"
                onClick={() => setShowSignInPrompt(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GigsPage;

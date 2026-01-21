import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { mockCities, mockPlaces } from '../data/mockData';
import RecommendationsSection from '../components/home/RecommendationsSection';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const filteredCities = mockCities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get featured places (highest voted)
  const featuredPlaces = [...mockPlaces]
    .sort((a, b) => b.upvotes - b.downvotes - (a.upvotes - a.downvotes))
    .slice(0, 6);

  const handleCityClick = (cityCode: string) => {
    navigate(`/city/${cityCode}`);
    setSearchTerm('');
  };

  const handleSearchSubmit = () => {
    if (filteredCities.length > 0) {
      handleCityClick(filteredCities[0].code);
    }
  };

  return (
    <div className="home-page">
      {/* Navigation */}
      <Navbar transparent />
      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>
            The Global Hub
            <br />
            for <span className="text-gradient">Aviation Pros</span>
          </h1>
          <p className="hero-subtitle">
            Unlock exclusive layover experiences and
            <br />
            professional connections globally.
          </p>

          <div className="hero-search-container">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search cities or IATA codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              />
              <span className="search-icon">🔍</span>
            </div>
            <button className="search-btn" onClick={handleSearchSubmit}>
              Search
            </button>
            {searchTerm && filteredCities.length > 0 && (
              <div className="search-dropdown-results">
                <div className="quick-results">
                  {filteredCities.slice(0, 5).map((city) => (
                    <div
                      key={city.id}
                      className="result-item"
                      onClick={() => handleCityClick(city.code)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleCityClick(city.code)
                      }
                    >
                      <strong>{city.code}</strong> - {city.name}, {city.country}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Recommendations Section */}
      <RecommendationsSection cityCode="LHR" />

      {/* Popular Layover Cities */}
      <section id="cities" className="section cities-section">
        <div className="section-container">
          <div className="section-header-row">
            <h2>Popular Layover Cities</h2>
            <div className="header-actions">
              <button className="nav-arrow prev">‹</button>
              <button className="nav-arrow next">›</button>
            </div>
          </div>

          <div className="cities-grid">
            {filteredCities.slice(0, 6).map((city) => (
              <Link
                to={`/city/${city.code}`}
                key={city.id}
                className="city-card"
              >
                <div
                  className="city-image"
                  style={{ backgroundImage: `url(${city.imageUrl})` }}
                >
                  {city.placeCount > 15 && (
                    <span className="verified-badge">Verified Crew</span>
                  )}
                </div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p className="city-meta">
                    {city.country}, {city.code}
                  </p>
                  <p className="city-places">{city.placeCount} places</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="featured" className="section featured-section">
        <div className="section-container">
          <div className="section-header-row">
            <h2>Featured Listings</h2>
            <div className="header-actions">
              <button className="nav-arrow prev">‹</button>
              <button className="nav-arrow next">›</button>
            </div>
          </div>

          <div className="featured-grid">
            {featuredPlaces.map((place) => {
              const city = mockCities.find((c) => c.code === place.cityCode);
              return (
                <Link
                  to={`/place/${place.id}`}
                  key={place.id}
                  className="featured-card"
                >
                  <div
                    className="featured-image"
                    style={{ backgroundImage: `url(${city?.imageUrl})` }}
                  >
                    <span className="source-badge">Verified Crew</span>
                  </div>
                  <div className="featured-info">
                    <h3>{place.name}</h3>
                    <p className="featured-location">
                      {city?.name}, {city?.code}
                    </p>
                    <p className="featured-places-count">
                      {place.upvotes} recommended
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section (Designed Specifically) */}
      <section id="features" className="section features-section">
        <div className="features-bg-gradient"></div>
        <div className="section-container text-center">
          <p className="section-pre-title">Scroll-triggered animation</p>
          <h2 className="section-title-large">
            Designed Specifically for Aviation Professionals
          </h2>

          <div className="features-grid-cards">
            <Link
              to="/properties"
              className="feature-card-glow"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="feature-icon home-icon">🏠</div>
              <h3>Crashpads & Vacation Rentals</h3>
              <p>Crashpads & vacation rentals and dorm-style places.</p>
            </Link>
            <Link
              to="/cities"
              className="feature-card-glow"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="feature-icon location-icon">📍</div>
              <h3>Layover Recommendations</h3>
              <p>Access issues free most layover recommendations.</p>
            </Link>
            <Link
              to="/cities"
              className="feature-card-glow"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="feature-icon work-icon">💼</div>
              <h3>Aviation Gigs</h3>
              <p>
                Offer someone carpooling and errands services aviation gigs.
              </p>
            </Link>
            <Link
              to="/auth"
              className="feature-card-glow"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="feature-icon group-icon">👥</div>
              <h3>Verified Community</h3>
              <p>Verified Community connections for verified community.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="section stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">2,400+</span>
              <span className="stat-label">Crew Members</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">850+</span>
              <span className="stat-label">Active Listings</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">15,000+</span>
              <span className="stat-label">Reviews Posted</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-bottom">
        <div className="section-container">
          <div className="cta-box">
            <h2>Join Our Aviation Community Today</h2>
            <div className="cta-buttons-row">
              <button className="cta-cyan">Start Exploring</button>
              <button className="cta-glass">Layover Sign In</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="section-container">
          <div className="footer-content">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <span>✈️ Crew Lounge</span>
              </div>
              <p className="footer-desc">
                The premier platform for aviation professionals to find
                crashpads, layover spots, and community resources.
              </p>
            </div>

            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Platform</h4>
                <a href="#">Cities</a>
                <a href="#">Listings</a>
                <a href="#">Community</a>
              </div>
              <div className="footer-col">
                <h4>Company</h4>
                <a href="#">About</a>
                <a href="#">Partners</a>
                <a href="#">Blog</a>
              </div>
              <div className="footer-col">
                <h4>Legal</h4>
                <a href="#">Terms of Service</a>
                <a href="#">Privacy Policy</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Crew Lounge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockCities, mockPlaces } from '../data/mockData';
import './HomePage.css';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <div className="nav-logo">✈️ Crew Lounge</div>
          <div className="nav-links">
            <a href="#cities">🏠 Home</a>
            <a href="#cities">✈️ Layovers</a>
            <Link to="/properties">🏠 Properties</Link>
            <a href="#about">💼 Gigs</a>
          </div>
          <Link to="/auth" className="nav-cta">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <h1>
            The Aviation
            <br />
            Professional Platform
          </h1>
          <p className="hero-subtitle">
            Find crew lounges, layover recommendations, and hidden gems tailored
            for aviation professionals worldwide.
          </p>
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search cities or destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </header>

      {/* Cities Section */}
      <section id="cities" className="cities-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Explore</span>
            <h2>Popular Layover Cities</h2>
            <p>Discover the best spots in your favorite layover destinations</p>
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
                  <span className="city-badge">{city.placeCount} places</span>
                </div>
                <div className="city-info">
                  <h3>{city.name}</h3>
                  <p>
                    {city.country} • {city.code}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/cities" className="view-all-btn">
            View All Cities →
          </Link>
        </div>
      </section>

      {/* Featured Listings */}
      <section id="featured" className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <span className="section-label">Crew Favorites</span>
            <h2>Featured Listings</h2>
            <p>Discover top-rated spots recommended by fellow crew members</p>
          </div>
          <div className="featured-grid">
            {featuredPlaces.map((place) => {
              const city = mockCities.find((c) => c.code === place.cityCode);
              return (
                <Link
                  to={`/city/${place.cityCode}`}
                  key={place.id}
                  className="featured-card"
                >
                  <div
                    className="featured-image"
                    style={{ backgroundImage: `url(${city?.imageUrl})` }}
                  >
                    <span className="featured-category">{place.category}</span>
                  </div>
                  <div className="featured-info">
                    <h3>{place.name}</h3>
                    <p className="featured-location">
                      {city?.name}, {city?.country}
                    </p>
                    <p className="featured-description">
                      {place.description.slice(0, 80)}...
                    </p>
                    <div className="featured-meta">
                      <span className="votes">👍 {place.upvotes}</span>
                      <span className="added-by">{place.addedBy}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>
              Designed Specifically for
              <br />
              Aviation Professionals
            </h2>
            <p>
              Our platform gives every flight attendant and pilot access to the
              resources they need for comfortable layovers, income tips, and
              aviation camaraderie.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🗺️</div>
              <h3>Crashpads & Vacation Rentals</h3>
              <p>
                Find short-term stays and crew houses in your base city or
                layover destinations.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍽️</div>
              <h3>Layover Recommendations</h3>
              <p>
                Discover crew-approved restaurants, bars, and attractions in
                every layover city.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✈️</div>
              <h3>Aviation Gigs</h3>
              <p>
                Explore side hustle opportunities and extra income tips tailored
                for flight crew.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Verified Community</h3>
              <p>
                Connect with verified airline employees and build trusted
                connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
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
      <section className="cta-section">
        <div className="section-container">
          <h2>Join Our Aviation Community Today</h2>
          <p>
            Connect with thousands of aviation professionals, find your perfect
            crashpad, discover layover recommendations, and grow your income
            through gigs.
          </p>
          <div className="cta-buttons">
            <button className="cta-primary">✈️ Start Exploring</button>
            <button className="cta-secondary">🔐 Layover Sign In</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>✈️ Crew Lounge</h3>
              <p>
                The premier platform for aviation professionals to find
                crashpads, layover spots, and community resources.
              </p>
            </div>
            <div className="footer-links">
              <h4>Platform</h4>
              <a href="#">Cities</a>
              <a href="#">Listings</a>
              <a href="#">Community</a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Partners</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-links">
              <h4>Legal</h4>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
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

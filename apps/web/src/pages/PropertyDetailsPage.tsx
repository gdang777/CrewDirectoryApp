import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProperties } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './PropertyDetailsPage.css';

const PropertyDetailsPage = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  // Find property from mock data
  const property = mockProperties.find((p) => p.id === propertyId);

  if (!property) {
    return (
      <div className="property-details-page not-found">
        <Navbar />
        <div className="not-found-content">
          <h1>🏠</h1>
          <h2>Property not found</h2>
          <p>This listing may have been removed or doesn't exist.</p>
          <Link to="/properties" className="back-btn">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const handleContactHost = () => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    // Navigate to chat page with property-specific room ID
    navigate(`/chat/property-${propertyId}`);
  };

  return (
    <div className="property-details-page">
      <Navbar />

      {/* Hero Image Section */}
      <section className="property-hero">
        <div
          className="hero-image"
          style={{ backgroundImage: `url(${property.imageUrl})` }}
        >
          <div className="hero-overlay">
            <Link to="/properties" className="back-link">
              ← Back to Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="property-main">
        <div className="property-container">
          {/* Left Column - Details */}
          <div className="property-info">
            {/* Tags */}
            <div className="property-tags">
              <span className="type-badge">
                {property.type === 'crashpad' ? '🛏️' : '🏖️'} {property.type}
              </span>
              <span className="property-type-badge">
                {property.propertyType}
              </span>
              {property.rating > 0 && (
                <span className="rating-badge">
                  ⭐ {property.rating} ({property.reviewCount} reviews)
                </span>
              )}
            </div>

            {/* Title & Location */}
            <h1>{property.title}</h1>
            <p className="location">
              📍 {property.location} • {property.distanceToAirport} to{' '}
              {property.airportCode}
            </p>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>🏠 Amenities</h2>
              <div className="amenities-grid">
                <div className="amenity">
                  <span className="amenity-icon">🛏️</span>
                  <span>
                    {property.beds} Bed{property.beds > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="amenity">
                  <span className="amenity-icon">🚿</span>
                  <span>
                    {property.baths} Bath{property.baths > 1 ? 's' : ''}
                  </span>
                </div>
                {property.hasWifi && (
                  <div className="amenity">
                    <span className="amenity-icon">📶</span>
                    <span>WiFi</span>
                  </div>
                )}
                <div className="amenity">
                  <span className="amenity-icon">✈️</span>
                  <span>Near {property.airportCode}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>📄 About this space</h2>
              <p>
                Welcome to this {property.propertyType.toLowerCase()} in{' '}
                {property.location}! Perfect for airline crew looking for a
                comfortable stay near {property.airportCode}. Located just{' '}
                {property.distanceToAirport} from the airport, this property
                offers everything you need for a restful layover.
              </p>
              <p>
                This{' '}
                {property.type === 'crashpad' ? 'crashpad' : 'vacation rental'}{' '}
                is owned by a fellow aviation professional who understands your
                needs.
              </p>
            </div>

            {/* House Rules */}
            <div className="rules-section">
              <h2>📋 House Rules</h2>
              <ul>
                <li>Check-in: 3:00 PM / Check-out: 11:00 AM</li>
                <li>Quiet hours: 10:00 PM - 8:00 AM</li>
                <li>No smoking indoors</li>
                <li>Pets allowed (ask host)</li>
              </ul>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="booking-sidebar">
            <div className="booking-card">
              <div className="price-section">
                <span className="price-amount">${property.price}</span>
                <span className="price-period">/ night</span>
              </div>

              <div className="host-info">
                <div className="host-avatar">
                  {property.ownerName.charAt(0)}
                </div>
                <div className="host-details">
                  <span className="host-name">{property.ownerName}</span>
                  <span className="host-airline">
                    ✈️ {property.ownerAirline}
                  </span>
                </div>
              </div>

              <button className="contact-btn" onClick={handleContactHost}>
                💬 Contact Host
              </button>

              <button className="book-btn">📅 Check Availability</button>

              <div className="booking-note">
                <span>🔒</span>
                <span>Verified aviation professional</span>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="map-placeholder">
              <div className="map-content">
                <span className="map-icon">🗺️</span>
                <span>Map coming soon</span>
                <span className="airport-distance">
                  {property.distanceToAirport} to {property.airportCode}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="property-container">
          <h2>💬 Reviews ({property.reviewCount})</h2>
          {property.reviewCount === 0 ? (
            <div className="no-reviews">
              <p>No reviews yet. Be the first to stay here!</p>
            </div>
          ) : (
            <div className="reviews-placeholder">
              <p>
                Reviews will be loaded from the database in a future update.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Sign-In Required Prompt */}
      {showSignInPrompt && (
        <div className="sign-in-prompt-overlay">
          <div className="sign-in-prompt-modal">
            <div className="prompt-icon">💬</div>
            <h2>Sign In Required</h2>
            <p>You need to be signed in to contact {property.ownerName}.</p>
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

export default PropertyDetailsPage;

import { Link } from 'react-router-dom';
import { Property } from '../data/mockData';
import './PropertyCard.css';

interface PropertyCardProps {
  property: Property;
  onToggleFavorite: (propertyId: string) => void;
}

const PropertyCard = ({ property, onToggleFavorite }: PropertyCardProps) => {
  return (
    <div className="property-card">
      <div
        className="property-image"
        style={{ backgroundImage: `url(${property.imageUrl})` }}
      >
        <button
          className={`favorite-btn ${property.isFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(property.id)}
        >
          {property.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>

      <div className="property-content">
        <div className="property-tags">
          <span className="property-type-tag">{property.propertyType}</span>
          <span className="owner-tag">
            👤 {property.ownerName} ({property.ownerAirline})
          </span>
          {property.rating > 0 && (
            <span className="rating-tag">
              ⭐ {property.rating} ({property.reviewCount})
            </span>
          )}
        </div>

        <h3 className="property-title">{property.title}</h3>

        <p className="property-location">
          📍 {property.location} • {property.distanceToAirport} to{' '}
          {property.airportCode}
        </p>

        <div className="property-amenities">
          <span>
            🛏️ {property.beds} bed{property.beds > 1 ? 's' : ''}
          </span>
          <span>
            🚿 {property.baths} bath{property.baths > 1 ? 's' : ''}
          </span>
          {property.hasWifi && <span>📶 Wifi</span>}
        </div>

        <div className="property-footer">
          <div className="property-price">
            <span className="price-amount">${property.price}</span>
            <span className="price-period">/ night</span>
          </div>
          <Link to={`/property/${property.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

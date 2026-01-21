import { Link } from 'react-router-dom';
import './GigCard.css';

export interface Gig {
  id: string;
  title: string;
  description: string;
  category: string;
  cityId: string;
  payRate: number;
  payType: string;
  duration?: string;
  requirements?: string;
  imageUrl?: string;
  postedAt: string;
  expiresAt?: string;
  applicationCount: number;
  city?: {
    id: string;
    name: string;
    code: string;
  };
  postedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    airline?: string;
  };
}

interface GigCardProps {
  gig: Gig;
}

const GigCard = ({ gig }: GigCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hospitality':
        return '🍽️';
      case 'retail':
        return '🛍️';
      case 'events':
        return '🎉';
      case 'services':
        return '🔧';
      default:
        return '💼';
    }
  };

  const formatPayType = (type: string) => {
    switch (type) {
      case 'hourly':
        return '/hr';
      case 'daily':
        return '/day';
      case 'fixed':
        return 'fixed';
      default:
        return '';
    }
  };

  return (
    <div className="gig-card">
      <div className="gig-card-header">
        <div className="gig-category-badge">
          <span className="category-icon">{getCategoryIcon(gig.category)}</span>
          <span className="category-text">{gig.category}</span>
        </div>
        {gig.city && <div className="gig-city-tag">📍 {gig.city.name}</div>}
      </div>

      <h3 className="gig-title">{gig.title}</h3>

      <p className="gig-description">
        {gig.description.length > 120
          ? `${gig.description.substring(0, 120)}...`
          : gig.description}
      </p>

      <div className="gig-meta">
        {gig.duration && (
          <span className="gig-duration">⏱️ {gig.duration}</span>
        )}
        <span className="gig-applications">
          👥 {gig.applicationCount}{' '}
          {gig.applicationCount === 1 ? 'applicant' : 'applicants'}
        </span>
      </div>

      <div className="gig-footer">
        <div className="gig-pay">
          <span className="pay-amount">${gig.payRate}</span>
          <span className="pay-type">{formatPayType(gig.payType)}</span>
        </div>
        <Link to={`/gigs/${gig.id}`} className="view-gig-btn">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default GigCard;

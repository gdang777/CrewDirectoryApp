import { Link } from 'react-router-dom';
import { Place } from '../data/mockData';
import './PlaceCard.css';

interface PlaceCardProps {
  place: Place;
  onVote: (placeId: string, value: 1 | -1) => void;
}

const categoryIcons: Record<string, string> = {
  eat: '🍽️',
  drink: '🍸',
  shop: '🛍️',
  visit: '📍',
};

const PlaceCard = ({ place, onVote }: PlaceCardProps) => {
  const score = place.upvotes - place.downvotes;

  return (
    <Link to={`/place/${place.id}`} className="place-card-link">
      <div className="place-card">
        <div
          className="place-image"
          style={{ backgroundImage: `url(${place.imageUrl})` }}
        >
          <span className="category-badge">
            {categoryIcons[place.category]} {place.category}
          </span>
          <div className="rating-badge">⭐ {place.rating.toFixed(1)}</div>
        </div>

        <div className="place-content">
          <h3 className="place-name">{place.name}</h3>
          <p className="place-description">{place.description}</p>

          {place.tips && (
            <p className="place-tips">
              💡 <em>{place.tips}</em>
            </p>
          )}

          <div className="place-footer">
            <span className="added-by">Added by {place.addedBy}</span>
            <div className="vote-buttons" onClick={(e) => e.preventDefault()}>
              <button
                className="vote-btn upvote"
                onClick={(e) => {
                  e.preventDefault();
                  onVote(place.id, 1);
                }}
              >
                ▲
              </button>
              <span
                className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}
              >
                {score}
              </span>
              <button
                className="vote-btn downvote"
                onClick={(e) => {
                  e.preventDefault();
                  onVote(place.id, -1);
                }}
              >
                ▼
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PlaceCard;

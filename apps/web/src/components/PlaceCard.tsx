import { Place } from '../data/mockData';
import './PlaceCard.css';

interface PlaceCardProps {
  place: Place;
  onVote: (placeId: string, value: 1 | -1) => void;
}

const PlaceCard = ({ place, onVote }: PlaceCardProps) => {
  const score = place.upvotes - place.downvotes;

  return (
    <div className="place-card">
      <div className="place-content">
        <h3>{place.name}</h3>
        <p className="place-description">{place.description}</p>
        {place.tips && (
          <p className="place-tips">
            💡 <em>{place.tips}</em>
          </p>
        )}
        <div className="place-meta">
          <span className="added-by">Added by {place.addedBy}</span>
        </div>
      </div>
      <div className="place-voting">
        <button className="vote-btn upvote" onClick={() => onVote(place.id, 1)}>
          ▲
        </button>
        <span
          className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}
        >
          {score}
        </span>
        <button
          className="vote-btn downvote"
          onClick={() => onVote(place.id, -1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
};

export default PlaceCard;

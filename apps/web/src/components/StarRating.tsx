import React from 'react';
import './StarRating.css';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
  showValue?: boolean;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRate,
  showValue = false,
  reviewCount,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (value: number) => {
    if (interactive && onRate) {
      onRate(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  const renderStar = (index: number) => {
    const value = index + 1;
    const fillPercentage = Math.min(
      100,
      Math.max(0, (displayRating - index) * 100)
    );
    const isFilled = fillPercentage >= 50;
    const isPartial = fillPercentage > 0 && fillPercentage < 100;

    return (
      <span
        key={index}
        className={`star ${size} ${interactive ? 'interactive' : ''} ${isFilled ? 'filled' : ''}`}
        onClick={() => handleClick(value)}
        onMouseEnter={() => handleMouseEnter(value)}
        onMouseLeave={handleMouseLeave}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => e.key === 'Enter' && handleClick(value)}
      >
        <span className="star-empty">★</span>
        <span
          className="star-filled"
          style={{
            width: isPartial ? `${fillPercentage}%` : isFilled ? '100%' : '0%',
          }}
        >
          ★
        </span>
      </span>
    );
  };

  return (
    <div className={`star-rating ${size}`}>
      <div className="stars">
        {Array.from({ length: maxRating }, (_, i) => renderStar(i))}
      </div>
      {showValue && (
        <span className="rating-value">
          {rating.toFixed(1)}
          {reviewCount !== undefined && (
            <span className="review-count">({reviewCount})</span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRating;

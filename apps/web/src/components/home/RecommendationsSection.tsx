import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Place, apiService, InteractionType } from '../../services/api';
import './RecommendationsSection.css';

interface Props {
  cityCode: string;
}

const RecommendationsSection: React.FC<Props> = ({ cityCode }) => {
  const [recommendations, setRecommendations] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await apiService.getRecommendations(cityCode);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to load recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [cityCode]);

  const handlePlaceClick = (place: Place) => {
    // Track interaction silently
    apiService.trackInteraction(place.id, InteractionType.CLICK);
    // Navigate to details
    navigate(`/city/${cityCode}/place/${place.id}`);
  };

  if (loading) return null; // Or a skeleton
  if (recommendations.length === 0) return null;

  return (
    <div className="recommendations-section">
      <div className="section-header">
        <h2>
          <span className="icon">🎯</span> Recommended for You
        </h2>
        <p>Curated based on your interests</p>
      </div>

      <div className="recommendations-scroll">
        {recommendations.map((place) => (
          <div
            key={place.id}
            className="recommendation-card"
            onClick={() => handlePlaceClick(place)}
          >
            <div
              className="card-image"
              style={{
                backgroundImage: `url(${place.imageUrl || '/placeholder-place.jpg'})`,
              }}
            >
              <div className="card-badge">{place.category}</div>
            </div>
            <div className="card-content">
              <h3>{place.name}</h3>
              <div className="card-rating">
                <span className="star">★</span>
                <span>{place.rating?.toFixed(1) || 'New'}</span>
                <span className="count">({place.ratingCount})</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsSection;

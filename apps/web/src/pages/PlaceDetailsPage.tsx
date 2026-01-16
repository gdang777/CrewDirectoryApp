import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockPlaces, mockCities, PlaceComment } from '../data/mockData';
import './PlaceDetailsPage.css';

const categoryIcons: Record<string, string> = {
  eat: '🍽️',
  drink: '🍸',
  shop: '🛍️',
  visit: '📍',
};

const PlaceDetailsPage = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const place = mockPlaces.find((p) => p.id === placeId);
  const city = place ? mockCities.find((c) => c.code === place.cityCode) : null;

  const [comments, setComments] = useState<PlaceComment[]>(
    place?.comments || []
  );
  const [newComment, setNewComment] = useState('');

  if (!place || !city) {
    return (
      <div className="place-details-page not-found">
        <h1>Place not found</h1>
        <Link to="/">← Back to Cities</Link>
      </div>
    );
  }

  const score = place.upvotes - place.downvotes;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment: PlaceComment = {
      id: String(Date.now()),
      userId: 'current-user',
      userName: 'You',
      userAirline: 'Crew Member',
      text: newComment.trim(),
      createdAt: new Date(),
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  return (
    <div className="place-details-page">
      {/* Navigation */}
      <nav className="details-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ✈️ Crew Lounge
          </Link>
          <div className="nav-links">
            <Link to="/">🏠 Home</Link>
            <Link to={`/city/${city.code}`}>✈️ {city.name}</Link>
            <Link to="/properties">🏠 Properties</Link>
          </div>
          <Link to="/auth" className="nav-cta">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Image */}
      <header
        className="place-hero"
        style={{ backgroundImage: `url(${place.imageUrl})` }}
      >
        <div className="hero-overlay">
          <Link to={`/city/${city.code}`} className="back-link">
            ← Back to {city.name}
          </Link>
          <div className="place-header-content">
            <span className="category-badge">
              {categoryIcons[place.category]} {place.category}
            </span>
            <h1>{place.name}</h1>
            <p className="location">
              📍 {city.name}, {city.country}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="place-main">
        <div className="content-container">
          {/* Left Column - Details */}
          <section className="place-details">
            <div className="stats-row">
              <div className="stat">
                <span className="stat-value">⭐ {place.rating.toFixed(1)}</span>
                <span className="stat-label">{place.reviewCount} reviews</span>
              </div>
              <div className="stat">
                <span className="stat-value">👍 {score}</span>
                <span className="stat-label">crew votes</span>
              </div>
              <div className="stat">
                <span className="stat-value">✈️</span>
                <span className="stat-label">{place.addedBy}</span>
              </div>
            </div>

            <div className="description-section">
              <h2>About this place</h2>
              <p>{place.description}</p>
            </div>

            {place.tips && (
              <div className="tips-section">
                <h2>💡 Crew Tips</h2>
                <p>{place.tips}</p>
              </div>
            )}

            <div className="actions-row">
              <button className="action-btn primary">📍 Get Directions</button>
              <button className="action-btn">🔗 Share</button>
              <button className="action-btn">❤️ Save</button>
            </div>
          </section>

          {/* Right Column - Comments */}
          <section className="comments-section">
            <h2>💬 Comments ({comments.length})</h2>

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                placeholder="Share your experience with fellow crew..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
              />
              <button type="submit" disabled={!newComment.trim()}>
                Post Comment
              </button>
            </form>

            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <p>No comments yet. Be the first to share your experience!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="user-avatar">
                        {comment.userName.charAt(0)}
                      </div>
                      <div className="user-info">
                        <span className="user-name">{comment.userName}</span>
                        <span className="user-airline">
                          {comment.userAirline}
                        </span>
                      </div>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="comment-text">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PlaceDetailsPage;

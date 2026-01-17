import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import apiService, { Place, PlaceComment } from '../services/api';
import StarRating from '../components/StarRating';
import './PlaceDetailsPage.css';

const categoryIcons: Record<string, string> = {
  eat: '🍽️',
  drink: '🍸',
  shop: '🛍️',
  visit: '📍',
};

const categoryColors: Record<string, string> = {
  eat: '#ff6b6b',
  drink: '#9775fa',
  shop: '#20c997',
  visit: '#339af0',
};

const PlaceDetailsPage = () => {
  const { placeId } = useParams<{ placeId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { joinDMRoom } = useChat();

  // ... (inside component)

  {
    place.createdBy && (
      <div className="stat">
        <span className="stat-value">✈️</span>
        <div className="author-info">
          <span className="stat-label">{place.createdBy.name}</span>
          {isAuthenticated && user?.id !== place.createdBy.id && (
            <button
              className="contact-host-btn"
              onClick={() => joinDMRoom(place.createdBy.id)}
              style={{
                marginLeft: '0.5rem',
                padding: '2px 8px',
                fontSize: '0.8em',
                borderRadius: '12px',
                border: 'none',
                background: '#7928CA',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Contact
            </button>
          )}
        </div>
      </div>
    );
  }

  const [place, setPlace] = useState<Place | null>(null);
  const [comments, setComments] = useState<PlaceComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Comment form
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  // Voting
  const [userVote, setUserVote] = useState(0);
  const [upvotes, setUpvotes] = useState(0);
  const [downvotes, setDownvotes] = useState(0);

  useEffect(() => {
    loadPlace();
  }, [placeId]);

  const loadPlace = async () => {
    if (!placeId) return;
    try {
      setLoading(true);
      const placeData = await apiService.getPlace(placeId);
      setPlace(placeData);
      setComments(placeData.comments || []);
      setUpvotes(placeData.upvotes);
      setDownvotes(placeData.downvotes);

      // Get user's vote if authenticated
      if (isAuthenticated) {
        try {
          const vote = await apiService.getPlaceVote(placeId);
          setUserVote(vote.value);
        } catch {
          // User hasn't voted
        }
      }
    } catch (err) {
      setError('Place not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !placeId || !isAuthenticated) return;

    setSubmitting(true);
    try {
      const comment = await apiService.addPlaceComment(placeId, {
        text: newComment.trim(),
        rating: newRating,
      });
      setComments([comment, ...comments]);
      setNewComment('');
      setNewRating(5);

      // Reload place to get updated rating
      const updatedPlace = await apiService.getPlace(placeId);
      setPlace(updatedPlace);
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (value: 1 | -1) => {
    if (!placeId || !isAuthenticated) {
      navigate('/auth');
      return;
    }

    try {
      const result = await apiService.votePlace(placeId, value);
      setUpvotes(result.upvotes);
      setDownvotes(result.downvotes);
      setUserVote(result.userVote);
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (loading) {
    return (
      <div className="place-details-page loading-state">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="place-details-page not-found">
        <div className="not-found-content">
          <h1>🔍</h1>
          <h2>Place not found</h2>
          <p>This place may have been removed or doesn't exist.</p>
          <Link to="/" className="back-home-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const score = upvotes - downvotes;
  const categoryColor = categoryColors[place.category] || '#00d9ff';

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
            {place.city && (
              <Link to={`/city/${place.city.code}`}>✈️ {place.city.name}</Link>
            )}
          </div>
          {isAuthenticated ? (
            <Link to="/dashboard" className="nav-cta">
              My Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="nav-cta">
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Image */}
      <header
        className="place-hero"
        style={{
          backgroundImage: place.imageUrl
            ? `url(${place.imageUrl})`
            : 'linear-gradient(135deg, #1a1a2e, #16213e)',
        }}
      >
        <div className="hero-overlay">
          {place.city && (
            <Link to={`/city/${place.city.code}`} className="back-link">
              ← Back to {place.city.name}
            </Link>
          )}
          <div className="place-header-content">
            <span
              className="category-badge"
              style={{ background: `${categoryColor}22`, color: categoryColor }}
            >
              {categoryIcons[place.category]} {place.category}
            </span>
            <h1>{place.name}</h1>
            {place.city && (
              <p className="location">
                📍 {place.city.name}, {place.city.country}
              </p>
            )}

            {/* Star Rating - Prominent */}
            <div className="hero-rating">
              <StarRating
                rating={Number(place.rating) || 0}
                size="lg"
                showValue
                reviewCount={place.ratingCount}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="place-main">
        <div className="content-container">
          {/* Left Column - Details */}
          <section className="place-details">
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat voting-stat">
                <div className="vote-buttons">
                  <button
                    className={`vote-btn upvote ${userVote === 1 ? 'active' : ''}`}
                    onClick={() => handleVote(1)}
                    title="Upvote"
                  >
                    👍
                  </button>
                  <span
                    className={`vote-score ${score > 0 ? 'positive' : score < 0 ? 'negative' : ''}`}
                  >
                    {score > 0 ? '+' : ''}
                    {score}
                  </span>
                  <button
                    className={`vote-btn downvote ${userVote === -1 ? 'active' : ''}`}
                    onClick={() => handleVote(-1)}
                    title="Downvote"
                  >
                    👎
                  </button>
                </div>
                <span className="stat-label">crew votes</span>
              </div>
              <div className="stat">
                <span className="stat-value">
                  ⭐ {Number(place.rating).toFixed(1)}
                </span>
                <span className="stat-label">{place.ratingCount} reviews</span>
              </div>
              {place.createdBy && (
                <div className="stat">
                  <span className="stat-value">✈️</span>
                  <div
                    className="author-info"
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <span className="stat-label">{place.createdBy.name}</span>
                    {isAuthenticated && user?.id !== place.createdBy.id && (
                      <button
                        className="contact-host-btn"
                        onClick={() => joinDMRoom(place.createdBy.id)}
                        style={{
                          marginTop: '4px',
                          padding: '2px 8px',
                          fontSize: '0.7em',
                          borderRadius: '12px',
                          border: 'none',
                          background: '#7928CA',
                          color: 'white',
                          cursor: 'pointer',
                          width: 'fit-content',
                        }}
                      >
                        Contact
                      </button>
                    )}
                  </div>
                </div>
              )}
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
            <h2>💬 Reviews ({comments.length})</h2>

            {isAuthenticated ? (
              <form onSubmit={handleAddComment} className="comment-form">
                <div className="rating-input">
                  <label>Your Rating</label>
                  <StarRating
                    rating={newRating}
                    interactive
                    onRate={setNewRating}
                    size="md"
                  />
                </div>
                <textarea
                  placeholder="Share your experience with fellow crew..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                >
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="login-prompt">
                <p>Sign in to leave a review</p>
                <Link to="/auth" className="login-btn">
                  Sign In
                </Link>
              </div>
            )}

            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  <p>No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <div className="user-avatar">
                        {comment.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div className="user-info">
                        <span className="user-name">
                          {comment.user?.name || 'Anonymous'}
                          {comment.user?.airlineId &&
                            comment.user.airlineId !== 'OT' && (
                              <span className="user-airline-tag">
                                {' '}
                                [{comment.user.airlineId}]
                              </span>
                            )}
                        </span>
                        <StarRating rating={comment.rating} size="sm" />
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

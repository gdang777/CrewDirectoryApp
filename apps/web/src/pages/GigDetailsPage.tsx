import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import { Gig } from '../components/GigCard';
import ApplyGigModal from '../components/ApplyGigModal';
import LoadingSpinner from '../components/LoadingSpinner';
import './GigDetailsPage.css';

const GigDetailsPage = () => {
  const { gigId } = useParams<{ gigId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    if (gigId) {
      loadGig();
    }
  }, [gigId]);

  const loadGig = async () => {
    try {
      setLoading(true);
      const data = await apiService.getGig(gigId!);
      setGig(data);
    } catch (error) {
      console.error('Failed to load gig:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    setShowApplyModal(true);
  };

  const handleContactPoster = () => {
    if (!isAuthenticated) {
      setShowSignInPrompt(true);
      return;
    }
    if (!gig) return;
    navigate(`/chat/gig-${gig.id}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!gig) {
    return <div className="error-page">Gig not found</div>;
  }

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

  return (
    <div className="gig-details-page">
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ✈️ Crew Lounge
          </Link>
        </div>
      </nav>

      <div className="gig-details-wrapper">
        <div className="gig-details-container">
          {/* Back Button */}
          <Link to="/gigs" className="back-link">
            ← Back to gigs
          </Link>

          {/* Status & Category Badges */}
          <div className="badges-row">
            <span className="status-badge active">● Active</span>
            <span className="category-badge-detail">
              {getCategoryIcon(gig.category)} {gig.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="gig-title-main">{gig.title}</h1>

          {/* Metadata Row */}
          <div className="metadata-row">
            {gig.city && (
              <div className="meta-item">
                <span className="meta-icon">📍</span>
                <span>{gig.city.name}</span>
              </div>
            )}
            {gig.duration && (
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span>{gig.duration}</span>
              </div>
            )}
            <div className="meta-item">
              <span className="meta-icon">💰</span>
              <span>
                ${gig.payRate}/
                {gig.payType === 'hourly'
                  ? 'hr'
                  : gig.payType === 'daily'
                    ? 'day'
                    : 'fixed'}
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="content-grid">
            {/* Left Column */}
            <div className="left-column">
              {/* Posted By */}
              {gig.postedBy && (
                <div className="posted-by-card">
                  <div className="avatar">
                    {gig.postedBy.firstName?.charAt(0)}
                    {gig.postedBy.lastName?.charAt(0)}
                  </div>
                  <div className="poster-info">
                    <div className="poster-label">Posted by</div>
                    <div className="poster-name">
                      {gig.postedBy.firstName} {gig.postedBy.lastName}
                      {gig.postedBy.airline && (
                        <span className="airline">
                          {' '}
                          ({gig.postedBy.airline})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="section-card">
                <h2 className="section-title">Description</h2>
                <p className="section-text">{gig.description}</p>
              </div>

              {/* Requirements */}
              {gig.requirements && (
                <div className="section-card">
                  <h2 className="section-title">Required Skills</h2>
                  <p className="section-text">{gig.requirements}</p>
                </div>
              )}

              {/* Gig Details */}
              <div className="section-card">
                <h2 className="section-title">Gig Details</h2>
                <div className="details-grid">
                  {gig.city && (
                    <div className="detail-item">
                      <div className="detail-icon">📍</div>
                      <div>
                        <div className="detail-label">Location</div>
                        <div className="detail-value">{gig.city.name}</div>
                      </div>
                    </div>
                  )}
                  {gig.duration && (
                    <div className="detail-item">
                      <div className="detail-icon">⏱️</div>
                      <div>
                        <div className="detail-label">Duration</div>
                        <div className="detail-value">{gig.duration}</div>
                      </div>
                    </div>
                  )}
                  <div className="detail-item">
                    <div className="detail-icon">💰</div>
                    <div>
                      <div className="detail-label">Payment</div>
                      <div className="detail-value">
                        ${gig.payRate}/
                        {gig.payType === 'hourly'
                          ? 'hr'
                          : gig.payType === 'daily'
                            ? 'day'
                            : 'fixed'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="right-sidebar">
              <div className="sidebar-card">
                <div className="price-display">
                  <span className="price-amount">${gig.payRate}</span>
                  <span className="price-unit">
                    /{gig.payType === 'hourly' ? 'hr' : 'day'}
                  </span>
                </div>

                <button
                  className="apply-btn-primary"
                  onClick={handleApplyClick}
                  disabled={hasApplied}
                >
                  <span className="btn-icon">💼</span>
                  {hasApplied ? 'Applied' : 'Apply for this Gig'}
                </button>

                <button
                  className="contact-btn-secondary"
                  onClick={handleContactPoster}
                >
                  <span className="btn-icon">💬</span>
                  Contact Poster
                </button>

                <div className="quick-info">
                  <h3 className="quick-info-title">Quick Info</h3>
                  <div className="quick-info-item">
                    <span className="info-icon">👥</span>
                    <span>Open to all aviation professionals</span>
                  </div>
                  <div className="quick-info-item">
                    <span className="info-icon">📊</span>
                    <span>
                      {gig.applicationCount}{' '}
                      {gig.applicationCount === 1 ? 'applicant' : 'applicants'}
                    </span>
                  </div>
                  <div className="quick-info-item">
                    <span className="info-icon">✓</span>
                    <span>Posted by verified member</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyGigModal
          gigId={gig.id}
          gigTitle={gig.title}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setHasApplied(true);
          }}
        />
      )}

      {showSignInPrompt && (
        <div className="sign-in-prompt-overlay">
          <div className="sign-in-prompt-modal">
            <div className="prompt-icon">🔐</div>
            <h2>Sign In Required</h2>
            <p>You need to be signed in to apply to this gig.</p>
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

export default GigDetailsPage;

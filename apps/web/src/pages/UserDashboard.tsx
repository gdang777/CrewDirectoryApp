import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService, { Playbook, SavedListing, UserStats } from '../services/api';
import './Dashboard.css';

const UserDashboard = () => {
  const { user, logout, isAdmin, isModerator } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'listings' | 'saved'>('listings');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [listings, setListings] = useState<Playbook[]>([]);
  const [savedListings, setSavedListings] = useState<SavedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, listingsData, savedData] = await Promise.all([
        apiService.getUserStats(),
        apiService.getUserListings(),
        apiService.getSavedListings(),
      ]);
      setStats(statsData);
      setListings(listingsData);
      setSavedListings(savedData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (playbookId: string) => {
    try {
      await apiService.unsaveListing(playbookId);
      setSavedListings((prev) =>
        prev.filter((s) => s.playbookId !== playbookId)
      );
    } catch (error) {
      console.error('Failed to unsave listing:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <h1>👤 My Dashboard</h1>
        <div className="dashboard-header-actions">
          <Link to="/" className="header-btn">
            🏠 Home
          </Link>
          {isAdmin && (
            <Link to="/admin" className="header-btn">
              ⚙️ Admin
            </Link>
          )}
          {isModerator && !isAdmin && (
            <Link to="/moderator" className="header-btn">
              🛡️ Moderation
            </Link>
          )}
          <Link to="/profile" className="header-btn primary">
            Edit Profile
          </Link>
          <button onClick={handleLogout} className="header-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Profile Card */}
        <section className="dashboard-section">
          <div className="profile-card">
            <div className="profile-avatar">
              {getInitials(user?.name || 'U')}
            </div>
            <div className="profile-info">
              <h2 className="profile-name">{user?.name}</h2>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-meta">
                {user?.role && (
                  <span className="profile-meta-item">
                    <span className={`badge ${user.role}`}>{user.role}</span>
                  </span>
                )}
                {user?.verifiedBadge && (
                  <span className="profile-meta-item">
                    <span className="badge verified">✓ Verified</span>
                  </span>
                )}
                {user?.airlineId && (
                  <span className="profile-meta-item">✈️ {user.airlineId}</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.karmaScore || 0}</div>
              <div className="stat-label">Karma Score</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.listingsCount || 0}</div>
              <div className="stat-label">My Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.savedCount || 0}</div>
              <div className="stat-label">Saved Places</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings
          </button>
          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            Saved Places
          </button>
        </div>

        {/* My Listings */}
        {activeTab === 'listings' && (
          <section className="dashboard-section">
            <h2>📍 My Listings</h2>
            {listings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>You haven't created any listings yet.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <div key={listing.id} className="listing-card">
                    <h3 className="listing-title">{listing.title}</h3>
                    <p className="listing-meta">
                      {listing.description?.slice(0, 100)}...
                    </p>
                    <div className="listing-meta">
                      👍 {listing.upvotes} · 👎 {listing.downvotes}
                    </div>
                    <div className="listing-actions">
                      <Link
                        to={`/playbook/${listing.id}`}
                        className="listing-btn view"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Saved Places */}
        {activeTab === 'saved' && (
          <section className="dashboard-section">
            <h2>❤️ Saved Places</h2>
            {savedListings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💝</div>
                <p>You haven't saved any places yet.</p>
              </div>
            ) : (
              <div className="listings-grid">
                {savedListings.map((saved) => (
                  <div key={saved.id} className="listing-card">
                    <h3 className="listing-title">
                      {saved.playbook?.title || 'Unknown'}
                    </h3>
                    <p className="listing-meta">
                      {saved.playbook?.city?.name &&
                        `📍 ${saved.playbook.city.name}`}
                    </p>
                    <div className="listing-actions">
                      <Link
                        to={`/playbook/${saved.playbookId}`}
                        className="listing-btn view"
                      >
                        View
                      </Link>
                      <button
                        className="listing-btn unsave"
                        onClick={() => handleUnsave(saved.playbookId)}
                      >
                        Unsave
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;

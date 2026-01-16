import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';
import './Dashboard.css';

const airlines = [
  'Air Canada',
  'WestJet',
  'Porter Airlines',
  'American Airlines',
  'Delta Air Lines',
  'United Airlines',
  'Southwest Airlines',
  'JetBlue Airways',
  'Alaska Airlines',
  'Spirit Airlines',
  'Frontier Airlines',
  'Other',
];

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    airlineId: user?.airlineId || '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await apiService.updateProfile(formData);
      updateUser(updatedUser);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
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

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <h1>✏️ Edit Profile</h1>
        <div className="dashboard-header-actions">
          <Link to="/dashboard" className="header-btn">
            ← Back to Dashboard
          </Link>
          <button onClick={handleLogout} className="header-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section" style={{ maxWidth: '600px' }}>
          {/* Avatar and current info */}
          <div className="profile-card" style={{ marginBottom: '2rem' }}>
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
                <span className="profile-meta-item">
                  ⭐ {user?.karmaScore || 0} Karma
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div
              className="auth-message auth-error"
              style={{ marginBottom: '1rem' }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="auth-message auth-success"
              style={{ marginBottom: '1rem' }}
            >
              Profile updated successfully!
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div
              className="form-row"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              <div className="form-group">
                <label
                  style={{
                    color: '#a0a0a0',
                    fontSize: '0.875rem',
                    marginBottom: '0.35rem',
                    display: 'block',
                  }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="John"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>
              <div className="form-group">
                <label
                  style={{
                    color: '#a0a0a0',
                    fontSize: '0.875rem',
                    marginBottom: '0.35rem',
                    display: 'block',
                  }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '1rem',
                  }}
                />
              </div>
            </div>

            <div className="form-group">
              <label
                style={{
                  color: '#a0a0a0',
                  fontSize: '0.875rem',
                  marginBottom: '0.35rem',
                  display: 'block',
                }}
              >
                Airline
              </label>
              <select
                value={formData.airlineId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    airlineId: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  cursor: 'pointer',
                }}
              >
                <option value="">Select your airline</option>
                {airlines.map((airline) => (
                  <option
                    key={airline}
                    value={airline}
                    style={{ background: '#1a1a2e' }}
                  >
                    {airline}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="header-btn primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                marginTop: '1rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default ProfilePage;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiService, {
  AdminStats,
  User,
  Playbook,
  UserRole,
} from '../services/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings'>(
    'overview'
  );
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [listings, setListings] = useState<Playbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, recentData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getRecentUsers(),
      ]);
      setStats(statsData);
      setRecentUsers(recentData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (page: number) => {
    try {
      const result = await apiService.getAdminUsers(page, 20);
      setAllUsers(result.data);
      setUsersTotalPages(result.totalPages);
      setUsersPage(page);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadListings = async () => {
    try {
      const result = await apiService.getAdminListings(1, 50);
      setListings(result.data);
    } catch (error) {
      console.error('Failed to load listings:', error);
    }
  };

  const handleTabChange = (tab: 'overview' | 'users' | 'listings') => {
    setActiveTab(tab);
    if (tab === 'users' && allUsers.length === 0) {
      loadUsers(1);
    }
    if (tab === 'listings' && listings.length === 0) {
      loadListings();
    }
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await apiService.updateUserRole(userId, newRole);
      // Update local state
      setAllUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setRecentUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="loading-container">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Header */}
      <header className="dashboard-header">
        <h1>⚙️ Admin Dashboard</h1>
        <div className="dashboard-header-actions">
          <Link to="/" className="header-btn">
            🏠 Home
          </Link>
          <Link to="/dashboard" className="header-btn">
            👤 My Dashboard
          </Link>
          <button onClick={handleLogout} className="header-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.totalUsers || 0}</div>
              <div className="stat-label">Total Users</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.newUsersThisWeek || 0}</div>
              <div className="stat-label">New This Week</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📍</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.totalListings || 0}</div>
              <div className="stat-label">Total Listings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{stats?.pendingEdits || 0}</div>
              <div className="stat-label">Pending Edits</div>
            </div>
          </div>
        </div>

        {/* Role Breakdown */}
        {stats?.usersByRole && (
          <section className="dashboard-section">
            <h2>📊 Users by Role</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.usersByRole.users}</div>
                  <div className="stat-label">Regular Users</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🛡️</div>
                <div className="stat-info">
                  <div className="stat-value">
                    {stats.usersByRole.moderators}
                  </div>
                  <div className="stat-label">Moderators</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚙️</div>
                <div className="stat-info">
                  <div className="stat-value">{stats.usersByRole.admins}</div>
                  <div className="stat-label">Admins</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tabs */}
        <div className="tab-nav">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTabChange('overview')}
          >
            Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTabChange('users')}
          >
            All Users
          </button>
          <button
            className={`tab-btn ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => handleTabChange('listings')}
          >
            All Listings
          </button>
        </div>

        {/* Overview - Recent Users */}
        {activeTab === 'overview' && (
          <section className="dashboard-section">
            <h2>🆕 Recent Signups (Last 7 Days)</h2>
            {recentUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">👻</div>
                <p>No new signups this week.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role}`}>{u.role}</span>
                      </td>
                      <td>
                        {u.verifiedBadge ? (
                          <span className="badge verified">✓</span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td>{u.createdAt ? formatDate(u.createdAt) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* All Users */}
        {activeTab === 'users' && (
          <section className="dashboard-section">
            <h2>👥 All Users</h2>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Karma</th>
                  <th>Verified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        className="role-select"
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value as UserRole)
                        }
                        disabled={u.id === user?.id}
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{u.karmaScore}</td>
                    <td>
                      {u.verifiedBadge ? (
                        <span className="badge verified">✓</span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      {u.id === user?.id ? (
                        <span style={{ color: '#888' }}>You</span>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            {usersTotalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginTop: '1rem',
                  justifyContent: 'center',
                }}
              >
                <button
                  className="header-btn"
                  onClick={() => loadUsers(usersPage - 1)}
                  disabled={usersPage <= 1}
                >
                  Previous
                </button>
                <span style={{ padding: '0.5rem 1rem', color: '#888' }}>
                  Page {usersPage} of {usersTotalPages}
                </span>
                <button
                  className="header-btn"
                  onClick={() => loadUsers(usersPage + 1)}
                  disabled={usersPage >= usersTotalPages}
                >
                  Next
                </button>
              </div>
            )}
          </section>
        )}

        {/* All Listings */}
        {activeTab === 'listings' && (
          <section className="dashboard-section">
            <h2>📍 All Listings</h2>
            {listings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>No listings yet.</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Tier</th>
                    <th>Votes</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <Link
                          to={`/playbook/${listing.id}`}
                          style={{ color: '#00d9ff' }}
                        >
                          {listing.title}
                        </Link>
                      </td>
                      <td>{listing.description?.slice(0, 50)}...</td>
                      <td>
                        <span className={`badge ${listing.tier}`}>
                          {listing.tier}
                        </span>
                      </td>
                      <td>
                        👍 {listing.upvotes} / 👎 {listing.downvotes}
                      </td>
                      <td>{formatDate(listing.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;

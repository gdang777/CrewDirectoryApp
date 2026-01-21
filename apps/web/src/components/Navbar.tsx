import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = ({ transparent = false }: { transparent?: boolean }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`main-nav ${transparent ? 'transparent' : ''}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          ✈️ Crew Lounge
        </Link>
        <div className="nav-links">
          <Link to="/">🏠 Home</Link>
          <Link to="/cities">✈️ Layovers</Link>
          <Link to="/properties">🏠 Properties</Link>
          <Link to="/gigs">💼 Gigs</Link>
        </div>
        <div className="nav-auth">
          {user ? (
            <div className="auth-menu">
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/profile" className="nav-link">
                Profile
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="nav-cta">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

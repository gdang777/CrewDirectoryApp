import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPage.css';

const airlines = [
  'Air Canada',
  'WestJet',
  'Porter Airlines',
  'Swoop',
  'Flair Airlines',
  'Air Transat',
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

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    airline: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      });
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signup({
        email: signupData.email,
        password: signupData.password,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        airline: signupData.airline || undefined,
      });
      setSuccess('Account created! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Navigation */}
      <nav className="auth-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            Crew Lounge
          </Link>
          <div className="nav-links">
            <Link to="/">🏠 Home</Link>
            <Link to="/">✈️ Layovers</Link>
            <Link to="/properties">🏠 Properties</Link>
            <a href="#">💼 Gigs</a>
          </div>
          <Link to="/auth" className="nav-cta">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Auth Card */}
      <main className="auth-main">
        <div className="auth-card">
          <h1>Welcome to Crew Lounge</h1>
          <p className="auth-subtitle">
            Sign in to your account or create a new one
          </p>

          {/* Error/Success Messages */}
          {error && <div className="auth-message auth-error">{error}</div>}
          {success && (
            <div className="auth-message auth-success">{success}</div>
          )}

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setError(null);
                setSuccess(null);
              }}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('signup');
                setError(null);
                setSuccess(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="youremail@example.com"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <p className="auth-terms">
                By continuing, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>.
              </p>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    placeholder="John"
                    value={signupData.firstName}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    placeholder="Doe"
                    value={signupData.lastName}
                    onChange={(e) =>
                      setSignupData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="youremail@example.com"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                  minLength={6}
                />
                <small className="form-hint">Minimum 6 characters</small>
              </div>

              <div className="form-group">
                <label>Airline (optional)</label>
                <select
                  value={signupData.airline}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      airline: e.target.value,
                    }))
                  }
                >
                  <option value="">Select your airline</option>
                  {airlines.map((airline) => (
                    <option key={airline} value={airline}>
                      {airline}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>

              <p className="auth-terms">
                By continuing, you agree to our <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>.
              </p>
            </form>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>✈️ Crew Lounge</h3>
              <p>
                The premier platform for aviation professionals to find
                crashpads, vacation rentals, and gig opportunities throughout
                North America.
              </p>
              <div className="social-links">
                <a href="#">📷</a>
                <a href="#">🐦</a>
                <a href="#">💼</a>
                <a href="#">📘</a>
              </div>
            </div>
            <div className="footer-links">
              <h4>COMPANY</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-links">
              <h4>SUPPORT</h4>
              <a href="#">Help Center</a>
              <a href="#">Safety Center</a>
              <a href="#">Community Guidelines</a>
              <a href="#">Improvement Suggestions</a>
            </div>
            <div className="footer-links">
              <h4>LEGAL</h4>
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Crew Lounge. All rights reserved.</p>
            <p>Made with ❤️ for aviation professionals worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthPage;

import { useState } from 'react';
import { Link } from 'react-router-dom';
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
    airlineEmail: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate with backend auth
    console.log('Login:', loginData);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Integrate with backend auth
    console.log('Signup:', signupData);
    setTimeout(() => setLoading(false), 1000);
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

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => setActiveTab('signup')}
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
                />
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

              <div className="form-group">
                <label>Airline Email (optional)</label>
                <input
                  type="email"
                  placeholder="your.name@airline.com"
                  value={signupData.airlineEmail}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      airlineEmail: e.target.value,
                    }))
                  }
                />
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

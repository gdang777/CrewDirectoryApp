import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ProtectedRoute from './components/ProtectedRoute';
import ChatWindow from './components/ChatWindow';
import HomePage from './pages/HomePage';
import CityPage from './pages/CityPage';
import PropertiesPage from './pages/PropertiesPage';
import AuthPage from './pages/AuthPage';
import PlaceDetailsPage from './pages/PlaceDetailsPage';
import AllCitiesPage from './pages/AllCitiesPage';
import UserDashboard from './pages/UserDashboard';
import ProductsPage from './pages/ProductsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import ChatPage from './pages/ChatPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/cities" element={<AllCitiesPage />} />
            <Route path="/city/:cityCode" element={<CityPage />} />
            <Route path="/place/:placeId" element={<PlaceDetailsPage />} />
            <Route path="/shopping" element={<ProductsPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/auth" element={<AuthPage />} />

            {/* Chat Route - Protected by Logic inside page or wrap here */}
            <Route
              path="/chat/:roomId"
              element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              }
            />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
        <ChatWindow />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PlaybooksPage from './pages/PlaybooksPage';
import ProductsPage from './pages/ProductsPage';

function App() {
  const [activeTab, setActiveTab] = useState('playbooks');

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Crew Directory</h1>
          <nav className="main-nav">
            <Link
              to="/"
              className={activeTab === 'playbooks' ? 'active' : ''}
              onClick={() => setActiveTab('playbooks')}
            >
              Playbooks
            </Link>
            <Link
              to="/products"
              className={activeTab === 'products' ? 'active' : ''}
              onClick={() => setActiveTab('products')}
            >
              Products
            </Link>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<PlaybooksPage />} />
            <Route path="/products" element={<ProductsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

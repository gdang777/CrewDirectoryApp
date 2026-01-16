import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockProperties, Property, PropertyType } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import AddPropertyModal from '../components/AddPropertyModal';
import './PropertiesPage.css';

const PropertiesPage = () => {
  const [activeTab, setActiveTab] = useState<PropertyType>('crashpad');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [properties, setProperties] = useState<Property[]>(mockProperties);

  const filteredProperties = properties.filter(
    (p) =>
      p.type === activeTab &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.airportCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddProperty = (
    newProperty: Omit<Property, 'id' | 'rating' | 'reviewCount' | 'isFavorite'>
  ) => {
    const property: Property = {
      ...newProperty,
      id: String(Date.now()),
      rating: 0,
      reviewCount: 0,
      isFavorite: false,
    };
    setProperties([...properties, property]);
    setShowAddModal(false);
  };

  const handleToggleFavorite = (propertyId: string) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  return (
    <div className="properties-page">
      {/* Navigation */}
      <nav className="main-nav">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            ✈️ Crew Lounge
          </Link>
          <div className="nav-links">
            <Link to="/">🏠 Home</Link>
            <Link to="/">✈️ Layovers</Link>
            <Link to="/properties" className="active">
              🏠 Properties
            </Link>
            <a href="#">💼 Gigs</a>
          </div>
          <button className="nav-cta">Sign In</button>
        </div>
      </nav>

      {/* Header */}
      <header className="page-header">
        <div className="header-container">
          <h1>Find Your Perfect Stay</h1>
          <p>
            Browse crashpads, vacation rentals, and discover layover
            recommendations from fellow aviation professionals
          </p>
        </div>
      </header>

      {/* Search & Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button className="filter-btn">📍 Near Me</button>
            <button
              className="add-property-btn"
              onClick={() => setShowAddModal(true)}
            >
              + Add Property
            </button>
            <button className="filter-btn">⚙️ Filters</button>
          </div>
        </div>

        <div className="tab-container">
          <button
            className={`tab-btn ${activeTab === 'crashpad' ? 'active' : ''}`}
            onClick={() => setActiveTab('crashpad')}
          >
            Crashpads
          </button>
          <button
            className={`tab-btn ${activeTab === 'vacation' ? 'active' : ''}`}
            onClick={() => setActiveTab('vacation')}
          >
            Vacation Rentals
          </button>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="properties-section">
        <div className="properties-container">
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <p>No properties found matching your search.</p>
              <button onClick={() => setShowAddModal(true)}>
                Be the first to list one!
              </button>
            </div>
          ) : (
            <div className="properties-grid">
              {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Add Property Modal */}
      {showAddModal && (
        <AddPropertyModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProperty}
        />
      )}
    </div>
  );
};

export default PropertiesPage;

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService, { Place, City } from '../services/api';
import './GlobalSearch.css';

interface SearchResults {
  places: Place[];
  cities: City[];
}

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    places: [],
    cities: [],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ places: [], cities: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const [places, cities] = await Promise.all([
          apiService.getPlaces({ search: query, limit: 5 }),
          apiService
            .getCities()
            .then((all) =>
              all
                .filter(
                  (c) =>
                    c.name.toLowerCase().includes(query.toLowerCase()) ||
                    c.code.toLowerCase().includes(query.toLowerCase())
                )
                .slice(0, 3)
            ),
        ]);
        setResults({ places, cities });
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const totalItems = results.cities.length + results.places.length;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % totalItems);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        if (selectedIndex < results.cities.length) {
          handleCityClick(results.cities[selectedIndex]);
        } else {
          handlePlaceClick(
            results.places[selectedIndex - results.cities.length]
          );
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    },
    [results, selectedIndex]
  );

  const handleCityClick = (city: City) => {
    navigate(`/city/${city.code}`);
    setQuery('');
    setIsOpen(false);
  };

  const handlePlaceClick = (place: Place) => {
    navigate(`/place/${place.id}`);
    setQuery('');
    setIsOpen(false);
  };

  const hasResults = results.cities.length > 0 || results.places.length > 0;

  return (
    <div className="global-search" ref={searchRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Search places, cities..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {loading && <span className="search-loading">⟳</span>}
      </div>

      {isOpen && (
        <div className="search-dropdown">
          {!hasResults && query.trim() && !loading && (
            <div className="no-results">No results found</div>
          )}

          {results.cities.length > 0 && (
            <div className="search-section">
              <div className="section-label">Cities</div>
              {results.cities.map((city, index) => (
                <div
                  key={city.id}
                  className={`search-result-item city-item ${selectedIndex === index ? 'selected' : ''}`}
                  onClick={() => handleCityClick(city)}
                >
                  <span className="result-icon">✈️</span>
                  <div className="result-text">
                    <span className="result-name">{city.name}</span>
                    <span className="result-meta">
                      {city.code} · {city.country}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.places.length > 0 && (
            <div className="search-section">
              <div className="section-label">Places</div>
              {results.places.map((place, index) => (
                <div
                  key={place.id}
                  className={`search-result-item place-item ${selectedIndex === results.cities.length + index ? 'selected' : ''}`}
                  onClick={() => handlePlaceClick(place)}
                >
                  <span className="result-icon">
                    {place.category === 'eat' && '🍽️'}
                    {place.category === 'drink' && '🍺'}
                    {place.category === 'shop' && '🛍️'}
                    {place.category === 'visit' && '🏛️'}
                  </span>
                  <div className="result-text">
                    <span className="result-name">{place.name}</span>
                    <span className="result-meta">
                      {place.city?.name || 'Unknown City'}
                    </span>
                  </div>
                  <span className="result-rating">
                    ⭐ {place.rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

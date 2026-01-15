import { useState, useEffect } from 'react';
import type { Playbook, City } from '@crewdirectoryapp/shared';
import { apiService } from '../services/api';
import './PlaybooksPage.css';

const PlaybooksPage = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedCity]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [playbooksData, citiesData] = await Promise.all([
        apiService.getPlaybooks(selectedCity || undefined),
        apiService.getCities(),
      ]);

      setPlaybooks(playbooksData);
      setCities(citiesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load playbooks');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading playbooks...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="playbooks-page">
      <div className="filters">
        <label htmlFor="city-select">Filter by City:</label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {city.name}, {city.country} ({city.code})
            </option>
          ))}
        </select>
      </div>

      <div className="playbooks-grid">
        {playbooks.length === 0 ? (
          <div className="no-results">No playbooks found</div>
        ) : (
          playbooks.map((playbook) => (
            <div key={playbook.id} className="playbook-card">
              <h3>{playbook.title}</h3>
              <p className="tier-badge">{playbook.tier}</p>
              <p>{playbook.description}</p>
              <div className="votes">
                <span>👍 {playbook.upvotes}</span>
                <span>👎 {playbook.downvotes}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaybooksPage;

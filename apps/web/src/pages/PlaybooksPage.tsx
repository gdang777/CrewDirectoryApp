import { useState, useEffect } from 'react';
import { apiService, Playbook, City } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
// import MapComponent from '../components/MapComponent';
import PlaybookEditor from '../components/PlaybookEditor';
import './PlaybooksPage.css';

const PlaybooksPage = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
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

  const handleVote = async (playbookId: string, value: 1 | -1) => {
    try {
      await apiService.votePlaybook(playbookId, value);
      loadData(); // Reload to show updated counts
    } catch (err) {
      console.error('Failed to vote:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
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
        <button onClick={() => setShowEditor(true)} className="create-button">
          + New Playbook
        </button>
      </div>

      {showEditor && (
        <PlaybookEditor
          cities={cities}
          onClose={() => setShowEditor(false)}
          onSave={loadData}
        />
      )}

      {/* MapComponent requires Place[] and City, but we have Playbook[]. 
          TODO: Adapt MapComponent to support POIs or transform data.
      {playbooks.length > 0 && (
        <MapComponent pois={playbooks.flatMap((p) => p.pois || [])} />
      )} 
      */}

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
                <button onClick={() => handleVote(playbook.id, 1)}>
                  👍 {playbook.upvotes}
                </button>
                <button onClick={() => handleVote(playbook.id, -1)}>
                  👎 {playbook.downvotes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaybooksPage;

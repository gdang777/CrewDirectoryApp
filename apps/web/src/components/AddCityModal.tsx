import { useState } from 'react';
import './AddCityModal.css';

interface AddCityModalProps {
  onClose: () => void;
  onSave: (city: {
    name: string;
    country: string;
    code: string;
  }) => Promise<void>;
}

const AddCityModal = ({ onClose, onSave }: AddCityModalProps) => {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim() || !country.trim() || !code.trim()) {
      setError('All fields are required');
      return;
    }

    if (code.length !== 3) {
      setError('Airport code must be exactly 3 characters');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave({
        name: name.trim(),
        country: country.trim(),
        code: code.toUpperCase().trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add city');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="add-city-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New City</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="city-name">City Name</label>
            <input
              id="city-name"
              type="text"
              placeholder="e.g., Paris"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city-country">Country</label>
            <input
              id="city-country"
              type="text"
              placeholder="e.g., France"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city-code">Airport Code (3 letters)</label>
            <input
              id="city-code"
              type="text"
              placeholder="e.g., CDG"
              value={code}
              onChange={(e) =>
                setCode(e.target.value.toUpperCase().slice(0, 3))
              }
              maxLength={3}
              disabled={loading}
            />
            <span className="helper-text">
              The 3-letter IATA airport code for this city
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={loading || !name || !country || !code}
            >
              {loading ? 'Adding...' : 'Add City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCityModal;

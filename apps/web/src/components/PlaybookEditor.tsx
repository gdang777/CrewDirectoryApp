import React, { useState } from 'react';
import type { City } from '@crewdirectoryapp/shared';
import { apiService } from '../services/api';

interface PlaybookEditorProps {
  cities: City[];
  onClose: () => void;
  onSave: () => void;
}

const PlaybookEditor: React.FC<PlaybookEditorProps> = ({
  cities,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cityId: '',
    tier: 'basic' as 'basic' | 'pro',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.createPlaybook({
        ...formData,
        // Mock POIs for MVP creation flow, typically would be a separate step or list
        pois: [],
      });
      onSave();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create playbook'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create New Playbook</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City</label>
            <select
              id="city"
              value={formData.cityId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cityId: e.target.value }))
              }
              required
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.code})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={4}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tier">Tier</label>
            <select
              id="tier"
              value={formData.tier}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  tier: e.target.value as 'basic' | 'pro',
                }))
              }
            >
              <option value="basic">Basic (Free)</option>
              <option value="pro">Pro (Paid)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Creating...' : 'Create Playbook'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }
        .primary-button {
          background: #007bff;
          color: white;
          border: none;
        }
        .error-message {
          color: red;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
};

export default PlaybookEditor;

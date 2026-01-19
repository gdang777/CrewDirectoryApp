import { useState } from 'react';
import apiService, { CreatePlaceData, PlaceCategory } from '../services/api';
import ImageUpload from './ImageUpload';
import './AddPlaceModal.css';

interface AddPlaceModalProps {
  cityId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const categories: { key: PlaceCategory; label: string; icon: string }[] = [
  { key: 'eat', label: 'Eat', icon: '🍽️' },
  { key: 'drink', label: 'Drink', icon: '🍸' },
  { key: 'shop', label: 'Shop', icon: '🛍️' },
  { key: 'visit', label: 'Visit', icon: '📍' },
];

const AddPlaceModal = ({ cityId, onClose, onSuccess }: AddPlaceModalProps) => {
  const [formData, setFormData] = useState<Omit<CreatePlaceData, 'cityId'>>({
    name: '',
    description: '',
    tips: '',
    category: 'eat',
    imageUrl: '',
    address: '',
    latitude: undefined,
    longitude: undefined,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await apiService.createPlace({
        ...formData,
        cityId,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create place:', err);
      setError('Failed to create place. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Add a New Place</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              placeholder="e.g., precise name of the spot"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <div className="category-options">
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  className={`category-option ${formData.category === cat.key ? 'selected' : ''}`}
                  onClick={() =>
                    setFormData({ ...formData, category: cat.key })
                  }
                  disabled={loading}
                >
                  <span className="cat-icon">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="What makes this place special? Share your experience."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="form-group row">
            <div className="input-group half">
              <label>Latitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 51.5074"
                value={formData.latitude || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    latitude: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="input-group half">
              <label>Longitude</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. -0.1278"
                value={formData.longitude || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    longitude: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Crew Tips (Optional)</label>
            <textarea
              placeholder="Best time to visit? Secret menu items? Discounts?"
              value={formData.tips}
              onChange={(e) =>
                setFormData({ ...formData, tips: e.target.value })
              }
              disabled={loading}
              rows={2}
            />
          </div>

          <ImageUpload
            category="places"
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            currentImage={formData.imageUrl}
            label="Place Image (Optional)"
          />

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || !formData.name || !formData.description}
            >
              {loading ? 'Adding...' : 'Add Place'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaceModal;

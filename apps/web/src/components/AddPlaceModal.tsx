import { useState } from 'react';
import apiService, { CreatePlaceData, PlaceCategory } from '../services/api';
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

// Placeholder images by category
const categoryImages: Record<PlaceCategory, string[]> = {
  eat: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&fit=crop',
  ],
  drink: [
    'https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&fit=crop',
    'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&fit=crop',
    'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&fit=crop',
  ],
  shop: [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&fit=crop',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&fit=crop',
    'https://images.unsplash.com/photo-1472851294608-415522f96485?w=800&fit=crop',
  ],
  visit: [
    'https://images.unsplash.com/photo-1565057430174-c05716df7ce0?w=800&fit=crop',
    'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&fit=crop',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&fit=crop',
  ],
};

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
      // Pick a random image if none provided
      let imageUrl = formData.imageUrl;
      if (!imageUrl) {
        const images = categoryImages[formData.category];
        imageUrl = images[Math.floor(Math.random() * images.length)];
      }

      await apiService.createPlace({
        ...formData,
        cityId,
        imageUrl,
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

          <div className="form-group">
            <label>Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              disabled={loading}
            />
            <small className="hint">
              Leave empty to use a random cool image.
            </small>
          </div>

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

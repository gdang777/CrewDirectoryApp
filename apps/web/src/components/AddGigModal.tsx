import { useState } from 'react';
import apiService from '../services/api';
import ImageUpload from './ImageUpload';
import './AddGigModal.css';

interface AddGigModalProps {
  onClose: () => void;
  onSuccess: () => void;
  cities: Array<{ id: string; name: string; code: string }>;
}

const categories = [
  { key: 'hospitality', label: 'Hospitality', icon: '🍽️' },
  { key: 'retail', label: 'Retail', icon: '🛍️' },
  { key: 'events', label: 'Events', icon: '🎉' },
  { key: 'services', label: 'Services', icon: '🔧' },
  { key: 'other', label: 'Other', icon: '💼' },
];

const payTypes = [
  { key: 'hourly', label: 'Per Hour' },
  { key: 'daily', label: 'Per Day' },
  { key: 'fixed', label: 'Fixed Rate' },
];

const AddGigModal = ({ onClose, onSuccess, cities }: AddGigModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'hospitality',
    cityId: '',
    payRate: '',
    payType: 'hourly',
    duration: '',
    requirements: '',
    imageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.cityId ||
      !formData.payRate
    ) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await apiService.createGig({
        ...formData,
        payRate: parseFloat(formData.payRate),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to create gig:', err);
      setError(
        err.response?.data?.message || 'Failed to create gig. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content add-gig-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>Post a Gig</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title *</label>
            <input
              type="text"
              placeholder="e.g., Barista Needed for Weekend Shift"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
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
            <label>City *</label>
            <select
              value={formData.cityId}
              onChange={(e) =>
                setFormData({ ...formData, cityId: e.target.value })
              }
              required
              disabled={loading}
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
            <label>Description *</label>
            <textarea
              placeholder="Describe the job, responsibilities, and what you're looking for..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="form-group row">
            <div className="input-group half">
              <label>Pay Rate *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="e.g., 25.00"
                value={formData.payRate}
                onChange={(e) =>
                  setFormData({ ...formData, payRate: e.target.value })
                }
                required
                disabled={loading}
              />
            </div>
            <div className="input-group half">
              <label>Pay Type *</label>
              <select
                value={formData.payType}
                onChange={(e) =>
                  setFormData({ ...formData, payType: e.target.value })
                }
                required
                disabled={loading}
              >
                {payTypes.map((type) => (
                  <option key={type.key} value={type.key}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Duration (Optional)</label>
            <input
              type="text"
              placeholder="e.g., 4 hours, 2 days, 1 week"
              value={formData.duration}
              onChange={(e) =>
                setFormData({ ...formData, duration: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Requirements (Optional)</label>
            <textarea
              placeholder="Any specific skills, experience, or qualifications needed..."
              value={formData.requirements}
              onChange={(e) =>
                setFormData({ ...formData, requirements: e.target.value })
              }
              disabled={loading}
              rows={3}
            />
          </div>

          <ImageUpload
            category="places"
            onUpload={(url) => setFormData({ ...formData, imageUrl: url })}
            currentImage={formData.imageUrl}
            label="Business Logo / Image (Optional)"
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
              disabled={
                loading ||
                !formData.title ||
                !formData.description ||
                !formData.cityId ||
                !formData.payRate
              }
            >
              {loading ? 'Posting...' : 'Post Gig'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGigModal;

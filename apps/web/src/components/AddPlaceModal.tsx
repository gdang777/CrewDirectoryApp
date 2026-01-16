import { useState } from 'react';
import { Place, PlaceCategory } from '../data/mockData';
import './AddPlaceModal.css';

interface AddPlaceModalProps {
  cityCode: string;
  onClose: () => void;
  onSave: (
    place: Omit<Place, 'id' | 'upvotes' | 'downvotes' | 'createdAt'>
  ) => void;
}

const categories: { key: PlaceCategory; label: string }[] = [
  { key: 'eat', label: '🍽️ Eat' },
  { key: 'drink', label: '🍸 Drink' },
  { key: 'shop', label: '🛍️ Shop' },
  { key: 'visit', label: '📍 Visit' },
];

const AddPlaceModal = ({ cityCode, onClose, onSave }: AddPlaceModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tips: '',
    category: 'eat' as PlaceCategory,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) return;

    onSave({
      ...formData,
      cityCode,
      addedBy: 'You (Crew)',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>Add a Place</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Place Name *</label>
            <input
              type="text"
              placeholder="e.g., The Coffee Collective"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
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
                    setFormData((prev) => ({ ...prev, category: cat.key }))
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              placeholder="What makes this place great for crew?"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label>Pro Tips (optional)</label>
            <input
              type="text"
              placeholder="Any insider tips for fellow crew?"
              value={formData.tips}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, tips: e.target.value }))
              }
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              Add Place
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPlaceModal;

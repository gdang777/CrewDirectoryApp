import { useState } from 'react';
import { apiService } from '../services/api';
import './AddTipModal.css';

interface AddTipModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityCode: string;
  onSuccess: () => void;
}

const CATEGORIES = [
  'chocolate',
  'cosmetics',
  'spirits',
  'electronics',
  'other',
];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'THB', 'JPY'];

const AddTipModal = ({
  isOpen,
  onClose,
  cityCode,
  onSuccess,
}: AddTipModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [step, setStep] = useState(1); // 1: Product, 2: Price

  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    description: '',
    price: '',
    currency: 'USD',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.name || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      await apiService.createProduct({
        name: formData.name,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        cityCode: cityCode,
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add tip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content tip-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <h2>Add Shopping Tip 🛍️</h2>
        <p className="modal-subtitle">Share a great deal in {cityCode}</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="e.g. iPhone 15 Pro, La Mer Cream..."
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="row">
            <div className="input-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
            </div>
            <div className="input-group small">
              <label>Currency</label>
              <select
                value={formData.currency}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Notes (Optional)</label>
            <textarea
              placeholder="Where specifically? Any tips?"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Tip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTipModal;

import React, { useState } from 'react';

interface RecommendationEditorProps {
  onClose: () => void;
  onSave: () => void;
}

const RecommendationEditor: React.FC<RecommendationEditorProps> = ({
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'chocolate',
    sku: '', // Optional
  });
  const [loading, setLoading] = useState(false);

  // In a real app, this would call the API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulating API call for now or use apiService.createProduct(formData)
      // await apiService.createProduct(formData);
      console.log('Saving recommendation:', formData);
      onSave();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add Recommendation</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Item Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              <option value="chocolate">Chocolate</option>
              <option value="cosmetics">Cosmetics</option>
              <option value="spirits">Spirits</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Why do you recommend this?</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="primary-button">
              {loading ? 'Saving...' : 'Post Recommendation'}
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
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
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
        .form-group input, .form-group select, .form-group textarea {
          width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 4px;
        }
        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1rem; }
        .primary-button { background: #007bff; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default RecommendationEditor;

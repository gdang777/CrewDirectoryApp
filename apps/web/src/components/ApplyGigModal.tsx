import { useState } from 'react';
import apiService from '../services/api';
import './ApplyGigModal.css';

interface ApplyGigModalProps {
  gigId: string;
  gigTitle: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ApplyGigModal = ({
  gigId,
  gigTitle,
  onClose,
  onSuccess,
}: ApplyGigModalProps) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await apiService.applyToGig(gigId, message);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to apply to gig:', err);
      setError(
        err.response?.data?.message ||
          'Failed to submit application. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content apply-gig-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2>Apply to Gig</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="gig-title-display">
          <span className="gig-icon">💼</span>
          <span>{gigTitle}</span>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Message to Employer (Optional)</label>
            <textarea
              placeholder="Tell the employer why you're a great fit for this gig..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              rows={6}
              autoFocus
            />
            <div className="help-text">
              Introduce yourself and highlight relevant experience or
              availability
            </div>
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
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyGigModal;

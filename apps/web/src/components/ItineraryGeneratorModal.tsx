import React, { useState } from 'react';
import api from '../services/api';
import './ItineraryGeneratorModal.css';

interface ItineraryItem {
  placeId: string;
  placeName: string;
  startTime: string;
  endTime: string;
  duration: number;
  reason: string;
  tips?: string;
}

interface ItineraryResponse {
  id: string;
  duration: number;
  items: ItineraryItem[];
  summary: string;
  preferences: string[];
}

interface Props {
  cityCode: string;
  cityName: string;
  onClose: () => void;
}

const PREFERENCES = [
  'food',
  'culture',
  'nightlife',
  'shopping',
  'nature',
  'coffee',
  'history',
];

const ItineraryGeneratorModal: React.FC<Props> = ({
  cityCode,
  cityName,
  onClose,
}) => {
  const [step, setStep] = useState<'input' | 'loading' | 'result'>('input');
  const [duration, setDuration] = useState<number>(6);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [result, setResult] = useState<ItineraryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const togglePreference = (pref: string) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleGenerate = async () => {
    setStep('loading');
    setError(null);
    try {
      const response = await api.generateItinerary({
        cityCode,
        duration,
        preferences: selectedPreferences,
      });
      setResult(response.itinerary || response);
      setStep('result');
    } catch (err) {
      console.error('Failed to generate itinerary:', err);
      setError('Failed to generate itinerary. Please try again.');
      setStep('input');
    }
  };

  const formatPreferenceLabel = (pref: string) => {
    return pref.charAt(0).toUpperCase() + pref.slice(1);
  };

  return (
    <div className="itinerary-modal-overlay" onClick={onClose}>
      <div
        className="itinerary-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="itinerary-modal-header">
          <h2>
            <span>✨</span> Plan My Layover in {cityName}
          </h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="itinerary-modal-body">
          {error && (
            <div
              style={{
                background: 'rgba(255, 59, 48, 0.1)',
                color: '#ff3b30',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid rgba(255, 59, 48, 0.3)',
              }}
            >
              {error}
            </div>
          )}

          {step === 'input' && (
            <div className="itinerary-form">
              <div className="form-group">
                <label>Layover Duration (hours)</label>
                <div className="duration-slider-container">
                  <input
                    type="range"
                    min="2"
                    max="24"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="duration-slider"
                  />
                  <span className="duration-value">{duration}h</span>
                </div>
              </div>

              <div className="form-group">
                <label>What are you in the mood for?</label>
                <div className="preferences-grid">
                  {PREFERENCES.map((pref) => (
                    <div
                      key={pref}
                      className={`preference-checkbox ${
                        selectedPreferences.includes(pref) ? 'selected' : ''
                      }`}
                      onClick={() => togglePreference(pref)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedPreferences.includes(pref)}
                        readOnly
                      />
                      <span>{formatPreferenceLabel(pref)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <p
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                  }}
                >
                  Our AI will analyze your preferences and availability to
                  create the perfect layover itinerary, complete with travel
                  times and local tips.
                </p>

                <button
                  className="generate-btn"
                  style={{ width: '100%' }}
                  onClick={handleGenerate}
                  disabled={selectedPreferences.length === 0}
                >
                  ✨ Generate Itinerary
                </button>
              </div>
            </div>
          )}

          {step === 'loading' && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <h3>Planning your trip...</h3>
              <p className="loading-text">Analyzing best routes and places</p>
            </div>
          )}

          {step === 'result' && result && (
            <div className="itinerary-result">
              <div className="itinerary-summary">
                <p>
                  <strong>AI Assistant:</strong> {result.summary}
                </p>
              </div>

              <div className="timeline">
                {result.items.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-dot"></div>
                    <span className="time-slot">
                      {item.startTime} - {item.endTime} ({item.duration} min)
                    </span>
                    <h4 className="place-name">{item.placeName}</h4>
                    <p className="place-reason">{item.reason}</p>
                    {item.tips && (
                      <div className="place-tips">
                        <span className="tip-icon">💡</span>
                        <span>{item.tips}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {step === 'result' && (
          <div className="modal-footer">
            <button className="secondary-btn" onClick={() => setStep('input')}>
              Start Over
            </button>
            <button className="primary-btn" onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryGeneratorModal;

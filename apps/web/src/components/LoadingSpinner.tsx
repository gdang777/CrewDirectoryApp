import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="airplane-loader-overlay">
      <div className="airplane-loader-container">
        <div className="earth-dot"></div>
        <div className="orbit-path"></div>
        <div className="airplane-icon">✈️</div>
      </div>
      <p className="loading-text">Cruising to destination...</p>
    </div>
  );
};

export default LoadingSpinner;

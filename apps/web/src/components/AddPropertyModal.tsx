import { useState, useRef } from 'react';
import { Property, PropertyType } from '../data/mockData';
import './AddPropertyModal.css';

interface AddPropertyModalProps {
  onClose: () => void;
  onSave: (
    property: Omit<Property, 'id' | 'rating' | 'reviewCount' | 'isFavorite'>
  ) => void;
}

const propertyTypes = [
  'Private Room',
  'Entire Apartment',
  'Shared Room',
  'Studio',
  'Cabin',
  'Condo',
  'Loft',
  'Entire Cottage',
];

const AddPropertyModal = ({ onClose, onSave }: AddPropertyModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'crashpad' as PropertyType,
    propertyType: 'Private Room',
    location: '',
    airportCode: '',
    distanceToAirport: '',
    beds: 1,
    baths: 1,
    hasWifi: true,
    price: 0,
    ownerName: '',
    ownerAirline: '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.location ||
      !formData.airportCode ||
      formData.price <= 0
    ) {
      alert('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      imageUrl:
        imagePreview ||
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-property-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h2>List Your Property</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="image-upload-section">
            <div
              className="image-preview"
              onClick={() => fileInputRef.current?.click()}
              style={
                imagePreview ? { backgroundImage: `url(${imagePreview})` } : {}
              }
            >
              {!imagePreview && (
                <div className="upload-placeholder">
                  <span className="upload-icon">📷</span>
                  <span>Click to upload photos</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              hidden
            />
          </div>

          {/* Property Type Toggle */}
          <div className="form-group">
            <label>Listing Type *</label>
            <div className="listing-type-toggle">
              <button
                type="button"
                className={formData.type === 'crashpad' ? 'active' : ''}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: 'crashpad' }))
                }
              >
                🏠 Crashpad
              </button>
              <button
                type="button"
                className={formData.type === 'vacation' ? 'active' : ''}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, type: 'vacation' }))
                }
              >
                🏖️ Vacation Rental
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label>Property Title *</label>
            <input
              type="text"
              placeholder="e.g., Cozy Crashpad Near YYZ Airport"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </div>

          {/* Property Type Dropdown */}
          <div className="form-group">
            <label>Property Type *</label>
            <select
              value={formData.propertyType}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  propertyType: e.target.value,
                }))
              }
            >
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Location Row */}
          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                placeholder="City, State/Province"
                value={formData.location}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, location: e.target.value }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Nearest Airport Code *</label>
              <input
                type="text"
                placeholder="e.g., YYZ"
                value={formData.airportCode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    airportCode: e.target.value.toUpperCase(),
                  }))
                }
                maxLength={3}
                required
              />
            </div>
          </div>

          {/* Distance */}
          <div className="form-group">
            <label>Distance to Airport</label>
            <input
              type="text"
              placeholder="e.g., 3.5 km"
              value={formData.distanceToAirport}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  distanceToAirport: e.target.value,
                }))
              }
            />
          </div>

          {/* Beds & Baths */}
          <div className="form-row">
            <div className="form-group">
              <label>Beds</label>
              <input
                type="number"
                min="1"
                value={formData.beds}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    beds: parseInt(e.target.value) || 1,
                  }))
                }
              />
            </div>
            <div className="form-group">
              <label>Baths</label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={formData.baths}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    baths: parseFloat(e.target.value) || 1,
                  }))
                }
              />
            </div>
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price per Night (USD) *</label>
            <input
              type="number"
              min="1"
              placeholder="0"
              value={formData.price || ''}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  price: parseInt(e.target.value) || 0,
                }))
              }
              required
            />
          </div>

          {/* Wifi */}
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.hasWifi}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hasWifi: e.target.checked,
                  }))
                }
              />
              <span>Wifi Available</span>
            </label>
          </div>

          {/* Owner Info */}
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input
                type="text"
                placeholder="e.g., John S."
                value={formData.ownerName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerName: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Your Airline</label>
              <input
                type="text"
                placeholder="e.g., Air Canada"
                value={formData.ownerAirline}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    ownerAirline: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              List Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;

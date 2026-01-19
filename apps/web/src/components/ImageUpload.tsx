import { useState, useRef, useCallback } from 'react';
import apiService from '../services/api';
import './ImageUpload.css';

export type ImageCategory = 'places' | 'cities' | 'avatars' | 'properties';

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void;
  category: ImageCategory;
  currentImage?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

const ImageUpload = ({
  onUpload,
  category,
  currentImage,
  maxSizeMB = 5,
  className = '',
  label = 'Upload Image',
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (file: File) => {
      // Reset states
      setError(null);
      setProgress(0);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        setError(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload file
      setUploading(true);
      try {
        const imageUrl = await apiService.uploadImage(file, category);
        onUpload(imageUrl);
        setProgress(100);
      } catch (err: any) {
        console.error('Upload failed:', err);
        setError(err.message || 'Failed to upload image');
        setPreview(currentImage || null);
      } finally {
        setUploading(false);
      }
    },
    [category, currentImage, maxSizeMB, onUpload]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleChange = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className={`image-upload-container ${className}`}>
      {label && <label className="image-upload-label">{label}</label>}

      <div
        className={`image-upload-zone ${dragActive ? 'drag-active' : ''} ${preview ? 'has-image' : ''}`}
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="file-input"
          disabled={uploading}
        />

        {preview ? (
          <div className="image-preview-container">
            <img src={preview} alt="Preview" className="image-preview" />
            <div className="image-overlay">
              <div className="image-actions">
                <button
                  type="button"
                  onClick={handleChange}
                  className="image-action-btn btn-change"
                  disabled={uploading}
                >
                  Change
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="image-action-btn btn-remove"
                  disabled={uploading}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="upload-icon">📸</div>
            <div className="upload-text">
              {dragActive
                ? 'Drop image here'
                : 'Click to upload or drag and drop'}
            </div>
            <div className="upload-hint">
              PNG, JPG, GIF or WebP (max {maxSizeMB}MB)
            </div>
          </>
        )}
      </div>

      {uploading && (
        <div className="upload-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            {progress === 100 ? 'Upload complete!' : 'Uploading...'}
          </div>
        </div>
      )}

      {error && <div className="upload-error">{error}</div>}

      {!preview && (
        <div className="size-limit-text">
          Recommended: Square images work best (e.g., 800x800px)
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

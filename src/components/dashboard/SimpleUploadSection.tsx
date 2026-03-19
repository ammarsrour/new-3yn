import React, { useState, useCallback, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { LocationData } from '../../services/locationService';
import SimpleLocationInput from './SimpleLocationInput';
import { BillboardMetadata } from '../../types/billboard';
import { activityLogger } from '../../services/activityLogger';

interface SimpleUploadSectionProps {
  onAnalyze: (
    file: File,
    location: string,
    distance: number,
    locationData?: LocationData,
    billboardMetadata?: BillboardMetadata
  ) => void;
  isAnalyzing: boolean;
  userId?: string;
}

/**
 * Distilled upload section - just upload and go.
 * Removes: Brand Analysis form, Location Recommendations, Advanced Options accordion.
 * Those features can be surfaced post-analysis or in a dedicated section.
 */
const SimpleUploadSection: React.FC<SimpleUploadSectionProps> = ({
  onAnalyze,
  isAnalyzing,
  userId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [billboardMetadata, setBillboardMetadata] = useState<BillboardMetadata | null>(null);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    const maxSize = 50 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or MP4 file.');
      return false;
    }

    if (file.size > maxSize) {
      setError('File size must be less than 50MB.');
      return false;
    }

    return true;
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setError('');

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile && validateFile(droppedFile)) {
        setFile(droppedFile);
        if (droppedFile.type.startsWith('image/')) {
          setPreviewUrl(URL.createObjectURL(droppedFile));
        }
        if (userId) {
          activityLogger.logUpload(userId, droppedFile.name, droppedFile.size, droppedFile.type);
        }
      }
    },
    [userId]
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
      if (userId) {
        activityLogger.logUpload(userId, selectedFile.name, selectedFile.size, selectedFile.type);
      }
    }
  };

  const handleAnalyze = () => {
    if (!file) {
      setError('Please upload a billboard image.');
      return;
    }

    if (!location.trim()) {
      setLocationError('Please select a location.');
      return;
    }

    setError('');
    setLocationError('');

    if (userId) {
      activityLogger.logAnalysis(userId, location, 'billboard');
    }

    const actualDistance = billboardMetadata?.location.distanceFromRoadM || 100;
    onAnalyze(file, location, actualDistance, undefined, billboardMetadata || undefined);
  };

  const handleLocationChange = (newLocation: string, metadata?: BillboardMetadata) => {
    setLocation(newLocation);
    setBillboardMetadata(metadata || null);
    setLocationError('');
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white p-6 lg:p-8">
      {/* Header - concise */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-950 tracking-tight">
          Analyze Billboard
        </h2>
        <p className="text-secondary text-sm mt-1">
          Upload your design for AI readability scoring
        </p>
      </div>

      {/* Upload Area */}
      {!file ? (
        <div
          className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
            dragActive
              ? 'border-navy-400 bg-navy-50'
              : 'border-surface-300 bg-surface-50 hover:border-navy-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.mp4"
            className="hidden"
          />

          <div className="w-10 h-10 bg-surface-100 flex items-center justify-center mx-auto mb-3">
            <Upload className="w-5 h-5 text-navy-500" />
          </div>

          <p className="font-medium text-navy-950 mb-1">Drop billboard here</p>
          <p className="text-sm text-secondary mb-4">or click to browse</p>

          <span className="inline-block bg-navy-950 text-white px-4 py-2 text-sm font-medium">
            Choose File
          </span>

          <p className="text-xs text-secondary mt-4">JPG, PNG, MP4 up to 50MB</p>
        </div>
      ) : (
        /* Preview */
        <div className="space-y-3">
          {previewUrl && (
            <div className="bg-navy-900 p-2">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-72 object-contain mx-auto"
              />
            </div>
          )}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-2 min-w-0">
              <Upload className="w-4 h-4 text-navy-500 flex-shrink-0" />
              <span className="text-sm font-medium text-navy-950 truncate">{file.name}</span>
              <span className="text-xs text-secondary">
                {(file.size / (1024 * 1024)).toFixed(1)} MB
              </span>
            </div>
            <button
              onClick={clearFile}
              className="text-xs text-secondary hover:text-navy-700 flex-shrink-0"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-danger-50 border-l-2 border-danger-400">
          <span className="text-danger-600 text-sm">{error}</span>
        </div>
      )}

      {/* Location - simple */}
      <div className="mt-6 pt-6 border-t border-surface-200">
        <label className="block text-sm font-medium text-navy-700 mb-2">
          Location
        </label>
        <SimpleLocationInput
          value={location}
          onChange={handleLocationChange}
          error={locationError}
        />
      </div>

      {/* CTA */}
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !file}
        className="w-full mt-6 bg-navy-950 text-white py-3 font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <span className="flex items-center justify-center space-x-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Analyzing...</span>
          </span>
        ) : (
          'Analyze'
        )}
      </button>
    </div>
  );
};

export default SimpleUploadSection;

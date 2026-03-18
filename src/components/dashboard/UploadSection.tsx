import React, { useState, useCallback, useRef } from 'react';
import { Upload, Target, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { LocationData } from '../../services/locationService';
import IntelligentLocationSelector from './IntelligentLocationSelector';
import { BillboardMetadata } from '../../types/billboard';
import BrandAnalysisForm, { BrandAnalysisData } from './BrandAnalysisForm';
import LocationRecommendations from './LocationRecommendations';
import { BillboardDataService } from '../../services/billboardDataService';
import { activityLogger } from '../../services/activityLogger';

interface UploadSectionProps {
  onAnalyze: (file: File, location: string, distance: number, locationData?: LocationData, billboardMetadata?: BillboardMetadata) => void;
  isAnalyzing: boolean;
  userId?: string;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalyze, isAnalyzing, userId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [billboardMetadata, setBillboardMetadata] = useState<BillboardMetadata | null>(null);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [brandData, setBrandData] = useState<BrandAnalysisData>({
    category: '',
    targetAge: '',
    campaignGoal: '',
    budgetRange: ''
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
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
  }, [userId]);

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

  const handleAnalyze = () => {
    if (!file) {
      setError('Please select an image file (JPG, PNG) or video file (MP4) to analyze.');
      return;
    }

    if (!location.trim()) {
      setLocationError('Please enter a billboard location.');
      return;
    }

    if (locationData && !locationData.valid) {
      setLocationError('Please enter a valid location.');
      return;
    }

    setError('');
    setLocationError('');

    if (userId) {
      activityLogger.logAnalysis(userId, location, 'billboard');
    }

    const actualDistance = billboardMetadata?.location.distanceFromRoadM || 100;
    onAnalyze(file, location, actualDistance, locationData || undefined, billboardMetadata || undefined);
  };

  const handleBillboardLocationChange = (newLocation: string, metadata?: BillboardMetadata) => {
    setLocation(newLocation);
    setBillboardMetadata(metadata || null);
    setLocationError('');
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
  };

  const hasAdvancedData = brandData.category || brandData.targetAge || brandData.campaignGoal || brandData.budgetRange;

  return (
    <div className="space-y-8">
      {/* Primary Upload Card */}
      <div className="bg-white p-8 lg:p-10">
        {/* Header - tight spacing */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Analyze Your Billboard</h2>
          <p className="text-secondary mt-1">Upload your creative for AI-powered readability scoring</p>
        </div>

        {/* Upload Area or Preview - this is the HERO */}
        {!file ? (
          <div
            className={`relative border-2 border-dashed p-12 lg:p-16 text-center transition-all duration-200 cursor-pointer ${
              dragActive
                ? 'border-success-500 bg-success-50'
                : 'border-surface-300 bg-surface-50 hover:border-navy-300 hover:bg-surface-100'
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

            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 flex items-center justify-center mb-6 transition-colors ${
                dragActive ? 'bg-success-500' : 'bg-navy-100'
              }`}>
                <Upload className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-navy-600'}`} />
              </div>

              <p className="text-xl font-semibold text-navy-950 mb-2">
                Drop your billboard creative here
              </p>
              <p className="text-secondary mb-6">or click to browse</p>

              <span className="inline-flex items-center bg-navy-950 text-white px-6 py-3 font-medium hover:bg-navy-800 transition-colors">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </span>

              <p className="text-xs text-secondary mt-6">
                JPG, PNG, or MP4 up to 50MB
              </p>
            </div>
          </div>
        ) : (
          /* File Preview - Billboard is the HERO */
          <div className="space-y-4">
            {previewUrl && (
              <div className="relative bg-navy-950 p-3">
                <img
                  src={previewUrl}
                  alt="Billboard preview"
                  className="w-full max-h-[400px] object-contain mx-auto"
                />
              </div>
            )}
            <div className="flex items-center justify-between py-3 border-b border-surface-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="font-semibold text-navy-950">{file.name}</p>
                  <p className="text-sm text-secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="text-sm text-secondary hover:text-danger-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-danger-50 border-l-4 border-danger-500 flex items-center space-x-2">
            <span className="text-danger-700 text-sm">{error}</span>
          </div>
        )}

        {/* Location Input - Secondary importance */}
        <div className="mt-8 pt-8 border-t border-surface-200">
          <label className="block text-sm font-semibold text-navy-700 mb-3">
            Billboard Location
          </label>
          <IntelligentLocationSelector
            value={location}
            onChange={handleBillboardLocationChange}
            error={locationError}
            brandCategory={brandData.category}
          />
        </div>

        {/* Distance Info - Contextual, appears when relevant */}
        {billboardMetadata?.location.distanceFromRoadM && (
          <div className="mt-4 flex items-center space-x-3 text-sm">
            <Target className="w-4 h-4 text-success-600" />
            <span className="text-secondary">Viewing distance:</span>
            <span className="font-semibold text-navy-950 tabular-nums">
              {billboardMetadata.location.distanceFromRoadM}m from road
            </span>
          </div>
        )}

        {/* Primary CTA - Full prominence */}
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            className="w-full bg-navy-950 hover:bg-navy-800 text-white py-4 px-8 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Analyzing...</span>
              </span>
            ) : 'Analyze Readability'}
          </button>
        </div>
      </div>

      {/* Advanced Options - Collapsed by default */}
      <div className="bg-white">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-navy-600" />
            <div>
              <span className="font-semibold text-navy-950">Advanced Options</span>
              {hasAdvancedData && (
                <span className="ml-2 text-xs bg-success-100 text-success-700 px-2 py-0.5">
                  Configured
                </span>
              )}
            </div>
          </div>
          {showAdvanced ? (
            <ChevronUp className="w-5 h-5 text-navy-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-navy-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="border-t border-surface-200">
            {/* Brand Analysis */}
            <div className="p-6 border-b border-surface-100">
              <BrandAnalysisForm onAnalysisChange={setBrandData} />
            </div>

            {/* Location Recommendations - Only show if brand data exists */}
            {brandData.category && (
              <div className="p-6">
                <LocationRecommendations
                  brandData={brandData}
                  allLocations={BillboardDataService.getAllLocations()}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadSection;

import React, { useState, useCallback, useRef, lazy, Suspense } from 'react';
import { Upload, ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';
import { LocationData } from '../../services/locationService';
import SimpleLocationInput from './SimpleLocationInput';
import BrandAnalysisForm, { BrandAnalysisData } from './BrandAnalysisForm';

// Lazy load heavy map component - only loads when user expands location section
const IntelligentLocationSelector = lazy(() => import('./IntelligentLocationSelector'));
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

const SimpleUploadSection: React.FC<SimpleUploadSectionProps> = ({
  onAnalyze,
  isAnalyzing,
  userId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [billboardMetadata, setBillboardMetadata] = useState<BillboardMetadata | null>(null);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');

  // Progressive disclosure states
  const [showCampaignDetails, setShowCampaignDetails] = useState(false);
  const [showLocationMap, setShowLocationMap] = useState(false);
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
          setImageLoading(true);
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
        setImageLoading(true);
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

    // Location is now optional
    setError('');
    setLocationError('');

    if (userId) {
      activityLogger.logAnalysis(userId, location || 'Unknown', 'billboard');
    }

    const actualDistance = billboardMetadata?.location.distanceFromRoadM || 100;
    onAnalyze(file, location || 'Custom Location', actualDistance, undefined, billboardMetadata || undefined);
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

  const hasCampaignData = brandData.category || brandData.targetAge || brandData.campaignGoal || brandData.budgetRange;

  return (
    <div className="space-y-6">
      {/* Main Upload Card */}
      <div className="bg-white p-6 lg:p-8">
        {/* Header */}
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
            className={`border-2 border-dashed p-6 sm:p-8 text-center transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-navy-500 focus-within:ring-offset-2 ${
              dragActive
                ? 'border-navy-400 bg-navy-50'
                : 'border-surface-300 bg-surface-50 hover:border-navy-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Upload billboard image. Drop file here or press Enter to browse"
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".jpg,.jpeg,.png,.mp4"
              className="sr-only"
              aria-describedby="file-requirements"
            />

            <div className="w-10 h-10 bg-surface-100 flex items-center justify-center mx-auto mb-3" aria-hidden="true">
              <Upload className="w-5 h-5 text-navy-500" />
            </div>

            <p className="font-medium text-navy-950 mb-1">Drop billboard here</p>
            <p className="text-sm text-secondary mb-4">or click to browse</p>

            <span className="inline-block bg-navy-950 text-white px-4 py-2 text-sm font-medium" aria-hidden="true">
              Choose File
            </span>

            <p id="file-requirements" className="text-xs text-secondary mt-4">JPG, PNG, MP4 up to 50MB</p>
          </div>
        ) : (
          /* Preview */
          <div className="space-y-3">
            {previewUrl && (
              <div className="bg-navy-900 p-2 relative">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-navy-900">
                    <div className="w-6 h-6 border-2 border-navy-700 border-t-white rounded-full animate-spin motion-reduce:animate-none" />
                  </div>
                )}
                <img
                  src={previewUrl}
                  alt={`Preview of uploaded billboard: ${file.name}`}
                  className="w-full max-h-72 object-contain mx-auto"
                  onLoad={() => setImageLoading(false)}
                />
              </div>
            )}
            <div className="flex items-center justify-between py-2 gap-2">
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <Upload className="w-4 h-4 text-navy-500 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-navy-950 truncate max-w-[200px] sm:max-w-none" title={file.name}>{file.name}</span>
                <span className="text-xs text-secondary flex-shrink-0">
                  {(file.size / (1024 * 1024)).toFixed(1)} MB
                </span>
              </div>
              <button
                onClick={clearFile}
                className="text-xs text-secondary hover:text-navy-700 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-2 py-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label={`Remove uploaded file: ${file.name}`}
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 p-2 bg-danger-50 border-l-2 border-danger-400" role="alert" aria-live="polite">
            <span className="text-danger-600 text-sm">{error}</span>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !file}
          className="w-full mt-6 bg-navy-950 text-white py-3 font-medium hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 min-h-[48px]"
          aria-busy={isAnalyzing}
          aria-disabled={!file}
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin motion-reduce:animate-none w-4 h-4" viewBox="0 0 24 24">
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

      {/* Progressive Disclosure: Campaign Details */}
      {file && (
        <div className="bg-white">
          <button
            onClick={() => setShowCampaignDetails(!showCampaignDetails)}
            className="w-full flex items-center justify-between p-4 hover:bg-surface-50 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-inset"
            aria-expanded={showCampaignDetails}
            aria-controls="campaign-details-panel"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <Sparkles className="w-4 h-4 text-navy-500 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-navy-700 truncate">
                Add campaign details for deeper insights
              </span>
              <span className="text-xs text-secondary flex-shrink-0">(optional)</span>
              {hasCampaignData && (
                <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 flex-shrink-0">
                  Configured
                </span>
              )}
            </div>
            {showCampaignDetails ? (
              <ChevronUp className="w-4 h-4 text-navy-400 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-navy-400 flex-shrink-0" aria-hidden="true" />
            )}
          </button>

          <div
            id="campaign-details-panel"
            className={showCampaignDetails ? 'px-4 pb-4 border-t border-surface-100' : 'hidden'}
            aria-hidden={!showCampaignDetails}
          >
            <div className="pt-4">
              <BrandAnalysisForm onAnalysisChange={setBrandData} />
            </div>
          </div>
        </div>
      )}

      {/* Progressive Disclosure: Location Selection */}
      {file && (
        <div className="bg-white">
          <button
            onClick={() => setShowLocationMap(!showLocationMap)}
            className="w-full flex items-center justify-between p-4 hover:bg-surface-50 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-inset"
            aria-expanded={showLocationMap}
            aria-controls="location-panel"
          >
            <div className="flex items-center space-x-2 min-w-0">
              <MapPin className="w-4 h-4 text-navy-500 flex-shrink-0" aria-hidden="true" />
              <span className="text-sm text-navy-700 truncate">
                Select a billboard location
              </span>
              <span className="text-xs text-secondary flex-shrink-0">(optional)</span>
              {location && (
                <span className="text-xs text-navy-600 bg-surface-100 px-2 py-0.5 truncate max-w-32 sm:max-w-48" title={location}>
                  {location}
                </span>
              )}
            </div>
            {showLocationMap ? (
              <ChevronUp className="w-4 h-4 text-navy-400 flex-shrink-0" aria-hidden="true" />
            ) : (
              <ChevronDown className="w-4 h-4 text-navy-400 flex-shrink-0" aria-hidden="true" />
            )}
          </button>

          <div
            id="location-panel"
            className={showLocationMap ? 'px-4 pb-4 border-t border-surface-100' : 'hidden'}
            aria-hidden={!showLocationMap}
          >
            <div className="pt-4">
              <Suspense fallback={
                <div className="flex items-center justify-center py-8">
                  <div className="w-5 h-5 border-2 border-navy-200 border-t-navy-600 rounded-full animate-spin motion-reduce:animate-none" />
                </div>
              }>
                <IntelligentLocationSelector
                  value={location}
                  onChange={handleLocationChange}
                  error={locationError}
                  brandCategory={brandData.category}
                />
              </Suspense>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleUploadSection;

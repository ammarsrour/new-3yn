import React, { useState, useCallback, useRef } from 'react';
import { Upload, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { LocationData } from '../../services/locationService';
import IntelligentLocationSelector from './IntelligentLocationSelector';
import { BillboardMetadata } from '../../types/billboard';
import BrandAnalysisForm, { BrandAnalysisData } from './BrandAnalysisForm';
import LocationRecommendations from './LocationRecommendations';
import { BillboardDataService } from '../../services/billboardDataService';
import { activityLogger } from '../../services/activityLogger';
import FeatureTooltip from './FeatureTooltip';

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

        {/* Upload Area or Preview */}
        {!file ? (
          <div
            className={`relative border-2 border-dashed p-10 lg:p-14 text-center transition-all duration-200 cursor-pointer ${
              dragActive
                ? 'border-navy-400 bg-navy-50'
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
              <div className={`w-12 h-12 flex items-center justify-center mb-4 ${
                dragActive ? 'bg-navy-200' : 'bg-surface-100'
              }`}>
                <Upload className={`w-6 h-6 ${dragActive ? 'text-navy-700' : 'text-navy-500'}`} />
              </div>

              <p className="text-lg font-medium text-navy-950 mb-1">
                Drop your billboard here
              </p>
              <p className="text-sm text-secondary mb-5">or click to browse</p>

              <span className="inline-flex items-center bg-navy-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors">
                Choose File
              </span>

              <p className="text-xs text-secondary mt-5">
                JPG, PNG, or MP4 up to 50MB
              </p>
            </div>
          </div>
        ) : (
          /* File Preview */
          <div className="space-y-3">
            {previewUrl && (
              <div className="relative bg-navy-900 p-2">
                <img
                  src={previewUrl}
                  alt="Billboard preview"
                  className="w-full max-h-[360px] object-contain mx-auto"
                />
              </div>
            )}
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-navy-500" />
                </div>
                <div>
                  <p className="font-medium text-navy-950 text-sm">{file.name}</p>
                  <p className="text-xs text-secondary">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={clearFile}
                className="text-xs text-secondary hover:text-navy-700 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-surface-50 border-l-2 border-danger-400">
            <span className="text-danger-600 text-sm">{error}</span>
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

        {/* Distance Info - Contextual */}
        {billboardMetadata?.location.distanceFromRoadM && (
          <div className="mt-4 text-sm text-secondary">
            Viewing distance: <span className="font-medium text-navy-700 tabular-nums">{billboardMetadata.location.distanceFromRoadM}m</span>
          </div>
        )}

        {/* Primary CTA */}
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            className="w-full bg-navy-950 hover:bg-navy-800 text-white py-3.5 px-6 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
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
        <FeatureTooltip
          id="advanced-options"
          title="Brand Analysis"
          description="Add brand context for smarter location recommendations and tailored analysis."
          position="top"
          delay={2000}
        >
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-navy-700">Advanced Options</span>
              {hasAdvancedData && (
                <span className="text-xs text-secondary">Configured</span>
              )}
            </div>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-navy-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-navy-400" />
            )}
          </button>
        </FeatureTooltip>

        {showAdvanced && (
          <div className="border-t border-surface-200">
            {/* Brand Analysis */}
            <div className="p-5 border-b border-surface-100">
              <BrandAnalysisForm onAnalysisChange={setBrandData} />
            </div>

            {/* Location Recommendations */}
            {brandData.category && (
              <div className="p-5">
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

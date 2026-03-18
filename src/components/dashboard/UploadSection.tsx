import React, { useState, useCallback, useRef } from 'react';
import { Upload, Target } from 'lucide-react';
import LocationInput from './LocationInput';
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

  const handleBrowseClick = (e: React.MouseEvent) => {
    console.log('🖱️ handleBrowseClick triggered');
    e.preventDefault();
    e.stopPropagation();
    if (fileInputRef.current) {
      console.log('📂 Triggering file input click');
      fileInputRef.current.click();
    } else {
      console.error('❌ fileInputRef.current is null!');
    }
  };
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState('');
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [billboardMetadata, setBillboardMetadata] = useState<BillboardMetadata | null>(null);
  const [error, setError] = useState('');
  const [locationError, setLocationError] = useState('');
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
    if (droppedFile) {
      if (validateFile(droppedFile)) {
        setFile(droppedFile);

        if (userId) {
          activityLogger.logUpload(userId, droppedFile.name, droppedFile.size, droppedFile.type);
        }
      }
    }
  }, [userId]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📂 handleFileSelect triggered');
    console.log('📂 Input files:', e.target.files);
    const selectedFile = e.target.files?.[0];
    console.log('📂 Selected file:', selectedFile?.name, selectedFile?.size);
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        console.log('✅ File validated successfully');
        setFile(selectedFile);

        if (userId) {
          activityLogger.logUpload(userId, selectedFile.name, selectedFile.size, selectedFile.type);
        }
      } else {
        console.log('❌ File validation failed');
      }
    } else {
      console.log('⚠️ No file selected');
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    const maxSize = 50 * 1024 * 1024; // 50MB

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

    // Clear any previous errors
    setError('');
    setLocationError('');

    // Log the analysis activity
    if (userId) {
      activityLogger.logAnalysis(userId, location, 'billboard');
    }

    // Use actual distance from location data, fallback to 100m
    const actualDistance = billboardMetadata?.location.distanceFromRoadM || 100;
    onAnalyze(file, location, actualDistance, locationData || undefined, billboardMetadata || undefined);
  };

  const handleLocationChange = (newLocation: string, newLocationData?: LocationData) => {
    setLocation(newLocation);
    setLocationData(newLocationData || null);
    setLocationError('');
  };

  const handleBillboardLocationChange = (newLocation: string, metadata?: BillboardMetadata) => {
    setLocation(newLocation);
    setBillboardMetadata(metadata || null);
    setLocationError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Brand Analysis Section */}
      <div className="mb-8">
        <BrandAnalysisForm onAnalysisChange={setBrandData} />
      </div>

      {/* Location Recommendations */}
      <div className="mb-8">
        <LocationRecommendations 
          brandData={brandData}
          allLocations={BillboardDataService.getAllLocations()}
        />
      </div>

      <div className="bg-white border-l-4 border-navy-950 p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Upload Your Billboard Creative</h2>
          <p className="text-secondary mt-2">Get AI-powered readability analysis in seconds</p>
        </div>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed p-8 sm:p-16 text-center transition-all duration-200 ${
            dragActive
              ? 'border-success-500 bg-success-50'
              : file
                ? 'border-success-500 bg-success-50'
                : 'border-surface-300 bg-surface-50 hover:border-success-400 hover:bg-success-50/50'
          }`}
          style={{
            cursor: file ? 'default' : 'pointer'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={(e) => {
            if (!file && e.target === e.currentTarget) {
              console.log('🖱️ Container clicked, triggering file input');
              fileInputRef.current?.click();
            }
          }}
        >

          <input
            ref={fileInputRef}
            id="file-upload-input-unique"
            type="file"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.mp4"
            style={{ display: 'none' }}
          />

          <div className="flex flex-col items-center space-y-6">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center transition-all duration-200 ${
              dragActive || file
                ? 'bg-success-500'
                : 'bg-success-100'
            }`}>
              <Upload className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-200 ${
                dragActive || file ? 'text-white' : 'text-success-600'
              }`} />
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-success-700">{file.name}</p>
                <p className="text-sm text-secondary font-medium">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-2 text-sm text-secondary hover:text-danger-600 transition-colors underline"
                >
                  Remove and choose another
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-navy-950 mb-2">
                    Drag & drop your creative here
                  </p>
                  <p className="text-secondary">or</p>
                </div>
                <label
                  htmlFor="file-upload-input-unique"
                  onClick={() => {
                    console.log('🖱️ Label clicked - native browser file picker should open');
                  }}
                  className="inline-flex items-center space-x-2 bg-success-500 hover:bg-success-600 text-white px-8 py-4 transition-colors cursor-pointer font-semibold text-lg"
                >
                  <Upload className="w-5 h-5" />
                  <span>Browse Files</span>
                </label>
                <p className="text-sm text-secondary mt-4">
                  Supports <span className="font-medium text-navy-600">JPG, PNG, MP4</span> files up to <span className="font-medium text-navy-600">50MB</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-danger-50 border-l-4 border-danger-500">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-danger-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-danger-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Location Input */}
        <div className="mt-8">
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

        {/* Distance Information */}
        {billboardMetadata?.location.distanceFromRoadM && (
          <div className="mt-8 p-4 bg-success-50 border-l-4 border-success-500">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 flex items-center justify-center">
                <Target className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <span className="text-sm text-secondary">Viewing Distance</span>
                <p className="font-bold text-lg text-success-700">
                  <span className="ltr-numbers">{billboardMetadata.location.distanceFromRoadM}</span>m from road
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
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
                <span>Analyzing Billboard...</span>
              </span>
            ) : 'Analyze Readability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
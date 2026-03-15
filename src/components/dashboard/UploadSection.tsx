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

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Upload Your Billboard Creative</h2>
          <p className="text-gray-500 mt-2">Get AI-powered readability analysis in seconds</p>
        </div>

        {/* File Upload Area - Enhanced Visual Prominence */}
        <div
          className={`relative border-3 border-dashed rounded-2xl p-8 sm:p-16 text-center transition-all duration-300 ${
            dragActive
              ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-[1.02] shadow-lg'
              : file
                ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50'
                : 'border-gray-300 bg-gradient-to-br from-gray-50/50 to-slate-50/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50'
          }`}
          style={{
            borderWidth: '3px',
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
          {/* Background decoration */}
          {!file && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              <div className="absolute top-4 right-4 w-32 h-32 bg-blue-100/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-100/30 rounded-full blur-xl"></div>
            </div>
          )}

          <input
            ref={fileInputRef}
            id="file-upload-input-unique"
            type="file"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.mp4"
            style={{ display: 'none' }}
          />

          <div className="relative flex flex-col items-center space-y-6">
            <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragActive
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110'
                : file
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'
                  : 'bg-gradient-to-br from-blue-100 to-purple-100'
            }`}>
              <Upload className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                dragActive || file ? 'text-white' : 'text-blue-500'
              }`} />
            </div>

            {file ? (
              <div className="space-y-2">
                <p className="text-xl font-bold text-green-700">{file.name}</p>
                <p className="text-sm text-gray-500 font-medium">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                  className="mt-2 text-sm text-gray-500 hover:text-red-500 transition-colors underline"
                >
                  Remove and choose another
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    Drag & drop your creative here
                  </p>
                  <p className="text-gray-500">or</p>
                </div>
                <label
                  htmlFor="file-upload-input-unique"
                  onClick={() => {
                    console.log('🖱️ Label clicked - native browser file picker should open');
                  }}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 cursor-pointer font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95 transform hover:-translate-y-0.5"
                >
                  <Upload className="w-5 h-5" />
                  <span>Browse Files</span>
                </label>
                <p className="text-sm text-gray-400 mt-4">
                  Supports <span className="font-medium text-gray-500">JPG, PNG, MP4</span> files up to <span className="font-medium text-gray-500">50MB</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Location Input */}
        <div className="mt-8">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
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
          <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 rounded-xl">
            <div className="flex items-center space-x-3 text-blue-800">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-sm text-gray-600">Viewing Distance</span>
                <p className="font-bold text-lg text-blue-700">
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
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none"
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
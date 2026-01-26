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

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Upload Your Billboard Creative</h2>
        
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50'
              : file
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
          }`}
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
          style={{ cursor: file ? 'default' : 'pointer' }}
        >
          <input
            ref={fileInputRef}
            id="file-upload-input-unique"
            type="file"
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png,.mp4"
            style={{ display: 'none' }}
          />
          
          <div className="flex flex-col items-center space-y-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              file ? 'bg-green-100' : 'bg-gray-100'
            }`}>
              <Upload className={`w-8 h-8 ${file ? 'text-green-500' : 'text-gray-400'}`} />
            </div>
            
            {file ? (
              <div>
                <p className="text-lg font-semibold text-green-700">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-semibold text-gray-700 mb-2">
                  Drag & drop your creative here
                </p>
                <p className="text-gray-500 mb-4">or</p>
                <label
                  htmlFor="file-upload-input-unique"
                  onClick={() => {
                    console.log('🖱️ Label clicked - native browser file picker should open');
                  }}
                  className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 cursor-pointer font-medium shadow-md hover:shadow-lg active:scale-95"
                >
                  Browse Files
                </label>
                <p className="text-sm text-gray-400 mt-4">
                  Supports JPG, PNG, MP4 files up to 50MB
                </p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">!</span>
              </div>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Location Input */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
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
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <Target className="w-5 h-5" />
              <span className="font-medium">Viewing Distance:</span>
              <span className="font-semibold">
                <span className="ltr-numbers">{billboardMetadata.location.distanceFromRoadM}</span>m from road
              </span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !file}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing Billboard...' : 'Analyze Readability'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
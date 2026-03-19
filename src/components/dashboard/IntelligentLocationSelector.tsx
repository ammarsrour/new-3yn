import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from '@react-google-maps/api';
import {
  MapPin,
  Navigation,
  Search,
  X,
  Clock,
  Globe,
  Eye,
  Gauge,
  DollarSign,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Target
} from 'lucide-react';
import { BillboardLocation, BillboardMetadata } from '../../types/billboard';
import { BillboardDataService } from '../../services/billboardDataService';
import LocationComparison from './LocationComparison';

// Muscat center coordinates
const MUSCAT_CENTER = { lat: 23.5880, lng: 58.3829 };

// Fallback coordinates by district
const DISTRICT_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'darsait': { lat: 23.6100, lng: 58.5400 },
  'cbd': { lat: 23.6100, lng: 58.5400 },
  'al amerat': { lat: 23.5200, lng: 58.5500 },
  'amerat': { lat: 23.5200, lng: 58.5500 },
  'al mouj': { lat: 23.6200, lng: 58.2800 },
  'madinat al-irfan': { lat: 23.5900, lng: 58.3200 },
  'ruwi': { lat: 23.5900, lng: 58.5400 },
  'al khuwair': { lat: 23.5950, lng: 58.4100 },
  'qurum': { lat: 23.5850, lng: 58.4350 },
};

// Map container style
const mapContainerStyle = {
  width: '100%',
  height: '350px',
};

// Map options - defined as plain object, typed inside component when google is available
const mapOptionsConfig = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

// Get marker color based on difficulty
const getDifficultyMarkerColor = (difficulty?: string): string => {
  switch (difficulty) {
    case 'easy': return '#22c55e';      // green-500
    case 'medium': return '#eab308';    // yellow-500
    case 'hard': return '#f97316';      // orange-500
    case 'extreme': return '#ef4444';   // red-500
    default: return '#6b7280';          // gray-500
  }
};

interface IntelligentLocationSelectorProps {
  value: string;
  onChange: (location: string, metadata?: BillboardMetadata) => void;
  error?: string;
  brandCategory?: string;
}

const IntelligentLocationSelector: React.FC<IntelligentLocationSelectorProps> = ({
  value,
  onChange,
  error,
  brandCategory
}) => {
  const { t } = useTranslation();

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });
  const [inputMode, setInputMode] = useState<'billboard' | 'address' | 'coordinates'>('billboard');
  const [suggestions, setSuggestions] = useState<BillboardLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BillboardLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isValidating, setIsValidating] = useState(false);
  const [comparisonLocations, setComparisonLocations] = useState<BillboardLocation[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedMapMarker, setSelectedMapMarker] = useState<BillboardLocation | null>(null);
  const [mapError, setMapError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  // Get coordinates for a location with fallback to district
  const getCoordinatesForLocation = useCallback((location: BillboardLocation): { lat: number; lng: number } => {
    // Check if location has its own coordinates
    if (location.location?.latitude && location.location?.longitude) {
      return { lat: location.location.latitude, lng: location.location.longitude };
    }

    // Check district for fallback coordinates
    const districtLower = location.district?.toLowerCase() || '';
    const addressLower = (location.addressLandmark || '').toLowerCase();

    for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (districtLower.includes(key) || addressLower.includes(key)) {
        // Add slight offset to prevent marker overlap
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.008,
          lng: coords.lng + (Math.random() - 0.5) * 0.008,
        };
      }
    }

    // Default to Muscat center with offset
    return {
      lat: MUSCAT_CENTER.lat + (Math.random() - 0.5) * 0.02,
      lng: MUSCAT_CENTER.lng + (Math.random() - 0.5) * 0.02,
    };
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    if (newValue.length >= 2 && inputMode === 'billboard') {
      const searchResults = BillboardDataService.searchLocations(newValue);
      setSuggestions(searchResults);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: BillboardLocation) => {
    setSelectedLocation(location);
    onChange(location.locationName, BillboardDataService.generateMetadata(location));
    setShowSuggestions(false);
    setIsValidating(false);
  };

  const addToComparison = (location: BillboardLocation) => {
    if (comparisonLocations.length < 3 && !comparisonLocations.find(l => l.id === location.id)) {
      setComparisonLocations([...comparisonLocations, location]);
    }
  };

  const removeFromComparison = (locationId: string) => {
    setComparisonLocations(comparisonLocations.filter(l => l.id !== locationId));
  };

  // Quieter difficulty colors - navy-tinted instead of semantic
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-surface-100 text-navy-700';
      case 'medium': return 'bg-surface-100 text-navy-700';
      case 'hard': return 'bg-navy-100 text-navy-800';
      case 'extreme': return 'bg-navy-200 text-navy-900';
      default: return 'bg-surface-100 text-navy-700';
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-3 h-3" />;
      case 'medium': return <Info className="w-3 h-3" />;
      case 'hard': return <AlertTriangle className="w-3 h-3" />;
      case 'extreme': return <AlertTriangle className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  // Quieter ROI colors - navy primary, danger only for poor
  const getROIColor = (score?: number) => {
    if (!score) return 'text-secondary';
    if (score >= 70) return 'text-navy-950';
    if (score >= 50) return 'text-navy-700';
    return 'text-danger-600';
  };

  const filteredSuggestions = filterDifficulty === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.readabilityDifficulty === filterDifficulty);

  const allLocations = BillboardDataService.getAllLocations();

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputMode('billboard')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'billboard'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Billboard Locations
        </button>
        <button
          type="button"
          onClick={() => setInputMode('address')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'address'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Custom Address
        </button>
        <button
          type="button"
          onClick={() => setInputMode('coordinates')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'coordinates'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Coordinates
        </button>
      </div>

      {/* Difficulty Filter (Billboard Mode Only) */}
      {inputMode === 'billboard' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-secondary">Filter by difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="text-sm border border-surface-300 px-2 py-1"
          >
            <option value="all">All Locations</option>
            <option value="easy">Easy (Low Speed)</option>
            <option value="medium">Medium (Urban)</option>
            <option value="hard">Hard (Highway)</option>
            <option value="extreme">Extreme (Expressway)</option>
          </select>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              showMap ? 'bg-navy-950 text-white' : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1 text-sm font-medium transition-colors ${
              showComparison ? 'bg-navy-950 text-white' : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            Compare ({comparisonLocations.length})
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Search className="w-4 h-4 text-navy-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (inputMode === 'billboard') {
                setSuggestions(allLocations);
                setShowSuggestions(true);
              }
            }}
            placeholder={
              inputMode === 'billboard'
                ? 'Search billboard locations (e.g., Sultan Qaboos, OOMCO, Al Mouj)'
                : inputMode === 'address'
                ? 'Enter custom address'
                : 'Enter coordinates (e.g., 23.5880, 58.3829)'
            }
            className={`w-full pl-10 pr-20 py-3 border focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors ${
              error ? 'border-danger-300 bg-danger-50' : 'border-surface-300'
            }`}
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isValidating && (
              <div className="w-4 h-4 border-2 border-navy-500 border-t-transparent animate-spin"></div>
            )}

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setSelectedLocation(null);
                }}
                className="text-navy-400 hover:text-navy-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && inputMode === 'billboard' && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-surface-200 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-secondary mb-2 flex items-center justify-between">
                <span>🇴🇲 Muscat Billboard Locations ({filteredSuggestions.length})</span>
                <span>ROI Score</span>
              </div>
              {filteredSuggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-3 hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-navy-500 flex-shrink-0" />
                        <span className="font-medium text-navy-950 truncate">
                          {location.locationName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToComparison(location);
                          }}
                          className="text-xs text-navy-600 hover:text-navy-800 px-2 py-1 bg-surface-100"
                        >
                          + Compare
                        </button>
                      </div>
                      <div className="text-sm text-secondary mb-2">
                        {location.addressLandmark}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs font-medium flex items-center space-x-1 ${getDifficultyColor(location.readabilityDifficulty)}`}>
                          {getDifficultyIcon(location.readabilityDifficulty)}
                          <span>{location.readabilityDifficulty?.toUpperCase()}</span>
                        </span>

                        <span className="px-2 py-1 bg-surface-100 text-navy-700 text-xs">
                          {location.boardType}
                        </span>

                        <span className="px-2 py-1 bg-surface-100 text-navy-700 text-xs flex items-center space-x-1">
                          <Gauge className="w-3 h-3" />
                          <span>{location.speedLimitKmh} km/h</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-right ml-3">
                      <div className={`text-lg font-bold ${getROIColor(location.roiScore)}`}>
                        {location.roiScore || 'N/A'}
                      </div>
                      <div className="text-xs text-secondary">ROI Score</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map View */}
      {showMap && inputMode === 'billboard' && (
        <div className="bg-surface-50 border-l-2 border-navy-300 p-6">
          <h4 className="font-semibold text-navy-950 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-navy-600" />
            Muscat Billboard Locations Map
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {['easy', 'medium', 'hard', 'extreme'].map((difficulty) => {
              const count = allLocations.filter(l => l.readabilityDifficulty === difficulty).length;
              return (
                <div key={difficulty} className={`p-3 rounded-lg ${getDifficultyColor(difficulty)}`}>
                  <div className="flex items-center space-x-2">
                    {getDifficultyIcon(difficulty)}
                    <span className="font-medium capitalize">{difficulty}</span>
                  </div>
                  <div className="text-sm mt-1">{count} locations</div>
                </div>
              );
            })}
          </div>
          
          <div className="overflow-hidden border border-surface-200">
            {loadError || mapError ? (
              <div className="w-full h-[350px] bg-surface-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-navy-400 mx-auto mb-3" />
                  <p className="text-navy-600 font-medium">Map unavailable</p>
                  <p className="text-secondary text-sm mt-1">Please check your API key or try again later</p>
                </div>
              </div>
            ) : !isLoaded ? (
              <div className="w-full h-[350px] bg-surface-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent animate-spin mx-auto mb-3"></div>
                  <p className="text-secondary text-sm">Loading map...</p>
                </div>
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={MUSCAT_CENTER}
                zoom={11}
                onLoad={onMapLoad}
                options={mapOptionsConfig}
              >
                {allLocations.map((location) => {
                  const coords = getCoordinatesForLocation(location);
                  const markerColor = getDifficultyMarkerColor(location.readabilityDifficulty);

                  return (
                    <MarkerF
                      key={location.id}
                      position={coords}
                      onClick={() => setSelectedMapMarker(location)}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: markerColor,
                        fillOpacity: 1,
                        strokeColor: 'white',
                        strokeWeight: 2,
                      }}
                    />
                  );
                })}

                {selectedMapMarker && (
                  <InfoWindowF
                    position={getCoordinatesForLocation(selectedMapMarker)}
                    onCloseClick={() => setSelectedMapMarker(null)}
                  >
                    <div className="p-2 max-w-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <h4 className="font-bold text-navy-950 text-sm mb-2">
                        {selectedMapMarker.locationName}
                      </h4>

                      <div className="space-y-1 text-xs mb-3">
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium w-20">District:</span>
                          <span>{selectedMapMarker.district}</span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium w-20">Board:</span>
                          <span>{selectedMapMarker.boardType}</span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium w-20">Speed:</span>
                          <span>{selectedMapMarker.speedLimitKmh} km/h</span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium w-20">Difficulty:</span>
                          <span className={`px-2 py-0.5 text-xs font-medium ${getDifficultyColor(selectedMapMarker.readabilityDifficulty)}`}>
                            {selectedMapMarker.readabilityDifficulty?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          handleLocationSelect(selectedMapMarker);
                          setSelectedMapMarker(null);
                        }}
                        className="w-full bg-navy-950 hover:bg-navy-800 text-white text-xs font-medium py-2 px-3 transition-colors"
                      >
                        Select This Location
                      </button>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
          </div>
        </div>
      )}

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="bg-surface-50 border-l-2 border-navy-300 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-navy-950 text-lg mb-1">
                {selectedLocation.locationName}
              </h4>
              <p className="text-secondary text-sm">
                {selectedLocation.addressLandmark}
              </p>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className={`text-2xl font-bold ${getROIColor(selectedLocation.roiScore)}`}>
                  {selectedLocation.roiScore.toFixed(2)}/100
                </div>
                <div className="text-xs text-secondary">ROI Score</div>

                {selectedLocation.roiBreakdown && (
                  <div className="absolute hidden group-hover:block bg-navy-900 text-white text-xs p-3 right-0 top-full mt-2 w-64 z-10">
                    <div className="font-semibold mb-2 border-b border-navy-700 pb-2">ROI Breakdown:</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-navy-300">Daily impressions:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.dailyImpressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-navy-300">Monthly cost:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.monthlyCost} OMR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-navy-300">CPM:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.cpm} OMR</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-navy-700 flex justify-between">
                        <span className="text-navy-300">Position:</span>
                        <span className="font-semibold text-white">{selectedLocation.roiBreakdown.marketPosition}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Profile Section */}
          <div className="bg-white p-4 mb-4">
            <h5 className="font-semibold text-navy-950 mb-3">Location Profile</h5>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-secondary mb-1">Traffic Type</div>
                <div className="font-medium text-navy-950">
                  {BillboardDataService.getTrafficType(selectedLocation)}
                </div>
              </div>
              <div>
                <div className="text-sm text-secondary mb-1">Primary Audience</div>
                <div className="font-medium text-navy-950">
                  {BillboardDataService.getAudienceEstimate(selectedLocation)}
                </div>
              </div>
              <div>
                <div className="text-sm text-secondary mb-1">Competition Level</div>
                <div className="font-medium text-navy-950">
                  {BillboardDataService.getCompetitionLevel(selectedLocation)}
                </div>
              </div>
            </div>
          </div>

          {/* Location Scoring */}
          <div className="bg-white p-4 mb-4">
            <h5 className="font-semibold text-navy-950 mb-3">Location Scoring</h5>
            {(() => {
              const score = BillboardDataService.calculateLocationScore(selectedLocation);
              return (
                <div className="space-y-3">
                  {/* Three Main Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-surface-50">
                    <div className="text-center relative group">
                      <div className={`text-2xl font-bold ${
                        score.roiScore >= 70 ? 'text-navy-950' :
                        score.roiScore >= 50 ? 'text-navy-700' : 'text-danger-600'
                      }`}>
                        {score.roiScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-secondary">ROI Score</div>
                      <div className="text-xs text-secondary mt-1">Business value & impressions</div>

                      {selectedLocation.roiBreakdown && (
                        <div className="absolute hidden group-hover:block bg-navy-900 text-white text-xs p-3 left-1/2 -translate-x-1/2 top-full mt-2 w-64 z-10">
                          <div className="font-semibold mb-2 border-b border-navy-700 pb-2">ROI Breakdown:</div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-navy-300">Daily impressions:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.dailyImpressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-navy-300">Monthly cost:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.monthlyCost} OMR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-navy-300">CPM:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.cpm} OMR</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-navy-700 flex justify-between">
                              <span className="text-navy-300">Position:</span>
                              <span className="font-semibold text-white">{selectedLocation.roiBreakdown.marketPosition}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        score.readabilityScore >= 70 ? 'text-navy-950' :
                        score.readabilityScore >= 50 ? 'text-navy-700' : 'text-danger-600'
                      }`}>
                        {score.readabilityScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-secondary">Readability Score</div>
                      <div className="text-xs text-secondary mt-1">Speed & distance factors</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        score.suitabilityScore >= 70 ? 'text-navy-950' :
                        score.suitabilityScore >= 50 ? 'text-navy-700' : 'text-danger-600'
                      }`}>
                        {score.suitabilityScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-secondary">Suitability Score</div>
                      <div className="text-xs text-secondary mt-1">Overall strategic fit</div>
                    </div>
                  </div>

                  {/* Component Breakdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Speed Score (30%)</span>
                    <span className="font-medium">{score.speedScore.toFixed(2)}/30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Distance Score (25%)</span>
                    <span className="font-medium">{score.distanceScore.toFixed(2)}/25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Size Score (20%)</span>
                    <span className="font-medium">{score.sizeScore.toFixed(2)}/20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-secondary">Cost Efficiency (25%)</span>
                    <span className="font-medium">{score.costScore.toFixed(2)}/25</span>
                  </div>
                  <div className="border-t border-surface-200 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-navy-950">Total Score</span>
                    <span className={`text-xl font-bold ${
                      score.totalScore >= 70 ? 'text-navy-950' :
                      score.totalScore >= 50 ? 'text-navy-700' : 'text-danger-600'
                    }`}>
                      {score.totalScore.toFixed(2)}/100
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Dynamic Recommendations */}
          <div className="bg-white p-4 mb-4">
            <h5 className="font-semibold text-navy-950 mb-3">Strategic Recommendations</h5>
            {(() => {
              const recommendations = BillboardDataService.getLocationRecommendations(selectedLocation);
              return (
                <div className="space-y-3">
                  <div className="bg-surface-50 border-l-2 border-navy-300 p-3">
                    <h6 className="font-medium text-navy-950 mb-1 flex items-center">
                      <Gauge className="w-4 h-4 mr-2 text-navy-600" />
                      Speed-Based Strategy
                    </h6>
                    <p className="text-secondary text-sm">{recommendations.speedRecommendation}</p>
                  </div>

                  <div className="bg-surface-50 border-l-2 border-navy-300 p-3">
                    <h6 className="font-medium text-navy-950 mb-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-navy-600" />
                      Location Intelligence
                    </h6>
                    <p className="text-secondary text-sm">{recommendations.locationInsight}</p>
                  </div>

                  <div className="bg-surface-50 border-l-2 border-navy-300 p-3">
                    <h6 className="font-medium text-navy-950 mb-1 flex items-center">
                      <Target className="w-4 h-4 mr-2 text-navy-600" />
                      Creative Strategy
                    </h6>
                    <p className="text-secondary text-sm">{recommendations.creativeStrategy}</p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-navy-600" />
                <span className="font-medium text-navy-950">Viewing</span>
              </div>
              <div className="text-sm text-secondary">
                <div>Distance: {selectedLocation.distanceFromRoadM || 'Est. 75'}m</div>
                <div>Direction: {selectedLocation.trafficDirectionVisibility}</div>
                <div>Lighting: {selectedLocation.lighting}</div>
              </div>
            </div>

            <div className="bg-white p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-4 h-4 text-navy-600" />
                <span className="font-medium text-navy-950">Traffic</span>
              </div>
              <div className="text-sm text-secondary">
                <div>Speed: {selectedLocation.speedLimitKmh} km/h</div>
                <div>Road: {selectedLocation.roadType}</div>
                <div>Type: {selectedLocation.boardType}</div>
              </div>
            </div>

            <div className="bg-white p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-navy-600" />
                <span className="font-medium text-navy-950">Business</span>
              </div>
              <div className="text-sm text-secondary">
                <div>Format: {selectedLocation.format}</div>
                <div>Owner: {selectedLocation.ownershipManagement.split(' ')[0]}</div>
                <div>District: {selectedLocation.district}</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4">
            <h5 className="font-medium text-navy-950 mb-2">AI Analysis Context</h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-navy-700">Readability Factors:</span>
                <ul className="text-secondary mt-1 space-y-1">
                  <li>• Speed-based font size requirements</li>
                  <li>• Distance-optimized contrast ratios</li>
                  <li>• Traffic flow visibility patterns</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-navy-700">Business Intelligence:</span>
                <ul className="text-secondary mt-1 space-y-1">
                  <li>• Estimated monthly impressions</li>
                  <li>• Competitive landscape analysis</li>
                  <li>• ROI optimization recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Comparison */}
      {showComparison && comparisonLocations.length > 0 && (
        <div className="mt-6">
          <LocationComparison 
            locations={comparisonLocations}
            brandCategory={brandCategory}
            onRemoveLocation={removeFromComparison}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-danger-600 text-sm flex items-center space-x-2">
          <div className="w-4 h-4 bg-danger-500 flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default IntelligentLocationSelector;
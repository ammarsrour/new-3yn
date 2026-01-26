import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Search, X, Clock, Globe } from 'lucide-react';
import {
  validateLocation,
  getCurrentLocation,
  getLocationSuggestions,
  saveRecentLocation,
  getRecentLocations,
  COMMON_LOCATIONS,
  LocationData,
  LocationSuggestion
} from '../../services/locationService';
import { activityLogger } from '../../services/activityLogger';

interface LocationInputProps {
  value: string;
  onChange: (location: string, locationData?: LocationData) => void;
  error?: string;
  userId?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChange, error, userId }) => {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState<'address' | 'coordinates'>('address');
  const [isValidating, setIsValidating] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentLocations, setRecentLocations] = useState<Array<{
    address: string;
    coordinates: { lat: number; lng: number };
    timestamp: number;
  }>>([]);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRecentLocations(getRecentLocations());
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

  const handleInputChange = async (newValue: string) => {
    onChange(newValue);
    
    if (newValue.length >= 3 && inputMode === 'address') {
      try {
        const locationSuggestions = await getLocationSuggestions(newValue);
        setSuggestions(locationSuggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.warn('Failed to get suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = async (selectedLocation: string) => {
    onChange(selectedLocation);
    setShowSuggestions(false);
    setIsValidating(true);

    try {
      const validated = await validateLocation(selectedLocation);
      setLocationData(validated);

      if (validated.valid) {
        saveRecentLocation(validated);
        setRecentLocations(getRecentLocations());
        onChange(selectedLocation, validated);

        if (userId) {
          activityLogger.logLocationSelect(userId, selectedLocation, validated.coordinates);
        }
      }
    } catch (error) {
      console.error('Location validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsGettingLocation(true);
    try {
      const coords = await getCurrentLocation();
      const validated = await validateLocation(`${coords.lat}, ${coords.lng}`);
      
      if (validated.valid) {
        onChange(validated.address, validated);
        setLocationData(validated);
        saveRecentLocation(validated);
        setRecentLocations(getRecentLocations());
      }
    } catch (error) {
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      toast.textContent = error.message || 'Unable to get current location';
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 5000);
    } finally {
      setIsGettingLocation(false);
    }
  };

  const clearInput = () => {
    onChange('');
    setLocationData(null);
    setShowSuggestions(false);
  };

  const getLocationIcon = () => {
    if (locationData?.valid) {
      return <div className="w-2 h-2 bg-green-500 rounded-full"></div>;
    }
    if (error) {
      return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
    }
    return <Search className="w-4 h-4 text-gray-400" />;
  };

  const formatCoordinates = (lat: number, lng: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}، ${Math.abs(lng).toFixed(4)}°${lngDir}`;
  };

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputMode('address')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === 'address'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          {t('dashboard.location.address')}
        </button>
        <button
          type="button"
          onClick={() => setInputMode('coordinates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === 'coordinates'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          {t('dashboard.location.coordinates')}
        </button>
      </div>

      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {getLocationIcon()}
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (inputMode === 'address' && (suggestions.length > 0 || recentLocations.length > 0)) {
                setShowSuggestions(true);
              }
            }}
            placeholder={
              inputMode === 'address' 
                ? t('dashboard.location.addressPlaceholder')
                : t('dashboard.location.coordinatesPlaceholder')
            }
            className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isValidating && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            
            {value && (
              <button
                type="button"
                onClick={clearInput}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              title={t('dashboard.location.useCurrentLocation')}
            >
              <Navigation className={`w-4 h-4 ${isGettingLocation ? 'animate-pulse' : ''}`} />
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {/* Recent Locations */}
            {recentLocations.length > 0 && (
              <div className="p-2 border-b border-gray-100">
                <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{t('dashboard.location.recentLocations')}</span>
                </div>
                {recentLocations.slice(0, 3).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                  >
                    {location.address}
                  </button>
                ))}
              </div>
            )}

            {/* Common Locations */}
            {inputMode === 'address' && value.length < 3 && (
              <div className="p-2 border-b border-gray-100">
                <div className="text-xs text-gray-500 mb-2">🇴🇲 Muscat Billboard Locations</div>
                {COMMON_LOCATIONS.slice(7).map((location, index) => ( // Show your billboard locations first
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded text-sm text-gray-700 border-l-2 border-blue-400"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <div>
                        <div className="font-medium">{location.address.split(' - ')[0]}</div>
                        <div className="text-xs text-gray-500">{location.type}</div>
                      </div>
                    </div>
                  </button>
                ))}
                
                <div className="text-xs text-gray-500 mb-2 mt-4">Popular Locations</div>
                {COMMON_LOCATIONS.slice(0, 7).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{location.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-500 mb-2">{t('dashboard.location.suggestions')}</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(suggestion.address)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded text-sm text-gray-700"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="w-3 h-3 text-gray-400" />
                      <span>{suggestion.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Mode Help Text */}
      <div className="text-xs text-gray-500">
        {inputMode === 'coordinates' ? (
          <span>{t('dashboard.location.example')}</span>
        ) : (
          <span>{t('dashboard.location.helpText')}</span>
        )}
      </div>

      {/* Location Context Display */}
      {locationData?.valid && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-blue-900 mb-1">
                {locationData.address}
              </div>
              <div className="text-sm text-blue-700 mb-2 ltr-numbers">
                {formatCoordinates(locationData.coordinates.lat, locationData.coordinates.lng)}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  locationData.context.type === 'highway' ? 'bg-red-100 text-red-800' :
                  locationData.context.type === 'urban' ? 'bg-blue-100 text-blue-800' :
                  locationData.context.type === 'suburban' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {locationData.context.type.charAt(0).toUpperCase() + locationData.context.type.slice(1)}
                </span>
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium ltr-numbers">
                  {locationData.context.speed} mph
                </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                  {locationData.context.trafficDensity} traffic
                </span>
                {locationData.context.country !== 'Unknown' && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                    {locationData.context.country}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-red-600 text-sm flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LocationInput;
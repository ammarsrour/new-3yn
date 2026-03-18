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
      return <div className="w-2 h-2 bg-success-500"></div>;
    }
    if (error) {
      return <div className="w-2 h-2 bg-danger-500"></div>;
    }
    return <Search className="w-4 h-4 text-navy-400" />;
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
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            inputMode === 'address'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          {t('dashboard.location.address')}
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
                onClick={clearInput}
                className="text-navy-400 hover:text-navy-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={isGettingLocation}
              className="text-navy-500 hover:text-navy-700 transition-colors disabled:opacity-50"
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
            className="absolute z-10 w-full mt-1 bg-white border border-surface-200 max-h-64 overflow-y-auto"
          >
            {/* Recent Locations */}
            {recentLocations.length > 0 && (
              <div className="p-2 border-b border-surface-100">
                <div className="flex items-center space-x-2 text-xs text-secondary mb-2">
                  <Clock className="w-3 h-3" />
                  <span>{t('dashboard.location.recentLocations')}</span>
                </div>
                {recentLocations.slice(0, 3).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-50 text-sm text-navy-700"
                  >
                    {location.address}
                  </button>
                ))}
              </div>
            )}

            {/* Common Locations */}
            {inputMode === 'address' && value.length < 3 && (
              <div className="p-2 border-b border-surface-100">
                <div className="text-xs text-secondary mb-2">🇴🇲 Muscat Billboard Locations</div>
                {COMMON_LOCATIONS.slice(7).map((location, index) => ( // Show your billboard locations first
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-info-50 text-sm text-navy-700 border-l-2 border-info-400"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-navy-400" />
                      <div>
                        <div className="font-medium">{location.address.split(' - ')[0]}</div>
                        <div className="text-xs text-secondary">{location.type}</div>
                      </div>
                    </div>
                  </button>
                ))}

                <div className="text-xs text-secondary mb-2 mt-4">Popular Locations</div>
                {COMMON_LOCATIONS.slice(0, 7).map((location, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(location.address)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-50 text-sm text-navy-700"
                  >
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-navy-400" />
                      <span>{location.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-secondary mb-2">{t('dashboard.location.suggestions')}</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleLocationSelect(suggestion.address)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-50 text-sm text-navy-700"
                  >
                    <div className="flex items-center space-x-2">
                      <Search className="w-3 h-3 text-navy-400" />
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
      <div className="text-xs text-secondary">
        {inputMode === 'coordinates' ? (
          <span>{t('dashboard.location.example')}</span>
        ) : (
          <span>{t('dashboard.location.helpText')}</span>
        )}
      </div>

      {/* Location Context Display */}
      {locationData?.valid && (
        <div className="bg-info-50 border-l-4 border-info-500 p-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-info-500 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium text-info-900 mb-1">
                {locationData.address}
              </div>
              <div className="text-sm text-info-700 mb-2 ltr-numbers">
                {formatCoordinates(locationData.coordinates.lat, locationData.coordinates.lng)}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-1 text-xs font-medium ${
                  locationData.context.type === 'highway' ? 'bg-danger-100 text-danger-800' :
                  locationData.context.type === 'urban' ? 'bg-info-100 text-info-800' :
                  locationData.context.type === 'suburban' ? 'bg-success-100 text-success-800' :
                  'bg-surface-100 text-navy-800'
                }`}>
                  {locationData.context.type.charAt(0).toUpperCase() + locationData.context.type.slice(1)}
                </span>
                <span className="px-2 py-1 bg-warning-100 text-warning-800 text-xs font-medium ltr-numbers">
                  {locationData.context.speed} mph
                </span>
                <span className="px-2 py-1 bg-info-100 text-info-800 text-xs font-medium">
                  {locationData.context.trafficDensity} traffic
                </span>
                {locationData.context.country !== 'Unknown' && (
                  <span className="px-2 py-1 bg-surface-100 text-navy-800 text-xs font-medium">
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

export default LocationInput;
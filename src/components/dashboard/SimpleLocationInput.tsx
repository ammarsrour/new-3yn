import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { BillboardLocation, BillboardMetadata } from '../../types/billboard';
import { BillboardDataService } from '../../services/billboardDataService';

interface SimpleLocationInputProps {
  value: string;
  onChange: (location: string, metadata?: BillboardMetadata) => void;
  error?: string;
}

/**
 * Distilled location selector - just search and select.
 * The complex map, comparison, and scoring features are available
 * in the full IntelligentLocationSelector for power users.
 */
const SimpleLocationInput: React.FC<SimpleLocationInputProps> = ({
  value,
  onChange,
  error
}) => {
  const [suggestions, setSuggestions] = useState<BillboardLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BillboardLocation | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const allLocations = BillboardDataService.getAllLocations();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    setSelectedLocation(null);

    if (newValue.length >= 2) {
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
  };

  const clearSelection = () => {
    onChange('');
    setSelectedLocation(null);
  };

  return (
    <div className="space-y-2">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="w-4 h-4 text-navy-400" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setSuggestions(allLocations.slice(0, 10));
            setShowSuggestions(true);
          }}
          placeholder="Search billboard locations..."
          className={`w-full pl-10 pr-10 py-3 border transition-colors ${
            error
              ? 'border-danger-300 bg-danger-50'
              : 'border-surface-300 focus:ring-2 focus:ring-navy-500 focus:border-transparent'
          }`}
        />

        {value && (
          <button
            type="button"
            onClick={clearSelection}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-surface-200 max-h-64 overflow-y-auto shadow-sm"
          >
            {suggestions.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left px-3 py-2.5 hover:bg-surface-50 transition-colors border-b border-surface-100 last:border-0"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-navy-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-navy-950 text-sm truncate">
                      {location.locationName}
                    </p>
                    <p className="text-xs text-secondary truncate">
                      {location.district} · {location.speedLimitKmh} km/h
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Summary - minimal */}
      {selectedLocation && (
        <div className="flex items-center justify-between text-sm bg-surface-50 px-3 py-2">
          <span className="text-secondary">
            {selectedLocation.district} · {selectedLocation.boardType}
          </span>
          <span className="text-navy-700 font-medium tabular-nums">
            {selectedLocation.speedLimitKmh} km/h
          </span>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-danger-600 text-sm">{error}</p>
      )}
    </div>
  );
};

export default SimpleLocationInput;

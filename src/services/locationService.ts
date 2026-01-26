export interface LocationData {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  context: {
    type: 'urban' | 'highway' | 'suburban' | 'rural';
    speed: number; // mph
    trafficDensity: 'low' | 'medium' | 'high';
    region: string;
    country: string;
  };
  valid: boolean;
  error?: string;
}

export interface LocationSuggestion {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: string;
}

import { getBillboardLocationSuggestions, searchBillboardLocations } from './billboardLocations';

// Common billboard locations in the region
export const COMMON_LOCATIONS: LocationSuggestion[] = [
  {
    address: "شارع السلطان قابوس، مسقط",
    coordinates: { lat: 23.5880, lng: 58.3829 },
    type: "highway"
  },
  {
    address: "الخوير، مسقط",
    coordinates: { lat: 23.6345, lng: 58.5216 },
    type: "urban"
  },
  {
    address: "منطقة روي التجارية، مسقط",
    coordinates: { lat: 23.6139, lng: 58.5922 },
    type: "urban"
  },
  {
    address: "شارع الشيخ زايد، دبي، الإمارات",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    type: "highway"
  },
  {
    address: "طريق الملك فهد، الرياض، السعودية",
    coordinates: { lat: 24.7136, lng: 46.6753 },
    type: "highway"
  },
  {
    address: "صحار، عُمان",
    coordinates: { lat: 24.3477, lng: 56.7085 },
    type: "urban"
  },
  {
    address: "صلالة، عُمان",
    coordinates: { lat: 17.0151, lng: 54.0924 },
    type: "urban"
  },
  // Add your specific billboard locations
  ...getBillboardLocationSuggestions()
];

export const isCoordinates = (input: string): boolean => {
  const coordPattern = /^-?\d+\.?\d*\s*,\s*-?\d+\.?\d*$/;
  return coordPattern.test(input.trim());
};

export const parseCoordinates = (input: string): { lat: number; lng: number } | null => {
  try {
    const [latStr, lngStr] = input.split(',').map(s => s.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    
    if (isNaN(lat) || isNaN(lng)) return null;
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    
    return { lat, lng };
  } catch {
    return null;
  }
};

export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        let message = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using OpenStreetMap Nominatim API for reverse geocoding (free alternative)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Billboard-Analyzer/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    console.warn('Reverse geocoding failed:', error);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

export const geocodeAddress = async (address: string): Promise<{
  coordinates: { lat: number; lng: number };
  formatted_address: string;
} | null> => {
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Billboard-Analyzer/1.0'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }
    
    const data = await response.json();
    if (data.length === 0) return null;
    
    const result = data[0];
    return {
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon)
      },
      formatted_address: result.display_name
    };
  } catch (error) {
    console.warn('Geocoding failed:', error);
    return null;
  }
};

export const getLocationContext = (coordinates: { lat: number; lng: number }, address: string): LocationData['context'] => {
  const { lat, lng } = coordinates;
  
  // Determine country/region
  let country = 'Unknown';
  let region = 'Unknown';
  
  // Middle East region detection
  if (lat >= 12 && lat <= 42 && lng >= 34 && lng <= 75) {
    if (lat >= 16 && lat <= 32 && lng >= 34 && lng <= 55) {
      country = 'Saudi Arabia';
      region = 'Gulf';
    } else if (lat >= 22 && lat <= 26.5 && lng >= 51 && lng <= 56.5) {
      country = 'UAE';
      region = 'Gulf';
    } else if (lat >= 16 && lat <= 26.5 && lng >= 51.5 && lng <= 59.5) {
      country = 'Oman';
      region = 'Gulf';
    } else {
      region = 'Middle East';
    }
  }
  
  // Determine location type based on address keywords and coordinates
  const addressLower = address.toLowerCase();
  let type: LocationData['context']['type'] = 'urban';
  let speed = 35; // default city speed
  let trafficDensity: LocationData['context']['trafficDensity'] = 'medium';
  
  if (addressLower.includes('highway') || 
      addressLower.includes('freeway') || 
      addressLower.includes('expressway') ||
      addressLower.includes('sultan qaboos') ||
      addressLower.includes('sheikh zayed') ||
      addressLower.includes('king fahd')) {
    type = 'highway';
    speed = 65;
    trafficDensity = 'high';
  } else if (addressLower.includes('rural') || 
             addressLower.includes('countryside') ||
             addressLower.includes('desert')) {
    type = 'rural';
    speed = 45;
    trafficDensity = 'low';
  } else if (addressLower.includes('suburb') || 
             addressLower.includes('residential')) {
    type = 'suburban';
    speed = 25;
    trafficDensity = 'medium';
  } else if (addressLower.includes('business') || 
             addressLower.includes('downtown') ||
             addressLower.includes('city center') ||
             addressLower.includes('ruwi')) {
    type = 'urban';
    speed = 25;
    trafficDensity = 'high';
  }
  
  return {
    type,
    speed,
    trafficDensity,
    region,
    country
  };
};

export const validateLocation = async (input: string): Promise<LocationData> => {
  if (!input.trim()) {
    return {
      coordinates: { lat: 0, lng: 0 },
      address: '',
      context: {
        type: 'urban',
        speed: 35,
        trafficDensity: 'medium',
        region: 'Unknown',
        country: 'Unknown'
      },
      valid: false,
      error: 'Please enter a location'
    };
  }

  try {
    if (isCoordinates(input)) {
      // Handle coordinate format
      const coords = parseCoordinates(input);
      if (!coords) {
        return {
          coordinates: { lat: 0, lng: 0 },
          address: '',
          context: {
            type: 'urban',
            speed: 35,
            trafficDensity: 'medium',
            region: 'Unknown',
            country: 'Unknown'
          },
          valid: false,
          error: 'Invalid coordinates. Use format: 23.5880, 58.3829'
        };
      }

      const address = await reverseGeocode(coords.lat, coords.lng);
      const context = getLocationContext(coords, address);

      return {
        coordinates: coords,
        address,
        context,
        valid: true
      };
    } else {
      // Handle address format
      const geocoded = await geocodeAddress(input);
      if (!geocoded) {
        return {
          coordinates: { lat: 0, lng: 0 },
          address: '',
          context: {
            type: 'urban',
            speed: 35,
            trafficDensity: 'medium',
            region: 'Unknown',
            country: 'Unknown'
          },
          valid: false,
          error: 'Location not found. Please check the address and try again.'
        };
      }

      const context = getLocationContext(geocoded.coordinates, geocoded.formatted_address);

      return {
        coordinates: geocoded.coordinates,
        address: geocoded.formatted_address,
        context,
        valid: true
      };
    }
  } catch (error) {
    return {
      coordinates: { lat: 0, lng: 0 },
      address: '',
      context: {
        type: 'urban',
        speed: 35,
        trafficDensity: 'medium',
        region: 'Unknown',
        country: 'Unknown'
      },
      valid: false,
      error: 'Unable to validate location. Please try again.'
    };
  }
};

export const getLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
  if (query.length < 3) return [];

  try {
    // First, search in your specific billboard locations
    const billboardResults = searchBillboardLocations(query);
    const billboardSuggestions = billboardResults.map(location => ({
      address: `${location.locationName} - ${location.addressLandmark}`,
      coordinates: {
        lat: location.latitude || 23.5880,
        lng: location.longitude || 58.3829
      },
      type: location.boardType.toLowerCase()
    }));

    // Then search OpenStreetMap for additional results
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'Billboard-Analyzer/1.0'
        }
      }
    );

    if (!response.ok) return billboardSuggestions;

    const data = await response.json();
    const osmSuggestions = data.map((item: any) => ({
      address: item.display_name,
      coordinates: {
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon)
      },
      type: item.type || 'unknown'
    }));

    // Combine and prioritize billboard locations
    return [...billboardSuggestions, ...osmSuggestions];
  } catch (error) {
    console.warn('Location suggestions failed:', error);
    return [];
  }
};

// Local storage helpers for location history
export const saveRecentLocation = (location: LocationData) => {
  try {
    const recent = getRecentLocations();
    const newLocation = {
      address: location.address,
      coordinates: location.coordinates,
      timestamp: Date.now()
    };
    
    // Remove duplicates and add new location
    const filtered = recent.filter(loc => loc.address !== location.address);
    const updated = [newLocation, ...filtered].slice(0, 5); // Keep only 5 recent
    
    localStorage.setItem('billboard-recent-locations', JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent location:', error);
  }
};

export const getRecentLocations = (): Array<{
  address: string;
  coordinates: { lat: number; lng: number };
  timestamp: number;
}> => {
  try {
    const stored = localStorage.getItem('billboard-recent-locations');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('Failed to load recent locations:', error);
    return [];
  }
};
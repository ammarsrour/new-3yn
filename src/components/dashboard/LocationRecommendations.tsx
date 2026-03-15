import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { MapPin, Star, DollarSign, Eye, TrendingUp, Map, List } from 'lucide-react';
import { BillboardLocation } from '../../types/billboard';
import { BrandAnalysisData } from './BrandAnalysisForm';

interface LocationRecommendation {
  location: BillboardLocation;
  matchPercentage: number;
  reason: string;
  estimatedImpressions: number;
  rentalCost: string;
}

interface LocationRecommendationsProps {
  brandData: BrandAnalysisData;
  allLocations: BillboardLocation[];
}

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
  'ghala': { lat: 23.5800, lng: 58.4500 },
  'azaiba': { lat: 23.6050, lng: 58.3400 },
  'seeb': { lat: 23.6700, lng: 58.1900 },
  'halban': { lat: 23.5644, lng: 58.2062 },
  'wadi adai': { lat: 23.4731, lng: 58.4945 },
};

// Muscat center coordinates
const MUSCAT_CENTER = { lat: 23.5880, lng: 58.3829 };

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

// Map options for styling
const mapOptions: google.maps.MapOptions = {
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

const LocationRecommendations: React.FC<LocationRecommendationsProps> = ({
  brandData,
  allLocations
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedMarker, setSelectedMarker] = useState<LocationRecommendation | null>(null);
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Check if we're on mobile (for default view mode)
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getCoordinatesForLocation = (location: BillboardLocation): { lat: number; lng: number } => {
    // First check if location has its own coordinates
    if (location.location?.latitude && location.location?.longitude) {
      return { lat: location.location.latitude, lng: location.location.longitude };
    }

    // Check district for fallback coordinates
    const districtLower = location.district?.toLowerCase() || '';

    for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (districtLower.includes(key)) {
        // Add slight offset to prevent marker overlap
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.01,
          lng: coords.lng + (Math.random() - 0.5) * 0.01,
        };
      }
    }

    // Check address/landmark for district hints
    const addressLower = (location.addressLandmark || '').toLowerCase();
    for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (addressLower.includes(key)) {
        return {
          lat: coords.lat + (Math.random() - 0.5) * 0.01,
          lng: coords.lng + (Math.random() - 0.5) * 0.01,
        };
      }
    }

    // Default to Muscat center with offset
    return {
      lat: MUSCAT_CENTER.lat + (Math.random() - 0.5) * 0.02,
      lng: MUSCAT_CENTER.lng + (Math.random() - 0.5) * 0.02,
    };
  };

  const generateRecommendations = (): LocationRecommendation[] => {
    if (!brandData.category || !brandData.targetAge || !brandData.campaignGoal) {
      return [];
    }

    const recommendations: LocationRecommendation[] = [];

    allLocations.forEach((location) => {
      let matchScore = 0;
      let reasons: string[] = [];

      // Brand Category Logic
      switch (brandData.category) {
        case 'Luxury':
          if (location.roadName.toLowerCase().includes('sultan qaboos') ||
              location.highwayDesignation?.includes('N5')) {
            matchScore += 30;
            reasons.push('Premium highway location attracts affluent demographics');
          }
          if (location.district.toLowerCase().includes('cbd') ||
              location.district.toLowerCase().includes('qurum')) {
            matchScore += 20;
            reasons.push('Upscale business district visibility');
          }
          break;

        case 'Family':
          if (location.district.toLowerCase().includes('qurum') ||
              location.district.toLowerCase().includes('azaiba') ||
              location.district.toLowerCase().includes('al khuwair')) {
            matchScore += 35;
            reasons.push('Located in family-friendly residential areas');
          }
          if (location.speedLimitKmh.includes('30-') || location.speedLimitKmh.includes('50')) {
            matchScore += 15;
            reasons.push('Lower speed allows for detailed message absorption');
          }
          break;

        case 'Tech':
          const speedMatch = location.speedLimitKmh.match(/(\d+)/);
          const speed = speedMatch ? parseInt(speedMatch[1]) : 0;
          if (speed >= 80) {
            matchScore += 25;
            reasons.push('High-speed location targets younger, tech-savvy commuters');
          }
          if (location.format.toLowerCase().includes('digital')) {
            matchScore += 30;
            reasons.push('Digital format aligns with tech brand image');
          }
          break;

        case 'B2B':
          if (location.addressLandmark.toLowerCase().includes('business') ||
              location.addressLandmark.toLowerCase().includes('commercial') ||
              location.district.toLowerCase().includes('cbd') ||
              location.locationName.toLowerCase().includes('ocec')) {
            matchScore += 40;
            reasons.push('Strategic business district placement for B2B visibility');
          }
          break;

        case 'Automotive':
          if (location.roadType.toLowerCase().includes('highway') ||
              location.roadType.toLowerCase().includes('expressway')) {
            matchScore += 35;
            reasons.push('Highway placement targets driving audience');
          }
          if (location.boardType.toLowerCase().includes('forecourt')) {
            matchScore += 25;
            reasons.push('Service station location reaches car owners');
          }
          break;

        case 'Real Estate':
          if (location.district.toLowerCase().includes('al mouj') ||
              location.district.toLowerCase().includes('madinat al-irfan') ||
              location.addressLandmark.toLowerCase().includes('development')) {
            matchScore += 30;
            reasons.push('Located near major development projects');
          }
          break;

        case 'Food/Beverage':
          if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
            matchScore += 20;
            reasons.push('Bidirectional visibility maximizes reach');
          }
          if (location.speedLimitKmh.includes('60') || location.speedLimitKmh.includes('80')) {
            matchScore += 15;
            reasons.push('Moderate speed allows appetite appeal messaging');
          }
          break;
      }

      // Age Group Logic
      switch (brandData.targetAge) {
        case '18-25':
          const youngSpeedMatch = location.speedLimitKmh.match(/(\d+)/);
          const youngSpeed = youngSpeedMatch ? parseInt(youngSpeedMatch[1]) : 0;
          if (youngSpeed >= 80) {
            matchScore += 15;
            reasons.push('Fast-paced location appeals to younger demographics');
          }
          if (location.format.toLowerCase().includes('digital')) {
            matchScore += 10;
            reasons.push('Digital format engages younger audience');
          }
          break;

        case '55+':
          if (location.speedLimitKmh.includes('30-') || location.speedLimitKmh.includes('50')) {
            matchScore += 15;
            reasons.push('Lower speed allows comfortable viewing for mature audience');
          }
          break;
      }

      // Campaign Goal Logic
      switch (brandData.campaignGoal) {
        case 'Brand Awareness':
          if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
            matchScore += 15;
            reasons.push('Maximum exposure with bidirectional traffic');
          }
          break;

        case 'Product Launch':
          if (location.format.toLowerCase().includes('digital')) {
            matchScore += 20;
            reasons.push('Dynamic digital format perfect for product launches');
          }
          break;
      }

      // Calculate estimated impressions
      const baseImpressions = calculateImpressions(location);
      const rentalCost = location.rentalRateOmrMonth || 'Contact for pricing';

      if (matchScore > 0) {
        recommendations.push({
          location,
          matchPercentage: Math.min(matchScore, 100),
          reason: reasons.join('. '),
          estimatedImpressions: baseImpressions,
          rentalCost
        });
      }
    });

    // Sort by match percentage and return top 3
    return recommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
  };

  const calculateImpressions = (location: BillboardLocation): number => {
    let baseImpressions = 50000; // Base monthly impressions

    // Adjust for speed (higher speed = more traffic)
    const speedMatch = location.speedLimitKmh.match(/(\d+)/);
    const speed = speedMatch ? parseInt(speedMatch[1]) : 50;
    baseImpressions += speed * 1000;

    // Adjust for traffic direction
    if (location.trafficDirectionVisibility.toLowerCase().includes('bidirectional')) {
      baseImpressions *= 1.8;
    }

    // Adjust for road type
    if (location.roadType.toLowerCase().includes('expressway')) {
      baseImpressions *= 2;
    } else if (location.roadType.toLowerCase().includes('highway')) {
      baseImpressions *= 1.5;
    }

    return Math.round(baseImpressions);
  };

  const recommendations = generateRecommendations();

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapLoaded(true);

    // Fit bounds to show all markers
    if (recommendations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      recommendations.forEach((rec) => {
        const coords = getCoordinatesForLocation(rec.location);
        bounds.extend(coords);
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [recommendations]);

  const handleMarkerClick = (rec: LocationRecommendation) => {
    setSelectedMarker(rec);
  };

  const handleViewDetails = (locationId: string) => {
    setSelectedMarker(null);
    setHighlightedCardId(locationId);

    // Scroll to the card
    const cardElement = cardRefs.current[locationId];
    if (cardElement) {
      cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // Remove highlight after 2 seconds
    setTimeout(() => {
      setHighlightedCardId(null);
    }, 2000);
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-emerald-500" />
          Location Recommendations
        </h3>
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Complete the brand analysis form to see personalized location recommendations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Star className="w-5 h-5 mr-2 text-emerald-500" />
          Top Location Recommendations
        </h3>

        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'map'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-white text-emerald-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List Only</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm h-[250px] md:h-[400px]">
          <LoadScript
            googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}
            loadingElement={
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading map...</p>
                </div>
              </div>
            }
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={MUSCAT_CENTER}
              zoom={11}
              onLoad={onMapLoad}
              options={mapOptions}
            >
              {recommendations.map((rec, index) => {
                const coords = getCoordinatesForLocation(rec.location);
                return (
                  <MarkerF
                    key={rec.location.id}
                    position={coords}
                    onClick={() => handleMarkerClick(rec)}
                    label={{
                      text: String(index + 1),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 14,
                      fillColor: index === 0 ? '#10b981' : index === 1 ? '#6b7280' : '#f97316',
                      fillOpacity: 1,
                      strokeColor: 'white',
                      strokeWeight: 2,
                    }}
                  />
                );
              })}

              {selectedMarker && (
                <InfoWindowF
                  position={getCoordinatesForLocation(selectedMarker.location)}
                  onCloseClick={() => setSelectedMarker(null)}
                >
                  <div className="p-2 max-w-xs" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <h4 className="font-bold text-gray-900 text-base mb-2">
                      {selectedMarker.location.locationName}
                    </h4>

                    <div className="space-y-1.5 text-sm mb-3">
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium text-gray-700 w-24">Board Type:</span>
                        <span>{selectedMarker.location.boardType}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium text-gray-700 w-24">Format:</span>
                        <span>{selectedMarker.location.format}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium text-gray-700 w-24">Impressions:</span>
                        <span className="text-emerald-600 font-semibold">
                          {selectedMarker.estimatedImpressions.toLocaleString()}/mo
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium text-gray-700 w-24">Rental:</span>
                        <span className="text-emerald-600 font-semibold">
                          {selectedMarker.rentalCost.includes('OMR')
                            ? selectedMarker.rentalCost
                            : `OMR ${selectedMarker.rentalCost}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-emerald-600 font-bold text-lg">
                        {selectedMarker.matchPercentage}% Match
                      </span>
                      <button
                        onClick={() => handleViewDetails(selectedMarker.location.id)}
                        className="text-emerald-600 hover:text-emerald-700 font-medium text-sm hover:underline"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          </LoadScript>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div
            key={rec.location.id}
            ref={(el) => (cardRefs.current[rec.location.id] = el)}
            className={`border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300 ${
              highlightedCardId === rec.location.id
                ? 'ring-2 ring-emerald-400 ring-offset-2 animate-pulse'
                : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-emerald-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {rec.location.locationName}
                  </h4>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {rec.location.addressLandmark}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {rec.matchPercentage}%
                </div>
                <div className="text-sm text-gray-500">Match</div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-emerald-900 mb-2">Why This Location:</h5>
              <p className="text-emerald-800 text-sm">{rec.reason}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-sm text-gray-500">Monthly Cost</div>
                  <div className="font-semibold text-gray-900">
                    {rec.rentalCost.includes('OMR') ? rec.rentalCost : `OMR ${rec.rentalCost}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-sm text-gray-500">Est. Impressions</div>
                  <div className="font-semibold text-gray-900">
                    {rec.estimatedImpressions.toLocaleString()}/mo
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <div>
                  <div className="text-sm text-gray-500">Board Type</div>
                  <div className="font-semibold text-gray-900">
                    {rec.location.boardType}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                {rec.location.roadType}
              </span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                {rec.location.speedLimitKmh} km/h
              </span>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">
                {rec.location.format}
              </span>
              {rec.location.lighting !== 'TBD' && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">
                  {rec.location.lighting}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">Pro Tip:</h5>
        <p className="text-gray-700 text-sm">
          These recommendations are based on your brand profile. Consider running A/B tests across multiple locations
          to optimize your campaign performance. Digital billboards offer more flexibility for testing different messages.
        </p>
      </div>
    </div>
  );
};

export default LocationRecommendations;

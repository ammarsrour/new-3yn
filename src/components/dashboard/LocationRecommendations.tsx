import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
const MUSCAT_CENTER: [number, number] = [23.5880, 58.3829];

// Create custom marker icons
const createMarkerIcon = (color: string, label: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        font-family: 'Plus Jakarta Sans', sans-serif;
      ">${label}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Component to fit map bounds
const FitBounds: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);

  return null;
};

const LocationRecommendations: React.FC<LocationRecommendationsProps> = ({
  brandData,
  allLocations
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [highlightedCardId, setHighlightedCardId] = useState<string | null>(null);
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

  const getCoordinatesForLocation = (location: BillboardLocation): [number, number] => {
    // First check if location has its own coordinates
    if (location.location?.latitude && location.location?.longitude) {
      return [location.location.latitude, location.location.longitude];
    }

    // Check district for fallback coordinates
    const districtLower = location.district?.toLowerCase() || '';

    for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (districtLower.includes(key)) {
        // Add slight offset to prevent marker overlap
        return [
          coords.lat + (Math.random() - 0.5) * 0.01,
          coords.lng + (Math.random() - 0.5) * 0.01,
        ];
      }
    }

    // Check address/landmark for district hints
    const addressLower = (location.addressLandmark || '').toLowerCase();
    for (const [key, coords] of Object.entries(DISTRICT_COORDINATES)) {
      if (addressLower.includes(key)) {
        return [
          coords.lat + (Math.random() - 0.5) * 0.01,
          coords.lng + (Math.random() - 0.5) * 0.01,
        ];
      }
    }

    // Default to Muscat center with offset
    return [
      MUSCAT_CENTER[0] + (Math.random() - 0.5) * 0.02,
      MUSCAT_CENTER[1] + (Math.random() - 0.5) * 0.02,
    ];
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

  const handleViewDetails = (locationId: string) => {
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

  // Get marker colors based on rank
  const getMarkerColor = (index: number) => {
    switch (index) {
      case 0: return '#10b981'; // emerald-500 - Gold/Best
      case 1: return '#6b7280'; // gray-500 - Silver
      case 2: return '#f97316'; // orange-500 - Bronze
      default: return '#6b7280';
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white border-l-4 border-navy-950 p-6">
        <h3 className="text-xl font-semibold text-navy-950 mb-4 flex items-center tracking-tight">
          <Star className="w-5 h-5 mr-2 text-success-500" />
          Location Recommendations
        </h3>
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <p className="text-secondary">Complete the brand analysis form to see personalized location recommendations</p>
        </div>
      </div>
    );
  }

  // Prepare marker positions for bounds fitting
  const markerPositions: [number, number][] = recommendations.map(rec =>
    getCoordinatesForLocation(rec.location)
  );

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-navy-950 flex items-center tracking-tight">
          <Star className="w-5 h-5 mr-2 text-success-500" />
          Top Location Recommendations
        </h3>

        {/* View Mode Toggle */}
        <div className="flex bg-surface-100 p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-success-600'
                : 'text-navy-600 hover:text-navy-950'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Map View</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-success-600'
                : 'text-navy-600 hover:text-navy-950'
            }`}
          >
            <List className="w-4 h-4" />
            <span>List Only</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' && (
        <div className="mb-6 overflow-hidden border border-surface-200 h-[250px] md:h-[400px]">
          <MapContainer
            center={MUSCAT_CENTER}
            zoom={11}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <FitBounds positions={markerPositions} />

            {recommendations.map((rec, index) => {
              const coords = getCoordinatesForLocation(rec.location);
              return (
                <Marker
                  key={rec.location.id}
                  position={coords}
                  icon={createMarkerIcon(getMarkerColor(index), String(index + 1))}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      <h4 className="font-bold text-navy-950 text-base mb-2">
                        {rec.location.locationName}
                      </h4>

                      <div className="space-y-1.5 text-sm mb-3">
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium text-navy-700 w-24">Board Type:</span>
                          <span>{rec.location.boardType}</span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium text-navy-700 w-24">Format:</span>
                          <span>{rec.location.format}</span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium text-navy-700 w-24">Impressions:</span>
                          <span className="text-success-600 font-semibold">
                            {rec.estimatedImpressions.toLocaleString()}/mo
                          </span>
                        </div>
                        <div className="flex items-center text-navy-600">
                          <span className="font-medium text-navy-700 w-24">Rental:</span>
                          <span className="text-success-600 font-semibold">
                            {rec.rentalCost.includes('OMR')
                              ? rec.rentalCost
                              : `OMR ${rec.rentalCost}`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-surface-100">
                        <span className="text-success-600 font-bold text-lg">
                          {rec.matchPercentage}% Match
                        </span>
                        <button
                          onClick={() => handleViewDetails(rec.location.id)}
                          className="text-success-600 hover:text-success-700 font-medium text-sm hover:underline"
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div
            key={rec.location.id}
            ref={(el) => (cardRefs.current[rec.location.id] = el)}
            className={`border-l-4 p-6 transition-colors ${
              highlightedCardId === rec.location.id
                ? 'border-success-500 bg-success-50'
                : index === 0 ? 'border-success-500 bg-surface-50' : index === 1 ? 'border-navy-400 bg-surface-50' : 'border-warning-500 bg-surface-50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-success-500' : index === 1 ? 'bg-navy-400' : 'bg-warning-500'
                  }`}>
                    {index + 1}
                  </div>
                  <h4 className="text-lg font-semibold text-navy-950">
                    {rec.location.locationName}
                  </h4>
                </div>
                <p className="text-secondary text-sm mb-3">
                  {rec.location.addressLandmark}
                </p>
              </div>

              <div className="text-right">
                <div className="text-2xl font-bold text-success-600">
                  {rec.matchPercentage}%
                </div>
                <div className="text-sm text-secondary">Match</div>
              </div>
            </div>

            <div className="bg-success-50 border-l-4 border-success-400 p-4 mb-4">
              <h5 className="font-medium text-success-900 mb-2">Why This Location:</h5>
              <p className="text-success-800 text-sm">{rec.reason}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-success-600" />
                <div>
                  <div className="text-sm text-secondary">Monthly Cost</div>
                  <div className="font-semibold text-navy-950">
                    {rec.rentalCost.includes('OMR') ? rec.rentalCost : `OMR ${rec.rentalCost}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-success-600" />
                <div>
                  <div className="text-sm text-secondary">Est. Impressions</div>
                  <div className="font-semibold text-navy-950">
                    {rec.estimatedImpressions.toLocaleString()}/mo
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-success-600" />
                <div>
                  <div className="text-sm text-secondary">Board Type</div>
                  <div className="font-semibold text-navy-950">
                    {rec.location.boardType}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-surface-100 text-navy-700 text-xs">
                {rec.location.roadType}
              </span>
              <span className="px-2 py-1 bg-success-100 text-success-700 text-xs">
                {rec.location.speedLimitKmh} km/h
              </span>
              <span className="px-2 py-1 bg-success-100 text-success-700 text-xs">
                {rec.location.format}
              </span>
              {rec.location.lighting !== 'TBD' && (
                <span className="px-2 py-1 bg-warning-100 text-warning-700 text-xs">
                  {rec.location.lighting}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-success-50 border-l-4 border-success-500 p-4">
        <h5 className="font-medium text-navy-950 mb-2">Pro Tip:</h5>
        <p className="text-navy-700 text-sm">
          These recommendations are based on your brand profile. Consider running A/B tests across multiple locations
          to optimize your campaign performance. Digital billboards offer more flexibility for testing different messages.
        </p>
      </div>
    </div>
  );
};

export default LocationRecommendations;

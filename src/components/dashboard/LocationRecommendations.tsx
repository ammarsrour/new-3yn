import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Map, List } from 'lucide-react';
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
      <div>
        <h4 className="text-sm font-semibold text-navy-950 mb-4">Location Recommendations</h4>
        <div className="text-center py-6">
          <MapPin className="w-6 h-6 text-navy-300 mx-auto mb-2" />
          <p className="text-sm text-secondary">Complete brand analysis to see recommendations</p>
        </div>
      </div>
    );
  }

  // Prepare marker positions for bounds fitting
  const markerPositions: [number, number][] = recommendations.map(rec =>
    getCoordinatesForLocation(rec.location)
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-navy-950">
          Recommended Locations
        </h4>

        {/* View Mode Toggle - smaller */}
        <div className="flex text-xs">
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 transition-colors ${
              viewMode === 'map'
                ? 'bg-navy-950 text-white'
                : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            <Map className="w-3 h-3" />
            <span>Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 transition-colors ${
              viewMode === 'list'
                ? 'bg-navy-950 text-white'
                : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            <List className="w-3 h-3" />
            <span>List</span>
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

      {/* Recommendations List - Quieter cards */}
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={rec.location.id}
            ref={(el) => (cardRefs.current[rec.location.id] = el)}
            className={`p-4 border transition-colors ${
              highlightedCardId === rec.location.id
                ? 'border-navy-400 bg-surface-50'
                : 'border-surface-200 hover:border-surface-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 flex items-center justify-center bg-navy-100 text-navy-700 text-xs font-medium">
                  {index + 1}
                </span>
                <h5 className="font-medium text-navy-950 text-sm">
                  {rec.location.locationName}
                </h5>
              </div>
              <span className="text-sm font-semibold text-navy-700 tabular-nums">
                {rec.matchPercentage}%
              </span>
            </div>

            <p className="text-xs text-secondary mb-3 pl-7">
              {rec.reason}
            </p>

            <div className="flex items-center gap-4 text-xs text-secondary pl-7">
              <span>
                {rec.rentalCost.includes('OMR') ? rec.rentalCost : `OMR ${rec.rentalCost}`}
              </span>
              <span>·</span>
              <span>{rec.estimatedImpressions.toLocaleString()}/mo</span>
              <span>·</span>
              <span>{rec.location.boardType}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-secondary">
        Consider A/B testing across locations. Digital billboards offer flexibility for message testing.
      </p>
    </div>
  );
};

export default LocationRecommendations;

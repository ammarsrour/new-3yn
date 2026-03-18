import React from 'react';
import { MapPin, Eye, Gauge, DollarSign, Users, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { BillboardLocation } from '../../types/billboard';
import { BillboardDataService } from '../../services/billboardDataService';

interface LocationComparisonProps {
  locations: BillboardLocation[];
  brandCategory?: string;
  onRemoveLocation: (locationId: string) => void;
}

const LocationComparison: React.FC<LocationComparisonProps> = ({
  locations,
  brandCategory,
  onRemoveLocation
}) => {
  if (locations.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600 bg-success-100';
    if (score >= 60) return 'text-info-600 bg-info-100';
    if (score >= 40) return 'text-warning-600 bg-warning-100';
    return 'text-danger-600 bg-danger-100';
  };

  const getBestLocationForBrand = (): string | null => {
    if (!brandCategory || locations.length === 0) return null;

    let bestLocation = locations[0];
    let bestScore = 0;

    locations.forEach(location => {
      let score = 0;
      const trafficType = BillboardDataService.getTrafficType(location);
      const audience = BillboardDataService.getAudienceEstimate(location);
      const locationScore = BillboardDataService.calculateLocationScore(location);

      // Brand-specific scoring
      switch (brandCategory) {
        case 'Luxury':
          if (location.roadName.toLowerCase().includes('sultan qaboos')) score += 30;
          if (trafficType === 'Business') score += 20;
          break;
        case 'Family':
          if (trafficType === 'Residential') score += 30;
          if (audience === 'Family') score += 20;
          break;
        case 'Tech':
          if (audience === 'Young Professional') score += 30;
          if (location.format.toLowerCase().includes('digital')) score += 20;
          break;
        case 'B2B':
          if (trafficType === 'Business') score += 40;
          break;
      }

      score += locationScore.totalScore * 0.5;

      if (score > bestScore) {
        bestScore = score;
        bestLocation = location;
      }
    });

    return bestLocation.id;
  };

  const bestLocationId = getBestLocationForBrand();

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-navy-950 tracking-tight">Location Comparison</h3>
        <div className="text-sm text-secondary">
          {locations.length} location{locations.length > 1 ? 's' : ''} selected
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-200">
              <th className="text-left py-3 px-4 font-medium text-navy-950">Location</th>
              {locations.map((location) => (
                <th key={location.id} className="text-center py-3 px-4 min-w-[200px]">
                  <div className="relative">
                    {bestLocationId === location.id && (
                      <div className="absolute -top-2 -right-2 bg-success-500 text-white text-xs px-2 py-1">
                        Best Match
                      </div>
                    )}
                    <div className="font-medium text-navy-950 mb-1">
                      {location.locationName.split(' ')[0]}...
                    </div>
                    <button
                      onClick={() => onRemoveLocation(location.id)}
                      className="text-danger-500 hover:text-danger-700 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100">
            {/* Overall Score */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Overall Score</td>
              {locations.map((location) => {
                const score = BillboardDataService.calculateLocationScore(location);
                return (
                  <td key={location.id} className="py-3 px-4 text-center">
                    <div className={`inline-flex items-center px-3 py-1 text-sm font-medium tabular-nums ${getScoreColor(score.totalScore)}`}>
                      {score.totalScore.toFixed(0)}/100
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Traffic Type */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Traffic Type</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm">
                  {BillboardDataService.getTrafficType(location)}
                </td>
              ))}
            </tr>

            {/* Audience */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Primary Audience</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm">
                  {BillboardDataService.getAudienceEstimate(location)}
                </td>
              ))}
            </tr>

            {/* Speed */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Speed Limit</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm tabular-nums">
                  {location.speedLimitKmh} km/h
                </td>
              ))}
            </tr>

            {/* Distance */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Distance from Road</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm tabular-nums">
                  {location.distanceFromRoadM || 'Est. 75'}m
                </td>
              ))}
            </tr>

            {/* Dimensions */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Dimensions</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm tabular-nums">
                  {location.approxWidthM || 14}m × {location.approxHeightM || 5}m
                </td>
              ))}
            </tr>

            {/* Competition */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Competition Level</td>
              {locations.map((location) => {
                const competition = BillboardDataService.getCompetitionLevel(location);
                return (
                  <td key={location.id} className="py-3 px-4 text-center text-sm">
                    <span className={`px-2 py-1 text-xs ${
                      competition === 'High' ? 'bg-danger-100 text-danger-800' :
                      competition === 'Medium' ? 'bg-warning-100 text-warning-800' :
                      'bg-success-100 text-success-800'
                    }`}>
                      {competition}
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Rental Cost */}
            <tr>
              <td className="py-3 px-4 font-medium text-navy-950">Monthly Cost</td>
              {locations.map((location) => (
                <td key={location.id} className="py-3 px-4 text-center text-sm">
                  {location.rentalRateOmrMonth || 'Contact for pricing'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Detailed Pros/Cons */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => {
          const prosAndCons = BillboardDataService.getLocationProsAndCons(location);
          const score = BillboardDataService.calculateLocationScore(location);

          return (
            <div key={location.id} className="border border-surface-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-navy-950 text-sm">
                  {location.locationName.split(' - ')[0]}
                </h4>
                {bestLocationId === location.id && (
                  <div className="bg-success-500 text-white text-xs px-2 py-1">
                    Recommended
                  </div>
                )}
              </div>

              {/* Score Breakdown */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-secondary mb-2">
                  <span>Speed: {score.speedScore.toFixed(0)}/30</span>
                  <span>Distance: {score.distanceScore.toFixed(0)}/25</span>
                </div>
                <div className="flex justify-between text-xs text-secondary mb-2">
                  <span>Size: {score.sizeScore.toFixed(0)}/20</span>
                  <span>Cost: {score.costScore.toFixed(0)}/25</span>
                </div>
                <div className="w-full bg-surface-200 h-2">
                  <div
                    className={`h-2 transition-all duration-500 ${
                      score.totalScore >= 80 ? 'bg-success-500' :
                      score.totalScore >= 60 ? 'bg-info-500' :
                      score.totalScore >= 40 ? 'bg-warning-500' : 'bg-danger-500'
                    }`}
                    style={{ width: `${score.totalScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Pros */}
              <div className="mb-3">
                <h5 className="text-xs font-medium text-success-700 mb-2 flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Advantages
                </h5>
                <ul className="space-y-1">
                  {prosAndCons.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="text-xs text-success-600 flex items-start">
                      <span className="w-1 h-1 bg-success-500 mt-1.5 mr-2 flex-shrink-0"></span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div>
                <h5 className="text-xs font-medium text-danger-700 mb-2 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Considerations
                </h5>
                <ul className="space-y-1">
                  {prosAndCons.cons.slice(0, 3).map((con, index) => (
                    <li key={index} className="text-xs text-danger-600 flex items-start">
                      <span className="w-1 h-1 bg-danger-500 mt-1.5 mr-2 flex-shrink-0"></span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Recommendation */}
      {brandCategory && bestLocationId && (
        <div className="mt-6 bg-surface-50 border-l-4 border-success-500 p-4">
          <h4 className="font-semibold text-navy-950 mb-2 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Recommendation for {brandCategory} Brand
          </h4>
          <p className="text-navy-700 text-sm">
            Based on your brand category, <strong>
            {locations.find(l => l.id === bestLocationId)?.locationName.split(' - ')[0]}
            </strong> offers the best strategic fit with optimal audience alignment and competitive positioning.
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationComparison;

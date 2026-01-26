import React from 'react';
import { MapPin, Star, DollarSign, Eye, TrendingUp } from 'lucide-react';
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

const LocationRecommendations: React.FC<LocationRecommendationsProps> = ({ 
  brandData, 
  allLocations 
}) => {
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

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2" />
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
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Star className="w-5 h-5 mr-2" />
        Top Location Recommendations
      </h3>

      <div className="space-y-6">
        {recommendations.map((rec, index) => (
          <div key={rec.location.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                    index === 0 ? 'bg-gold-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
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
                <div className="text-2xl font-bold text-green-600">
                  {rec.matchPercentage}%
                </div>
                <div className="text-sm text-gray-500">Match</div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-blue-900 mb-2">Why This Location:</h5>
              <p className="text-blue-800 text-sm">{rec.reason}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-sm text-gray-500">Monthly Cost</div>
                  <div className="font-semibold text-gray-900">
                    {rec.rentalCost.includes('OMR') ? rec.rentalCost : `OMR ${rec.rentalCost}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-sm text-gray-500">Est. Impressions</div>
                  <div className="font-semibold text-gray-900">
                    {rec.estimatedImpressions.toLocaleString()}/mo
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
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
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {rec.location.speedLimitKmh} km/h
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
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

      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
        <h5 className="font-medium text-gray-900 mb-2">💡 Pro Tip:</h5>
        <p className="text-gray-700 text-sm">
          These recommendations are based on your brand profile. Consider running A/B tests across multiple locations 
          to optimize your campaign performance. Digital billboards offer more flexibility for testing different messages.
        </p>
      </div>
    </div>
  );
};

export default LocationRecommendations;
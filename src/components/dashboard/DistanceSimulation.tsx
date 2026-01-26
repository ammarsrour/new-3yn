import React, { useState } from 'react';
import { Eye, Car, Gauge } from 'lucide-react';

interface DistanceSimulationProps {
  imageUrl: string;
  distanceAnalysis: {
    '50m': number;
    '100m': number;
    '150m': number;
  };
}

const DistanceSimulation: React.FC<DistanceSimulationProps> = ({ 
  imageUrl, 
  distanceAnalysis 
}) => {
  const [selectedDistance, setSelectedDistance] = useState<'50m' | '100m' | '150m'>('100m');

  const getBlurLevel = (distance: string) => {
    switch (distance) {
      case '50m':
        return 'blur-none';
      case '100m':
        return 'blur-sm';
      case '150m':
        return 'blur-md';
      default:
        return 'blur-sm';
    }
  };

  const getScaleLevel = (distance: string) => {
    switch (distance) {
      case '50m':
        return 'scale-100';
      case '100m':
        return 'scale-75';
      case '150m':
        return 'scale-50';
      default:
        return 'scale-75';
    }
  };

  const getReadabilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSpeedForDistance = (distance: string) => {
    switch (distance) {
      case '50m':
        return '25-35 mph';
      case '100m':
        return '45-55 mph';
      case '150m':
        return '65+ mph';
      default:
        return '45-55 mph';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Distance Simulation
      </h3>

      {/* Distance Selector */}
      <div className="flex space-x-2 mb-6">
        {(['50m', '100m', '150m'] as const).map((distance) => (
          <button
            key={distance}
            onClick={() => setSelectedDistance(distance)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedDistance === distance
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <div className="text-center">
              <div className="font-bold">{distance}</div>
              <div className="text-xs opacity-75">
                {getSpeedForDistance(distance)}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Simulation Display */}
      <div className="relative bg-gradient-to-b from-sky-200 to-gray-300 rounded-lg p-8 mb-6 overflow-hidden">
        {/* Road/Environment */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gray-600"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-yellow-400 rounded"></div>
        
        {/* Billboard Simulation */}
        <div className="flex justify-center items-center h-64">
          <div className={`transition-all duration-500 ${getScaleLevel(selectedDistance)}`}>
            <img
              src={imageUrl}
              alt="Billboard at distance"
              className={`w-80 h-48 object-cover rounded-lg shadow-lg transition-all duration-500 ${getBlurLevel(selectedDistance)}`}
            />
          </div>
        </div>

        {/* Driver's View Indicator */}
        <div className="absolute bottom-8 left-8 flex items-center space-x-2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
          <Car className="w-4 h-4" />
          <span className="text-sm">Driver's View</span>
        </div>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className={`text-2xl font-bold ${getReadabilityColor(distanceAnalysis[selectedDistance])}`}>
            {distanceAnalysis[selectedDistance].toFixed(2)}/100
          </div>
          <div className="text-sm text-gray-600">Readability Score</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {selectedDistance}
          </div>
          <div className="text-sm text-gray-600">Viewing Distance</div>
        </div>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 flex items-center justify-center">
            <Gauge className="w-6 h-6 mr-1" />
            {getSpeedForDistance(selectedDistance)}
          </div>
          <div className="text-sm text-gray-600">Traffic Speed</div>
        </div>
      </div>

      {/* Distance-Specific Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">
          Recommendations for {selectedDistance} viewing:
        </h4>
        <ul className="text-blue-800 text-sm space-y-1">
          {selectedDistance === '50m' && (
            <>
              <li>• Current font size is adequate for close viewing</li>
              <li>• Fine details and secondary text are visible</li>
              <li>• Consider this distance for pedestrian areas</li>
            </>
          )}
          {selectedDistance === '100m' && (
            <>
              <li>• Increase main headline by 25-35% for better readability</li>
              <li>• Focus on primary message only</li>
              <li>• Ideal for urban arterial roads</li>
            </>
          )}
          {selectedDistance === '150m' && (
            <>
              <li>• Increase font size by 50%+ for highway visibility</li>
              <li>• Use maximum contrast colors</li>
              <li>• Limit to 6 words or less for quick comprehension</li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DistanceSimulation;
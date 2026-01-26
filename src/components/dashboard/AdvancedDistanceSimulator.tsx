import React, { useState, useEffect } from 'react';
import { Eye, Car, Gauge, Cloud, Sun, Wind } from 'lucide-react';

interface AdvancedDistanceSimulatorProps {
  imageUrl: string;
  distanceAnalysis: {
    '50m': number;
    '100m': number;
    '150m': number;
  };
}

const AdvancedDistanceSimulator: React.FC<AdvancedDistanceSimulatorProps> = ({ 
  imageUrl, 
  distanceAnalysis 
}) => {
  const [selectedDistance, setSelectedDistance] = useState<number>(100);
  const [selectedSpeed, setSelectedSpeed] = useState<number>(45);
  const [weatherCondition, setWeatherCondition] = useState<'clear' | 'fog' | 'sandstorm'>('clear');
  const [isAnimating, setIsAnimating] = useState(false);

  const distances = [50, 75, 100, 125, 150, 200];
  const speeds = [25, 35, 45, 55, 65, 80];

  const getBlurLevel = (distance: number, speed: number, weather: string) => {
    let baseBlur = Math.max(0, (distance - 50) / 25); // Base blur from distance
    const speedBlur = Math.max(0, (speed - 25) / 20); // Additional blur from speed
    let weatherBlur = 0;
    
    switch (weather) {
      case 'fog':
        weatherBlur = 2;
        break;
      case 'sandstorm':
        weatherBlur = 4;
        break;
    }
    
    return Math.min(baseBlur + speedBlur + weatherBlur, 8);
  };

  const getScaleLevel = (distance: number) => {
    return Math.max(0.3, 1 - ((distance - 50) / 200));
  };

  const getOpacity = (weather: string) => {
    switch (weather) {
      case 'fog':
        return 0.7;
      case 'sandstorm':
        return 0.5;
      default:
        return 1;
    }
  };

  const getReadabilityScore = (distance: number) => {
    if (distance <= 50) return distanceAnalysis['50m'];
    if (distance <= 100) {
      const ratio = (distance - 50) / 50;
      return Math.round(distanceAnalysis['50m'] * (1 - ratio) + distanceAnalysis['100m'] * ratio);
    }
    if (distance <= 150) {
      const ratio = (distance - 100) / 50;
      return Math.round(distanceAnalysis['100m'] * (1 - ratio) + distanceAnalysis['150m'] * ratio);
    }
    // Extrapolate for distances > 150m
    const decline = (distanceAnalysis['100m'] - distanceAnalysis['150m']) / 50;
    return Math.max(20, Math.round(distanceAnalysis['150m'] - decline * (distance - 150)));
  };

  const getViewingTime = (speed: number) => {
    // Approximate viewing time based on billboard size and speed
    const billboardWidth = 14; // meters (standard billboard)
    const viewingAngle = 60; // degrees
    const viewingDistance = billboardWidth / Math.tan((viewingAngle * Math.PI) / 360);
    return (viewingDistance * 2) / (speed * 0.44704); // Convert mph to m/s
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'fog':
        return <Cloud className="w-4 h-4" />;
      case 'sandstorm':
        return <Wind className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  const getWeatherOverlay = (weather: string) => {
    switch (weather) {
      case 'fog':
        return 'bg-gradient-to-b from-gray-300/30 to-gray-500/20';
      case 'sandstorm':
        return 'bg-gradient-to-b from-yellow-300/40 to-orange-400/30';
      default:
        return '';
    }
  };

  const simulateMovement = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const currentScore = getReadabilityScore(selectedDistance);
  const viewingTime = getViewingTime(selectedSpeed);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Eye className="w-5 h-5 mr-2" />
        Advanced Distance Simulation
      </h3>

      {/* Control Panel */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Distance Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Viewing Distance: {selectedDistance}m
          </label>
          <input
            type="range"
            min="50"
            max="200"
            step="25"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>50m</span>
            <span>125m</span>
            <span>200m</span>
          </div>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Traffic Speed: {selectedSpeed} mph
          </label>
          <input
            type="range"
            min="25"
            max="80"
            step="5"
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>25mph</span>
            <span>55mph</span>
            <span>80mph</span>
          </div>
        </div>

        {/* Weather Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Weather Conditions
          </label>
          <div className="flex space-x-2">
            {(['clear', 'fog', 'sandstorm'] as const).map((weather) => (
              <button
                key={weather}
                onClick={() => setWeatherCondition(weather)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                  weatherCondition === weather
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {getWeatherIcon(weather)}
                <span className="capitalize">{weather}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation Display */}
      <div className="relative bg-gradient-to-b from-sky-200 to-gray-300 rounded-lg p-8 mb-6 overflow-hidden min-h-[400px]">
        {/* Weather Overlay */}
        {weatherCondition !== 'clear' && (
          <div className={`absolute inset-0 ${getWeatherOverlay(weatherCondition)} pointer-events-none`}></div>
        )}

        {/* Road Environment */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gray-600"></div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-yellow-400 rounded"></div>
        
        {/* Distance Markers */}
        <div className="absolute bottom-24 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          {selectedDistance}m
        </div>

        {/* Billboard Simulation */}
        <div className="flex justify-center items-center h-80">
          <div 
            className={`transition-all duration-500 ${isAnimating ? 'animate-pulse' : ''}`}
            style={{ 
              transform: `scale(${getScaleLevel(selectedDistance)})`,
              filter: `blur(${getBlurLevel(selectedDistance, selectedSpeed, weatherCondition)}px)`,
              opacity: getOpacity(weatherCondition)
            }}
          >
            <img
              src={imageUrl}
              alt="Billboard at distance"
              className="w-96 h-60 object-cover rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Driver's View Indicator */}
        <div className="absolute bottom-8 left-8 flex items-center space-x-2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg">
          <Car className="w-5 h-5" />
          <span className="text-sm font-medium">Driver's View</span>
          <Gauge className="w-4 h-4 ml-2" />
          <span className="text-sm">{selectedSpeed} mph</span>
        </div>

        {/* Movement Simulation Button */}
        <button
          onClick={simulateMovement}
          className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
        >
          <Car className="w-4 h-4" />
          <span>Simulate Movement</span>
        </button>
      </div>

      {/* Analysis Results */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className={`text-3xl font-bold ${
            currentScore >= 80 ? 'text-green-600' :
            currentScore >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {currentScore.toFixed(2)}/100
          </div>
          <div className="text-sm text-gray-600 mt-1">Readability Score</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-3xl font-bold text-purple-600">
            {viewingTime.toFixed(1)}s
          </div>
          <div className="text-sm text-gray-600 mt-1">Viewing Time</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {Math.round(getScaleLevel(selectedDistance) * 100)}%
          </div>
          <div className="text-sm text-gray-600 mt-1">Apparent Size</div>
        </div>
        
        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-3xl font-bold text-orange-600 flex items-center justify-center">
            {getWeatherIcon(weatherCondition)}
            <span className="ml-2 capitalize">{weatherCondition}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Conditions</div>
        </div>
      </div>

      {/* Professional Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">
          Professional Viewing Analysis
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-indigo-700 mb-2">Current Conditions Impact:</h5>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Distance reduces apparent size by {Math.round((1 - getScaleLevel(selectedDistance)) * 100)}%</li>
              <li>• Speed creates {getBlurLevel(selectedDistance, selectedSpeed, weatherCondition).toFixed(1)}px motion blur</li>
              <li>• Weather reduces visibility by {Math.round((1 - getOpacity(weatherCondition)) * 100)}%</li>
              <li>• Effective viewing time: {viewingTime.toFixed(1)} seconds</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-purple-700 mb-2">Optimization Recommendations:</h5>
            <ul className="space-y-1 text-sm text-gray-700">
              {currentScore < 70 && (
                <li>• Increase font size by {Math.round((70 - currentScore) * 0.8)}% for this distance</li>
              )}
              {selectedSpeed > 55 && (
                <li>• Simplify message for high-speed viewing</li>
              )}
              {weatherCondition !== 'clear' && (
                <li>• Use higher contrast colors for weather conditions</li>
              )}
              <li>• Target 6 words or less for {viewingTime.toFixed(1)}s viewing time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Oman-Specific Conditions */}
      <div className="mt-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
        <h5 className="font-medium text-orange-800 mb-2 flex items-center">
          🇴🇲 Oman-Specific Considerations
        </h5>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-orange-700">
          <div>
            <span className="font-medium">Desert Conditions:</span>
            <p>High ambient light requires 20% higher contrast</p>
          </div>
          <div>
            <span className="font-medium">Sandstorm Season:</span>
            <p>Visibility can drop to 50m during peak conditions</p>
          </div>
          <div>
            <span className="font-medium">Highway Speeds:</span>
            <p>Sultan Qaboos Street: 80-120 km/h typical speeds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDistanceSimulator;
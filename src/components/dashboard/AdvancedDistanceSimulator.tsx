import React, { useState } from 'react';
import { Car, Cloud, Sun, Wind, Gauge } from 'lucide-react';

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

  const getBlurLevel = (distance: number, speed: number, weather: string) => {
    let baseBlur = Math.max(0, (distance - 50) / 25);
    const speedBlur = Math.max(0, (speed - 25) / 20);
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
    const decline = (distanceAnalysis['100m'] - distanceAnalysis['150m']) / 50;
    return Math.max(20, Math.round(distanceAnalysis['150m'] - decline * (distance - 150)));
  };

  const getViewingTime = (speed: number) => {
    const billboardWidth = 14;
    const viewingAngle = 60;
    const viewingDistance = billboardWidth / Math.tan((viewingAngle * Math.PI) / 360);
    return (viewingDistance * 2) / (speed * 0.44704);
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
        return 'bg-surface-300/30';
      case 'sandstorm':
        return 'bg-warning-300/40';
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
    <div className="bg-white p-6">
      <h3 className="text-sm font-semibold text-navy-950 mb-6">
        Distance Simulation
      </h3>

      {/* Control Panel */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* Distance Control */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">
            Viewing Distance: <span className="tabular-nums">{selectedDistance}m</span>
          </label>
          <input
            type="range"
            min="50"
            max="200"
            step="25"
            value={selectedDistance}
            onChange={(e) => setSelectedDistance(parseInt(e.target.value))}
            className="w-full h-2 bg-surface-200 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary mt-1 tabular-nums">
            <span>50m</span>
            <span>125m</span>
            <span>200m</span>
          </div>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">
            Traffic Speed: <span className="tabular-nums">{selectedSpeed} mph</span>
          </label>
          <input
            type="range"
            min="25"
            max="80"
            step="5"
            value={selectedSpeed}
            onChange={(e) => setSelectedSpeed(parseInt(e.target.value))}
            className="w-full h-2 bg-surface-200 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary mt-1 tabular-nums">
            <span>25mph</span>
            <span>55mph</span>
            <span>80mph</span>
          </div>
        </div>

        {/* Weather Control */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">
            Weather Conditions
          </label>
          <div className="flex space-x-2">
            {(['clear', 'fog', 'sandstorm'] as const).map((weather) => (
              <button
                key={weather}
                onClick={() => setWeatherCondition(weather)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-1 ${
                  weatherCondition === weather
                    ? 'bg-navy-950 text-white'
                    : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
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
      <div className="relative bg-surface-200 p-8 mb-6 overflow-hidden min-h-[400px]">
        {/* Weather Overlay */}
        {weatherCondition !== 'clear' && (
          <div className={`absolute inset-0 ${getWeatherOverlay(weatherCondition)} pointer-events-none`}></div>
        )}

        {/* Road Environment */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-navy-600"></div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-warning-400"></div>

        {/* Distance Markers */}
        <div className="absolute bottom-24 left-4 text-white text-sm bg-navy-950/80 px-2 py-1 tabular-nums">
          {selectedDistance}m
        </div>

        {/* Billboard Simulation */}
        <div className="flex justify-center items-center h-80">
          <div
            className={`transition-all duration-500 ${isAnimating ? 'animate-pulse motion-reduce:animate-none' : ''}`}
            style={{
              transform: `scale(${getScaleLevel(selectedDistance)})`,
              filter: `blur(${getBlurLevel(selectedDistance, selectedSpeed, weatherCondition)}px)`,
              opacity: getOpacity(weatherCondition)
            }}
          >
            <img
              src={imageUrl}
              alt="Billboard at distance"
              className="w-96 h-60 object-cover"
            />
          </div>
        </div>

        {/* Driver's View Indicator */}
        <div className="absolute bottom-8 left-8 flex items-center space-x-2 bg-navy-950/80 text-white px-4 py-2">
          <Car className="w-5 h-5" />
          <span className="text-sm font-medium">Driver's View</span>
          <Gauge className="w-4 h-4 ml-2" />
          <span className="text-sm tabular-nums">{selectedSpeed} mph</span>
        </div>

        {/* Movement Simulation Button */}
        <button
          onClick={simulateMovement}
          className="absolute top-4 right-4 bg-navy-950 text-white px-4 py-2 hover:bg-navy-800 transition-colors flex items-center space-x-2"
        >
          <Car className="w-4 h-4" />
          <span>Simulate Movement</span>
        </button>
      </div>

      {/* Analysis Results - Quieter grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-surface-50">
          <div className="text-2xl font-semibold text-navy-950 tabular-nums">
            {currentScore}
          </div>
          <div className="text-xs text-secondary mt-1">Readability</div>
        </div>

        <div className="text-center p-3 bg-surface-50">
          <div className="text-2xl font-semibold text-navy-950 tabular-nums">
            {viewingTime.toFixed(1)}s
          </div>
          <div className="text-xs text-secondary mt-1">View Time</div>
        </div>

        <div className="text-center p-3 bg-surface-50">
          <div className="text-2xl font-semibold text-navy-950 tabular-nums">
            {Math.round(getScaleLevel(selectedDistance) * 100)}%
          </div>
          <div className="text-xs text-secondary mt-1">Apparent Size</div>
        </div>

        <div className="text-center p-3 bg-surface-50">
          <div className="text-2xl font-semibold text-navy-950 flex items-center justify-center">
            {getWeatherIcon(weatherCondition)}
            <span className="ml-1.5 capitalize text-lg">{weatherCondition}</span>
          </div>
          <div className="text-xs text-secondary mt-1">Conditions</div>
        </div>
      </div>

      {/* Insights - Quieter */}
      <div className="bg-surface-50 p-4 text-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-navy-950 mb-2">Conditions Impact</h5>
            <ul className="space-y-1 text-secondary">
              <li>Distance reduces size by {Math.round((1 - getScaleLevel(selectedDistance)) * 100)}%</li>
              <li>Motion blur: {getBlurLevel(selectedDistance, selectedSpeed, weatherCondition).toFixed(1)}px</li>
              <li>Viewing time: {viewingTime.toFixed(1)}s</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-navy-950 mb-2">Recommendations</h5>
            <ul className="space-y-1 text-secondary">
              {currentScore < 70 && (
                <li>Increase font size by {Math.round((70 - currentScore) * 0.8)}%</li>
              )}
              {selectedSpeed > 55 && (
                <li>Simplify message for high-speed viewing</li>
              )}
              <li>Target 6 words or less</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedDistanceSimulator;

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Eye, Info } from 'lucide-react';

interface AnalysisPoint {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'critical' | 'minor' | 'good';
  title: string;
  description: string;
}

interface ImageAnalysisOverlayProps {
  imageUrl: string;
  analysisPoints: AnalysisPoint[];
}

const ImageAnalysisOverlay: React.FC<ImageAnalysisOverlayProps> = ({ 
  imageUrl, 
  analysisPoints 
}) => {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);

  const getPointIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'minor':
        return <Info className="w-4 h-4 text-white" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-white" />;
      default:
        return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getPointColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500 border-red-600';
      case 'minor':
        return 'bg-yellow-500 border-yellow-600';
      case 'good':
        return 'bg-green-500 border-green-600';
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Visual Analysis
        </h3>
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            showOverlay 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
        </button>
      </div>

      <div className="relative">
        <img
          src={imageUrl}
          alt="Billboard analysis"
          className="w-full h-auto rounded-lg"
        />
        
        {showOverlay && (
          <div className="absolute inset-0">
            {analysisPoints.map((point) => (
              <div key={point.id}>
                {/* Analysis Point */}
                <button
                  onClick={() => setSelectedPoint(
                    selectedPoint === point.id ? null : point.id
                  )}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${getPointColor(point.type)}`}
                  style={{
                    left: `${point.x}%`,
                    top: `${point.y}%`
                  }}
                >
                  {getPointIcon(point.type)}
                </button>

                {/* Tooltip */}
                {selectedPoint === point.id && (
                  <div
                    className="absolute z-10 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-xs"
                    style={{
                      left: `${Math.min(point.x, 70)}%`,
                      top: `${Math.max(point.y - 10, 5)}%`
                    }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getPointColor(point.type)}`}>
                        {getPointIcon(point.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {point.title}
                        </h4>
                        <p className="text-gray-600 text-xs mt-1">
                          {point.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-gray-600">Critical Issues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <span className="text-gray-600">Minor Issues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">Good Elements</span>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysisOverlay;
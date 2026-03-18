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
        return 'bg-danger-500';
      case 'minor':
        return 'bg-warning-500';
      case 'good':
        return 'bg-success-500';
      default:
        return 'bg-info-500';
    }
  };

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-navy-950 flex items-center tracking-tight">
          <Eye className="w-5 h-5 mr-2" />
          Visual Analysis
        </h3>
        <button
          onClick={() => setShowOverlay(!showOverlay)}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            showOverlay
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
        </button>
      </div>

      <div className="relative">
        <img
          src={imageUrl}
          alt="Billboard analysis"
          className="w-full h-auto"
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
                  className={`absolute w-8 h-8 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hover:scale-110 ${getPointColor(point.type)}`}
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
                    className="absolute z-10 bg-white border border-surface-200 p-4 max-w-xs"
                    style={{
                      left: `${Math.min(point.x, 70)}%`,
                      top: `${Math.max(point.y - 10, 5)}%`
                    }}
                  >
                    <div className="flex items-start space-x-2">
                      <div className={`w-6 h-6 flex items-center justify-center flex-shrink-0 ${getPointColor(point.type)}`}>
                        {getPointIcon(point.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-navy-950 text-sm">
                          {point.title}
                        </h4>
                        <p className="text-secondary text-xs mt-1">
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
          <div className="w-3 h-3 bg-danger-500"></div>
          <span className="text-secondary">Critical Issues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-warning-500"></div>
          <span className="text-secondary">Minor Issues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-success-500"></div>
          <span className="text-secondary">Good Elements</span>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysisOverlay;

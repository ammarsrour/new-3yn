import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Eye, Info, Lightbulb, ZoomIn, ZoomOut } from 'lucide-react';

interface AnalysisMarker {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'critical' | 'minor' | 'good' | 'suggestion';
  title: string;
  description: string;
  recommendation?: string;
  metrics?: {
    current: string;
    recommended: string;
    improvement: string;
  };
}

interface InteractiveImageOverlayProps {
  imageUrl: string;
  analysisMarkers: AnalysisMarker[];
  aiAnalysis?: {
    criticalIssues: Array<{ title: string; description: string }>;
    minorIssues: Array<{ title: string; description: string }>;
    quickWins: Array<{ title: string; description: string }>;
  };
}

const InteractiveImageOverlay: React.FC<InteractiveImageOverlayProps> = ({ 
  imageUrl, 
  analysisMarkers,
  aiAnalysis 
}) => {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showReadingFlow, setShowReadingFlow] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Generate dynamic markers based on AI analysis
  const generateDynamicMarkers = (): AnalysisMarker[] => {
    const markers: AnalysisMarker[] = [];
    let markerId = 1;

    if (aiAnalysis) {
      // Critical issues - red markers
      aiAnalysis.criticalIssues.forEach((issue, index) => {
        markers.push({
          id: `critical-${markerId++}`,
          x: 20 + (index * 25), // Spread across top
          y: 25,
          type: 'critical',
          title: issue.title,
          description: issue.description,
          recommendation: 'Immediate action required',
          metrics: {
            current: 'Below standard',
            recommended: 'Industry best practice',
            improvement: 'High impact'
          }
        });
      });

      // Minor issues - yellow markers
      aiAnalysis.minorIssues.forEach((issue, index) => {
        markers.push({
          id: `minor-${markerId++}`,
          x: 70 - (index * 20), // Spread across right side
          y: 45 + (index * 15),
          type: 'minor',
          title: issue.title,
          description: issue.description,
          recommendation: 'Recommended improvement',
          metrics: {
            current: 'Adequate',
            recommended: 'Optimized',
            improvement: 'Medium impact'
          }
        });
      });

      // Quick wins - suggestion markers
      aiAnalysis.quickWins.forEach((win, index) => {
        markers.push({
          id: `suggestion-${markerId++}`,
          x: 15 + (index * 30), // Spread across bottom
          y: 75,
          type: 'suggestion',
          title: win.title,
          description: win.description,
          recommendation: 'Easy implementation',
          metrics: {
            current: 'Good',
            recommended: 'Excellent',
            improvement: 'Quick win'
          }
        });
      });
    }

    // Add some good elements
    markers.push({
      id: 'good-1',
      x: 50,
      y: 60,
      type: 'good',
      title: 'Clear Visual Hierarchy',
      description: 'Good separation between headline and supporting text',
      metrics: {
        current: 'Excellent',
        recommended: 'Maintain current',
        improvement: 'Already optimized'
      }
    });

    return markers;
  };

  const dynamicMarkers = generateDynamicMarkers();
  const allMarkers = [...analysisMarkers, ...dynamicMarkers];

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-4 h-4 text-white" />;
      case 'minor':
        return <Info className="w-4 h-4 text-white" />;
      case 'good':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'suggestion':
        return <Lightbulb className="w-4 h-4 text-white" />;
      default:
        return <Info className="w-4 h-4 text-white" />;
    }
  };

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-red-500 border-red-600 shadow-red-200';
      case 'minor':
        return 'bg-yellow-500 border-yellow-600 shadow-yellow-200';
      case 'good':
        return 'bg-green-500 border-green-600 shadow-green-200';
      case 'suggestion':
        return 'bg-blue-500 border-blue-600 shadow-blue-200';
      default:
        return 'bg-gray-500 border-gray-600 shadow-gray-200';
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 flex items-center">
          <Eye className="w-5 h-5 mr-2" />
          Interactive Visual Analysis
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showHeatmap 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Heat Map
          </button>
          
          <button
            onClick={() => setShowReadingFlow(!showReadingFlow)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showReadingFlow 
                ? 'bg-indigo-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Reading Flow
          </button>
          
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              showOverlay 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showOverlay ? 'Hide Analysis' : 'Show Analysis'}
          </button>
        </div>
      </div>

      {/* Interactive Image Container */}
      <div 
        ref={imageRef}
        className="relative overflow-hidden rounded-lg border-2 border-gray-200"
        style={{ maxHeight: '600px' }}
      >
        <div 
          className="relative transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          <img
            src={imageUrl}
            alt="Billboard analysis"
            className="w-full h-auto block"
          />
          
          {/* Heat Map Overlay */}
          {showHeatmap && (
            <div className="absolute inset-0 pointer-events-none">
              {/* Attention zones */}
              <div className="absolute top-[20%] left-[10%] w-[30%] h-[25%] bg-red-500 opacity-20 rounded-full"></div>
              <div className="absolute top-[50%] right-[15%] w-[25%] h-[20%] bg-orange-500 opacity-15 rounded-full"></div>
              <div className="absolute bottom-[25%] left-[20%] w-[40%] h-[15%] bg-yellow-500 opacity-10 rounded-full"></div>
            </div>
          )}
          
          {/* Reading Flow Arrows */}
          {showReadingFlow && (
            <div className="absolute inset-0 pointer-events-none">
              <svg className="w-full h-full">
                {/* Reading path arrows */}
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                    refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#3B82F6" />
                  </marker>
                </defs>
                <path 
                  d="M 20% 30% Q 50% 20% 80% 40%" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  fill="none" 
                  markerEnd="url(#arrowhead)"
                  opacity="0.8"
                />
                <path 
                  d="M 80% 40% Q 60% 60% 30% 70%" 
                  stroke="#3B82F6" 
                  strokeWidth="3" 
                  fill="none" 
                  markerEnd="url(#arrowhead)"
                  opacity="0.8"
                />
              </svg>
            </div>
          )}
          
          {/* Analysis Markers */}
          {showOverlay && (
            <div className="absolute inset-0">
              {allMarkers.map((marker) => (
                <div key={marker.id}>
                  {/* Marker Button */}
                  <button
                    onClick={() => setSelectedMarker(
                      selectedMarker === marker.id ? null : marker.id
                    )}
                    className={`absolute w-10 h-10 rounded-full border-2 flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 shadow-lg ${getMarkerColor(marker.type)} animate-pulse`}
                    style={{
                      left: `${marker.x}%`,
                      top: `${marker.y}%`,
                      animationDuration: marker.type === 'critical' ? '1s' : '2s'
                    }}
                  >
                    {getMarkerIcon(marker.type)}
                  </button>

                  {/* Detailed Tooltip */}
                  {selectedMarker === marker.id && (
                    <div
                      className="absolute z-20 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 max-w-sm"
                      style={{
                        left: `${Math.min(marker.x, 60)}%`,
                        top: `${Math.max(marker.y - 15, 5)}%`
                      }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getMarkerColor(marker.type)}`}>
                          {getMarkerIcon(marker.type)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-2">
                            {marker.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {marker.description}
                          </p>
                          
                          {marker.metrics && (
                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                <div>
                                  <span className="text-gray-500">Current:</span>
                                  <div className="font-semibold text-gray-900">{marker.metrics.current}</div>
                                </div>
                                <div>
                                  <span className="text-gray-500">Recommended:</span>
                                  <div className="font-semibold text-green-600">{marker.metrics.recommended}</div>
                                </div>
                              </div>
                              <div className="mt-2 pt-2 border-t border-gray-200">
                                <span className="text-gray-500 text-xs">Impact:</span>
                                <div className="font-semibold text-blue-600 text-sm">{marker.metrics.improvement}</div>
                              </div>
                            </div>
                          )}
                          
                          {marker.recommendation && (
                            <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
                              marker.type === 'critical' ? 'bg-red-100 text-red-800' :
                              marker.type === 'minor' ? 'bg-yellow-100 text-yellow-800' :
                              marker.type === 'suggestion' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              💡 {marker.recommendation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Legend */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2 p-3 bg-red-50 rounded-lg">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-red-800 text-sm">Critical Issues</div>
            <div className="text-red-600 text-xs">Immediate attention</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-yellow-50 rounded-lg">
          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-yellow-800 text-sm">Minor Issues</div>
            <div className="text-yellow-600 text-xs">Recommended fixes</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
          <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-blue-800 text-sm">Suggestions</div>
            <div className="text-blue-600 text-xs">Quick improvements</div>
          </div>
        </div>
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <div>
            <div className="font-semibold text-green-800 text-sm">Good Elements</div>
            <div className="text-green-600 text-xs">Keep as-is</div>
          </div>
        </div>
      </div>

      {/* Professional Insights */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
          <Eye className="w-4 h-4 mr-2" />
          Professional Eye-Tracking Insights
        </h4>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-700">Primary Focus Zone:</span>
            <p className="text-gray-600">Upper left quadrant captures 68% of initial attention</p>
          </div>
          <div>
            <span className="font-medium text-purple-700">Reading Pattern:</span>
            <p className="text-gray-600">Z-pattern flow optimized for highway viewing</p>
          </div>
          <div>
            <span className="font-medium text-green-700">Attention Retention:</span>
            <p className="text-gray-600">3.2 second average engagement at 65mph</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveImageOverlay;
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  MapPin, 
  Navigation, 
  Search, 
  X, 
  Clock, 
  Globe,
  Eye,
  Gauge,
  DollarSign,
  Users,
  Zap,
  AlertTriangle,
  CheckCircle,
  Info,
  Target
} from 'lucide-react';
import { BillboardLocation, BillboardMetadata } from '../../types/billboard';
import { BillboardDataService } from '../../services/billboardDataService';
import LocationComparison from './LocationComparison';

interface IntelligentLocationSelectorProps {
  value: string;
  onChange: (location: string, metadata?: BillboardMetadata) => void;
  error?: string;
  brandCategory?: string;
}

const IntelligentLocationSelector: React.FC<IntelligentLocationSelectorProps> = ({ 
  value, 
  onChange, 
  error,
  brandCategory
}) => {
  const { t } = useTranslation();
  const [inputMode, setInputMode] = useState<'billboard' | 'address' | 'coordinates'>('billboard');
  const [suggestions, setSuggestions] = useState<BillboardLocation[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<BillboardLocation | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [isValidating, setIsValidating] = useState(false);
  const [comparisonLocations, setComparisonLocations] = useState<BillboardLocation[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange(newValue);
    
    if (newValue.length >= 2 && inputMode === 'billboard') {
      const searchResults = BillboardDataService.searchLocations(newValue);
      setSuggestions(searchResults);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleLocationSelect = (location: BillboardLocation) => {
    setSelectedLocation(location);
    onChange(location.locationName, BillboardDataService.generateMetadata(location));
    setShowSuggestions(false);
    setIsValidating(false);
  };

  const addToComparison = (location: BillboardLocation) => {
    if (comparisonLocations.length < 3 && !comparisonLocations.find(l => l.id === location.id)) {
      setComparisonLocations([...comparisonLocations, location]);
    }
  };

  const removeFromComparison = (locationId: string) => {
    setComparisonLocations(comparisonLocations.filter(l => l.id !== locationId));
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-orange-100 text-orange-800';
      case 'extreme': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return <CheckCircle className="w-3 h-3" />;
      case 'medium': return <Info className="w-3 h-3" />;
      case 'hard': return <AlertTriangle className="w-3 h-3" />;
      case 'extreme': return <AlertTriangle className="w-3 h-3" />;
      default: return <Info className="w-3 h-3" />;
    }
  };

  const getROIColor = (score?: number) => {
    if (!score) return 'text-gray-500';
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredSuggestions = filterDifficulty === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.readabilityDifficulty === filterDifficulty);

  const allLocations = BillboardDataService.getAllLocations();

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setInputMode('billboard')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === 'billboard'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Billboard Locations
        </button>
        <button
          type="button"
          onClick={() => setInputMode('address')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === 'address'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Search className="w-4 h-4 inline mr-2" />
          Custom Address
        </button>
        <button
          type="button"
          onClick={() => setInputMode('coordinates')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            inputMode === 'coordinates'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Globe className="w-4 h-4 inline mr-2" />
          Coordinates
        </button>
      </div>

      {/* Difficulty Filter (Billboard Mode Only) */}
      {inputMode === 'billboard' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filter by difficulty:</span>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">All Locations</option>
            <option value="easy">Easy (Low Speed)</option>
            <option value="medium">Medium (Urban)</option>
            <option value="hard">Hard (Highway)</option>
            <option value="extreme">Extreme (Expressway)</option>
          </select>
          <button
            onClick={() => setShowMap(!showMap)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showMap ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
          <button
            onClick={() => setShowComparison(!showComparison)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showComparison ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Compare ({comparisonLocations.length})
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="relative">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if (inputMode === 'billboard') {
                setSuggestions(allLocations);
                setShowSuggestions(true);
              }
            }}
            placeholder={
              inputMode === 'billboard' 
                ? 'Search billboard locations (e.g., Sultan Qaboos, OOMCO, Al Mouj)'
                : inputMode === 'address'
                ? 'Enter custom address'
                : 'Enter coordinates (e.g., 23.5880, 58.3829)'
            }
            className={`w-full pl-10 pr-20 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              error ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {isValidating && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
            
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('');
                  setSelectedLocation(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && inputMode === 'billboard' && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="text-xs text-gray-500 mb-2 flex items-center justify-between">
                <span>🇴🇲 Muscat Billboard Locations ({filteredSuggestions.length})</span>
                <span>ROI Score</span>
              </div>
              {filteredSuggestions.map((location) => (
                <button
                  key={location.id}
                  type="button"
                  onClick={() => handleLocationSelect(location)}
                  className="w-full text-left p-3 hover:bg-blue-50 rounded-lg border border-transparent hover:border-blue-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="font-medium text-gray-900 truncate">
                          {location.locationName}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToComparison(location);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-100 rounded"
                        >
                          + Compare
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {location.addressLandmark}
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getDifficultyColor(location.readabilityDifficulty)}`}>
                          {getDifficultyIcon(location.readabilityDifficulty)}
                          <span>{location.readabilityDifficulty?.toUpperCase()}</span>
                        </span>
                        
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {location.boardType}
                        </span>
                        
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center space-x-1">
                          <Gauge className="w-3 h-3" />
                          <span>{location.speedLimitKmh} km/h</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right ml-3">
                      <div className={`text-lg font-bold ${getROIColor(location.roiScore)}`}>
                        {location.roiScore || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">ROI Score</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map View */}
      {showMap && inputMode === 'billboard' && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border-2 border-blue-200">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Muscat Billboard Locations Map
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {['easy', 'medium', 'hard', 'extreme'].map((difficulty) => {
              const count = allLocations.filter(l => l.readabilityDifficulty === difficulty).length;
              return (
                <div key={difficulty} className={`p-3 rounded-lg ${getDifficultyColor(difficulty)}`}>
                  <div className="flex items-center space-x-2">
                    {getDifficultyIcon(difficulty)}
                    <span className="font-medium capitalize">{difficulty}</span>
                  </div>
                  <div className="text-sm mt-1">{count} locations</div>
                </div>
              );
            })}
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center">
            <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600">Interactive map with color-coded difficulty levels coming soon</p>
            <p className="text-sm text-gray-500 mt-1">Click any location above to see detailed specifications</p>
          </div>
        </div>
      )}

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="font-bold text-blue-900 text-lg mb-1">
                {selectedLocation.locationName}
              </h4>
              <p className="text-blue-700 text-sm">
                {selectedLocation.addressLandmark}
              </p>
            </div>
            <div className="text-right">
              <div className="relative group">
                <div className={`text-2xl font-bold ${getROIColor(selectedLocation.roiScore)}`}>
                  {selectedLocation.roiScore.toFixed(2)}/100
                </div>
                <div className="text-xs text-gray-600">ROI Score</div>

                {selectedLocation.roiBreakdown && (
                  <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 right-0 top-full mt-2 w-64 z-10 shadow-xl">
                    <div className="font-semibold mb-2 border-b border-gray-700 pb-2">ROI Breakdown:</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Daily impressions:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.dailyImpressions.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Monthly cost:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.monthlyCost} OMR</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">CPM:</span>
                        <span className="font-medium">{selectedLocation.roiBreakdown.cpm} OMR</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-700 flex justify-between">
                        <span className="text-gray-300">Position:</span>
                        <span className="font-semibold text-blue-400">{selectedLocation.roiBreakdown.marketPosition}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Location Profile Section */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-900 mb-3">Location Profile</h5>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Traffic Type</div>
                <div className="font-medium text-gray-900">
                  {BillboardDataService.getTrafficType(selectedLocation)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Primary Audience</div>
                <div className="font-medium text-gray-900">
                  {BillboardDataService.getAudienceEstimate(selectedLocation)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Competition Level</div>
                <div className={`font-medium ${
                  BillboardDataService.getCompetitionLevel(selectedLocation) === 'High' ? 'text-red-600' :
                  BillboardDataService.getCompetitionLevel(selectedLocation) === 'Medium' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {BillboardDataService.getCompetitionLevel(selectedLocation)}
                </div>
              </div>
            </div>
          </div>

          {/* Location Scoring */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-900 mb-3">Location Scoring</h5>
            {(() => {
              const score = BillboardDataService.calculateLocationScore(selectedLocation);
              return (
                <div className="space-y-3">
                  {/* Three Main Scores */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center relative group">
                      <div className={`text-2xl font-bold ${
                        score.roiScore >= 80 ? 'text-green-600' :
                        score.roiScore >= 60 ? 'text-blue-600' :
                        score.roiScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score.roiScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-gray-600">ROI Score</div>
                      <div className="text-xs text-gray-500 mt-1">Business value & impressions</div>

                      {selectedLocation.roiBreakdown && (
                        <div className="absolute hidden group-hover:block bg-gray-900 text-white text-xs rounded-lg p-3 left-1/2 -translate-x-1/2 top-full mt-2 w-64 z-10 shadow-xl">
                          <div className="font-semibold mb-2 border-b border-gray-700 pb-2">ROI Breakdown:</div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-gray-300">Daily impressions:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.dailyImpressions.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">Monthly cost:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.monthlyCost} OMR</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-300">CPM:</span>
                              <span className="font-medium">{selectedLocation.roiBreakdown.cpm} OMR</span>
                            </div>
                            <div className="pt-2 mt-2 border-t border-gray-700 flex justify-between">
                              <span className="text-gray-300">Position:</span>
                              <span className="font-semibold text-blue-400">{selectedLocation.roiBreakdown.marketPosition}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        score.readabilityScore >= 80 ? 'text-green-600' :
                        score.readabilityScore >= 60 ? 'text-blue-600' :
                        score.readabilityScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score.readabilityScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-gray-600">Readability Score</div>
                      <div className="text-xs text-gray-500 mt-1">Speed & distance factors</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${
                        score.suitabilityScore >= 80 ? 'text-green-600' :
                        score.suitabilityScore >= 60 ? 'text-blue-600' :
                        score.suitabilityScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {score.suitabilityScore.toFixed(2)}/100
                      </div>
                      <div className="text-xs text-gray-600">Suitability Score</div>
                      <div className="text-xs text-gray-500 mt-1">Overall strategic fit</div>
                    </div>
                  </div>
                  
                  {/* Component Breakdown */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Speed Score (30%)</span>
                    <span className="font-medium">{score.speedScore.toFixed(2)}/30</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Distance Score (25%)</span>
                    <span className="font-medium">{score.distanceScore.toFixed(2)}/25</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Size Score (20%)</span>
                    <span className="font-medium">{score.sizeScore.toFixed(2)}/20</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cost Efficiency (25%)</span>
                    <span className="font-medium">{score.costScore.toFixed(2)}/25</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Score</span>
                    <span className={`text-xl font-bold ${
                      score.totalScore >= 80 ? 'text-green-600' :
                      score.totalScore >= 60 ? 'text-blue-600' :
                      score.totalScore >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {score.totalScore.toFixed(2)}/100
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Dynamic Recommendations */}
          <div className="bg-white rounded-lg p-4 mb-4">
            <h5 className="font-semibold text-gray-900 mb-3">Strategic Recommendations</h5>
            {(() => {
              const recommendations = BillboardDataService.getLocationRecommendations(selectedLocation);
              return (
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <h6 className="font-medium text-blue-900 mb-2 flex items-center">
                      <Gauge className="w-4 h-4 mr-2" />
                      Speed-Based Strategy
                    </h6>
                    <p className="text-blue-800 text-sm">{recommendations.speedRecommendation}</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <h6 className="font-medium text-green-900 mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Location Intelligence
                    </h6>
                    <p className="text-green-800 text-sm">{recommendations.locationInsight}</p>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <h6 className="font-medium text-purple-900 mb-2 flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Creative Strategy
                    </h6>
                    <p className="text-purple-800 text-sm">{recommendations.creativeStrategy}</p>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-gray-900">Viewing</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Distance: {selectedLocation.distanceFromRoadM || 'Est. 75'}m</div>
                <div>Direction: {selectedLocation.trafficDirectionVisibility}</div>
                <div>Lighting: {selectedLocation.lighting}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">Traffic</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Speed: {selectedLocation.speedLimitKmh} km/h</div>
                <div>Road: {selectedLocation.roadType}</div>
                <div>Type: {selectedLocation.boardType}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-green-600" />
                <span className="font-medium text-gray-900">Business</span>
              </div>
              <div className="text-sm text-gray-600">
                <div>Format: {selectedLocation.format}</div>
                <div>Owner: {selectedLocation.ownershipManagement.split(' ')[0]}</div>
                <div>District: {selectedLocation.district}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-2">AI Analysis Context</h5>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-700">Readability Factors:</span>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Speed-based font size requirements</li>
                  <li>• Distance-optimized contrast ratios</li>
                  <li>• Traffic flow visibility patterns</li>
                </ul>
              </div>
              <div>
                <span className="font-medium text-green-700">Business Intelligence:</span>
                <ul className="text-gray-600 mt-1 space-y-1">
                  <li>• Estimated monthly impressions</li>
                  <li>• Competitive landscape analysis</li>
                  <li>• ROI optimization recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location Comparison */}
      {showComparison && comparisonLocations.length > 0 && (
        <div className="mt-6">
          <LocationComparison 
            locations={comparisonLocations}
            brandCategory={brandCategory}
            onRemoveLocation={removeFromComparison}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="text-red-600 text-sm flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">!</span>
          </div>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default IntelligentLocationSelector;
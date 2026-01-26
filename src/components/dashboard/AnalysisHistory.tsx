import React from 'react';
import { AnalysisHistory as AnalysisHistoryType } from '../../types';
import { Calendar, MapPin, TrendingUp, TrendingDown } from 'lucide-react';

interface AnalysisHistoryProps {
  history: AnalysisHistoryType[];
  onSelectAnalysis: (id: string) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelectAnalysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-orange-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-orange-100 text-orange-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const averageScore = history.length > 0
    ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1)
    : '0.0';

  const recentScore = history.length > 0 ? history[0].score : 0;
  const previousScore = history.length > 1 ? history[1].score : recentScore;
  const scoreTrend = recentScore - previousScore;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Analysis History</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">Avg Score:</span>
            <span className={`font-bold ${getScoreColor(parseFloat(averageScore))}`}>
              {averageScore}/100
            </span>
          </div>
          {scoreTrend !== 0 && (
            <div className={`flex items-center space-x-1 ${
              scoreTrend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {scoreTrend > 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {Math.abs(scoreTrend)} pts
              </span>
            </div>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No analyses yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload your first billboard to get started</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt="Billboard thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{item.timestamp.toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadgeColor(item.score)}`}>
                  <span className="ltr-numbers">{item.score}/100</span>
                </span>
                {item.status === 'failed' && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    Failed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;
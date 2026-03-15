import React from 'react';
import { AnalysisHistory as AnalysisHistoryType } from '../../types';
import { Calendar, MapPin, TrendingUp, TrendingDown, Clock, Upload } from 'lucide-react';

interface AnalysisHistoryProps {
  history: AnalysisHistoryType[];
  onSelectAnalysis: (id: string) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelectAnalysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200/50';
    if (score >= 70) return 'bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 border border-blue-200/50';
    if (score >= 50) return 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200/50';
    return 'bg-gradient-to-r from-red-100 to-red-100 text-red-800 border border-red-200/50';
  };

  const averageScore = history.length > 0
    ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1)
    : '0.0';

  const recentScore = history.length > 0 ? history[0].score : 0;
  const previousScore = history.length > 1 ? history[1].score : recentScore;
  const scoreTrend = recentScore - previousScore;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Analysis History</h3>
        </div>
        {history.length > 0 && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
              <span className="text-gray-500">Avg:</span>
              <span className={`font-bold ${getScoreColor(parseFloat(averageScore))}`}>
                {averageScore}
              </span>
            </div>
            {scoreTrend !== 0 && (
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
                scoreTrend > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {scoreTrend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold">
                  {Math.abs(scoreTrend)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Upload className="w-10 h-10 text-blue-500" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">No analyses yet</h4>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
            Upload your first billboard creative to see your analysis history here
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {history.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className={`flex items-center space-x-4 p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 cursor-pointer transition-all duration-300 hover:shadow-md hover:border-blue-200/50 group ${
                index === 0 ? 'bg-gradient-to-r from-blue-50/30 to-purple-50/30 border-blue-100' : 'bg-white'
              }`}
            >
              <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm group-hover:ring-blue-100 transition-all duration-300">
                <img
                  src={item.thumbnail}
                  alt="Billboard thumbnail"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors">
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{item.timestamp.toLocaleDateString()}</span>
                  <span className="text-gray-300">•</span>
                  <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-bold ${getScoreBadgeColor(item.score)}`}>
                  <span className="ltr-numbers">{item.score}</span>
                </span>
                {item.status === 'failed' && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-lg">
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
import React from 'react';
import { AnalysisHistory as AnalysisHistoryType } from '../../types';
import { Calendar, MapPin, TrendingUp, TrendingDown, Clock, Upload } from 'lucide-react';

interface AnalysisHistoryProps {
  history: AnalysisHistoryType[];
  onSelectAnalysis: (id: string) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelectAnalysis }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-success-500';
    if (score >= 50) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-success-100 text-success-800 border border-success-200';
    if (score >= 70) return 'bg-success-50 text-success-700 border border-success-200';
    if (score >= 50) return 'bg-warning-100 text-warning-800 border border-warning-200';
    return 'bg-danger-100 text-danger-800 border border-danger-200';
  };

  const averageScore = history.length > 0
    ? (history.reduce((sum, item) => sum + item.score, 0) / history.length).toFixed(1)
    : '0.0';

  const recentScore = history.length > 0 ? history[0].score : 0;
  const previousScore = history.length > 1 ? history[1].score : recentScore;
  const scoreTrend = recentScore - previousScore;

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-navy-100 flex items-center justify-center">
            <Clock className="w-4 h-4 text-navy-600" />
          </div>
          <h3 className="text-lg font-bold text-navy-950 tracking-tight">Analysis History</h3>
        </div>
        {history.length > 0 && (
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 bg-surface-100 px-3 py-1.5">
              <span className="text-secondary">Avg:</span>
              <span className={`font-bold tabular-nums ${getScoreColor(parseFloat(averageScore))}`}>
                {averageScore}
              </span>
            </div>
            {scoreTrend !== 0 && (
              <div className={`flex items-center space-x-1 px-2 py-1 ${
                scoreTrend > 0 ? 'bg-success-50 text-success-600' : 'bg-danger-50 text-danger-600'
              }`}>
                {scoreTrend > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm font-semibold tabular-nums">
                  {Math.abs(scoreTrend)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 bg-surface-100 flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-navy-400" />
          </div>
          <h4 className="text-base font-bold text-navy-950 mb-2 tracking-tight">No analyses yet</h4>
          <p className="text-secondary text-sm max-w-xs mx-auto">
            Upload your first billboard creative to see your analysis history here
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[28rem] overflow-y-auto pr-1">
          {history.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className={`flex items-center space-x-4 p-4 border cursor-pointer transition-colors duration-200 hover:bg-surface-50 ${
                index === 0 ? 'bg-success-50/50 border-l-4 border-l-success-500 border-t-0 border-r-0 border-b-0' : 'border-surface-200 hover:border-navy-200'
              }`}
            >
              <div className="w-14 h-14 bg-surface-100 overflow-hidden flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt="Billboard thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
                  <p className="text-sm font-semibold text-navy-950 truncate">
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-secondary">
                  <Calendar className="w-3 h-3" />
                  <span>{item.timestamp.toLocaleDateString()}</span>
                  <span className="text-surface-300">•</span>
                  <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1.5 text-sm font-bold ${getScoreBadgeColor(item.score)}`}>
                  <span className="ltr-numbers tabular-nums">{item.score}</span>
                </span>
                {item.status === 'failed' && (
                  <span className="px-2 py-1 bg-danger-100 text-danger-700 text-xs font-medium">
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

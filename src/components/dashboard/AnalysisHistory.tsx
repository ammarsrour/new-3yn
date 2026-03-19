import React from 'react';
import { AnalysisHistory as AnalysisHistoryType } from '../../types';
import { Upload } from 'lucide-react';

interface AnalysisHistoryProps {
  history: AnalysisHistoryType[];
  onSelectAnalysis: (id: string) => void;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ history, onSelectAnalysis }) => {
  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
    : 0;

  return (
    <div className="bg-white p-5">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-navy-950">History</h3>
        {history.length > 0 && (
          <span className="text-xs text-secondary">
            Avg: <span className="font-medium text-navy-700 tabular-nums">{averageScore}</span>
          </span>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <Upload className="w-6 h-6 text-navy-300 mx-auto mb-2" />
          <p className="text-sm text-secondary">No analyses yet</p>
        </div>
      ) : (
        <div className="space-y-1 max-h-[24rem] overflow-y-auto">
          {history.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onSelectAnalysis(item.id)}
              className={`flex items-center space-x-3 p-3 cursor-pointer transition-colors hover:bg-surface-50 ${
                index === 0 ? 'bg-surface-50' : ''
              }`}
            >
              <div className="w-10 h-10 bg-surface-100 overflow-hidden flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-950 truncate">
                  {item.location}
                </p>
                <p className="text-xs text-secondary">
                  {item.timestamp.toLocaleDateString()}
                </p>
              </div>

              <span className="text-sm font-semibold text-navy-950 tabular-nums">
                {item.score}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisHistory;

import React, { useState, useMemo } from 'react';
import { Search, Calendar, MapPin, ChevronRight, Upload } from 'lucide-react';
import { AnalysisHistory, AnalysisResult } from '../../types';

interface AnalysesHistoryPageProps {
  history: AnalysisHistory[];
  onSelectAnalysis: (id: string) => void;
}

const AnalysesHistoryPage: React.FC<AnalysesHistoryPageProps> = ({
  history,
  onSelectAnalysis
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'score'>('date');
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'week' | 'month'>('all');

  // Filter and sort analyses
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) => item.location.toLowerCase().includes(query)
      );
    }

    // Filter by time period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoff = new Date();
      if (filterPeriod === 'week') {
        cutoff.setDate(now.getDate() - 7);
      } else if (filterPeriod === 'month') {
        cutoff.setMonth(now.getMonth() - 1);
      }
      filtered = filtered.filter((item) => item.timestamp >= cutoff);
    }

    // Sort
    if (sortBy === 'date') {
      filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    } else if (sortBy === 'score') {
      filtered.sort((a, b) => b.score - a.score);
    }

    return filtered;
  }, [history, searchQuery, sortBy, filterPeriod]);

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-navy-950 bg-surface-100';
    if (score >= 50) return 'text-navy-700 bg-surface-100';
    return 'text-danger-600 bg-danger-50';
  };

  const averageScore = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + item.score, 0) / history.length)
    : 0;

  if (history.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-surface-100 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-8 h-8 text-navy-400" />
        </div>
        <h2 className="text-xl font-semibold text-navy-950 mb-2">No analyses yet</h2>
        <p className="text-secondary mb-6">
          Upload your first billboard to get started with AI-powered readability analysis.
        </p>
        <button
          onClick={() => onSelectAnalysis('new')}
          className="bg-navy-950 text-white px-5 py-2.5 font-medium hover:bg-navy-800 transition-colors"
        >
          Analyze Your First Billboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 text-center">
          <div className="text-2xl font-bold text-navy-950 tabular-nums">{history.length}</div>
          <div className="text-xs text-secondary">Total Analyses</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-2xl font-bold text-navy-950 tabular-nums">{averageScore}</div>
          <div className="text-xs text-secondary">Average Score</div>
        </div>
        <div className="bg-white p-4 text-center">
          <div className="text-2xl font-bold text-navy-950 tabular-nums">
            {history.filter(h => h.score >= 70).length}
          </div>
          <div className="text-xs text-secondary">High Performers</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-2 border border-surface-300 text-sm"
            />
          </div>

          {/* Period Filter */}
          <div className="flex items-center space-x-1">
            {(['all', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setFilterPeriod(period)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  filterPeriod === period
                    ? 'bg-navy-950 text-white'
                    : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                }`}
              >
                {period === 'all' ? 'All Time' : period === 'week' ? 'This Week' : 'This Month'}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
            className="px-3 py-2 border border-surface-300 text-sm bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="score">Sort by Score</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-secondary">
            No analyses match your search
          </div>
        ) : (
          <div className="divide-y divide-surface-100">
            {filteredHistory.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectAnalysis(item.id)}
                className="w-full flex items-center p-4 hover:bg-surface-50 transition-colors text-left"
              >
                {/* Thumbnail */}
                <div className="w-16 h-12 bg-surface-100 overflow-hidden flex-shrink-0 mr-4">
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" />
                    <span className="font-medium text-navy-950 text-sm truncate">
                      {item.location}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-secondary">
                    <Calendar className="w-3 h-3" />
                    <span>{item.timestamp.toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Score */}
                <div className={`px-3 py-1.5 text-sm font-bold tabular-nums ${getScoreColor(item.score)}`}>
                  {item.score}
                </div>

                {/* Arrow */}
                <ChevronRight className="w-4 h-4 text-navy-300 ml-3" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Load More (placeholder) */}
      {filteredHistory.length >= 10 && (
        <div className="text-center">
          <button className="text-sm text-navy-600 hover:text-navy-800">
            Load more analyses
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysesHistoryPage;

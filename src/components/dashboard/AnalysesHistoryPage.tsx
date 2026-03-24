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
      <div className="max-w-2xl mx-auto text-center py-16" role="status">
        <div className="w-16 h-16 bg-surface-100 flex items-center justify-center mx-auto mb-4" aria-hidden="true">
          <Upload className="w-8 h-8 text-navy-400" />
        </div>
        <h2 className="text-xl font-semibold text-navy-950 mb-2">No analyses yet</h2>
        <p className="text-secondary mb-6">
          Upload your first billboard to get started with AI-powered readability analysis.
        </p>
        <button
          onClick={() => onSelectAnalysis('new')}
          className="bg-navy-950 text-white px-5 py-2.5 font-medium hover:bg-navy-800 transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 min-h-[44px]"
        >
          Analyze Your First Billboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary - responsive: horizontal scroll on very small, grid on larger */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-navy-950 tabular-nums">{history.length}</div>
          <div className="text-xs text-secondary">Total</div>
        </div>
        <div className="bg-white p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-navy-950 tabular-nums">{averageScore}</div>
          <div className="text-xs text-secondary">Avg Score</div>
        </div>
        <div className="bg-white p-3 sm:p-4 text-center">
          <div className="text-xl sm:text-2xl font-bold text-navy-950 tabular-nums">
            {history.filter(h => h.score >= 70).length}
          </div>
          <div className="text-xs text-secondary">High Score</div>
        </div>
      </div>

      {/* Filters - responsive: stacked on mobile, inline on larger */}
      <div className="bg-white p-3 sm:p-4">
        <div className="flex flex-col gap-3">
          {/* Search - always full width on mobile */}
          <div className="relative">
            <label htmlFor="history-search" className="sr-only">Search analyses by location</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" aria-hidden="true" />
            <input
              id="history-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by location..."
              className="w-full pl-10 pr-4 py-2 border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent min-h-[44px]"
            />
          </div>

          {/* Period Filter + Sort - inline row */}
          <div className="flex flex-wrap items-center gap-2">
            <fieldset className="flex items-center flex-1 min-w-0">
              <legend className="sr-only">Filter by time period</legend>
              <div className="flex w-full sm:w-auto">
                {(['all', 'week', 'month'] as const).map((period) => (
                  <button
                    key={period}
                    onClick={() => setFilterPeriod(period)}
                    aria-pressed={filterPeriod === period}
                    className={`flex-1 sm:flex-none px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-inset min-h-[44px] ${
                      filterPeriod === period
                        ? 'bg-navy-950 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    {period === 'all' ? 'All' : period === 'week' ? 'Week' : 'Month'}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Sort */}
            <div className="flex-shrink-0">
              <label htmlFor="history-sort" className="sr-only">Sort analyses</label>
              <select
                id="history-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'score')}
                className="px-2 sm:px-3 py-2 border border-surface-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent min-h-[44px]"
              >
                <option value="date">Date</option>
                <option value="score">Score</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white" role="region" aria-label="Analysis results" aria-live="polite">
        {filteredHistory.length === 0 ? (
          <div className="p-8 text-center text-secondary" role="status">
            No analyses match your search
          </div>
        ) : (
          <ul className="divide-y divide-surface-100" aria-label={`${filteredHistory.length} analyses found`}>
            {filteredHistory.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onSelectAnalysis(item.id)}
                  className="w-full flex items-center p-4 hover:bg-surface-50 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-inset min-h-[72px]"
                  aria-label={`View analysis for ${item.location}, score ${item.score}, from ${item.timestamp.toLocaleDateString()}`}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-12 bg-surface-100 overflow-hidden flex-shrink-0 mr-4">
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-navy-400 flex-shrink-0" aria-hidden="true" />
                      <span className="font-medium text-navy-950 text-sm truncate max-w-[150px] sm:max-w-none" title={item.location}>
                        {item.location}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-secondary">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <time dateTime={item.timestamp.toISOString()}>{item.timestamp.toLocaleDateString()}</time>
                      <span aria-hidden="true">·</span>
                      <span>{item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className={`px-3 py-1.5 text-sm font-bold tabular-nums ${getScoreColor(item.score)}`} aria-label={`Score: ${item.score}`}>
                    {item.score}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-4 h-4 text-navy-300 ml-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Load More (placeholder) */}
      {filteredHistory.length >= 10 && (
        <div className="text-center py-4">
          <button className="text-sm text-navy-600 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 rounded px-4 py-2 min-h-[44px]">
            Load more analyses
          </button>
        </div>
      )}
    </div>
  );
};

export default AnalysesHistoryPage;

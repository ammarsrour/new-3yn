import React from 'react';
import { Calendar } from 'lucide-react';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

const PRESETS = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'All time', days: -1 },
];

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onChange }) => {
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const handlePresetClick = (days: number) => {
    if (days === -1) {
      // All time
      onChange({ startDate: null, endDate: null });
    } else if (days === 0) {
      // Today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      onChange({ startDate: today, endDate: endOfDay });
    } else {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);
      onChange({ startDate, endDate });
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      onChange({ ...dateRange, startDate: date });
    } else {
      onChange({ ...dateRange, startDate: null });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      const date = new Date(value);
      date.setHours(23, 59, 59, 999);
      onChange({ ...dateRange, endDate: date });
    } else {
      onChange({ ...dateRange, endDate: null });
    }
  };

  const getActivePreset = (): string | null => {
    if (!dateRange.startDate && !dateRange.endDate) return 'All time';

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (dateRange.startDate && dateRange.endDate) {
      const startTime = dateRange.startDate.getTime();
      const todayTime = today.getTime();

      if (startTime === todayTime) return 'Today';

      const daysDiff = Math.round((now.getTime() - startTime) / (1000 * 60 * 60 * 24));
      if (daysDiff === 7) return 'Last 7 days';
      if (daysDiff === 30) return 'Last 30 days';
      if (daysDiff === 90) return 'Last 90 days';
    }

    return null;
  };

  const activePreset = getActivePreset();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Date Range</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => handlePresetClick(preset.days)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              activePreset === preset.label
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={formatDateForInput(dateRange.startDate)}
          onChange={handleStartDateChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={formatDateForInput(dateRange.endDate)}
          onChange={handleEndDateChange}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;

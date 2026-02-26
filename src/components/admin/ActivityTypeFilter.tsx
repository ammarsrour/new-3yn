import React, { useState, useRef, useEffect } from 'react';
import { Filter, Check, ChevronDown } from 'lucide-react';
import { ActivityType } from '../../services/activityLogger';

interface ActivityTypeFilterProps {
  selectedTypes: ActivityType[];
  onChange: (types: ActivityType[]) => void;
}

const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  'page_view': 'Page View',
  'upload': 'Upload',
  'analysis': 'Analysis Started',
  'analysis_complete': 'Analysis Complete',
  'analysis_failed': 'Analysis Failed',
  'download': 'Download',
  'login': 'Login',
  'logout': 'Logout',
  'signup': 'Signup',
  'location_select': 'Location Select',
};

const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  'page_view': 'bg-gray-100 text-gray-800',
  'upload': 'bg-green-100 text-green-800',
  'analysis': 'bg-blue-100 text-blue-800',
  'analysis_complete': 'bg-emerald-100 text-emerald-800',
  'analysis_failed': 'bg-red-100 text-red-800',
  'download': 'bg-orange-100 text-orange-800',
  'login': 'bg-cyan-100 text-cyan-800',
  'logout': 'bg-slate-100 text-slate-800',
  'signup': 'bg-purple-100 text-purple-800',
  'location_select': 'bg-indigo-100 text-indigo-800',
};

const ALL_ACTIVITY_TYPES: ActivityType[] = [
  'login',
  'logout',
  'signup',
  'upload',
  'analysis',
  'analysis_complete',
  'analysis_failed',
  'download',
  'location_select',
  'page_view',
];

const ActivityTypeFilter: React.FC<ActivityTypeFilterProps> = ({ selectedTypes, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleType = (type: ActivityType) => {
    if (selectedTypes.includes(type)) {
      onChange(selectedTypes.filter(t => t !== type));
    } else {
      onChange([...selectedTypes, type]);
    }
  };

  const handleSelectAll = () => {
    onChange([...ALL_ACTIVITY_TYPES]);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const getButtonLabel = (): string => {
    if (selectedTypes.length === 0 || selectedTypes.length === ALL_ACTIVITY_TYPES.length) {
      return 'All Types';
    }
    if (selectedTypes.length === 1) {
      return ACTIVITY_TYPE_LABELS[selectedTypes[0]];
    }
    return `${selectedTypes.length} types`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700">{getButtonLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2 border-b border-gray-100 flex justify-between">
            <button
              onClick={handleSelectAll}
              className="text-xs text-blue-500 hover:text-blue-600"
            >
              Select All
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-600"
            >
              Clear All
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {ALL_ACTIVITY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => handleToggleType(type)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                  selectedTypes.includes(type) || selectedTypes.length === 0
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                }`}>
                  {(selectedTypes.includes(type) || selectedTypes.length === 0) && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${ACTIVITY_TYPE_COLORS[type]}`}>
                  {ACTIVITY_TYPE_LABELS[type]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTypeFilter;

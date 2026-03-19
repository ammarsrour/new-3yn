import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface FeatureTooltipProps {
  id: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  showOnce?: boolean;
  delay?: number;
}

const STORAGE_KEY = 'feature-tooltips-seen';

const getSeenTooltips = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
};

const markTooltipSeen = (id: string) => {
  const seen = getSeenTooltips();
  if (!seen.includes(id)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, id]));
  }
};

const FeatureTooltip: React.FC<FeatureTooltipProps> = ({
  id,
  title,
  description,
  position = 'bottom',
  children,
  showOnce = true,
  delay = 500
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenSeen, setHasBeenSeen] = useState(true);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const seen = getSeenTooltips();
    const alreadySeen = seen.includes(id);
    setHasBeenSeen(alreadySeen);

    if (!alreadySeen && showOnce) {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }
  }, [id, showOnce, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    markTooltipSeen(id);
    setHasBeenSeen(true);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 -translate-y-1/2 ml-2';
      default:
        return 'top-full left-1/2 -translate-x-1/2 mt-2';
    }
  };

  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 -translate-x-1/2 border-t-navy-900 border-x-transparent border-b-transparent';
      case 'bottom':
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-navy-900 border-x-transparent border-t-transparent';
      case 'left':
        return 'left-full top-1/2 -translate-y-1/2 border-l-navy-900 border-y-transparent border-r-transparent';
      case 'right':
        return 'right-full top-1/2 -translate-y-1/2 border-r-navy-900 border-y-transparent border-l-transparent';
      default:
        return 'bottom-full left-1/2 -translate-x-1/2 border-b-navy-900 border-x-transparent border-t-transparent';
    }
  };

  if (hasBeenSeen && showOnce) {
    return <>{children}</>;
  }

  return (
    <div className="relative inline-block">
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`absolute z-50 ${getPositionClasses()}`}
          role="tooltip"
        >
          <div className="bg-navy-900 text-white p-3 max-w-xs shadow-lg">
            {/* Arrow */}
            <div
              className={`absolute w-0 h-0 border-4 ${getArrowClasses()}`}
            />

            {/* Content */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-sm mb-1">{title}</p>
                <p className="text-navy-200 text-xs">{description}</p>
              </div>
              <button
                onClick={handleDismiss}
                className="text-navy-400 hover:text-white transition-colors flex-shrink-0"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureTooltip;

// Utility to reset all tooltips (for testing)
export const resetAllTooltips = () => {
  localStorage.removeItem(STORAGE_KEY);
};

// Utility to check if a specific tooltip has been seen
export const hasSeenTooltip = (id: string): boolean => {
  return getSeenTooltips().includes(id);
};

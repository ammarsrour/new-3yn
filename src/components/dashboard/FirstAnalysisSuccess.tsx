import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

interface FirstAnalysisSuccessProps {
  score: number;
  onContinue: () => void;
  onExploreFeatures: () => void;
}

const FirstAnalysisSuccess: React.FC<FirstAnalysisSuccessProps> = ({
  score,
  onContinue,
  onExploreFeatures
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getScoreMessage = () => {
    if (score >= 80) return "Excellent work. This billboard will perform well.";
    if (score >= 60) return "Good foundation. A few improvements will boost performance.";
    return "We found opportunities to significantly improve readability.";
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`bg-white max-w-md w-full mx-4 p-8 transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Success icon */}
        <div className="w-12 h-12 bg-surface-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-6 h-6 text-navy-600" />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-navy-950 mb-2">
            Your First Analysis Complete
          </h2>
          <p className="text-secondary">
            {getScoreMessage()}
          </p>
        </div>

        {/* Score preview */}
        <div className="bg-surface-50 p-4 mb-8 text-center">
          <div className="text-4xl font-bold text-navy-950 tabular-nums mb-1">
            {score}
          </div>
          <div className="text-sm text-secondary">Readability Score</div>
        </div>

        {/* Tips for next steps */}
        <div className="space-y-3 mb-8">
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-5 h-5 bg-surface-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-navy-700">1</span>
            </div>
            <p className="text-secondary">
              Review the <span className="text-navy-700 font-medium">Critical Issues</span> section for highest-impact fixes
            </p>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-5 h-5 bg-surface-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-navy-700">2</span>
            </div>
            <p className="text-secondary">
              Use the <span className="text-navy-700 font-medium">Real-World Simulator</span> to test at different distances
            </p>
          </div>
          <div className="flex items-start space-x-3 text-sm">
            <div className="w-5 h-5 bg-surface-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-navy-700">3</span>
            </div>
            <p className="text-secondary">
              <span className="text-navy-700 font-medium">Export PDF</span> to share findings with your team
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3">
          <button
            onClick={onContinue}
            className="w-full bg-navy-950 text-white py-3 font-medium hover:bg-navy-800 transition-colors flex items-center justify-center space-x-2"
          >
            <span>View Full Results</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onExploreFeatures}
            className="w-full text-navy-600 py-2 text-sm hover:text-navy-800 transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Advanced Features</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstAnalysisSuccess;

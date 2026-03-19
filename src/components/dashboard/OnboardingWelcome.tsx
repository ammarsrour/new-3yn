import React, { useState, useEffect } from 'react';
import { X, Upload, Target, Zap } from 'lucide-react';

interface OnboardingWelcomeProps {
  userName: string;
  onDismiss: () => void;
  onSkip: () => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  userName,
  onDismiss,
  onSkip
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slight delay for smooth entrance
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 200);
  };

  const handleSkip = () => {
    setIsVisible(false);
    setTimeout(onSkip, 200);
  };

  return (
    <div
      className={`bg-white border-b border-surface-200 transition-all duration-200 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-navy-950 mb-1">
              Welcome to 3YN, {userName.split(' ')[0]}
            </h2>
            <p className="text-secondary text-sm mb-4">
              Get AI-powered readability analysis for your billboards in under a minute.
            </p>

            {/* Quick value props - inline */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
                  <Upload className="w-4 h-4 text-navy-600" />
                </div>
                <div>
                  <span className="font-medium text-navy-950">Upload</span>
                  <span className="text-secondary ml-1">your billboard design</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
                  <Target className="w-4 h-4 text-navy-600" />
                </div>
                <div>
                  <span className="font-medium text-navy-950">Get scored</span>
                  <span className="text-secondary ml-1">on readability at distance</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-surface-100 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-navy-600" />
                </div>
                <div>
                  <span className="font-medium text-navy-950">Fix issues</span>
                  <span className="text-secondary ml-1">with specific recommendations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSkip}
              className="text-sm text-secondary hover:text-navy-700 transition-colors"
            >
              Skip intro
            </button>
            <button
              onClick={handleDismiss}
              className="bg-navy-950 text-white px-4 py-2 text-sm font-medium hover:bg-navy-800 transition-colors"
            >
              Get Started
            </button>
            <button
              onClick={handleDismiss}
              className="text-navy-400 hover:text-navy-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWelcome;

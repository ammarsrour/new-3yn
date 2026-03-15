import React from 'react';
import { Upload, Brain, FileText, CheckCircle, Sparkles } from 'lucide-react';

interface AnalysisProgressProps {
  stage: 'uploading' | 'analyzing' | 'generating' | 'completed';
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage, progress }) => {
  const stages = [
    { key: 'uploading', label: 'Uploading image', description: 'Preparing your creative for analysis', icon: Upload },
    { key: 'analyzing', label: 'AI Analysis', description: 'Examining readability and design elements', icon: Brain },
    { key: 'generating', label: 'Generating report', description: 'Compiling insights and recommendations', icon: FileText },
    { key: 'completed', label: 'Analysis complete', description: 'Your results are ready', icon: CheckCircle }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-purple-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/20 to-blue-100/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-5">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-3">
              Analyzing Your Billboard
            </h2>
            <p className="text-gray-500">Our AI is examining your creative for optimal readability</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-500 font-medium">Progress</span>
              <span className="font-bold text-blue-600 ltr-numbers">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 h-4 rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="space-y-4">
            {stages.map((stageItem, index) => {
              const StageIcon = stageItem.icon;
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;

              return (
                <div
                  key={stageItem.key}
                  className={`flex items-center space-x-4 p-4 sm:p-5 rounded-xl transition-all duration-500 ease-out transform ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md scale-[1.02]'
                      : isCompleted
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200'
                        : 'bg-gray-50 border-2 border-gray-100 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ${
                    isActive
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
                      : isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isActive ? (
                      <div className="relative">
                        <StageIcon className="w-6 h-6" />
                        <div className="absolute inset-0 animate-ping">
                          <StageIcon className="w-6 h-6 opacity-50" />
                        </div>
                      </div>
                    ) : (
                      <StageIcon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-700'
                        : isCompleted
                          ? 'text-green-700'
                          : 'text-gray-400'
                    }`}>
                      {stageItem.label}
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? 'text-blue-500'
                        : isCompleted
                          ? 'text-green-500'
                          : 'text-gray-400'
                    }`}>
                      {stageItem.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center space-x-3 text-sm text-gray-500 bg-gray-50 px-5 py-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span>This usually takes 30-60 seconds</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add shimmer animation to global styles */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default AnalysisProgress;
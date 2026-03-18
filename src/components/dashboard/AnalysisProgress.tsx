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
      <div className="bg-white border-l-4 border-navy-950 p-8 sm:p-10">
        <div>
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-950 mb-5">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight mb-3">
              Analyzing Your Billboard
            </h2>
            <p className="text-secondary">Our AI is examining your creative for optimal readability</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-secondary font-medium">Progress</span>
              <span className="font-bold text-navy-950 ltr-numbers">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-surface-100 h-2 overflow-hidden">
              <div
                className="bg-navy-950 h-2 transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="space-y-3">
            {stages.map((stageItem, index) => {
              const StageIcon = stageItem.icon;
              const isActive = index === currentStageIndex;
              const isCompleted = index < currentStageIndex;

              return (
                <div
                  key={stageItem.key}
                  className={`flex items-center space-x-4 p-4 sm:p-5 transition-all duration-300 ${
                    isActive
                      ? 'bg-info-50 border-l-4 border-info-500'
                      : isCompleted
                        ? 'bg-success-50 border-l-4 border-success-500'
                        : 'bg-surface-50 border-l-4 border-surface-200 opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-info-500 text-white'
                      : isCompleted
                        ? 'bg-success-500 text-white'
                        : 'bg-surface-200 text-navy-400'
                  }`}>
                    <StageIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold transition-colors duration-300 ${
                      isActive
                        ? 'text-info-700'
                        : isCompleted
                          ? 'text-success-700'
                          : 'text-navy-400'
                    }`}>
                      {stageItem.label}
                    </p>
                    <p className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? 'text-info-600'
                        : isCompleted
                          ? 'text-success-600'
                          : 'text-navy-400'
                    }`}>
                      {stageItem.description}
                    </p>
                  </div>
                  {isCompleted && (
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-success-500" />
                    </div>
                  )}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-info-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-info-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-info-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-10 text-center">
            <div className="inline-flex items-center space-x-3 text-sm text-secondary bg-surface-50 px-5 py-3">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-navy-400 animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-navy-500 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-1.5 h-1.5 bg-navy-400 animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              <span>This usually takes 30-60 seconds</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
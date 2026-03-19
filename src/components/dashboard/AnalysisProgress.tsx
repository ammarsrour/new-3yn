import React from 'react';
import { Upload, Brain, FileText, Check } from 'lucide-react';

interface AnalysisProgressProps {
  stage: 'uploading' | 'analyzing' | 'generating' | 'completed';
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage, progress }) => {
  const stages = [
    { key: 'uploading', label: 'Uploading', description: 'Preparing your creative', icon: Upload },
    { key: 'analyzing', label: 'Analyzing', description: 'Examining readability', icon: Brain },
    { key: 'generating', label: 'Generating', description: 'Compiling recommendations', icon: FileText },
    { key: 'completed', label: 'Complete', description: 'Results ready', icon: Check }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-navy-950 tracking-tight mb-1">
            Analyzing Your Billboard
          </h2>
          <p className="text-sm text-secondary">Examining readability and design elements</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-secondary">Progress</span>
            <span className="font-medium text-navy-950 tabular-nums">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-surface-100 h-1.5 overflow-hidden">
            <div
              className="bg-navy-950 h-1.5 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stage Indicators - Quieter */}
        <div className="space-y-2">
          {stages.map((stageItem, index) => {
            const StageIcon = stageItem.icon;
            const isActive = index === currentStageIndex;
            const isCompleted = index < currentStageIndex;

            return (
              <div
                key={stageItem.key}
                className={`flex items-center space-x-3 p-3 transition-colors ${
                  isActive
                    ? 'bg-surface-50'
                    : isCompleted
                      ? 'bg-surface-50'
                      : 'opacity-40'
                }`}
              >
                <div className={`w-8 h-8 flex items-center justify-center transition-colors ${
                  isActive
                    ? 'bg-navy-950 text-white'
                    : isCompleted
                      ? 'bg-navy-200 text-navy-700'
                      : 'bg-surface-100 text-navy-400'
                }`}>
                  <StageIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isActive || isCompleted ? 'text-navy-950' : 'text-navy-400'
                  }`}>
                    {stageItem.label}
                  </p>
                  <p className="text-xs text-secondary">
                    {stageItem.description}
                  </p>
                </div>
                {isCompleted && (
                  <Check className="w-4 h-4 text-navy-500" />
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-secondary">Usually 30-60 seconds</p>
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
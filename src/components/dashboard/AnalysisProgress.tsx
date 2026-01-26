import React from 'react';
import { Upload, Brain, FileText, CheckCircle } from 'lucide-react';

interface AnalysisProgressProps {
  stage: 'uploading' | 'analyzing' | 'generating' | 'completed';
  progress: number;
}

const AnalysisProgress: React.FC<AnalysisProgressProps> = ({ stage, progress }) => {
  const stages = [
    { key: 'uploading', label: 'Uploading image...', icon: Upload },
    { key: 'analyzing', label: 'Analyzing with AI...', icon: Brain },
    { key: 'generating', label: 'Generating report...', icon: FileText },
    { key: 'completed', label: 'Analysis complete!', icon: CheckCircle }
  ];

  const currentStageIndex = stages.findIndex(s => s.key === stage);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Billboard</h2>
        <p className="text-gray-600">Our AI is examining your creative for optimal readability</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Progress</span>
          <span className="ltr-numbers">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
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
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-50 border-2 border-blue-200' 
                  : isCompleted 
                    ? 'bg-green-50 border-2 border-green-200'
                    : 'bg-gray-50 border-2 border-gray-200'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'bg-blue-500 text-white animate-pulse' 
                  : isCompleted 
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-500'
              }`}>
                <StageIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className={`font-medium ${
                  isActive 
                    ? 'text-blue-700' 
                    : isCompleted 
                      ? 'text-green-700'
                      : 'text-gray-500'
                }`}>
                  {stageItem.label}
                </p>
              </div>
              {isCompleted && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>This usually takes 30-60 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default AnalysisProgress;
import React, { useState } from 'react';
import { ArrowRight, Palette, Type, Layout } from 'lucide-react';

interface Improvement {
  id: string;
  type: 'font' | 'contrast' | 'layout';
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
}

interface BeforeAfterComparisonProps {
  originalImage: string;
  improvements: Improvement[];
}

const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  originalImage,
  improvements
}) => {
  const [selectedImprovement, setSelectedImprovement] = useState<string>(improvements[0]?.id || '');

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'font':
        return <Type className="w-5 h-5" />;
      case 'contrast':
        return <Palette className="w-5 h-5" />;
      case 'layout':
        return <Layout className="w-5 h-5" />;
      default:
        return <Type className="w-5 h-5" />;
    }
  };

  const selectedImprovementData = improvements.find(imp => imp.id === selectedImprovement);

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <h3 className="text-xl font-semibold text-navy-950 mb-6 tracking-tight">
        Visual Improvements
      </h3>

      {/* Improvement Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {improvements.map((improvement) => (
          <button
            key={improvement.id}
            onClick={() => setSelectedImprovement(improvement.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              selectedImprovement === improvement.id
                ? 'bg-navy-950 text-white'
                : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            {getImprovementIcon(improvement.type)}
            <span>{improvement.title}</span>
          </button>
        ))}
      </div>

      {selectedImprovementData && (
        <div>
          {/* Description */}
          <div className="bg-info-50 border-l-4 border-info-500 p-4 mb-6">
            <p className="text-info-800 text-sm">
              {selectedImprovementData.description}
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-danger-500"></div>
                <h4 className="font-semibold text-navy-950">Before</h4>
              </div>
              <div className="relative">
                <img
                  src={originalImage}
                  alt="Original billboard"
                  className="w-full h-48 object-cover border-l-4 border-danger-500"
                />
                <div className="absolute top-2 left-2 bg-danger-500 text-white px-2 py-1 text-xs font-medium">
                  Original
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-navy-950 text-white w-12 h-12 flex items-center justify-center">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* After */}
            <div className="md:col-start-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-success-500"></div>
                <h4 className="font-semibold text-navy-950">After</h4>
              </div>
              <div className="relative">
                <img
                  src={selectedImprovementData.afterImage}
                  alt="Improved billboard"
                  className="w-full h-48 object-cover border-l-4 border-success-500"
                />
                <div className="absolute top-2 left-2 bg-success-500 text-white px-2 py-1 text-xs font-medium">
                  Improved
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-surface-50 border-l-4 border-success-500">
              <div className="text-2xl font-bold text-success-600 tabular-nums">+15</div>
              <div className="text-sm text-secondary">Score Improvement</div>
            </div>
            <div className="text-center p-4 bg-surface-50 border-l-4 border-info-500">
              <div className="text-2xl font-bold text-info-600 tabular-nums">40%</div>
              <div className="text-sm text-secondary">Better Readability</div>
            </div>
            <div className="text-center p-4 bg-surface-50 border-l-4 border-navy-500">
              <div className="text-2xl font-bold text-navy-700 tabular-nums">2.5x</div>
              <div className="text-sm text-secondary">Faster Recognition</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterComparison;

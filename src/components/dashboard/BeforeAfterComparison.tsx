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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Visual Improvements
      </h3>

      {/* Improvement Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {improvements.map((improvement) => (
          <button
            key={improvement.id}
            onClick={() => setSelectedImprovement(improvement.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedImprovement === improvement.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              {selectedImprovementData.description}
            </p>
          </div>

          {/* Before/After Comparison */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Before</h4>
              </div>
              <div className="relative">
                <img
                  src={originalImage}
                  alt="Original billboard"
                  className="w-full h-48 object-cover rounded-lg border-2 border-red-200"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Original
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* After */}
            <div className="md:col-start-2">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">After</h4>
              </div>
              <div className="relative">
                <img
                  src={selectedImprovementData.afterImage}
                  alt="Improved billboard"
                  className="w-full h-48 object-cover rounded-lg border-2 border-green-200"
                />
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Improved
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">+15</div>
              <div className="text-sm text-gray-600">Score Improvement</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">40%</div>
              <div className="text-sm text-gray-600">Better Readability</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2.5x</div>
              <div className="text-sm text-gray-600">Faster Recognition</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeforeAfterComparison;
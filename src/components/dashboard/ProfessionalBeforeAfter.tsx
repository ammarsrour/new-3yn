import React, { useState } from 'react';
import { ArrowRight, Palette, Type, Layout, Zap, TrendingUp, Award } from 'lucide-react';

interface Improvement {
  id: string;
  type: 'font' | 'contrast' | 'layout' | 'arabic';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  roiEstimate: number;
  beforeMetrics: {
    score: number;
    readability: string;
    compliance: string;
  };
  afterMetrics: {
    score: number;
    readability: string;
    compliance: string;
  };
}

interface ProfessionalBeforeAfterProps {
  originalImage: string;
  aiAnalysis?: {
    criticalIssues: Array<{ title: string; description: string }>;
    minorIssues: Array<{ title: string; description: string }>;
    quickWins: Array<{ title: string; description: string }>;
    detailedAnalysis: string;
  };
  currentScore: number;
}

const ProfessionalBeforeAfter: React.FC<ProfessionalBeforeAfterProps> = ({
  originalImage,
  aiAnalysis,
  currentScore
}) => {
  const [selectedImprovement, setSelectedImprovement] = useState<string>('all');
  const [showSlider, setShowSlider] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  const generateImprovements = (): Improvement[] => {
    const improvements: Improvement[] = [];

    if (aiAnalysis) {
      const allText = [
        ...aiAnalysis.criticalIssues.map(i => `${i.title} ${i.description}`),
        ...aiAnalysis.minorIssues.map(i => `${i.title} ${i.description}`),
        ...aiAnalysis.quickWins.map(i => `${i.title} ${i.description}`),
        aiAnalysis.detailedAnalysis
      ].join(' ').toLowerCase();

      if (allText.includes('font') || allText.includes('text size') || allText.includes('too small')) {
        improvements.push({
          id: 'font',
          type: 'font',
          title: 'Font Size Enhancement',
          description: 'Increase Arabic text by 45% and English text by 35% for optimal highway readability',
          impact: 'high',
          difficulty: 'easy',
          roiEstimate: 25,
          beforeMetrics: {
            score: currentScore,
            readability: 'Challenging at 100m+',
            compliance: 'Below MTCIT standards'
          },
          afterMetrics: {
            score: Math.min(currentScore + 18, 95),
            readability: 'Clear at all distances',
            compliance: 'MTCIT compliant'
          }
        });
      }

      if (allText.includes('contrast') || allText.includes('4.5:1') || allText.includes('darker')) {
        improvements.push({
          id: 'contrast',
          type: 'contrast',
          title: 'Color Contrast Optimization',
          description: 'Achieve 4.8:1 contrast ratio for desert lighting conditions',
          impact: 'high',
          difficulty: 'easy',
          roiEstimate: 20,
          beforeMetrics: {
            score: currentScore,
            readability: 'Poor in bright light',
            compliance: 'Below WCAG standards'
          },
          afterMetrics: {
            score: Math.min(currentScore + 15, 95),
            readability: 'Excellent visibility',
            compliance: 'WCAG AA compliant'
          }
        });
      }

      if (allText.includes('layout') || allText.includes('simplify') || allText.includes('complex')) {
        improvements.push({
          id: 'layout',
          type: 'layout',
          title: 'Layout Simplification',
          description: 'Reduce visual elements and improve message hierarchy',
          impact: 'medium',
          difficulty: 'medium',
          roiEstimate: 15,
          beforeMetrics: {
            score: currentScore,
            readability: 'Information overload',
            compliance: 'Cluttered design'
          },
          afterMetrics: {
            score: Math.min(currentScore + 12, 95),
            readability: 'Clear message flow',
            compliance: 'Clean, focused design'
          }
        });
      }

      if (allText.includes('arabic') || allText.includes('60%') || allText.includes('mtcit')) {
        improvements.push({
          id: 'arabic',
          type: 'arabic',
          title: 'Arabic Text Prominence',
          description: 'Ensure Arabic text occupies 60%+ of space per MTCIT guidelines',
          impact: 'high',
          difficulty: 'medium',
          roiEstimate: 30,
          beforeMetrics: {
            score: currentScore,
            readability: 'Arabic text secondary',
            compliance: 'Non-compliant'
          },
          afterMetrics: {
            score: Math.min(currentScore + 20, 95),
            readability: 'Arabic prominence achieved',
            compliance: 'MTCIT compliant'
          }
        });
      }
    }

    return improvements;
  };

  const improvements = generateImprovements();
  const selectedImprovementData = improvements.find(imp => imp.id === selectedImprovement);

  const getImprovementIcon = (type: string) => {
    switch (type) {
      case 'font':
        return <Type className="w-5 h-5" />;
      case 'contrast':
        return <Palette className="w-5 h-5" />;
      case 'layout':
        return <Layout className="w-5 h-5" />;
      case 'arabic':
        return <span className="text-lg font-bold">ع</span>;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-danger-600 bg-danger-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'low':
        return 'text-success-600 bg-success-100';
      default:
        return 'text-navy-600 bg-surface-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-success-600 bg-success-100';
      case 'medium':
        return 'text-warning-600 bg-warning-100';
      case 'hard':
        return 'text-danger-600 bg-danger-100';
      default:
        return 'text-navy-600 bg-surface-100';
    }
  };

  const totalROI = improvements.reduce((sum, imp) => sum + imp.roiEstimate, 0);
  const totalScoreImprovement = improvements.reduce((sum, imp) => sum + (imp.afterMetrics.score - imp.beforeMetrics.score), 0);

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <h3 className="text-xl font-semibold text-navy-950 mb-6 tracking-tight">
        Professional Before/After Analysis
      </h3>

      {/* Improvement Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedImprovement('all')}
          className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
            selectedImprovement === 'all'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          All Improvements
        </button>
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

      {/* Before/After Comparison */}
      <div className="grid lg:grid-cols-2 gap-8 mb-6">
        {/* Before */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-navy-950 flex items-center">
              <div className="w-2 h-2 bg-danger-500 mr-2"></div>
              Current Design
            </h4>
            <div className="text-sm text-secondary tabular-nums">Score: {currentScore}/100</div>
          </div>

          <div className="relative group">
            <img
              src={originalImage}
              alt="Original billboard"
              className="w-full h-64 object-cover border-l-4 border-danger-500"
            />

            {/* Problem Indicators */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {improvements.map((improvement, index) => (
                <div
                  key={improvement.id}
                  className="absolute bg-danger-500 text-white px-2 py-1 text-xs font-medium"
                  style={{
                    top: `${20 + index * 15}%`,
                    left: `${10 + index * 20}%`
                  }}
                >
                  {improvement.type}
                </div>
              ))}
            </div>
          </div>

          {selectedImprovementData && (
            <div className="mt-4 bg-danger-50 border-l-4 border-danger-500 p-4">
              <h5 className="font-medium text-danger-800 mb-2">Current Issues:</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Readability:</span>
                  <span className="font-medium">{selectedImprovementData.beforeMetrics.readability}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance:</span>
                  <span className="font-medium">{selectedImprovementData.beforeMetrics.compliance}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Arrow */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="bg-navy-950 text-white w-16 h-16 flex items-center justify-center">
            <ArrowRight className="w-8 h-8" />
          </div>
        </div>

        {/* After */}
        <div className="lg:col-start-2">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-navy-950 flex items-center">
              <div className="w-2 h-2 bg-success-500 mr-2"></div>
              Optimized Design
            </h4>
            <div className="text-sm text-secondary tabular-nums">
              Score: {selectedImprovementData ? selectedImprovementData.afterMetrics.score : Math.min(currentScore + totalScoreImprovement, 95)}/100
            </div>
          </div>

          <div className="relative group">
            <img
              src={originalImage}
              alt="Optimized billboard"
              className="w-full h-64 object-cover border-l-4 border-success-500"
            />

            {/* Improvement Overlays */}
            <div className="absolute inset-0">
              {(selectedImprovement === 'all' ? improvements : selectedImprovementData ? [selectedImprovementData] : []).map((improvement, index) => (
                <div
                  key={improvement.id}
                  className="absolute bg-success-500 text-white px-3 py-2"
                  style={{
                    top: `${15 + index * 20}%`,
                    right: `${10 + index * 15}%`
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {getImprovementIcon(improvement.type)}
                    <span className="text-sm font-medium">
                      {improvement.type === 'font' && '45% Larger'}
                      {improvement.type === 'contrast' && '4.8:1 Ratio'}
                      {improvement.type === 'layout' && 'Simplified'}
                      {improvement.type === 'arabic' && 'Enhanced'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSlider(!showSlider)}
              className="absolute bottom-4 left-4 bg-navy-950 text-white px-3 py-2 text-sm hover:bg-navy-800 transition-colors"
            >
              {showSlider ? 'Hide Slider' : 'Show Comparison'}
            </button>
          </div>

          {selectedImprovementData && (
            <div className="mt-4 bg-success-50 border-l-4 border-success-500 p-4">
              <h5 className="font-medium text-success-800 mb-2">After Improvements:</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Readability:</span>
                  <span className="font-medium">{selectedImprovementData.afterMetrics.readability}</span>
                </div>
                <div className="flex justify-between">
                  <span>Compliance:</span>
                  <span className="font-medium">{selectedImprovementData.afterMetrics.compliance}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Slider */}
      {showSlider && (
        <div className="mb-6 bg-surface-50 p-4">
          <h4 className="font-medium text-navy-950 mb-3">Interactive Comparison</h4>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(parseInt(e.target.value))}
              className="w-full h-2 bg-surface-200 appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-secondary mt-2">
              <span>Before</span>
              <span className="tabular-nums">{sliderPosition}% Improved</span>
              <span>After</span>
            </div>
          </div>
        </div>
      )}

      {/* Improvement Details */}
      {selectedImprovementData && (
        <div className="bg-info-50 border-l-4 border-info-500 p-6 mb-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-info-500 flex items-center justify-center text-white">
              {getImprovementIcon(selectedImprovementData.type)}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-info-900 mb-2">
                {selectedImprovementData.title}
              </h4>
              <p className="text-info-800 mb-4">
                {selectedImprovementData.description}
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium ${getImpactColor(selectedImprovementData.impact)}`}>
                    {selectedImprovementData.impact.toUpperCase()} IMPACT
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium ${getDifficultyColor(selectedImprovementData.difficulty)}`}>
                    {selectedImprovementData.difficulty.toUpperCase()} TO IMPLEMENT
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-success-600" />
                  <span className="text-success-600 font-medium tabular-nums">+{selectedImprovementData.roiEstimate}% ROI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overall Impact Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-success-50 border-l-4 border-success-500">
          <div className="text-2xl font-bold text-success-600 tabular-nums">+{totalScoreImprovement}</div>
          <div className="text-sm text-secondary">Score Improvement</div>
        </div>
        <div className="text-center p-4 bg-info-50 border-l-4 border-info-500">
          <div className="text-2xl font-bold text-info-600 tabular-nums">+{totalROI}%</div>
          <div className="text-sm text-secondary">Expected ROI</div>
        </div>
        <div className="text-center p-4 bg-navy-50 border-l-4 border-navy-500">
          <div className="text-2xl font-bold text-navy-700 flex items-center justify-center">
            <Award className="w-6 h-6 mr-1" />
            A+
          </div>
          <div className="text-sm text-secondary">Final Grade</div>
        </div>
        <div className="text-center p-4 bg-warning-50 border-l-4 border-warning-500">
          <div className="text-2xl font-bold text-warning-600">2-3 hrs</div>
          <div className="text-sm text-secondary">Implementation</div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBeforeAfter;

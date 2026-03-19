import React, { useState } from 'react';
import { ArrowRight, Palette, Type, Layout, Zap } from 'lucide-react';

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

  // Quieter - use navy tints instead of semantic colors
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-navy-700 bg-navy-100';
      case 'medium':
        return 'text-navy-600 bg-surface-100';
      case 'low':
        return 'text-navy-500 bg-surface-50';
      default:
        return 'text-navy-600 bg-surface-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-navy-600 bg-surface-100';
      case 'medium':
        return 'text-navy-600 bg-surface-100';
      case 'hard':
        return 'text-navy-700 bg-navy-100';
      default:
        return 'text-navy-600 bg-surface-100';
    }
  };

  const totalROI = improvements.reduce((sum, imp) => sum + imp.roiEstimate, 0);
  const totalScoreImprovement = improvements.reduce((sum, imp) => sum + (imp.afterMetrics.score - imp.beforeMetrics.score), 0);

  return (
    <div className="bg-white p-6">
      <h3 className="text-sm font-semibold text-navy-950 mb-4">
        Before/After Analysis
      </h3>

      {/* Improvement Selector - Smaller, quieter */}
      <div className="flex flex-wrap gap-1 mb-6">
        <button
          onClick={() => setSelectedImprovement('all')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors ${
            selectedImprovement === 'all'
              ? 'bg-navy-950 text-white'
              : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
          }`}
        >
          All
        </button>
        {improvements.map((improvement) => (
          <button
            key={improvement.id}
            onClick={() => setSelectedImprovement(improvement.id)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedImprovement === improvement.id
                ? 'bg-navy-950 text-white'
                : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
            }`}
          >
            {getImprovementIcon(improvement.type)}
            <span>{improvement.type}</span>
          </button>
        ))}
      </div>

      {/* Before/After Comparison - Quieter */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Before */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-navy-950">Current</h4>
            <span className="text-xs text-secondary tabular-nums">{currentScore}</span>
          </div>

          <div className="relative">
            <img
              src={originalImage}
              alt="Original billboard"
              className="w-full h-48 object-cover border border-surface-200"
            />
          </div>

          {selectedImprovementData && (
            <div className="mt-3 text-xs text-secondary">
              <span>{selectedImprovementData.beforeMetrics.readability}</span>
              <span className="mx-1.5">·</span>
              <span>{selectedImprovementData.beforeMetrics.compliance}</span>
            </div>
          )}
        </div>

        {/* After */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-navy-950">Optimized</h4>
            <span className="text-xs text-navy-700 font-medium tabular-nums">
              {selectedImprovementData ? selectedImprovementData.afterMetrics.score : Math.min(currentScore + totalScoreImprovement, 95)}
            </span>
          </div>

          <div className="relative">
            <img
              src={originalImage}
              alt="Optimized billboard"
              className="w-full h-48 object-cover border border-surface-200"
            />

            <button
              onClick={() => setShowSlider(!showSlider)}
              className="absolute bottom-2 left-2 bg-navy-950/80 text-white px-2 py-1 text-xs hover:bg-navy-950 transition-colors"
            >
              {showSlider ? 'Hide' : 'Compare'}
            </button>
          </div>

          {selectedImprovementData && (
            <div className="mt-3 text-xs text-secondary">
              <span>{selectedImprovementData.afterMetrics.readability}</span>
              <span className="mx-1.5">·</span>
              <span>{selectedImprovementData.afterMetrics.compliance}</span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Slider */}
      {showSlider && (
        <div className="mb-6 bg-surface-50 p-3">
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(parseInt(e.target.value))}
            className="w-full h-1 bg-surface-200 appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-secondary mt-2">
            <span>Before</span>
            <span className="tabular-nums">{sliderPosition}%</span>
            <span>After</span>
          </div>
        </div>
      )}

      {/* Improvement Details - Quieter */}
      {selectedImprovementData && (
        <div className="bg-surface-50 p-4 mb-6">
          <h4 className="font-medium text-navy-950 mb-1">
            {selectedImprovementData.title}
          </h4>
          <p className="text-sm text-secondary mb-3">
            {selectedImprovementData.description}
          </p>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className={`px-2 py-1 ${getImpactColor(selectedImprovementData.impact)}`}>
              {selectedImprovementData.impact} impact
            </span>
            <span className={`px-2 py-1 ${getDifficultyColor(selectedImprovementData.difficulty)}`}>
              {selectedImprovementData.difficulty} to implement
            </span>
            <span className="px-2 py-1 bg-surface-100 text-navy-600 tabular-nums">
              +{selectedImprovementData.roiEstimate}% ROI
            </span>
          </div>
        </div>
      )}

      {/* Overall Impact Summary - Quieter */}
      <div className="grid grid-cols-4 gap-3 text-center">
        <div className="p-3 bg-surface-50">
          <div className="text-lg font-semibold text-navy-950 tabular-nums">+{totalScoreImprovement}</div>
          <div className="text-xs text-secondary">Score</div>
        </div>
        <div className="p-3 bg-surface-50">
          <div className="text-lg font-semibold text-navy-950 tabular-nums">+{totalROI}%</div>
          <div className="text-xs text-secondary">ROI</div>
        </div>
        <div className="p-3 bg-surface-50">
          <div className="text-lg font-semibold text-navy-950">A+</div>
          <div className="text-xs text-secondary">Grade</div>
        </div>
        <div className="p-3 bg-surface-50">
          <div className="text-lg font-semibold text-navy-950">2-3h</div>
          <div className="text-xs text-secondary">Time</div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalBeforeAfter;

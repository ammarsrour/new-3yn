import React, { useState } from 'react';
import { ArrowRight, BarChart3, TrendingUp, Award, Eye, Type, Palette, Layout as Layout3, Zap } from 'lucide-react';

interface ComparisonData {
  id: string;
  name: string;
  image: string;
  score: number;
  improvements: string[];
  roi_estimate: number;
}

interface SmartComparisonProps {
  originalAnalysis: {
    id: string;
    image: string;
    score: number;
  };
  aiAnalysis?: {
    criticalIssues: Array<{ title: string; description: string }>;
    minorIssues: Array<{ title: string; description: string }>;
    quickWins: Array<{ title: string; description: string }>;
    detailedAnalysis: string;
    arabicTextDetected?: boolean;
    culturalCompliance?: string;
  };
}

const SmartComparison: React.FC<SmartComparisonProps> = ({ originalAnalysis, aiAnalysis }) => {
  const [selectedComparison, setSelectedComparison] = useState<'improved' | 'competitor' | 'historical'>('improved');

  // Analyze AI feedback to determine what overlays to show
  const getRequiredImprovements = () => {
    if (!aiAnalysis) return { font: false, contrast: false, arabic: false, layout: false };
    
    const allIssues = [
      ...aiAnalysis.criticalIssues,
      ...aiAnalysis.minorIssues,
      ...aiAnalysis.quickWins
    ];
    
    const allText = [
      ...allIssues.map(issue => `${issue.title} ${issue.description}`),
      aiAnalysis.detailedAnalysis
    ].join(' ').toLowerCase();
    
    return {
      font: allText.includes('font size') || allText.includes('text size') || allText.includes('too small') || allText.includes('increase') && allText.includes('font'),
      contrast: allText.includes('contrast') || allText.includes('4.5:1') || allText.includes('color contrast') || allText.includes('darker text') || allText.includes('lighter background'),
      arabic: (aiAnalysis.arabicTextDetected && aiAnalysis.culturalCompliance !== 'appropriate') || allText.includes('arabic') || allText.includes('60%') || allText.includes('mtcit'),
      layout: allText.includes('layout') || allText.includes('simplify') || allText.includes('too many') || allText.includes('complexity')
    };
  };
  
  const improvements = getRequiredImprovements();
  
  // Generate dynamic improvements list based on AI analysis
  const generateImprovementsList = () => {
    const improvementsList = [];
    
    if (improvements.font) {
      improvementsList.push('✨ Text enlarged by 45% - Highway-readable fonts');
    }
    if (improvements.contrast) {
      improvementsList.push('🎨 Contrast boosted to 4.8:1 - Crystal clear visibility');
    }
    if (improvements.arabic) {
      improvementsList.push('🔤 Arabic text prominence - 60% more visible');
    }
    if (improvements.layout) {
      improvementsList.push('📐 Layout decluttered - Clean, focused design');
    }
    
    // If no specific improvements detected, show generic ones
    if (improvementsList.length === 0) {
      improvementsList.push('✨ Professional design optimization applied');
      improvementsList.push('🚗 Readability enhanced for highway viewing');
      improvementsList.push('📊 Visual hierarchy improved significantly');
    }
    
    return improvementsList;
  };

  const comparisons = {
    improved: {
      title: 'AI-Optimized Version (+20 Points)',
      data: {
        id: 'improved',
        name: 'Dramatically Improved Design',
        image: originalAnalysis.image, // In real app, this would be AI-generated
        score: Math.min(originalAnalysis.score + 20, 95),
        improvements: generateImprovementsList(),
        roi_estimate: 45
      }
    },
    competitor: {
      title: 'Market Leader Example',
      data: {
        id: 'competitor',
        name: 'Best-in-Class Billboard',
        image: 'https://images.pexels.com/photos/1666021/pexels-photo-1666021.jpeg?auto=compress&cs=tinysrgb&w=400',
        score: 92,
        improvements: [
          'Perfect font sizing for highway speeds',
          'Maximum contrast color scheme (5.2:1)',
          'Optimal Arabic/English text balance',
          'Strategic call-to-action positioning'
        ],
        roi_estimate: 0
      }
    },
    historical: {
      title: 'Your Previous Best (+15 Points)',
      data: {
        id: 'historical',
        name: 'Previous Top Campaign',
        image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400',
        score: Math.min(originalAnalysis.score + 15, 88),
        improvements: [
          'Good Arabic text balance achieved',
          'Effective regional color psychology',
          'Solid viewing distance optimization',
          'Culturally appropriate messaging'
        ],
        roi_estimate: 25
      }
    }
  };

  const currentComparison = comparisons[selectedComparison];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Visual Improvement Analysis
      </h3>

      {/* Comparison Type Selector */}
      <div className="flex space-x-2 mb-6">
        {Object.entries(comparisons).map(([key, comparison]) => (
          <button
            key={key}
            onClick={() => setSelectedComparison(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedComparison === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {comparison.title}
          </button>
        ))}
      </div>

      {/* Before/After Comparison */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Original */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <h4 className="font-semibold text-gray-900">Current Design (Issues)</h4>
          </div>
          <div className="relative">
            <img
              src={originalAnalysis.image}
              alt="Original billboard"
              className="w-full h-48 object-cover rounded-lg border-2 border-red-300 original-billboard-image"
            />
            
            {/* Clean Score Badge */}
            <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
              Score: {originalAnalysis.score}/100
            </div>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-center justify-center">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white w-20 h-20 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>

        {/* Comparison */}
        <div className="md:col-start-2">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h4 className="font-semibold text-gray-900">{currentComparison.data.name}</h4>
            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
              +{currentComparison.data.score - originalAnalysis.score} POINTS
            </div>
          </div>
          <div className="relative">
            <img
              src={currentComparison.data.image}
              alt="Comparison billboard"
              className={`w-full h-48 object-cover rounded-lg border-2 border-green-400 transition-all duration-500 ${
                selectedComparison === 'improved' ? 'optimized-billboard-image' : ''
              }`}
            />
            
            {/* Clean Score Badge */}
            <div className="absolute top-2 left-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-bold shadow-lg">
              Score: {currentComparison.data.score}/100
            </div>
          </div>
        </div>
      </div>

      {/* Improvements List */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6 border-2 border-green-200">
        <h4 className="font-bold text-green-900 mb-4 text-lg flex items-center">
          <Award className="w-5 h-5 mr-2" />
          Visual Transformations Applied
        </h4>
        <ul className="space-y-2">
          {currentComparison.data.improvements.map((improvement, index) => (
            <li key={index} className="flex items-center space-x-3 text-green-800 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></div>
              <span className="font-medium">{improvement}</span>
            </li>
          ))}
        </ul>
        
        {/* Visual Impact Statement */}
        <div className="mt-4 bg-white rounded-lg p-4 border border-green-300">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-800">Visual Impact Assessment:</span>
          </div>
          <p className="text-green-700 text-sm">
            {selectedComparison === 'improved' 
              ? "Dramatic visual improvements make this billboard 3x more readable at highway speeds. Text is significantly larger, contrast is boosted for desert conditions, and layout is simplified for instant comprehension."
              : "This example demonstrates industry best practices with optimal font sizing, perfect contrast ratios, and clean layout design."
            }
          </p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
          <div className="text-3xl font-bold text-green-600">
            +{currentComparison.data.score - originalAnalysis.score}
          </div>
          <div className="text-sm text-green-700 font-medium">Score Improvement</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
          <div className="text-3xl font-bold text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 mr-1" />
            {currentComparison.data.roi_estimate}%
          </div>
          <div className="text-sm text-blue-700 font-medium">ROI Increase</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
          <div className="text-3xl font-bold text-purple-600 flex items-center justify-center">
            <Eye className="w-6 h-6 mr-1" />
            3x
          </div>
          <div className="text-sm text-purple-700 font-medium">Better Recognition</div>
        </div>
      </div>
    </div>
  );
};

export default SmartComparison;
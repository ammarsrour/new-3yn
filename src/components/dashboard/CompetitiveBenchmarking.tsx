import React from 'react';
import { TrendingUp, Award, Target, BarChart3 } from 'lucide-react';

interface BenchmarkData {
  userScore: number;
  industryAverage: number;
  topPerformer: number;
  percentile: number;
  category: string;
}

interface CompetitiveBenchmarkingProps {
  score: number;
  category?: string;
}

const CompetitiveBenchmarking: React.FC<CompetitiveBenchmarkingProps> = ({ 
  score, 
  category = 'Highway Billboards' 
}) => {
  const benchmarkData: BenchmarkData = {
    userScore: score,
    industryAverage: 58,
    topPerformer: 92,
    percentile: Math.min(95, Math.max(5, Math.round((score - 30) * 1.5))),
    category
  };

  const getPerformanceLevel = (score: number) => {
    if (score >= 85) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 55) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { level: 'Below Average', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const performance = getPerformanceLevel(score);

  const benchmarks = [
    {
      label: 'Your Billboard',
      score: benchmarkData.userScore,
      color: 'bg-blue-500',
      icon: Target
    },
    {
      label: 'Industry Average',
      score: benchmarkData.industryAverage,
      color: 'bg-gray-400',
      icon: BarChart3
    },
    {
      label: 'Top Performer',
      score: benchmarkData.topPerformer,
      color: 'bg-green-500',
      icon: Award
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <TrendingUp className="w-5 h-5 mr-2" />
        Competitive Benchmarking
      </h3>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Your Performance
            </h4>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${performance.bgColor} ${performance.color}`}>
                {performance.level}
              </span>
              <span className="text-gray-600">
                {benchmarkData.percentile}th percentile
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-blue-600">
              {benchmarkData.userScore}/100
            </div>
            <div className="text-sm text-gray-500">
              vs {benchmarkData.industryAverage} avg
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="space-y-4 mb-6">
        {benchmarks.map((benchmark, index) => {
          const IconComponent = benchmark.icon;
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full ${benchmark.color} flex items-center justify-center`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-900">
                    {benchmark.label}
                  </span>
                  <span className="font-bold text-gray-900">
                    {benchmark.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${benchmark.color} transition-all duration-1000 ease-out`}
                    style={{ width: `${benchmark.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Industry Insights */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">
          {benchmarkData.category} Industry Insights
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Common Issues:</div>
            <ul className="text-gray-800 mt-1 space-y-1">
              <li>• Font size too small (68%)</li>
              <li>• Poor contrast (45%)</li>
              <li>• Too much text (52%)</li>
            </ul>
          </div>
          <div>
            <div className="text-gray-600">Top Performers Use:</div>
            <ul className="text-gray-800 mt-1 space-y-1">
              <li>• High contrast colors</li>
              <li>• 6 words or less</li>
              <li>• Clear call-to-action</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Improvement Potential */}
      {score < benchmarkData.topPerformer && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-800">Improvement Potential</span>
          </div>
          <p className="text-green-700 text-sm">
            By implementing our recommendations, you could potentially increase your score by{' '}
            <span className="font-bold">
              {Math.min(25, benchmarkData.topPerformer - score)} points
            </span>
            , moving you into the top {Math.max(5, 100 - benchmarkData.percentile - 15)}% of performers.
          </p>
        </div>
      )}
    </div>
  );
};

export default CompetitiveBenchmarking;
import React from 'react';
import { TrendingUp, Target, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';

interface ExecutiveSummaryProps {
  analysis: {
    score: number;
    location: string;
    criticalIssues: number;
    quickWins: number;
    roiEstimate: number;
  };
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ analysis }) => {
  const getScoreStatus = (score: number) => {
    if (score >= 85) return { status: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100' };
    if (score >= 70) return { status: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100' };
    if (score >= 55) return { status: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-100' };
  };

  const scoreStatus = getScoreStatus(analysis.score);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Executive Summary</h2>
        <p className="text-gray-600">Strategic Billboard Performance Analysis</p>
      </div>

      {/* Key Performance Indicator */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overall Performance</h3>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${scoreStatus.bgColor} ${scoreStatus.color}`}>
                {scoreStatus.status}
              </span>
              <span className="text-gray-600">Location: {analysis.location}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600">{analysis.score}/100</div>
            <div className="text-sm text-gray-500">Readability Score</div>
          </div>
        </div>
      </div>

      {/* Strategic Metrics */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{analysis.criticalIssues}</div>
          <div className="text-sm text-gray-600">Critical Issues</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">{analysis.quickWins}</div>
          <div className="text-sm text-gray-600">Quick Wins</div>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-600">73%</div>
          <div className="text-sm text-gray-600">Industry Percentile</div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <DollarSign className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-600">+{analysis.roiEstimate}%</div>
          <div className="text-sm text-gray-600">ROI Potential</div>
        </div>
      </div>

      {/* Strategic Recommendations */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Strategic Recommendations
        </h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Immediate Action Required</h4>
              <p className="text-gray-600 text-sm">Increase Arabic text size by 45% to meet MTCIT compliance and improve highway readability.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Optimize for Local Market</h4>
              <p className="text-gray-600 text-sm">Enhance color contrast to 4.5:1 ratio for optimal visibility in Oman's bright lighting conditions.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Competitive Advantage</h4>
              <p className="text-gray-600 text-sm">Implement recommended changes to achieve top 15% performance in regional market.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Impact */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expected Business Impact</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">+35%</div>
            <div className="text-sm text-gray-600">Campaign Effectiveness</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">2.5x</div>
            <div className="text-sm text-gray-600">Message Recognition</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">24hrs</div>
            <div className="text-sm text-gray-600">Implementation Time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummary;
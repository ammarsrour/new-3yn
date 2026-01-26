import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalysisResult } from '../../types';
import { Download, RefreshCw, AlertTriangle, AlertCircle, Lightbulb, Gauge, Eye, Sparkles, Sun, Cloud, CloudRain } from 'lucide-react';
import ScoreCircle from './ScoreCircle';
import { generatePDFReport } from '../../services/pdfGenerator';
import { activityLogger } from '../../services/activityLogger';

interface AnalysisResultsProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
  userId?: string;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis, onNewAnalysis, userId }) => {
  const { t } = useTranslation();
  const [simulatorDistance, setSimulatorDistance] = useState<50 | 100 | 150>(100);
  const [simulatorWeather, setSimulatorWeather] = useState<'clear' | 'cloudy' | 'rainy'>('clear');
  const [simulatorSpeed, setSimulatorSpeed] = useState<60 | 80 | 100>(80);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-orange-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Poor';
  };

  const handleDownloadPDF = async () => {
    const fileName = `billboard-analysis-${analysis.location}-${Date.now()}.pdf`;

    const result = await generatePDFReport({
      score: analysis.score,
      location: analysis.location,
      distance: analysis.distance,
      timestamp: analysis.timestamp,
      criticalIssues: analysis.criticalIssues.map(issue => `${issue.title}: ${issue.description}`),
      minorIssues: analysis.minorIssues.map(issue => `${issue.title}: ${issue.description}`),
      quickWins: analysis.quickWins.map(win => `${win.title}: ${win.description}`),
      detailedAnalysis: analysis.aiAnalysis,
      fontScore: analysis.fontScore,
      contrastScore: analysis.contrastScore,
      layoutScore: analysis.layoutScore,
      ctaScore: analysis.ctaScore,
      distanceAnalysis: analysis.distanceAnalysis,
      arabicTextDetected: analysis.arabicTextDetected,
      culturalCompliance: analysis.culturalCompliance,
      menaConsiderations: analysis.menaConsiderations
    }, userId);

    if (userId) {
      const storageResult = result.storageResult;
      activityLogger.logDownload(
        userId,
        storageResult?.fileName || fileName,
        'text/html',
        storageResult?.fileSize || 0,
        storageResult?.fileUrl,
        storageResult?.storagePath
      );
    }
  };

  const getWeatherOpacity = () => {
    switch (simulatorWeather) {
      case 'clear': return 1.0;
      case 'cloudy': return 0.85;
      case 'rainy': return 0.7;
      default: return 1.0;
    }
  };

  const getBlurAmount = () => {
    const baseBlur = simulatorDistance === 50 ? 0 : simulatorDistance === 100 ? 1 : 2;
    const speedBlur = simulatorSpeed === 60 ? 0 : simulatorSpeed === 80 ? 0.5 : 1;
    const weatherBlur = simulatorWeather === 'clear' ? 0 : simulatorWeather === 'cloudy' ? 0.5 : 1;
    return baseBlur + speedBlur + weatherBlur;
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Analysis Complete</h2>
            <p className="text-gray-600 text-sm">
              {analysis.location} • {analysis.distance}m • {analysis.timestamp.toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onNewAnalysis}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar - Score Display */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Score</h3>
            <ScoreCircle score={analysis.score} />
            <div className="mt-4">
              <div className={`text-3xl font-bold ${getScoreColor(analysis.score)} ltr-numbers`}>
                {analysis.score.toFixed(2)}/100
              </div>
              <div className={`text-lg font-medium ${getScoreColor(analysis.score)} mt-1`}>
                {getScoreLabel(analysis.score)}
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Font Clarity</span>
                <span className="font-semibold ltr-numbers">{analysis.fontScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Contrast</span>
                <span className="font-semibold ltr-numbers">{analysis.contrastScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Layout</span>
                <span className="font-semibold ltr-numbers">{analysis.layoutScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Call-to-Action</span>
                <span className="font-semibold ltr-numbers">{analysis.ctaScore.toFixed(2)}/25</span>
              </div>
            </div>

            {/* Distance Analysis */}
            {analysis.distanceAnalysis && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Distance Readability</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">50m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['50m'].toFixed(2)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">100m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['100m'].toFixed(2)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">150m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['150m'].toFixed(2)}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Enhancement</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get AI-powered improvement suggestions for your design
            </p>
            <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium">
              Generate Enhanced Version
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Viewing Conditions Simulator */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Real-World Simulator</h3>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Distance</label>
                <div className="flex gap-2">
                  {[50, 100, 150].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSimulatorDistance(dist as 50 | 100 | 150)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        simulatorDistance === dist
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {dist}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Speed</label>
                <div className="flex gap-2">
                  {[60, 80, 100].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimulatorSpeed(speed as 60 | 80 | 100)}
                      className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        simulatorSpeed === speed
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Weather</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSimulatorWeather('clear')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                      simulatorWeather === 'clear'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorWeather('cloudy')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                      simulatorWeather === 'cloudy'
                        ? 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Cloud className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorWeather('rainy')}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                      simulatorWeather === 'rainy'
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <CloudRain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Billboard Preview */}
            <div className="relative bg-gradient-to-b from-blue-100 to-blue-50 rounded-xl p-8 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-200 opacity-20"></div>

              <div className="relative">
                {/* Road markers */}
                <div className="flex justify-center items-end space-x-4 mb-8">
                  <div className="text-center">
                    <div className="w-1 h-12 bg-white mx-auto mb-2"></div>
                    <span className="text-xs text-gray-600 font-medium">{simulatorDistance}m</span>
                  </div>
                </div>

                {/* Billboard Frame */}
                <div className="bg-gray-800 rounded-lg p-2 shadow-2xl mx-auto max-w-2xl">
                  <div
                    className="relative bg-white rounded overflow-hidden"
                    style={{
                      opacity: getWeatherOpacity(),
                      filter: `blur(${getBlurAmount()}px)`,
                      transition: 'all 0.3s ease-in-out'
                    }}
                  >
                    <img
                      src={analysis.image}
                      alt="Billboard preview"
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Condition Info */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Viewing at <strong>{simulatorSpeed} km/h</strong> • <strong>{simulatorDistance}m</strong> distance • <strong className="capitalize">{simulatorWeather}</strong> conditions
                  </p>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      analysis.distanceAnalysis?.[`${simulatorDistance}m`] >= 70
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      Readability: {(analysis.distanceAnalysis?.[`${simulatorDistance}m`] || 0).toFixed(2)}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Issues */}
          {analysis.criticalIssues.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Critical Issues ({analysis.criticalIssues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.criticalIssues.map((issue) => (
                  <div key={issue.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 text-sm mb-1">{issue.title}</h4>
                    <p className="text-red-700 text-sm">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins */}
          {analysis.quickWins.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Wins ({analysis.quickWins.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.quickWins.map((win) => (
                  <div key={win.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 text-sm mb-1">{win.title}</h4>
                    <p className="text-blue-700 text-sm">{win.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minor Issues */}
          {analysis.minorIssues.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Additional Improvements ({analysis.minorIssues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.minorIssues.map((issue) => (
                  <div key={issue.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 text-sm mb-1">{issue.title}</h4>
                    <p className="text-orange-700 text-sm">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {analysis.aiAnalysis && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Gauge className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Detailed Analysis</h3>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {analysis.aiAnalysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;

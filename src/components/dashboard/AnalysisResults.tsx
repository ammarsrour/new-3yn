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
    if (score >= 90) return 'text-success-600';
    if (score >= 70) return 'text-warning-600';
    if (score >= 50) return 'text-warning-500';
    return 'text-danger-600';
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
      <div className="bg-white border-l-4 border-success-500 p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-navy-950 tracking-tight mb-1">Analysis Complete</h2>
            <p className="text-secondary text-sm">
              {analysis.location} • {analysis.distance}m • {analysis.timestamp.toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onNewAnalysis}
              className="flex items-center space-x-2 bg-surface-100 text-navy-700 px-4 py-2 hover:bg-surface-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Analysis</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-navy-950 text-white px-4 py-2 hover:bg-navy-800 transition-colors"
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
          <div className="bg-white border-l-4 border-navy-950 p-6">
            <h3 className="text-lg font-semibold text-navy-950 mb-4">Overall Score</h3>
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
            <div className="mt-6 pt-6 border-t border-surface-200 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Font Clarity</span>
                <span className="font-semibold ltr-numbers">{analysis.fontScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Contrast</span>
                <span className="font-semibold ltr-numbers">{analysis.contrastScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Layout</span>
                <span className="font-semibold ltr-numbers">{analysis.layoutScore.toFixed(2)}/25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-secondary">Call-to-Action</span>
                <span className="font-semibold ltr-numbers">{analysis.ctaScore.toFixed(2)}/25</span>
              </div>
            </div>

            {/* Distance Analysis */}
            {analysis.distanceAnalysis && (
              <div className="mt-6 pt-6 border-t border-surface-200">
                <h4 className="font-semibold text-navy-950 mb-3 text-sm">Distance Readability</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary">50m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['50m'].toFixed(2)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary">100m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['100m'].toFixed(2)}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-secondary">150m</span>
                    <span className="font-semibold text-sm ltr-numbers">{analysis.distanceAnalysis['150m'].toFixed(2)}/100</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-info-50 border-l-4 border-info-500 p-6">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-info-600" />
              <h3 className="text-lg font-semibold text-navy-950">AI Enhancement</h3>
            </div>
            <p className="text-sm text-secondary mb-4">
              Get AI-powered improvement suggestions for your design
            </p>
            <button className="w-full bg-navy-950 text-white px-4 py-2 hover:bg-navy-800 transition-colors text-sm font-medium">
              Generate Enhanced Version
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Viewing Conditions Simulator */}
          <div className="bg-white border-l-4 border-info-500 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Eye className="w-5 h-5 text-info-600" />
              <h3 className="text-lg font-semibold text-navy-950">Real-World Simulator</h3>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-medium text-navy-700 mb-2">Distance</label>
                <div className="flex gap-2">
                  {[50, 100, 150].map((dist) => (
                    <button
                      key={dist}
                      onClick={() => setSimulatorDistance(dist as 50 | 100 | 150)}
                      className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                        simulatorDistance === dist
                          ? 'bg-info-500 text-white'
                          : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                      }`}
                    >
                      {dist}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-700 mb-2">Speed</label>
                <div className="flex gap-2">
                  {[60, 80, 100].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSimulatorSpeed(speed as 60 | 80 | 100)}
                      className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                        simulatorSpeed === speed
                          ? 'bg-success-500 text-white'
                          : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-navy-700 mb-2">Weather</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSimulatorWeather('clear')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                      simulatorWeather === 'clear'
                        ? 'bg-warning-500 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorWeather('cloudy')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                      simulatorWeather === 'cloudy'
                        ? 'bg-navy-500 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    <Cloud className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSimulatorWeather('rainy')}
                    className={`flex-1 px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                      simulatorWeather === 'rainy'
                        ? 'bg-info-700 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    <CloudRain className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Billboard Preview */}
            <div className="relative bg-surface-100 p-8 overflow-hidden">
              <div className="relative">
                {/* Road markers */}
                <div className="flex justify-center items-end space-x-4 mb-8">
                  <div className="text-center">
                    <div className="w-1 h-12 bg-surface-300 mx-auto mb-2"></div>
                    <span className="text-xs text-secondary font-medium">{simulatorDistance}m</span>
                  </div>
                </div>

                {/* Billboard Frame */}
                <div className="bg-navy-800 p-2 mx-auto max-w-2xl">
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
                  <p className="text-sm text-secondary">
                    Viewing at <strong>{simulatorSpeed} km/h</strong> • <strong>{simulatorDistance}m</strong> distance • <strong className="capitalize">{simulatorWeather}</strong> conditions
                  </p>
                  <div className="mt-2">
                    <span className={`inline-block px-3 py-1 text-xs font-medium ${
                      analysis.distanceAnalysis?.[`${simulatorDistance}m`] >= 70
                        ? 'bg-success-100 text-success-800'
                        : 'bg-warning-100 text-warning-800'
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
            <div className="bg-white border-l-4 border-danger-500 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-danger-500" />
                <h3 className="text-lg font-semibold text-navy-950">
                  Critical Issues ({analysis.criticalIssues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.criticalIssues.map((issue) => (
                  <div key={issue.id} className="bg-danger-50 border-l-4 border-danger-400 p-4">
                    <h4 className="font-semibold text-danger-900 text-sm mb-1">{issue.title}</h4>
                    <p className="text-danger-700 text-sm">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Wins */}
          {analysis.quickWins.length > 0 && (
            <div className="bg-white border-l-4 border-info-500 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Lightbulb className="w-5 h-5 text-info-500" />
                <h3 className="text-lg font-semibold text-navy-950">
                  Quick Wins ({analysis.quickWins.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.quickWins.map((win) => (
                  <div key={win.id} className="bg-info-50 border-l-4 border-info-400 p-4">
                    <h4 className="font-semibold text-info-900 text-sm mb-1">{win.title}</h4>
                    <p className="text-info-700 text-sm">{win.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Minor Issues */}
          {analysis.minorIssues.length > 0 && (
            <div className="bg-white border-l-4 border-warning-500 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertCircle className="w-5 h-5 text-warning-500" />
                <h3 className="text-lg font-semibold text-navy-950">
                  Additional Improvements ({analysis.minorIssues.length})
                </h3>
              </div>
              <div className="space-y-3">
                {analysis.minorIssues.map((issue) => (
                  <div key={issue.id} className="bg-warning-50 border-l-4 border-warning-400 p-4">
                    <h4 className="font-semibold text-warning-900 text-sm mb-1">{issue.title}</h4>
                    <p className="text-warning-700 text-sm">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {analysis.aiAnalysis && (
            <div className="bg-white border-l-4 border-navy-950 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Gauge className="w-5 h-5 text-navy-600" />
                <h3 className="text-lg font-semibold text-navy-950">Detailed Analysis</h3>
              </div>
              <div className="prose prose-sm max-w-none text-navy-700 whitespace-pre-wrap">
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

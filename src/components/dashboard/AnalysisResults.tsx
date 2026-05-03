import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnalysisResult } from '../../types';
import { Download, RefreshCw, Eye, Sun, Cloud, CloudRain, Gauge } from 'lucide-react';
import ScoreCircle from './ScoreCircle';
import { generatePDFReport } from '../../services/pdfGenerator';
import { activityLogger } from '../../services/activityLogger';
import FeatureTooltip from './FeatureTooltip';

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

  // Score color - only use semantic color for poor scores
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-navy-950';
    if (score >= 50) return 'text-navy-700';
    return 'text-danger-600'; // Only red for truly poor
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  const handleDownloadPDF = async () => {
    const fileName = `billboard-analysis-${analysis.location}-${Date.now()}.pdf`;

    const result = await generatePDFReport({
      score: analysis.score,
      location: analysis.location,
      distance: analysis.distance,
      timestamp: analysis.timestamp,
      criticalIssues: analysis.criticalIssues,
      minorIssues: analysis.minorIssues,
      quickWins: analysis.quickWins,
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
    <div className="space-y-8">
      {/* Hero: Billboard + Score - Most important content first */}
      <div className="bg-white p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-navy-950 tracking-tight">Analysis Complete</h2>
            <p className="text-sm text-secondary mt-0.5">
              {analysis.location} · {analysis.distance}m · {analysis.timestamp.toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onNewAnalysis}
              className="flex items-center space-x-2 text-navy-600 px-3 py-2 hover:bg-surface-100 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-navy-950 text-white px-4 py-2 hover:bg-navy-800 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        {/* Billboard + Score Grid */}
        <div className="grid lg:grid-cols-[1fr,280px] gap-6">
          {/* Billboard Preview - HERO */}
          <div className="bg-navy-950 p-4">
            <img
              src={analysis.image}
              alt="Billboard"
              className="w-full h-auto max-h-[480px] object-contain mx-auto"
            />
          </div>

          {/* Score Panel */}
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center lg:text-left">
              <ScoreCircle score={analysis.score} />
              <div className="mt-3">
                <div className={`text-4xl font-bold tabular-nums ${getScoreColor(analysis.score)}`}>
                  {Math.round(analysis.score)}
                </div>
                <div className={`text-sm font-medium ${getScoreColor(analysis.score)}`}>
                  {getScoreLabel(analysis.score)}
                </div>
              </div>
            </div>

            {/* Score Breakdown - compact */}
            <div className="space-y-2 pt-4 border-t border-surface-200">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Font</span>
                <span className="font-medium tabular-nums">{Math.round(analysis.fontScore)}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Contrast</span>
                <span className="font-medium tabular-nums">{Math.round(analysis.contrastScore)}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Layout</span>
                <span className="font-medium tabular-nums">{Math.round(analysis.layoutScore)}/25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary">CTA</span>
                <span className="font-medium tabular-nums">{Math.round(analysis.ctaScore)}/25</span>
              </div>
            </div>

            {/* Distance Scores - inline */}
            {analysis.distanceAnalysis && (
              <div className="pt-4 border-t border-surface-200">
                <p className="text-xs text-secondary mb-2">Distance Readability</p>
                <div className="flex gap-2">
                  {(['50m', '100m', '150m'] as const).map((dist) => (
                    <div key={dist} className="flex-1 bg-surface-50 p-2 text-center">
                      <div className="text-xs text-secondary">{dist}</div>
                      <div className="font-semibold tabular-nums text-sm">
                        {Math.round(analysis.distanceAnalysis[dist])}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issues Section - Quieter, unified styling */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Critical Issues - Only these get accent color */}
        {analysis.criticalIssues.length > 0 && (
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-950">
                Critical Issues
              </h3>
              <span className="text-xs text-danger-600 tabular-nums">
                {analysis.criticalIssues.length}
              </span>
            </div>
            <div className="space-y-3">
              {analysis.criticalIssues.map((issue) => (
                <div key={issue.id} className="border-l-2 border-danger-400 pl-4 py-1">
                  <h4 className="font-medium text-navy-950 text-sm">{issue.title}</h4>
                  <p className="text-secondary text-sm mt-0.5">{issue.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Wins - Neutral styling */}
        {analysis.quickWins.length > 0 && (
          <div className="bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-navy-950">
                Quick Wins
              </h3>
              <span className="text-xs text-secondary tabular-nums">
                {analysis.quickWins.length}
              </span>
            </div>
            <div className="space-y-3">
              {analysis.quickWins.map((win) => (
                <div key={win.id} className="border-l-2 border-navy-200 pl-4 py-1">
                  <h4 className="font-medium text-navy-950 text-sm">{win.title}</h4>
                  <p className="text-secondary text-sm mt-0.5">{win.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Minor Issues - Subtle treatment */}
      {analysis.minorIssues.length > 0 && (
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-navy-950">
              Additional Improvements
            </h3>
            <span className="text-xs text-secondary tabular-nums">
              {analysis.minorIssues.length}
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {analysis.minorIssues.map((issue) => (
              <div key={issue.id} className="border-l-2 border-surface-200 pl-4 py-1">
                <h4 className="font-medium text-navy-950 text-sm">{issue.title}</h4>
                <p className="text-secondary text-sm mt-0.5">{issue.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simulator - Secondary feature, collapsible feel */}
      <details className="bg-white group">
        <FeatureTooltip
          id="real-world-simulator"
          title="Test at Different Distances"
          description="See how your billboard looks from 50m, 100m, and 150m with weather and speed conditions."
          position="bottom"
          delay={1500}
        >
          <summary className="p-6 cursor-pointer flex items-center justify-between hover:bg-surface-50 transition-colors">
            <div className="flex items-center space-x-2">
              <Eye className="w-5 h-5 text-navy-600" />
              <h3 className="font-semibold text-navy-950">Real-World Simulator</h3>
            </div>
            <span className="text-sm text-secondary group-open:hidden">Click to expand</span>
          </summary>
        </FeatureTooltip>

        <div className="px-6 pb-6 pt-0 border-t border-surface-100">
          {/* Simulator Controls - All same accent color */}
          <div className="grid grid-cols-3 gap-4 mb-6 pt-4">
            <div>
              <label className="block text-xs text-secondary mb-2">Distance</label>
              <div className="flex gap-1">
                {[50, 100, 150].map((dist) => (
                  <button
                    key={dist}
                    onClick={() => setSimulatorDistance(dist as 50 | 100 | 150)}
                    className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
                      simulatorDistance === dist
                        ? 'bg-navy-950 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    {dist}m
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-secondary mb-2">Speed</label>
              <div className="flex gap-1">
                {[60, 80, 100].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => setSimulatorSpeed(speed as 60 | 80 | 100)}
                    className={`flex-1 px-2 py-2 text-sm font-medium transition-colors ${
                      simulatorSpeed === speed
                        ? 'bg-navy-950 text-white'
                        : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                    }`}
                  >
                    {speed}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-secondary mb-2">Weather</label>
              <div className="flex gap-1">
                <button
                  onClick={() => setSimulatorWeather('clear')}
                  className={`flex-1 px-2 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                    simulatorWeather === 'clear'
                      ? 'bg-navy-950 text-white'
                      : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                  }`}
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSimulatorWeather('cloudy')}
                  className={`flex-1 px-2 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                    simulatorWeather === 'cloudy'
                      ? 'bg-navy-950 text-white'
                      : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                  }`}
                >
                  <Cloud className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSimulatorWeather('rainy')}
                  className={`flex-1 px-2 py-2 text-sm font-medium transition-colors flex items-center justify-center ${
                    simulatorWeather === 'rainy'
                      ? 'bg-navy-950 text-white'
                      : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                  }`}
                >
                  <CloudRain className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Billboard in Simulator */}
          <div className="bg-surface-50 p-6">
            <div className="bg-navy-900 p-2 mx-auto max-w-xl">
              <div
                className="relative overflow-hidden"
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
            <div className="mt-4 text-center text-sm text-secondary">
              {simulatorSpeed} km/h · {simulatorDistance}m · {simulatorWeather}
              <span className="ml-3 text-navy-700 font-medium tabular-nums">
                Readability: {Math.round(analysis.distanceAnalysis?.[`${simulatorDistance}m`] || 0)}
              </span>
            </div>
          </div>
        </div>
      </details>

      {/* PASS 1 EDIT 9 (Omar MED-01): aiAnalysis hidden from UI - looked unpolished compared to structured cards above. Still rendered in PDF (pdfGenerator.ts) via the detailedAnalysis mapping in handleDownloadPDF. To restore, remove this comment block and uncomment the JSX below. */}
      {/*
      {analysis.aiAnalysis && (
        <div className="bg-white p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gauge className="w-5 h-5 text-navy-600" />
            <h3 className="font-semibold text-navy-950">Detailed Analysis</h3>
          </div>
          <div className="prose prose-sm max-w-none text-navy-700 whitespace-pre-wrap">
            {analysis.aiAnalysis}
          </div>
        </div>
      )}
      */}

      {/* AI Enhancement CTA - Quieter, still prominent */}
      <div className="bg-surface-50 border border-surface-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-medium text-navy-950">Get AI-Enhanced Version</p>
          <p className="text-secondary text-sm">Automatically fix issues and improve readability</p>
        </div>
        <button className="bg-navy-950 text-white px-5 py-2.5 text-sm font-medium hover:bg-navy-800 transition-colors whitespace-nowrap">
          Generate Enhanced Version
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;

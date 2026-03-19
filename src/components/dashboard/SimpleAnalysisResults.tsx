import React from 'react';
import { AnalysisResult } from '../../types';
import { Download, RefreshCw } from 'lucide-react';
import { generatePDFReport } from '../../services/pdfGenerator';
import { activityLogger } from '../../services/activityLogger';

interface SimpleAnalysisResultsProps {
  analysis: AnalysisResult;
  onNewAnalysis: () => void;
  userId?: string;
}

/**
 * Distilled analysis results - focus on the verdict.
 * Removes: Real-World Simulator, AI Enhancement CTA, detailed breakdown sections.
 * Core value: Score + Critical Issues + Quick Wins
 */
const SimpleAnalysisResults: React.FC<SimpleAnalysisResultsProps> = ({
  analysis,
  onNewAnalysis,
  userId
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-navy-950';
    if (score >= 50) return 'text-navy-700';
    return 'text-danger-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 50) return 'Fair';
    return 'Needs Work';
  };

  const handleDownloadPDF = async () => {
    const result = await generatePDFReport(
      {
        score: analysis.score,
        location: analysis.location,
        distance: analysis.distance,
        timestamp: analysis.timestamp,
        criticalIssues: analysis.criticalIssues.map(
          (issue) => `${issue.title}: ${issue.description}`
        ),
        minorIssues: analysis.minorIssues.map(
          (issue) => `${issue.title}: ${issue.description}`
        ),
        quickWins: analysis.quickWins.map((win) => `${win.title}: ${win.description}`),
        detailedAnalysis: analysis.aiAnalysis,
        fontScore: analysis.fontScore,
        contrastScore: analysis.contrastScore,
        layoutScore: analysis.layoutScore,
        ctaScore: analysis.ctaScore,
        distanceAnalysis: analysis.distanceAnalysis
      },
      userId
    );

    if (userId && result.storageResult) {
      activityLogger.logDownload(
        userId,
        result.storageResult.fileName,
        'text/html',
        result.storageResult.fileSize,
        result.storageResult.fileUrl,
        result.storageResult.storagePath
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero: Billboard + Score */}
      <div className="bg-white p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-bold text-navy-950">Analysis Complete</h2>
            <p className="text-sm text-secondary mt-0.5">
              {analysis.location} · {analysis.timestamp.toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onNewAnalysis}
              className="flex items-center space-x-1.5 text-navy-600 px-3 py-1.5 hover:bg-surface-100 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-1.5 bg-navy-950 text-white px-3 py-1.5 hover:bg-navy-800 text-sm"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Billboard + Score */}
        <div className="grid lg:grid-cols-[1fr,200px] gap-6">
          {/* Billboard - hero */}
          <div className="bg-navy-950 p-3">
            <img
              src={analysis.image}
              alt="Billboard"
              className="w-full h-auto max-h-96 object-contain mx-auto"
            />
          </div>

          {/* Score - simple */}
          <div className="text-center lg:text-left">
            <div className={`text-5xl font-bold tabular-nums ${getScoreColor(analysis.score)}`}>
              {Math.round(analysis.score)}
            </div>
            <div className={`text-sm font-medium ${getScoreColor(analysis.score)} mb-4`}>
              {getScoreLabel(analysis.score)}
            </div>

            {/* Breakdown - inline */}
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary">Font</span>
                <span className="tabular-nums">{Math.round(analysis.fontScore)}/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Contrast</span>
                <span className="tabular-nums">{Math.round(analysis.contrastScore)}/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Layout</span>
                <span className="tabular-nums">{Math.round(analysis.layoutScore)}/25</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">CTA</span>
                <span className="tabular-nums">{Math.round(analysis.ctaScore)}/25</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Issues - combined, prioritized */}
      {(analysis.criticalIssues.length > 0 || analysis.quickWins.length > 0) && (
        <div className="bg-white p-6">
          <h3 className="text-sm font-semibold text-navy-950 mb-4">
            {analysis.criticalIssues.length > 0 ? 'What to Fix' : 'Quick Wins'}
          </h3>

          <div className="space-y-3">
            {/* Critical first */}
            {analysis.criticalIssues.map((issue) => (
              <div key={issue.id} className="border-l-2 border-danger-400 pl-4 py-1">
                <p className="font-medium text-navy-950 text-sm">{issue.title}</p>
                <p className="text-secondary text-sm">{issue.description}</p>
              </div>
            ))}

            {/* Then quick wins */}
            {analysis.quickWins.slice(0, 3).map((win) => (
              <div key={win.id} className="border-l-2 border-navy-200 pl-4 py-1">
                <p className="font-medium text-navy-950 text-sm">{win.title}</p>
                <p className="text-secondary text-sm">{win.description}</p>
              </div>
            ))}
          </div>

          {/* Show more link if there are additional items */}
          {analysis.minorIssues.length > 0 && (
            <p className="text-sm text-secondary mt-4">
              +{analysis.minorIssues.length} additional improvements available in PDF
            </p>
          )}
        </div>
      )}

      {/* AI Summary - if available, kept brief */}
      {analysis.aiAnalysis && (
        <div className="bg-surface-50 p-6 text-sm text-navy-700">
          <p className="line-clamp-4">{analysis.aiAnalysis}</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAnalysisResults;

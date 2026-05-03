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
    <div className="space-y-4 sm:space-y-6">
      {/* Hero: Billboard + Score */}
      <div className="bg-white p-4 sm:p-6">
        {/* Header - actions fixed to bottom on mobile for thumb reach */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-navy-950">Analysis Complete</h2>
            <p className="text-sm text-secondary mt-0.5">
              <span className="truncate max-w-[180px] sm:max-w-[200px] inline-block align-bottom" title={analysis.location}>{analysis.location}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={analysis.timestamp.toISOString()}>{analysis.timestamp.toLocaleDateString()}</time>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={onNewAnalysis}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 text-navy-600 px-3 py-2 hover:bg-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 rounded min-h-[44px] border border-surface-200 sm:border-0"
              aria-label="Start new analysis"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              <span>New</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 bg-navy-950 text-white px-3 py-2 hover:bg-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 min-h-[44px]"
              aria-label="Download analysis as PDF"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Billboard + Score - stacked on mobile, side-by-side on larger */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr,200px] gap-4 sm:gap-6">
          {/* Billboard - hero */}
          <div className="bg-navy-950 p-2 sm:p-3 order-2 md:order-1">
            <img
              src={analysis.image}
              alt={`Analyzed billboard at ${analysis.location}`}
              className="w-full h-auto max-h-64 sm:max-h-96 object-contain mx-auto"
              decoding="async"
            />
          </div>

          {/* Score - on mobile, show score prominently first */}
          <div className="order-1 md:order-2" aria-label="Analysis scores">
            {/* Mobile: horizontal score + breakdown */}
            <div className="flex items-center justify-between md:block">
              <div className="text-center md:text-left">
                <div className={`text-4xl sm:text-5xl font-bold tabular-nums ${getScoreColor(analysis.score)}`} aria-label={`Overall score: ${Math.round(analysis.score)} out of 100`}>
                  {Math.round(analysis.score)}
                </div>
                <div className={`text-sm font-medium ${getScoreColor(analysis.score)} mb-2 md:mb-4`}>
                  {getScoreLabel(analysis.score)}
                </div>
              </div>

              {/* Breakdown - horizontal on mobile, vertical on desktop */}
              <dl className="flex md:flex-col gap-3 md:gap-1.5 text-xs sm:text-sm md:space-y-1.5">
                <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left">
                  <dt className="text-secondary">Font</dt>
                  <dd className="tabular-nums font-medium md:font-normal">{Math.round(analysis.fontScore)}/25</dd>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left">
                  <dt className="text-secondary">Contrast</dt>
                  <dd className="tabular-nums font-medium md:font-normal">{Math.round(analysis.contrastScore)}/25</dd>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left">
                  <dt className="text-secondary">Layout</dt>
                  <dd className="tabular-nums font-medium md:font-normal">{Math.round(analysis.layoutScore)}/25</dd>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between text-center md:text-left">
                  <dt className="text-secondary">CTA</dt>
                  <dd className="tabular-nums font-medium md:font-normal">{Math.round(analysis.ctaScore)}/25</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Issues - combined, prioritized */}
      {(analysis.criticalIssues.length > 0 || analysis.quickWins.length > 0) && (
        <div className="bg-white p-4 sm:p-6">
          <h3 className="text-sm font-semibold text-navy-950 mb-3 sm:mb-4">
            {analysis.criticalIssues.length > 0 ? 'What to Fix' : 'Quick Wins'}
          </h3>

          <div className="space-y-3">
            {/* Critical first */}
            {analysis.criticalIssues.map((issue) => (
              <div key={issue.id} className="border-l-2 border-danger-400 pl-3 sm:pl-4 py-1">
                <p className="font-medium text-navy-950 text-sm">{issue.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{issue.description}</p>
              </div>
            ))}

            {/* Then quick wins */}
            {analysis.quickWins.slice(0, 3).map((win) => (
              <div key={win.id} className="border-l-2 border-navy-200 pl-3 sm:pl-4 py-1">
                <p className="font-medium text-navy-950 text-sm">{win.title}</p>
                <p className="text-secondary text-xs sm:text-sm">{win.description}</p>
              </div>
            ))}
          </div>

          {/* Show more link if there are additional items */}
          {analysis.minorIssues.length > 0 && (
            <p className="text-xs sm:text-sm text-secondary mt-3 sm:mt-4">
              +{analysis.minorIssues.length} more in PDF
            </p>
          )}
        </div>
      )}

      {/* PASS 1 EDIT 9 (Omar MED-01): aiAnalysis hidden from UI - looked unpolished compared to structured cards above. Still rendered in PDF (pdfGenerator.ts) via the detailedAnalysis mapping in handleDownloadPDF. To restore, remove this comment block and uncomment the JSX below. */}
      {/*
      {analysis.aiAnalysis && (
        <div className="bg-surface-50 p-4 sm:p-6 text-xs sm:text-sm text-navy-700">
          <p className="line-clamp-3 sm:line-clamp-4">{analysis.aiAnalysis}</p>
        </div>
      )}
      */}
    </div>
  );
};

export default SimpleAnalysisResults;

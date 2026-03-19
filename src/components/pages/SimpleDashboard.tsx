import React, { useState } from 'react';
import { User, AnalysisResult, AnalysisHistory } from '../../types';
import SimpleUploadSection from '../dashboard/SimpleUploadSection';
import SimpleAnalysisResults from '../dashboard/SimpleAnalysisResults';
import AnalysisProgress from '../dashboard/AnalysisProgress';
import { BillboardMetadata } from '../../types/billboard';
import { analyzeBillboardWithAI } from '../../services/openai';
import { LocationData } from '../../services/locationService';
import { UserProfile, supabaseAuthService } from '../../services/supabaseAuth';
import { activityLogger } from '../../services/activityLogger';

interface SimpleDashboardProps {
  user: User;
  userProfile?: UserProfile | null;
}

/**
 * Distilled Dashboard - focused on the core flow.
 *
 * Removed:
 * - UsageStats bar (move to account settings)
 * - Onboarding modals (the product should be self-explanatory)
 * - Enterprise views (separate route)
 * - Analysis History sidebar (move to separate page)
 * - Mock enterprise data
 *
 * Core flow: Upload → Progress → Results
 */
const SimpleDashboard: React.FC<SimpleDashboardProps> = ({ user, userProfile }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<
    'uploading' | 'analyzing' | 'generating' | 'completed'
  >('uploading');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = async (
    file: File,
    location: string,
    distance: number,
    locationData?: LocationData,
    billboardMetadata?: BillboardMetadata
  ) => {
    // Access check
    if (userProfile) {
      const accessCheck = supabaseAuthService.canAnalyze(userProfile);
      if (!accessCheck.allowed) {
        alert(accessCheck.reason || 'Access not permitted');
        return;
      }
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');

    try {
      setAnalysisProgress(25);
      await new Promise((resolve) => setTimeout(resolve, 800));

      setAnalysisStage('analyzing');
      setAnalysisProgress(50);

      const enhancedLocationData = billboardMetadata
        ? { ...locationData, billboardMetadata }
        : locationData;

      const aiAnalysis = await analyzeBillboardWithAI(
        file,
        location,
        distance,
        enhancedLocationData
      );

      setAnalysisStage('generating');
      setAnalysisProgress(75);
      await new Promise((resolve) => setTimeout(resolve, 500));

      setAnalysisStage('completed');
      setAnalysisProgress(100);

      const analysis: AnalysisResult = {
        id: Date.now().toString(),
        score: aiAnalysis.overallScore,
        fontScore: aiAnalysis.fontScore,
        contrastScore: aiAnalysis.contrastScore,
        layoutScore: aiAnalysis.layoutScore,
        ctaScore: aiAnalysis.ctaScore,
        image: URL.createObjectURL(file),
        location,
        distance,
        timestamp: new Date(),
        criticalIssues: aiAnalysis.criticalIssues.map((issue, index) => ({
          id: `critical-${index}`,
          title: issue.split(':')[0] || issue,
          description: issue.split(':')[1] || issue,
          severity: 'critical' as const
        })),
        minorIssues: aiAnalysis.minorIssues.map((issue, index) => ({
          id: `minor-${index}`,
          title: issue.split(':')[0] || issue,
          description: issue.split(':')[1] || issue,
          severity: 'minor' as const
        })),
        quickWins: aiAnalysis.quickWins.map((win, index) => ({
          id: `win-${index}`,
          title: win.split(':')[0] || win,
          description: win.split(':')[1] || win,
          severity: 'improvement' as const
        })),
        distanceAnalysis: aiAnalysis.distanceAnalysis,
        aiAnalysis: aiAnalysis.detailedAnalysis,
        status: 'completed'
      };

      setCurrentAnalysis(analysis);

      await activityLogger.logAnalysisComplete(user.id, {
        analysisId: analysis.id,
        score: analysis.score,
        location: analysis.location,
        criticalIssuesCount: analysis.criticalIssues.length,
        fontScore: analysis.fontScore,
        contrastScore: analysis.contrastScore,
        layoutScore: analysis.layoutScore,
        ctaScore: analysis.ctaScore
      });

      if (userProfile && userProfile.subscription_status === 'trial') {
        await supabaseAuthService.decrementTrialCredit(userProfile.id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await activityLogger.logAnalysisFailed(user.id, location, errorMessage);
      alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h1 className="text-lg font-bold text-navy-950">3YN</h1>
        </div>
      </div>

      {/* Content - centered, constrained width */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        {isAnalyzing ? (
          <AnalysisProgress stage={analysisStage} progress={analysisProgress} />
        ) : currentAnalysis ? (
          <SimpleAnalysisResults
            analysis={currentAnalysis}
            onNewAnalysis={handleNewAnalysis}
            userId={user.id}
          />
        ) : (
          <SimpleUploadSection
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
};

export default SimpleDashboard;

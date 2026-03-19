import React, { useState } from 'react';
import { User, AnalysisResult, AnalysisHistory } from '../../types';
import SimpleUploadSection from '../dashboard/SimpleUploadSection';
import SimpleAnalysisResults from '../dashboard/SimpleAnalysisResults';
import AnalysisProgress from '../dashboard/AnalysisProgress';
import AnalysisHistoryComponent from '../dashboard/AnalysisHistory';
import { BillboardMetadata } from '../../types/billboard';
import { analyzeBillboardWithAI } from '../../services/openai';
import { LocationData } from '../../services/locationService';
import { UserProfile, supabaseAuthService } from '../../services/supabaseAuth';
import { activityLogger } from '../../services/activityLogger';

interface DashboardProps {
  user: User;
  userProfile?: UserProfile | null;
}

/**
 * Dashboard - Distilled version
 *
 * Focused on the core flow: Upload → Analyze → Results
 *
 * Removed complexity:
 * - UsageStats bar (moved to account settings)
 * - Onboarding modals (product is self-explanatory)
 * - Enterprise views (separate routes)
 * - Mock enterprise data
 * - Advanced location features (available via IntelligentLocationSelector if needed)
 */
const Dashboard: React.FC<DashboardProps> = ({ user, userProfile }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'uploading' | 'analyzing' | 'generating' | 'completed'>('uploading');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);

  const handleAnalyze = async (file: File, location: string, distance: number, locationData?: LocationData, billboardMetadata?: BillboardMetadata) => {
    if (userProfile) {
      const accessCheck = supabaseAuthService.canAnalyze(userProfile);
      if (!accessCheck.allowed) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-danger-500 text-white px-6 py-3 z-50 max-w-md';

        const title = document.createElement('div');
        title.className = 'font-semibold mb-1';
        title.textContent = 'Access Denied';

        const message = document.createElement('div');
        message.className = 'text-sm';
        message.textContent = accessCheck.reason || 'Access not permitted';

        toast.appendChild(title);
        toast.appendChild(message);
        document.body.appendChild(toast);
        setTimeout(() => {
          if (document.body.contains(toast)) {
            document.body.removeChild(toast);
          }
        }, 6000);
        return;
      }
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');

    try {
      setAnalysisProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000));

      setAnalysisStage('analyzing');
      setAnalysisProgress(50);

      const enhancedLocationData = billboardMetadata ? {
        ...locationData,
        billboardMetadata
      } : locationData;

      const aiAnalysis = await analyzeBillboardWithAI(file, location, distance, enhancedLocationData);

      setAnalysisStage('generating');
      setAnalysisProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1000));

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

      const historyItem: AnalysisHistory = {
        id: analysis.id,
        thumbnail: analysis.image,
        score: analysis.score,
        location: analysis.location,
        timestamp: analysis.timestamp,
        status: 'completed'
      };
      setAnalysisHistory(prev => [historyItem, ...prev]);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await activityLogger.logAnalysisFailed(user.id, location, errorMessage);

      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-danger-500 text-white px-6 py-3 z-50 max-w-md relative';

      const title = document.createElement('div');
      title.className = 'font-semibold mb-1';
      title.textContent = 'Analysis Failed';

      const message = document.createElement('div');
      message.className = 'text-sm';
      message.textContent = error instanceof Error
        ? error.message
        : 'Please try again or contact support if the issue persists.';

      const closeBtn = document.createElement('button');
      closeBtn.className = 'absolute top-1 right-2 text-white hover:text-surface-200';
      closeBtn.textContent = '×';
      closeBtn.onclick = () => toast.remove();

      toast.appendChild(title);
      toast.appendChild(message);
      toast.appendChild(closeBtn);
      document.body.appendChild(toast);
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 8000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAnalysis = (id: string) => {
    // TODO: Implement analysis selection
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');
  };

  const hasHistory = analysisHistory.length > 0;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Minimal Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-navy-950">3YN</h1>

          {/* Trial indicator - subtle */}
          {userProfile && userProfile.subscription_status === 'trial' && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-secondary tabular-nums">
                {userProfile.trial_credits_remaining} credits
              </span>
              <button className="text-sm text-navy-600 hover:text-navy-800">
                Upgrade
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content - centered, constrained */}
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
          <div className="space-y-6">
            <SimpleUploadSection
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              userId={user.id}
            />

            {/* History - below, not sidebar */}
            {hasHistory && (
              <AnalysisHistoryComponent
                history={analysisHistory}
                onSelectAnalysis={handleSelectAnalysis}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

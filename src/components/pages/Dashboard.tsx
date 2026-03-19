import React, { useState } from 'react';
import { User, AnalysisResult, AnalysisHistory } from '../../types';
import SimpleUploadSection from '../dashboard/SimpleUploadSection';
import SimpleAnalysisResults from '../dashboard/SimpleAnalysisResults';
import AnalysisProgress from '../dashboard/AnalysisProgress';
import AnalysesHistoryPage from '../dashboard/AnalysesHistoryPage';
import SimulatePage from '../dashboard/SimulatePage';
import AccountPage from '../dashboard/AccountPage';
import { BillboardMetadata } from '../../types/billboard';
import { analyzeBillboardWithAI } from '../../services/openai';
import { LocationData } from '../../services/locationService';
import { UserProfile, supabaseAuthService } from '../../services/supabaseAuth';
import { activityLogger } from '../../services/activityLogger';
import { BarChart3, History, Eye, UserCircle } from 'lucide-react';

interface DashboardProps {
  user: User;
  userProfile?: UserProfile | null;
}

type DashboardView = 'analyze' | 'history' | 'simulate' | 'account';

const Dashboard: React.FC<DashboardProps> = ({ user, userProfile }) => {
  const [activeView, setActiveView] = useState<DashboardView>('analyze');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'uploading' | 'analyzing' | 'generating' | 'completed'>('uploading');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);

  const handleAnalyze = async (file: File, location: string, distance: number, locationData?: LocationData, billboardMetadata?: BillboardMetadata) => {
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
      await new Promise(resolve => setTimeout(resolve, 800));

      setAnalysisStage('analyzing');
      setAnalysisProgress(50);

      const enhancedLocationData = billboardMetadata ? {
        ...locationData,
        billboardMetadata
      } : locationData;

      const aiAnalysis = await analyzeBillboardWithAI(file, location, distance, enhancedLocationData);

      setAnalysisStage('generating');
      setAnalysisProgress(75);
      await new Promise(resolve => setTimeout(resolve, 500));

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
      alert(error instanceof Error ? error.message : 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAnalysis = (id: string) => {
    if (id === 'new') {
      setActiveView('analyze');
      return;
    }
    // TODO: Load full analysis from history
    const historyItem = analysisHistory.find(h => h.id === id);
    if (historyItem) {
      // For now, switch to analyze tab - later we'll load full results
      setActiveView('analyze');
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');
  };

  const tabs = [
    { id: 'analyze' as const, label: 'Analyze', icon: BarChart3 },
    { id: 'history' as const, label: 'My Analyses', icon: History },
    { id: 'simulate' as const, label: 'Simulate', icon: Eye },
    { id: 'account' as const, label: 'Account', icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Header */}
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-bold text-navy-950">3YN</h1>

          {/* Trial indicator */}
          {userProfile && userProfile.subscription_status === 'trial' && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-secondary tabular-nums">
                <span className="sr-only">Remaining credits: </span>
                {userProfile.trial_credits_remaining} credits
              </span>
              <button
                className="text-sm text-navy-600 hover:text-navy-800 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-offset-2 rounded px-2 py-1"
                aria-label="Upgrade subscription plan"
              >
                Upgrade
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <nav className="max-w-5xl mx-auto px-4 sm:px-6" aria-label="Dashboard navigation">
          <div className="flex space-x-1" role="tablist">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  onClick={() => {
                    setActiveView(tab.id);
                    // Reset analysis view when switching to analyze tab
                    if (tab.id === 'analyze' && currentAnalysis) {
                      // Keep current analysis visible
                    }
                  }}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative focus:outline-none focus:ring-2 focus:ring-navy-500 focus:ring-inset ${
                    isActive
                      ? 'text-navy-950'
                      : 'text-secondary hover:text-navy-700'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{tab.label}</span>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8" id={`panel-${activeView}`} role="tabpanel" aria-label={`${activeView} content`}>
        {activeView === 'analyze' && (
          <>
            {isAnalyzing ? (
              <div className="max-w-2xl mx-auto">
                <AnalysisProgress stage={analysisStage} progress={analysisProgress} />
              </div>
            ) : currentAnalysis ? (
              <div className="max-w-3xl mx-auto">
                <SimpleAnalysisResults
                  analysis={currentAnalysis}
                  onNewAnalysis={handleNewAnalysis}
                  userId={user.id}
                />
              </div>
            ) : (
              <div className="max-w-3xl mx-auto">
                <SimpleUploadSection
                  onAnalyze={handleAnalyze}
                  isAnalyzing={isAnalyzing}
                  userId={user.id}
                />
              </div>
            )}
          </>
        )}

        {activeView === 'history' && (
          <AnalysesHistoryPage
            history={analysisHistory}
            onSelectAnalysis={handleSelectAnalysis}
          />
        )}

        {activeView === 'simulate' && (
          <SimulatePage />
        )}

        {activeView === 'account' && (
          <AccountPage user={user} userProfile={userProfile} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

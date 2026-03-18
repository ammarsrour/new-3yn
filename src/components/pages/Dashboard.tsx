import React, { useState } from 'react';
import { User, AnalysisResult, AnalysisHistory } from '../../types';
import UploadSection from '../dashboard/UploadSection';
import AnalysisResults from '../dashboard/AnalysisResults';
import AnalysisProgress from '../dashboard/AnalysisProgress';
import AnalysisHistoryComponent from '../dashboard/AnalysisHistory';
import UsageStats from '../dashboard/UsageStats';
import { BillboardMetadata } from '../../types/billboard';
import EnterpriseAnalytics from '../enterprise/EnterpriseAnalytics';
import TeamWorkspace from '../enterprise/TeamWorkspace';
import ClientPortal from '../enterprise/ClientPortal';
import { analyzeBillboardWithAI } from '../../services/openai';
import { LocationData } from '../../services/locationService';
import { TeamMember, Organization, Project, ClientPortal as ClientPortalType } from '../../types';
import { UserProfile, supabaseAuthService } from '../../services/supabaseAuth';
import { activityLogger } from '../../services/activityLogger';
import { AlertCircle, Lock, Calendar, Zap, Upload, ArrowRight } from 'lucide-react';

interface DashboardProps {
  user: User;
  userProfile?: UserProfile | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user, userProfile }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [activeView, setActiveView] = useState<'analysis' | 'analytics' | 'team' | 'client-portal'>('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState<'uploading' | 'analyzing' | 'generating' | 'completed'>('uploading');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([]);

  // Mock enterprise data
  const mockOrganization: Organization = {
    id: '1',
    name: 'Omantel Innovation Labs',
    logo: '/3yn eye.png',
    plan: 'Enterprise',
    members: [
      {
        id: '1',
        name: 'Sarah Al-Rashid',
        email: 'sarah.alrashid@omantel.om',
        role: 'admin',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'online',
        lastActive: new Date(),
        permissions: ['all']
      },
      {
        id: '2',
        name: 'Ahmed Al-Balushi',
        email: 'ahmed.balushi@omantel.om',
        role: 'analyst',
        avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'online',
        lastActive: new Date(),
        permissions: ['analyze', 'view']
      },
      {
        id: '3',
        name: 'Fatima Al-Zahra',
        email: 'fatima.zahra@omantel.om',
        role: 'viewer',
        avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100',
        status: 'away',
        lastActive: new Date(Date.now() - 3600000),
        permissions: ['view']
      }
    ],
    projects: [],
    settings: {
      branding: {
        logo: '/3yn eye.png',
        primaryColor: '#E30613',
        whiteLabel: true
      },
      compliance: {
        mtcitEnabled: true,
        traEnabled: true,
        customGuidelines: ['Arabic text prominence', 'Cultural sensitivity']
      },
      integrations: {
        ssoEnabled: true,
        apiAccess: true
      }
    }
  };

  const mockClientPortal: ClientPortalType = {
    id: '1',
    clientName: 'Omantel',
    brandedUrl: 'omantel.billboard-analyzer.com',
    accessCode: 'OTL2024',
    projects: ['1', '2'],
    customBranding: {
      logo: '/3yn eye.png',
      colors: {
        primary: '#E30613',
        secondary: '#1E40AF'
      }
    },
    permissions: {
      canComment: true,
      canRequestRevisions: true,
      canViewAnalytics: true
    }
  };

  const handleAnalyze = async (file: File, location: string, distance: number, locationData?: LocationData, billboardMetadata?: BillboardMetadata) => {
    if (userProfile) {
      const accessCheck = supabaseAuthService.canAnalyze(userProfile);
      if (!accessCheck.allowed) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md';

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
      // Stage 1: Uploading
      setAnalysisProgress(25);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 2: Analyzing
      setAnalysisStage('analyzing');
      setAnalysisProgress(50);
      
      // Enhanced location data with billboard metadata
      const enhancedLocationData = billboardMetadata ? {
        ...locationData,
        billboardMetadata
      } : locationData;

      const aiAnalysis = await analyzeBillboardWithAI(file, location, distance, enhancedLocationData);

      // Stage 3: Generating report
      setAnalysisStage('generating');
      setAnalysisProgress(75);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Stage 4: Complete
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

      // Log analysis completion for audit trail
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

      // Add to history
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
      // Log analysis failure for audit trail
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await activityLogger.logAnalysisFailed(user.id, location, errorMessage);

      // Show detailed error message
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md relative';

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
    // In a real app, this would fetch the full analysis from the backend
    // TODO: Implement analysis selection
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setAnalysisProgress(0);
    setAnalysisStage('uploading');
  };

  const getTrialDaysRemaining = () => {
    if (!userProfile) return 0;
    const now = new Date();
    const trialEnd = new Date(userProfile.trial_end_date);
    const diffTime = Math.abs(trialEnd.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-navy-950 tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-secondary mt-1">
                Welcome back, <span className="font-semibold text-navy-950">{user.name}</span>
              </p>
            </div>

            {/* Trial banner - compact */}
            {userProfile && userProfile.subscription_status === 'trial' && (
              <div className="flex items-center space-x-3 bg-warning-50 border-l-4 border-warning-500 px-4 py-2.5">
                <div>
                  <p className="text-label text-warning-700">Trial</p>
                  <p className="text-sm font-semibold text-navy-950 tabular-nums">
                    {getTrialDaysRemaining()} days, {userProfile.trial_credits_remaining} credits left
                  </p>
                </div>
                <button className="bg-warning-500 text-white px-3 py-1.5 text-sm font-semibold hover:bg-warning-600 transition-colors">
                  Upgrade
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <UsageStats user={user} totalAnalyses={user.totalAnalyses} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 lg:py-8">

      {activeView === 'analytics' && (user.plan === 'Enterprise' || user.plan === 'Professional') ? (
        <EnterpriseAnalytics />
      ) : activeView === 'team' && user.plan === 'Enterprise' ? (
        <TeamWorkspace 
          organization={mockOrganization}
          currentUser={mockOrganization.members[0]}
        />
      ) : activeView === 'client-portal' ? (
        <ClientPortal 
          portal={mockClientPortal}
          projects={[]}
          analyses={analysisHistory.map(h => ({
            id: h.id,
            score: h.score,
            image: h.thumbnail,
            location: h.location,
            distance: 100,
            timestamp: h.timestamp,
            criticalIssues: [],
            minorIssues: [],
            quickWins: [],
            distanceAnalysis: { '50m': 85, '100m': h.score, '150m': h.score - 15 },
            aiAnalysis: 'Mock analysis',
            status: 'completed',
            fontScore: Math.floor(h.score * 0.25),
            contrastScore: Math.floor(h.score * 0.25),
            layoutScore: Math.floor(h.score * 0.25),
            ctaScore: Math.floor(h.score * 0.25)
          }))}
        />
      ) : (
        isAnalyzing ? (
        <AnalysisProgress stage={analysisStage} progress={analysisProgress} />
      ) : currentAnalysis ? (
        <AnalysisResults
          analysis={currentAnalysis}
          onNewAnalysis={handleNewAnalysis}
          userId={user.id}
        />
      ) : user.totalAnalyses === 0 && analysisHistory.length === 0 ? (
        /* Empty State for New Users */
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UploadSection
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              userId={user.id}
            />
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 border-l-4 border-success-500">
              <div className="w-12 h-12 bg-success-50 flex items-center justify-center mb-4">
                <Upload className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-950 mb-2 tracking-tight">
                Start Your First Analysis
              </h3>
              <p className="text-sm text-secondary mb-5">
                Upload your first billboard creative to get AI-powered readability insights.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5 text-sm">
                  <div className="w-1.5 h-1.5 bg-success-500"></div>
                  <span className="text-navy-700">Instant AI analysis</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm">
                  <div className="w-1.5 h-1.5 bg-info-500"></div>
                  <span className="text-navy-700">Distance readability scores</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm">
                  <div className="w-1.5 h-1.5 bg-warning-500"></div>
                  <span className="text-navy-700">Actionable improvements</span>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-surface-200">
                <p className="text-label text-navy-500 flex items-center space-x-2">
                  <ArrowRight className="w-3 h-3" />
                  <span>Drag & drop to upload</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <UploadSection
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
              userId={user.id}
            />
          </div>
          <div className="lg:col-span-1">
            <AnalysisHistoryComponent
              history={analysisHistory}
              onSelectAnalysis={handleSelectAnalysis}
            />
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default Dashboard;
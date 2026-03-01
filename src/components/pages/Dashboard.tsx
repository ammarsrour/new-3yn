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
import { AlertCircle, Lock, Calendar, Zap } from 'lucide-react';

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
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([
    {
      id: '1',
      thumbnail: 'https://images.unsplash.com/photo-1599743777555-e362a2feab39?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      score: 78,
      location: 'Muttrah Corniche',
      timestamp: new Date(Date.now() - 86400000),
      status: 'completed'
    },
    {
      id: '2',
      thumbnail: 'https://images.unsplash.com/photo-1606813332135-228593b6e201?q=80&w=988&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      score: 65,
      location: 'Sultan Qaboos Highway',
      timestamp: new Date(Date.now() - 172800000),
      status: 'completed'
    }
  ]);

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
      closeBtn.className = 'absolute top-1 right-2 text-white hover:text-gray-200';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {userProfile && userProfile.subscription_status === 'trial' && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Free Trial Active</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{getTrialDaysRemaining()} days remaining</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{userProfile.trial_credits_remaining} / {userProfile.trial_credits_total} credits left</span>
                  </span>
                </div>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold">
              Upgrade Now
            </button>
          </div>
        </div>
      )}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">
            Welcome back, {user.name}! Ready to analyze your billboard?
          </p>
          {false && (user.plan === 'Enterprise' || user.plan === 'Professional') && (
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveView('analysis')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'analysis'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Analysis
              </button>
              {user.plan === 'Enterprise' && (
                <button
                  onClick={() => setActiveView('team')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeView === 'team'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Team Workspace
                </button>
              )}
              <button
                onClick={() => setActiveView('client-portal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'client-portal'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Client Portal
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'analytics'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Enterprise Analytics
              </button>
            </div>
          )}
        </div>
      </div>

      <UsageStats user={user} />

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
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
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
  );
};

export default Dashboard;
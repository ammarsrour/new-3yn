export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'Starter' | 'Professional' | 'Enterprise';
  analysesThisMonth: number;
  maxAnalyses: number;
  totalAnalyses: number;
}

export interface AnalysisResult {
  id: string;
  score: number;
  arabicTextDetected?: boolean;
  culturalCompliance?: string;
  fontScore: number;
  contrastScore: number;
  layoutScore: number;
  ctaScore: number;
  image: string;
  location: string;
  distance: number;
  timestamp: Date;
  criticalIssues: Issue[];
  minorIssues: Issue[];
  quickWins: Issue[];
  distanceAnalysis: {
    '50m': number;
    '100m': number;
    '150m': number;
  };
  aiAnalysis: string;
  menaConsiderations?: string;
  status: 'analyzing' | 'completed' | 'failed';
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'minor' | 'improvement';
}

export interface AnalysisHistory {
  id: string;
  thumbnail: string;
  score: number;
  location: string;
  timestamp: Date;
  status: 'completed' | 'failed';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'client';
  avatar: string;
  status: 'online' | 'offline' | 'away';
  lastActive: Date;
  permissions: string[];
}

export interface Organization {
  id: string;
  name: string;
  logo: string;
  plan: 'Professional' | 'Enterprise';
  members: TeamMember[];
  projects: Project[];
  settings: OrganizationSettings;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  status: 'draft' | 'under_review' | 'approved' | 'implemented';
  deadline: Date;
  analyses: string[]; // Analysis IDs
  team: string[]; // Team member IDs
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  branding: {
    logo: string;
    primaryColor: string;
    whiteLabel: boolean;
  };
  compliance: {
    mtcitEnabled: boolean;
    traEnabled: boolean;
    customGuidelines: string[];
  };
  integrations: {
    ssoEnabled: boolean;
    slackWebhook?: string;
    apiAccess: boolean;
  };
}

export interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'revision_request';
  mentions: string[]; // User IDs
  attachments?: string[];
}

export interface ClientPortal {
  id: string;
  clientName: string;
  brandedUrl: string;
  accessCode: string;
  projects: string[]; // Project IDs
  customBranding: {
    logo: string;
    colors: {
      primary: string;
      secondary: string;
    };
  };
  permissions: {
    canComment: boolean;
    canRequestRevisions: boolean;
    canViewAnalytics: boolean;
  };
}
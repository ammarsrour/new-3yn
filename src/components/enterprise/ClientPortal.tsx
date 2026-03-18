import React, { useState } from 'react';
import { Shield, Eye, MessageCircle, Download, Calendar, BarChart3 } from 'lucide-react';
import { ClientPortal as ClientPortalType, Project, AnalysisResult } from '../../types';

interface ClientPortalProps {
  portal: ClientPortalType;
  projects: Project[];
  analyses: AnalysisResult[];
}

const ClientPortal: React.FC<ClientPortalProps> = ({ portal, projects, analyses }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'feedback'>('dashboard');

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-success-500';
    if (score >= 40) return 'text-warning-500';
    return 'text-danger-500';
  };

  const averageScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length)
    : 0;

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Custom Branded Header */}
      <header className="bg-white border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src={portal.customBranding.logo}
                alt={portal.clientName}
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-lg font-bold text-navy-950 tracking-tight">
                  {portal.clientName} Campaign Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-secondary">
                Secure Access • Last updated: {new Date().toLocaleDateString()}
              </span>
              <Shield className="w-4 h-4 text-success-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
        {/* Navigation */}
        <div className="bg-white mb-6">
          <div className="border-b border-surface-200">
            <nav className="flex space-x-6 px-6">
              {[
                { key: 'dashboard', label: 'Campaign Overview', icon: BarChart3 },
                { key: 'projects', label: 'Billboard Analyses', icon: Eye },
                { key: 'feedback', label: 'Feedback & Comments', icon: MessageCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'text-navy-950 border-navy-950'
                        : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-surface-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-200">
                  <div className="bg-info-50 p-5 border-l-4 border-info-500">
                    <div className="text-3xl text-stat text-info-600 tabular-nums">{projects.length}</div>
                    <div className="text-label mt-1">Active Campaigns</div>
                  </div>
                  <div className="bg-success-50 p-5 border-l-4 border-success-500">
                    <div className="text-3xl text-stat text-success-600 tabular-nums">{analyses.length}</div>
                    <div className="text-label mt-1">Billboards Analyzed</div>
                  </div>
                  <div className="bg-white p-5 border-l-4 border-navy-950">
                    <div className={`text-3xl text-stat tabular-nums ${getScoreColor(averageScore)}`}>{averageScore}</div>
                    <div className="text-label mt-1">Average Score</div>
                  </div>
                  <div className="bg-warning-50 p-5 border-l-4 border-warning-500">
                    <div className="text-3xl text-stat text-warning-600 tabular-nums">+28%</div>
                    <div className="text-label mt-1">Improvement Rate</div>
                  </div>
                </div>

                {/* Campaign Progress */}
                <div className="bg-white p-6 border-l-4 border-surface-200">
                  <h3 className="text-lg font-bold text-navy-950 tracking-tight mb-4">Campaign Progress</h3>
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-surface-50">
                        <div>
                          <h4 className="font-semibold text-navy-950">{project.name}</h4>
                          <p className="text-sm text-secondary">
                            {project.analyses.length} analyses • Due: {project.deadline.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-label">Progress</div>
                            <div className="font-semibold text-navy-950 tabular-nums">
                              {project.status === 'implemented' ? '100%' :
                               project.status === 'approved' ? '80%' :
                               project.status === 'under_review' ? '60%' : '40%'}
                            </div>
                          </div>
                          <div className="w-16 h-1.5 bg-surface-200">
                            <div
                              className="h-1.5 bg-success-500 transition-all duration-500"
                              style={{
                                width: project.status === 'implemented' ? '100%' :
                                       project.status === 'approved' ? '80%' :
                                       project.status === 'under_review' ? '60%' : '40%'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Performance */}
                <div className="bg-warning-50 p-6 border-l-4 border-warning-500">
                  <h3 className="text-lg font-bold text-navy-950 tracking-tight mb-4 flex items-center">
                    Oman Market Performance
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-2xl text-stat text-warning-600">Top 15%</div>
                      <div className="text-label mt-1">Market Ranking</div>
                    </div>
                    <div>
                      <div className="text-2xl text-stat text-success-600">98%</div>
                      <div className="text-label mt-1">MTCIT Compliance</div>
                    </div>
                    <div>
                      <div className="text-2xl text-stat text-success-600">+35%</div>
                      <div className="text-label mt-1">ROI Improvement</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-navy-950 tracking-tight">Billboard Analyses</h3>
                  <button className="bg-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Download All Reports</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="bg-white p-6 border-l-4 border-surface-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={analysis.image}
                            alt="Billboard"
                            className="w-20 h-12 object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-navy-950">{analysis.location}</h4>
                            <p className="text-sm text-secondary">
                              Analyzed on {analysis.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl text-stat ${getScoreColor(analysis.score)}`}>
                            {analysis.score}
                          </div>
                          <div className="text-label">Readability Score</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-label">Critical Issues</span>
                          <div className="font-semibold text-danger-600 tabular-nums">{analysis.criticalIssues.length}</div>
                        </div>
                        <div>
                          <span className="text-label">Quick Wins</span>
                          <div className="font-semibold text-success-600 tabular-nums">{analysis.quickWins.length}</div>
                        </div>
                        <div>
                          <span className="text-label">Distance</span>
                          <div className="font-semibold text-navy-950 tabular-nums">{analysis.distance}m</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {analysis.criticalIssues.length === 0 && (
                            <span className="px-2 py-0.5 bg-success-50 text-success-700 text-xs font-semibold">
                              Highway Ready
                            </span>
                          )}
                          {analysis.contrastScore >= 20 && (
                            <span className="px-2 py-0.5 bg-info-50 text-info-700 text-xs font-semibold">
                              High Contrast
                            </span>
                          )}
                          {analysis.score >= 80 && (
                            <span className="px-2 py-0.5 bg-success-50 text-success-700 text-xs font-semibold">
                              Excellent
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-3">
                          {portal.permissions.canComment && (
                            <button className="text-navy-500 hover:text-navy-950 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-navy-500 hover:text-navy-950 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-navy-950 tracking-tight">Feedback & Comments</h3>
                  {portal.permissions.canComment && (
                    <button className="bg-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors">
                      Add Feedback
                    </button>
                  )}
                </div>

                <div className="bg-white p-6 border-l-4 border-surface-200">
                  <div className="text-center py-8">
                    <MessageCircle className="w-10 h-10 text-navy-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-navy-950 mb-2">No feedback yet</h4>
                    <p className="text-secondary">
                      {portal.permissions.canComment
                        ? "Start a conversation about your billboard campaigns"
                        : "Feedback and comments will appear here"
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortal;

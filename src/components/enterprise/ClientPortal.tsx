import React, { useState } from 'react';
import { Shield, Eye, MessageCircle, Download, Star, Calendar, BarChart3 } from 'lucide-react';
import { ClientPortal as ClientPortalType, Project, AnalysisResult } from '../../types';

interface ClientPortalProps {
  portal: ClientPortalType;
  projects: Project[];
  analyses: AnalysisResult[];
}

const ClientPortal: React.FC<ClientPortalProps> = ({ portal, projects, analyses }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'feedback'>('dashboard');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const averageScore = analyses.length > 0 
    ? Math.round(analyses.reduce((sum, analysis) => sum + analysis.score, 0) / analyses.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom Branded Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src={portal.customBranding.logo} 
                alt={portal.clientName}
                className="w-8 h-8 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold" style={{ color: portal.customBranding.colors.primary }}>
                  {portal.clientName} Campaign Portal
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Secure Access • Last updated: {new Date().toLocaleDateString()}
              </div>
              <Shield className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
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
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.key
                        ? 'text-blue-600 border-blue-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={activeTab === tab.key ? { 
                      color: portal.customBranding.colors.primary,
                      borderColor: portal.customBranding.colors.primary 
                    } : {}}
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600">{projects.length}</div>
                    <div className="text-sm text-blue-700">Active Campaigns</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-600">{analyses.length}</div>
                    <div className="text-sm text-green-700">Billboards Analyzed</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                    <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>{averageScore}/100</div>
                    <div className="text-sm text-purple-700">Average Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                    <div className="text-3xl font-bold text-orange-600">+28%</div>
                    <div className="text-sm text-orange-700">Improvement Rate</div>
                  </div>
                </div>

                {/* Campaign Progress */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Progress</h3>
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold text-gray-900">{project.name}</h4>
                          <p className="text-sm text-gray-600">
                            {project.analyses.length} analyses • Due: {project.deadline.toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm text-gray-500">Progress</div>
                            <div className="font-semibold text-gray-900">
                              {project.status === 'implemented' ? '100%' : 
                               project.status === 'approved' ? '80%' :
                               project.status === 'under_review' ? '60%' : '40%'}
                            </div>
                          </div>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: project.status === 'implemented' ? '100%' : 
                                       project.status === 'approved' ? '80%' :
                                       project.status === 'under_review' ? '60%' : '40%',
                                backgroundColor: portal.customBranding.colors.primary
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Regional Performance */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    🇴🇲 Oman Market Performance
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">Top 15%</div>
                      <div className="text-sm text-orange-700">Market Ranking</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">98%</div>
                      <div className="text-sm text-red-700">MTCIT Compliance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">+35%</div>
                      <div className="text-sm text-green-700">ROI Improvement</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Billboard Analyses</h3>
                  <button 
                    className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors flex items-center space-x-2"
                    style={{ backgroundColor: portal.customBranding.colors.primary }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download All Reports</span>
                  </button>
                </div>

                <div className="grid gap-6">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={analysis.image}
                            alt="Billboard"
                            className="w-20 h-12 object-cover rounded-lg"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{analysis.location}</h4>
                            <p className="text-sm text-gray-600">
                              Analyzed on {analysis.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                            {analysis.score}/100
                          </div>
                          <div className="text-sm text-gray-500">Readability Score</div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Critical Issues:</span>
                          <div className="font-medium text-red-600">{analysis.criticalIssues.length}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Quick Wins:</span>
                          <div className="font-medium text-green-600">{analysis.quickWins.length}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Distance:</span>
                          <div className="font-medium">{analysis.distance}m</div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          {analysis.criticalIssues.length === 0 && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              ✓ Highway Ready
                            </span>
                          )}
                          {analysis.contrastScore >= 20 && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              ✓ High Contrast
                            </span>
                          )}
                          {analysis.score >= 80 && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                              ✓ Excellent
                            </span>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          {portal.permissions.canComment && (
                            <button className="text-gray-600 hover:text-gray-800 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button className="text-gray-600 hover:text-gray-800 transition-colors">
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
                  <h3 className="text-lg font-semibold text-gray-900">Feedback & Comments</h3>
                  {portal.permissions.canComment && (
                    <button 
                      className="text-white px-4 py-2 rounded-lg hover:opacity-90 transition-colors"
                      style={{ backgroundColor: portal.customBranding.colors.primary }}
                    >
                      Add Feedback
                    </button>
                  )}
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h4>
                    <p className="text-gray-600">
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
import React, { useState } from 'react';
import { Users, Plus, Settings, Shield, Calendar, MessageCircle, Bell, Search } from 'lucide-react';
import { TeamMember, Project, Organization } from '../../types';

interface TeamWorkspaceProps {
  organization: Organization;
  currentUser: TeamMember;
}

const TeamWorkspace: React.FC<TeamWorkspaceProps> = ({ organization, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'team' | 'analytics'>('overview');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Omantel Q4 Campaign',
      client: 'Omantel',
      status: 'under_review',
      deadline: new Date('2024-12-31'),
      analyses: ['1', '2', '3'],
      team: ['1', '2'],
      tags: ['telecom', 'highway', 'arabic'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Tourism Board Billboards',
      client: 'Oman Tourism',
      status: 'approved',
      deadline: new Date('2024-11-30'),
      analyses: ['4', '5'],
      team: ['1', '3'],
      tags: ['tourism', 'cultural', 'seasonal'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'Bank Muscat Highway Series',
      client: 'Bank Muscat',
      status: 'draft',
      deadline: new Date('2025-01-15'),
      analyses: ['6'],
      team: ['2', '3'],
      tags: ['banking', 'highway', 'finance'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-19')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'implemented': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'analyst': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src={organization.logo || "/3yn eye.png"} 
              alt={organization.name}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
              <p className="text-gray-600">{organization.plan} Plan • {organization.members.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-2xl shadow-lg mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview', icon: Users },
              { key: 'projects', label: 'Projects', icon: Calendar },
              { key: 'team', label: 'Team', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <div className="text-2xl font-bold text-blue-600">{mockProjects.length}</div>
                  <div className="text-sm text-blue-700">Active Projects</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <div className="text-2xl font-bold text-green-600">
                    {mockProjects.reduce((sum, p) => sum + p.analyses.length, 0)}
                  </div>
                  <div className="text-sm text-green-700">Total Analyses</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
                  <div className="text-2xl font-bold text-purple-600">{organization.members.length}</div>
                  <div className="text-sm text-purple-700">Team Members</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
                  <div className="text-2xl font-bold text-orange-600">94%</div>
                  <div className="text-sm text-orange-700">Client Satisfaction</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>Sarah Al-Rashid</strong> approved "Omantel Q4 Campaign" analysis
                    </span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>Ahmed Al-Balushi</strong> completed analysis for "Tourism Board Billboards"
                    </span>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      <strong>Client Portal</strong> feedback received on "Bank Muscat Highway Series"
                    </span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Client Projects</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="grid gap-6">
                {mockProjects.map((project) => (
                  <div key={project.id} className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                        <p className="text-gray-600">Client: {project.client}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-gray-500">Deadline:</span>
                        <div className="font-medium">{project.deadline.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Analyses:</span>
                        <div className="font-medium">{project.analyses.length} completed</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Team:</span>
                        <div className="font-medium">{project.team.length} members</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="grid gap-4">
                {organization.members.map((member) => (
                  <div key={member.id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{member.name}</h4>
                        <p className="text-gray-600 text-sm">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${
                        member.status === 'online' ? 'bg-green-500' : 
                        member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Enterprise Analytics</h3>
              
              {/* Portfolio Performance */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Portfolio Performance</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">87/100</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-gray-600">Improvement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">94%</div>
                    <div className="text-sm text-gray-600">Client Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Regional Performance */}
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  🇴🇲 Oman Market Performance
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-orange-800 mb-2">MTCIT Compliance</h5>
                    <div className="text-2xl font-bold text-orange-600">98%</div>
                    <p className="text-sm text-orange-700">Arabic text requirements met</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-800 mb-2">Market Position</h5>
                    <div className="text-2xl font-bold text-red-600">Top 5%</div>
                    <p className="text-sm text-red-700">Regional performance ranking</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 m-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="colleague@omantel.om"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamWorkspace;
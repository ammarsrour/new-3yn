import React, { useState } from 'react';
import { Users, Plus, Shield, Calendar, Bell, Search } from 'lucide-react';
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
      case 'draft': return 'bg-surface-100 text-navy-700';
      case 'under_review': return 'bg-warning-50 text-warning-700';
      case 'approved': return 'bg-success-50 text-success-700';
      case 'implemented': return 'bg-info-50 text-info-700';
      default: return 'bg-surface-100 text-navy-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-navy-950 text-white';
      case 'analyst': return 'bg-info-50 text-info-700';
      case 'viewer': return 'bg-surface-100 text-navy-600';
      case 'client': return 'bg-success-50 text-success-700';
      default: return 'bg-surface-100 text-navy-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6">
      {/* Header */}
      <div className="bg-white p-6 mb-6 border-b border-surface-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img
              src={organization.logo || "/3yn eye.png"}
              alt={organization.name}
              className="w-10 h-10"
            />
            <div>
              <h1 className="text-2xl font-bold text-navy-950 tracking-tight">{organization.name}</h1>
              <p className="text-secondary">{organization.plan} Plan • {organization.members.length} members</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 text-navy-400 hover:text-navy-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-navy-400 hover:text-navy-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Invite Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white mb-6">
        <div className="border-b border-surface-200">
          <nav className="flex space-x-6 px-6">
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
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-navy-950 text-navy-950'
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-200">
                <div className="bg-info-50 p-5 border-l-4 border-info-500">
                  <div className="text-2xl text-stat text-info-600 tabular-nums">{mockProjects.length}</div>
                  <div className="text-label mt-1">Active Projects</div>
                </div>
                <div className="bg-success-50 p-5 border-l-4 border-success-500">
                  <div className="text-2xl text-stat text-success-600 tabular-nums">
                    {mockProjects.reduce((sum, p) => sum + p.analyses.length, 0)}
                  </div>
                  <div className="text-label mt-1">Total Analyses</div>
                </div>
                <div className="bg-white p-5 border-l-4 border-navy-950">
                  <div className="text-2xl text-stat text-navy-950 tabular-nums">{organization.members.length}</div>
                  <div className="text-label mt-1">Team Members</div>
                </div>
                <div className="bg-warning-50 p-5 border-l-4 border-warning-500">
                  <div className="text-2xl text-stat text-warning-600 tabular-nums">94%</div>
                  <div className="text-label mt-1">Client Satisfaction</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-surface-50 p-6 border-l-4 border-surface-200">
                <h3 className="text-lg font-bold text-navy-950 tracking-tight mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-success-500"></div>
                    <span className="text-sm text-navy-700">
                      <span className="font-semibold">Sarah Al-Rashid</span> approved "Omantel Q4 Campaign" analysis
                    </span>
                    <span className="text-xs text-secondary">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-info-500"></div>
                    <span className="text-sm text-navy-700">
                      <span className="font-semibold">Ahmed Al-Balushi</span> completed analysis for "Tourism Board Billboards"
                    </span>
                    <span className="text-xs text-secondary">4 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-1.5 h-1.5 bg-warning-500"></div>
                    <span className="text-sm text-navy-700">
                      <span className="font-semibold">Client Portal</span> feedback received on "Bank Muscat Highway Series"
                    </span>
                    <span className="text-xs text-secondary">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-navy-950 tracking-tight">Client Projects</h3>
                <button className="bg-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </button>
              </div>

              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <div key={project.id} className="bg-surface-50 p-6 border-l-4 border-surface-200">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold text-navy-950">{project.name}</h4>
                        <p className="text-secondary">Client: {project.client}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {project.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-label">Deadline</span>
                        <div className="font-semibold text-navy-950">{project.deadline.toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-label">Analyses</span>
                        <div className="font-semibold text-navy-950">{project.analyses.length} completed</div>
                      </div>
                      <div>
                        <span className="text-label">Team</span>
                        <div className="font-semibold text-navy-950">{project.team.length} members</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-info-50 text-info-700 text-xs font-semibold">
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
                <h3 className="text-lg font-bold text-navy-950 tracking-tight">Team Members</h3>
                <button className="bg-navy-950 text-white px-4 py-2 text-sm font-semibold hover:bg-navy-800 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Invite Member</span>
                </button>
              </div>

              <div className="space-y-3">
                {organization.members.map((member) => (
                  <div key={member.id} className="bg-surface-50 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10"
                      />
                      <div>
                        <h4 className="font-semibold text-navy-950">{member.name}</h4>
                        <p className="text-secondary text-sm">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-0.5 text-xs font-semibold ${getRoleColor(member.role)}`}>
                        {member.role.toUpperCase()}
                      </span>
                      <div className={`w-2 h-2 ${
                        member.status === 'online' ? 'bg-success-500' :
                        member.status === 'away' ? 'bg-warning-500' : 'bg-navy-300'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-navy-950 tracking-tight">Enterprise Analytics</h3>

              {/* Portfolio Performance */}
              <div className="bg-info-50 p-6 border-l-4 border-info-500">
                <h4 className="font-bold text-navy-950 mb-4">Portfolio Performance</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl text-stat text-info-600">87</div>
                    <div className="text-label mt-1">Average Score</div>
                  </div>
                  <div>
                    <div className="text-3xl text-stat text-success-600">+23%</div>
                    <div className="text-label mt-1">Improvement Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl text-stat text-success-600">94%</div>
                    <div className="text-label mt-1">Client Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Regional Performance */}
              <div className="bg-warning-50 p-6 border-l-4 border-warning-500">
                <h4 className="font-bold text-navy-950 mb-4 flex items-center">
                  Oman Market Performance
                </h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-label mb-1">MTCIT Compliance</h5>
                    <div className="text-2xl text-stat text-warning-600">98%</div>
                    <p className="text-sm text-secondary mt-1">Arabic text requirements met</p>
                  </div>
                  <div>
                    <h5 className="text-label mb-1">Market Position</h5>
                    <div className="text-2xl text-stat text-success-600">Top 5%</div>
                    <p className="text-sm text-secondary mt-1">Regional performance ranking</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-navy-950/50 flex items-center justify-center z-50">
          <div className="bg-white max-w-md w-full p-6 m-4">
            <h3 className="text-xl font-bold text-navy-950 mb-4 tracking-tight">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-surface-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent"
                  placeholder="colleague@omantel.om"
                />
              </div>
              <div>
                <label className="block text-label mb-2">Role</label>
                <select className="w-full px-3 py-2 border border-surface-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent">
                  <option value="analyst">Analyst</option>
                  <option value="viewer">Viewer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-surface-200 text-navy-700 hover:bg-surface-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 bg-navy-950 text-white font-semibold hover:bg-navy-800 transition-colors"
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

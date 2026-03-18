import React, { useState } from 'react';
import { Users, MessageCircle, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface Comment {
  id: string;
  author: TeamMember;
  content: string;
  timestamp: Date;
  type: 'comment' | 'approval' | 'revision';
}

interface TeamCollaborationProps {
  analysisId: string;
}

const TeamCollaboration: React.FC<TeamCollaborationProps> = ({ analysisId }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'approvals' | 'history'>('comments');
  const [newComment, setNewComment] = useState('');

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Ahmed Al-Rashid',
      role: 'Creative Director',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'online'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Account Manager',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'online'
    },
    {
      id: '3',
      name: 'Omar Al-Balushi',
      role: 'Designer',
      avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100',
      status: 'offline'
    }
  ];

  const comments: Comment[] = [
    {
      id: '1',
      author: teamMembers[0],
      content: 'The Arabic text size needs to be increased significantly. Current size won\'t be readable from highway distances.',
      timestamp: new Date(Date.now() - 3600000),
      type: 'comment'
    },
    {
      id: '2',
      author: teamMembers[1],
      content: 'Client approved the color scheme but wants to see the contrast improvements before final approval.',
      timestamp: new Date(Date.now() - 1800000),
      type: 'approval'
    },
    {
      id: '3',
      author: teamMembers[2],
      content: 'I\'ve updated the design with the recommended font size changes. Ready for review.',
      timestamp: new Date(Date.now() - 900000),
      type: 'revision'
    }
  ];

  const approvalStatus = [
    { name: 'Creative Director', status: 'approved', user: teamMembers[0] },
    { name: 'Account Manager', status: 'pending', user: teamMembers[1] },
    { name: 'Client', status: 'pending', user: null }
  ];

  const handleAddComment = () => {
    if (newComment.trim()) {
      setNewComment('');
    }
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-success-500" />;
      case 'revision':
        return <AlertCircle className="w-4 h-4 text-info-500" />;
      default:
        return <MessageCircle className="w-4 h-4 text-navy-500" />;
    }
  };

  return (
    <div className="bg-white p-6 border-l-4 border-navy-950">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-navy-950 tracking-tight flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Team Collaboration
        </h3>
        <div className="flex items-center space-x-2">
          {teamMembers.slice(0, 3).map((member) => (
            <div key={member.id} className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 border-2 border-white"
              />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white ${
                member.status === 'online' ? 'bg-success-500' : 'bg-navy-300'
              }`}></div>
            </div>
          ))}
          <span className="text-sm text-secondary ml-2">+2 more</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 bg-surface-100 p-1">
        {[
          { key: 'comments', label: 'Comments', count: comments.length },
          { key: 'approvals', label: 'Approvals', count: 2 },
          { key: 'history', label: 'History', count: 5 }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-navy-950'
                : 'text-navy-600 hover:text-navy-950'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          {/* Comment Input */}
          <div className="flex space-x-3">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100"
              alt="You"
              className="w-8 h-8"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-surface-200 focus:ring-2 focus:ring-navy-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-navy-950 text-white text-sm font-semibold hover:bg-navy-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-3">
                <img
                  src={comment.author.avatar}
                  alt={comment.author.name}
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="bg-surface-50 p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-navy-950">{comment.author.name}</span>
                      <span className="text-sm text-secondary">{comment.author.role}</span>
                      {getCommentIcon(comment.type)}
                    </div>
                    <p className="text-sm text-navy-700">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1 text-xs text-secondary">
                    <Clock className="w-3 h-3" />
                    <span>{comment.timestamp.toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approvals Tab */}
      {activeTab === 'approvals' && (
        <div className="space-y-3">
          {approvalStatus.map((approval, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-surface-200">
              <div className="flex items-center space-x-3">
                {approval.user ? (
                  <img
                    src={approval.user.avatar}
                    alt={approval.user.name}
                    className="w-10 h-10"
                  />
                ) : (
                  <div className="w-10 h-10 bg-surface-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-navy-400" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-navy-950">{approval.name}</h4>
                  {approval.user && (
                    <p className="text-sm text-secondary">{approval.user.role}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {approval.status === 'approved' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-success-500" />
                    <span className="text-success-600 font-medium">Approved</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 text-warning-500" />
                    <span className="text-warning-600 font-medium">Pending</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="text-center py-8">
          <Clock className="w-10 h-10 mx-auto mb-4 text-navy-300" />
          <p className="text-secondary">Version history and activity timeline will appear here</p>
        </div>
      )}
    </div>
  );
};

export default TeamCollaboration;

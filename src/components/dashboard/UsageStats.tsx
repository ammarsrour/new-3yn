import React from 'react';
import { User } from '../../types';

interface UsageStatsProps {
  user: User;
  totalAnalyses?: number;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user, totalAnalyses }) => {
  const usagePercentage = (user.analysesThisMonth / user.maxAnalyses) * 100;

  // Determine usage status color
  const getUsageColor = () => {
    if (usagePercentage > 80) return { bg: 'bg-danger-500', text: 'text-danger-600', light: 'bg-danger-50' };
    if (usagePercentage > 60) return { bg: 'bg-warning-500', text: 'text-warning-600', light: 'bg-warning-50' };
    return { bg: 'bg-success-500', text: 'text-success-600', light: 'bg-success-50' };
  };

  const usageColor = getUsageColor();

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-success-500';
    if (score >= 40) return 'text-warning-500';
    return 'text-danger-500';
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-200">
      {/* Monthly Usage - with colored background based on status */}
      <div className={`${usageColor.light} p-5 lg:p-6 border-l-4 ${usageColor.bg.replace('bg-', 'border-')}`}>
        <p className="text-label mb-2">This Month</p>
        <p className={`text-3xl lg:text-4xl text-stat tabular-nums mb-3 ${usageColor.text}`}>
          {user.analysesThisMonth}<span className="text-navy-300">/{user.maxAnalyses}</span>
        </p>
        {/* Progress bar */}
        <div className="w-full bg-white/50 h-1.5 overflow-hidden">
          <div
            className={`h-1.5 transition-all duration-700 ${usageColor.bg}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <p className={`text-xs mt-2 tabular-nums ${usageColor.text}`}>{Math.round(usagePercentage)}% used</p>
      </div>

      {/* Total Analyses */}
      <div className="bg-white p-5 lg:p-6">
        <p className="text-label mb-2">Total Analyses</p>
        <p className="text-3xl lg:text-4xl text-stat text-navy-950 tabular-nums">
          {totalAnalyses ?? user.totalAnalyses}
        </p>
        <p className="text-secondary text-xs mt-3">All time</p>
      </div>

      {/* Average Score - colored by score value */}
      <div className="bg-success-50 p-5 lg:p-6 border-l-4 border-success-500">
        <p className="text-label mb-2">Avg Score</p>
        <p className={`text-3xl lg:text-4xl text-stat tabular-nums ${user.totalAnalyses > 0 ? getScoreColor(73) : 'text-navy-300'}`}>
          {user.totalAnalyses > 0 ? '73' : '--'}
        </p>
        <p className="text-xs text-success-700 mt-3">
          {user.totalAnalyses > 0 ? 'Good performance' : 'No data yet'}
        </p>
      </div>

      {/* Plan - gold accent for premium feel */}
      <div className="bg-navy-950 p-5 lg:p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-label text-navy-400 mb-2">Your Plan</p>
        <p className="text-2xl lg:text-3xl font-bold tracking-tight text-gold-400">
          {user.plan}
        </p>
        <p className="text-xs text-navy-400 mt-3">
          {user.plan === 'Starter' ? 'Upgrade for more' : 'Active subscription'}
        </p>
      </div>
    </div>
  );
};

export default UsageStats;

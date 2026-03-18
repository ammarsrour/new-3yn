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
      <div className={`${usageColor.light} p-6 lg:p-8 border-l-4 ${usageColor.bg.replace('bg-', 'border-')}`}>
        <p className="text-label mb-3">This Month</p>
        <p className={`text-4xl lg:text-5xl text-stat tabular-nums mb-4 ${usageColor.text}`}>
          {user.analysesThisMonth}<span className="text-navy-300">/{user.maxAnalyses}</span>
        </p>
        {/* Progress bar */}
        <div className="w-full bg-white/50 h-2 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-700 ${usageColor.bg}`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <p className={`text-sm mt-2 tabular-nums ${usageColor.text}`}>{Math.round(usagePercentage)}% used</p>
      </div>

      {/* Total Analyses */}
      <div className="bg-white p-6 lg:p-8">
        <p className="text-label mb-3">Total Analyses</p>
        <p className="text-4xl lg:text-5xl text-stat text-navy-950 tabular-nums">
          {totalAnalyses ?? user.totalAnalyses}
        </p>
        <p className="text-secondary mt-4">All time</p>
      </div>

      {/* Average Score - colored by score value */}
      <div className="bg-success-50 p-6 lg:p-8 border-l-4 border-success-500">
        <p className="text-label mb-3">Avg Score</p>
        <p className={`text-4xl lg:text-5xl text-stat tabular-nums ${user.totalAnalyses > 0 ? getScoreColor(73) : 'text-navy-300'}`}>
          {user.totalAnalyses > 0 ? '73' : '--'}
        </p>
        <p className="text-sm text-success-700 mt-4">
          {user.totalAnalyses > 0 ? 'Good performance' : 'No data yet'}
        </p>
      </div>

      {/* Plan - gold accent for premium feel */}
      <div className="bg-navy-950 p-6 lg:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <p className="text-label text-navy-400 mb-3">Your Plan</p>
        <p className="text-3xl lg:text-4xl font-bold tracking-tight text-gold-400">
          {user.plan}
        </p>
        <p className="text-xs text-navy-400 mt-4">
          {user.plan === 'Starter' ? 'Upgrade for more' : 'Active subscription'}
        </p>
      </div>
    </div>
  );
};

export default UsageStats;

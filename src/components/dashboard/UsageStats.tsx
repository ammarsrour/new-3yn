import React from 'react';
import { User } from '../../types';

interface UsageStatsProps {
  user: User;
  totalAnalyses?: number;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user, totalAnalyses }) => {
  const usagePercentage = (user.analysesThisMonth / user.maxAnalyses) * 100;

  // Only show warning color when usage is high
  const isHighUsage = usagePercentage > 80;

  return (
    <div className="border-b border-surface-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-surface-200">
          {/* Monthly Usage */}
          <div className="py-4 lg:py-5 pr-6">
            <p className="text-xs text-secondary mb-1">This Month</p>
            <p className="text-2xl font-semibold text-navy-950 tabular-nums">
              {user.analysesThisMonth}<span className="text-navy-400 font-normal">/{user.maxAnalyses}</span>
            </p>
            {/* Subtle progress bar */}
            <div className="w-full bg-surface-100 h-1 mt-2 overflow-hidden">
              <div
                className={`h-1 transition-all duration-500 ${isHighUsage ? 'bg-warning-500' : 'bg-navy-400'}`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Total Analyses */}
          <div className="py-4 lg:py-5 px-6">
            <p className="text-xs text-secondary mb-1">Total Analyses</p>
            <p className="text-2xl font-semibold text-navy-950 tabular-nums">
              {totalAnalyses ?? user.totalAnalyses}
            </p>
            <p className="text-xs text-secondary mt-2">All time</p>
          </div>

          {/* Average Score */}
          <div className="py-4 lg:py-5 px-6">
            <p className="text-xs text-secondary mb-1">Avg Score</p>
            <p className={`text-2xl font-semibold tabular-nums ${user.totalAnalyses > 0 ? 'text-navy-950' : 'text-navy-300'}`}>
              {user.totalAnalyses > 0 ? '73' : '--'}
            </p>
            <p className="text-xs text-secondary mt-2">
              {user.totalAnalyses > 0 ? 'Good' : 'No data'}
            </p>
          </div>

          {/* Plan */}
          <div className="py-4 lg:py-5 pl-6">
            <p className="text-xs text-secondary mb-1">Plan</p>
            <p className="text-2xl font-semibold text-navy-950">
              {user.plan}
            </p>
            <p className="text-xs text-secondary mt-2">
              {user.plan === 'Starter' ? 'Upgrade available' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;

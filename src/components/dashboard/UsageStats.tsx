import React from 'react';
import { User } from '../../types';

interface UsageStatsProps {
  user: User;
  totalAnalyses?: number;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user, totalAnalyses }) => {
  const usagePercentage = (user.analysesThisMonth / user.maxAnalyses) * 100;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
      {/* Monthly Usage - Hero stat */}
      <div className="bg-white p-6 lg:p-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">This Month</p>
        <p className="text-4xl lg:text-5xl font-black text-[#0f2942] ltr-numbers mb-4">
          {user.analysesThisMonth}<span className="text-slate-300">/{user.maxAnalyses}</span>
        </p>
        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className={`h-1.5 transition-all duration-700 ${
              usagePercentage > 80 ? 'bg-red-500' :
              usagePercentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 ltr-numbers">{Math.round(usagePercentage)}% used</p>
      </div>

      {/* Total Analyses */}
      <div className="bg-white p-6 lg:p-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Total Analyses</p>
        <p className="text-4xl lg:text-5xl font-black text-[#0f2942] ltr-numbers">
          {totalAnalyses ?? user.totalAnalyses}
        </p>
        <p className="text-xs text-slate-500 mt-4">All time</p>
      </div>

      {/* Average Score */}
      <div className="bg-white p-6 lg:p-8">
        <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">Avg Score</p>
        <p className="text-4xl lg:text-5xl font-black text-emerald-600 ltr-numbers">
          {user.totalAnalyses > 0 ? '73' : '--'}
        </p>
        <p className="text-xs text-slate-500 mt-4">Out of 100</p>
      </div>

      {/* Plan */}
      <div className="bg-[#0f2942] p-6 lg:p-8 text-white">
        <p className="text-xs uppercase tracking-wider text-slate-400 mb-3">Your Plan</p>
        <p className="text-3xl lg:text-4xl font-bold">
          {user.plan}
        </p>
        <p className="text-xs text-slate-400 mt-4">
          {user.plan === 'Starter' ? 'Upgrade for more' : 'Active subscription'}
        </p>
      </div>
    </div>
  );
};

export default UsageStats;

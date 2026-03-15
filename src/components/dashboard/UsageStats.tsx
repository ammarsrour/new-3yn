import React from 'react';
import { BarChart3, Target, TrendingUp, Crown } from 'lucide-react';
import { User } from '../../types';

interface UsageStatsProps {
  user: User;
  totalAnalyses?: number;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user, totalAnalyses }) => {
  const usagePercentage = (user.analysesThisMonth / user.maxAnalyses) * 100;

  const stats = [
    {
      label: 'Analyses This Month',
      value: `${user.analysesThisMonth}/${user.maxAnalyses}`,
      icon: BarChart3,
      color: 'emerald',
      bgGradient: 'from-emerald-50 to-green-100',
      percentage: usagePercentage
    },
    {
      label: 'Total Analyses',
      value: (totalAnalyses ?? user.totalAnalyses).toString(),
      icon: Target,
      color: 'emerald',
      bgGradient: 'from-emerald-50 to-emerald-100'
    },
    {
      label: 'Average Score',
      value: user.totalAnalyses > 0 ? '73/100' : '--',
      icon: TrendingUp,
      color: 'green',
      bgGradient: 'from-green-50 to-emerald-100'
    },
    {
      label: 'Current Plan',
      value: user.plan,
      icon: Crown,
      color: 'amber',
      bgGradient: 'from-amber-50 to-orange-100'
    }
  ];

  const getIconBgClass = (stat: typeof stats[0]) => {
    return `bg-gradient-to-br ${stat.bgGradient}`;
  };

  const getIconColorClass = (color: string) => {
    const colors: Record<string, string> = {
      emerald: 'text-emerald-600',
      green: 'text-green-600',
      amber: 'text-amber-600'
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-5 sm:p-6 border border-gray-100 group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${getIconBgClass(stat)} group-hover:scale-105 transition-transform duration-300`}>
              <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${getIconColorClass(stat.color)}`} />
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xl sm:text-2xl font-bold text-gray-900 ltr-numbers">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">{stat.label}</p>
          </div>

          {stat.percentage !== undefined && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Usage</span>
                <span className="ltr-numbers font-medium">{Math.round(stat.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${
                    stat.percentage > 80 ? 'bg-red-500' :
                    stat.percentage > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(stat.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UsageStats;

import React from 'react';
import { BarChart3, Target, TrendingUp, Calendar } from 'lucide-react';
import { User } from '../../types';

interface UsageStatsProps {
  user: User;
}

const UsageStats: React.FC<UsageStatsProps> = ({ user }) => {
  const usagePercentage = (user.analysesThisMonth / user.maxAnalyses) * 100;
  
  const stats = [
    {
      label: 'Analyses This Month',
      value: `${user.analysesThisMonth}/${user.maxAnalyses}`,
      icon: BarChart3,
      color: 'blue',
      percentage: usagePercentage
    },
    {
      label: 'Total Analyses',
      value: user.totalAnalyses.toString(),
      icon: Target,
      color: 'green'
    },
    {
      label: 'Average Score',
      value: '73/100',
      icon: TrendingUp,
      color: 'orange'
    },
    {
      label: 'Plan',
      value: user.plan,
      icon: Calendar,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      orange: 'bg-orange-100 text-orange-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </div>
          
          <div className="mb-2">
            <p className="text-2xl font-bold text-gray-900 ltr-numbers">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>

          {stat.percentage !== undefined && (
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Usage</span>
                <span className="ltr-numbers">{Math.round(stat.percentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stat.percentage > 80 ? 'bg-red-500' : 
                    stat.percentage > 60 ? 'bg-yellow-500' : 'bg-blue-500'
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
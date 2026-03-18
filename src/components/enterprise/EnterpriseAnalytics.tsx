import React, { useState } from 'react';
import { BarChart3, TrendingUp, MapPin, Users, Calendar, Filter } from 'lucide-react';

interface AnalyticsData {
  totalAnalyses: number;
  averageScore: number;
  improvementRate: number;
  clientSatisfaction: number;
  topLocations: Array<{
    location: string;
    count: number;
    averageScore: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    analyses: number;
    score: number;
  }>;
}

const EnterpriseAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'analyses' | 'scores' | 'clients'>('analyses');

  const analyticsData: AnalyticsData = {
    totalAnalyses: 1247,
    averageScore: 73.2,
    improvementRate: 28.5,
    clientSatisfaction: 94.8,
    topLocations: [
      { location: 'Sultan Qaboos Street, Muscat', count: 156, averageScore: 78.5 },
      { location: 'Al Khuwair, Muscat', count: 89, averageScore: 71.2 },
      { location: 'Ruwi Business District', count: 67, averageScore: 75.8 },
      { location: 'Sohar Industrial Area', count: 45, averageScore: 69.3 },
      { location: 'Salalah Tourism Zone', count: 34, averageScore: 82.1 }
    ],
    monthlyTrends: [
      { month: 'Jan', analyses: 98, score: 71.2 },
      { month: 'Feb', analyses: 112, score: 72.8 },
      { month: 'Mar', analyses: 134, score: 74.1 },
      { month: 'Apr', analyses: 156, score: 73.9 },
      { month: 'May', analyses: 189, score: 75.2 },
      { month: 'Jun', analyses: 167, score: 76.8 }
    ]
  };

  const kpiCards = [
    {
      title: 'Total Analyses',
      value: analyticsData.totalAnalyses.toLocaleString(),
      change: '+23%',
      changeType: 'positive' as const,
      icon: BarChart3
    },
    {
      title: 'Average Score',
      value: `${analyticsData.averageScore}/100`,
      change: '+5.2',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Improvement Rate',
      value: `${analyticsData.improvementRate}%`,
      change: '+12%',
      changeType: 'positive' as const,
      icon: TrendingUp
    },
    {
      title: 'Client Satisfaction',
      value: `${analyticsData.clientSatisfaction}%`,
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Users
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 border-b border-surface-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-navy-950 tracking-tight">Enterprise Analytics</h2>
            <p className="text-secondary mt-1">Comprehensive performance insights across all campaigns</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-navy-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="border border-surface-200 px-3 py-2 text-sm focus:ring-2 focus:ring-navy-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-navy-500" />
              <span className="text-sm text-secondary">Updated 5 min ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-200">
        {kpiCards.map((kpi, index) => (
          <div key={index} className="bg-white p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-info-50 flex items-center justify-center">
                <kpi.icon className="w-5 h-5 text-info-600" />
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 ${
                kpi.changeType === 'positive'
                  ? 'text-success-700 bg-success-50'
                  : 'text-danger-700 bg-danger-50'
              }`}>
                {kpi.change}
              </span>
            </div>
            <div>
              <p className="text-2xl text-stat text-navy-950">{kpi.value}</p>
              <p className="text-label mt-1">{kpi.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Performance Trends */}
        <div className="bg-white p-6 border-l-4 border-info-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-navy-950 tracking-tight">Performance Trends</h3>
            <div className="flex">
              {['analyses', 'scores', 'clients'].map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric as any)}
                  className={`px-3 py-1 text-sm font-medium transition-colors ${
                    selectedMetric === metric
                      ? 'bg-navy-950 text-white'
                      : 'bg-surface-100 text-navy-600 hover:bg-surface-200'
                  }`}
                >
                  {metric.charAt(0).toUpperCase() + metric.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Chart Representation */}
          <div className="space-y-3">
            {analyticsData.monthlyTrends.map((trend) => (
              <div key={trend.month} className="flex items-center space-x-4">
                <div className="w-8 text-sm text-secondary">{trend.month}</div>
                <div className="flex-1 bg-surface-100 h-2">
                  <div
                    className="bg-info-500 h-2 transition-all duration-700"
                    style={{
                      width: selectedMetric === 'analyses'
                        ? `${(trend.analyses / 200) * 100}%`
                        : `${trend.score}%`
                    }}
                  ></div>
                </div>
                <div className="w-12 text-sm text-navy-950 font-semibold tabular-nums">
                  {selectedMetric === 'analyses' ? trend.analyses : trend.score}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white p-6 border-l-4 border-success-500">
          <h3 className="text-lg font-bold text-navy-950 tracking-tight mb-6 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-success-600" />
            Top Performing Locations
          </h3>
          <div className="space-y-3">
            {analyticsData.topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-surface-50 border-l-2 border-surface-200">
                <div className="flex-1">
                  <h4 className="font-semibold text-navy-950 text-sm">{location.location}</h4>
                  <p className="text-xs text-secondary">{location.count} analyses</p>
                </div>
                <div className="text-right">
                  <div className="text-lg text-stat text-success-600">{location.averageScore}</div>
                  <div className="text-label">Avg Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Performance Map Placeholder */}
      <div className="bg-white p-6 border-l-4 border-navy-950">
        <h3 className="text-lg font-bold text-navy-950 tracking-tight mb-6">Geographic Performance</h3>
        <div className="bg-surface-50 p-12 text-center">
          <MapPin className="w-12 h-12 text-navy-300 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-navy-950 mb-2">Interactive Map Coming Soon</h4>
          <p className="text-secondary">Visualize billboard performance across Oman with heat maps and location insights</p>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseAnalytics;

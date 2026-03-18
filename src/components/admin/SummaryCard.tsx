import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'info' | 'success' | 'warning' | 'danger';
}

const colorClasses = {
  info: {
    bg: 'bg-info-50',
    text: 'text-info-600',
    border: 'border-info-500'
  },
  success: {
    bg: 'bg-success-50',
    text: 'text-success-600',
    border: 'border-success-500'
  },
  warning: {
    bg: 'bg-warning-50',
    text: 'text-warning-600',
    border: 'border-warning-500'
  },
  danger: {
    bg: 'bg-danger-50',
    text: 'text-danger-600',
    border: 'border-danger-500'
  }
};

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, icon: Icon, color }) => {
  const colors = colorClasses[color];

  return (
    <div className={`bg-white p-6 border-l-4 ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-label mb-1">{title}</p>
          <p className="text-3xl text-stat text-navy-950">{value.toLocaleString()}</p>
        </div>
        <div className={`${colors.bg} p-3`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;

import React, { useState } from 'react';

export interface BrandAnalysisData {
  category: string;
  targetAge: string;
  campaignGoal: string;
  budgetRange: string;
}

interface BrandAnalysisFormProps {
  onAnalysisChange: (data: BrandAnalysisData) => void;
}

const BrandAnalysisForm: React.FC<BrandAnalysisFormProps> = ({ onAnalysisChange }) => {
  const [formData, setFormData] = useState<BrandAnalysisData>({
    category: '',
    targetAge: '',
    campaignGoal: '',
    budgetRange: ''
  });

  const handleChange = (field: keyof BrandAnalysisData, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onAnalysisChange(newData);
  };

  const categories = [
    'Luxury',
    'Family',
    'Tech',
    'B2B',
    'Traditional',
    'Food/Beverage',
    'Automotive',
    'Real Estate'
  ];

  const ageGroups = [
    '18-25',
    '26-35',
    '36-45',
    '46-55',
    '55+'
  ];

  const campaignGoals = [
    'Brand Awareness',
    'Product Launch',
    'Sales Drive',
    'Event Promotion'
  ];

  const budgetRanges = [
    'Under $5K',
    '$5K-15K',
    '$15K-50K',
    '$50K+'
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold text-navy-950 mb-4">Brand Analysis</h4>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Brand Category */}
        <div>
          <label className="block text-xs text-secondary mb-1.5">
            Brand Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:ring-1 focus:ring-navy-500 focus:border-navy-500 transition-colors"
          >
            <option value="">Select...</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Target Age Group */}
        <div>
          <label className="block text-xs text-secondary mb-1.5">
            Target Age
          </label>
          <select
            value={formData.targetAge}
            onChange={(e) => handleChange('targetAge', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:ring-1 focus:ring-navy-500 focus:border-navy-500 transition-colors"
          >
            <option value="">Select...</option>
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* Campaign Goal */}
        <div>
          <label className="block text-xs text-secondary mb-1.5">
            Campaign Goal
          </label>
          <select
            value={formData.campaignGoal}
            onChange={(e) => handleChange('campaignGoal', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:ring-1 focus:ring-navy-500 focus:border-navy-500 transition-colors"
          >
            <option value="">Select...</option>
            {campaignGoals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-xs text-secondary mb-1.5">
            Budget Range
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:ring-1 focus:ring-navy-500 focus:border-navy-500 transition-colors"
          >
            <option value="">Select...</option>
            {budgetRanges.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary - subtle, inline */}
      {formData.category && formData.targetAge && formData.campaignGoal && formData.budgetRange && (
        <div className="mt-4 pt-4 border-t border-surface-200 text-sm text-secondary">
          <span className="font-medium text-navy-700">{formData.category}</span>
          <span className="mx-1.5">·</span>
          <span>{formData.targetAge}</span>
          <span className="mx-1.5">·</span>
          <span>{formData.campaignGoal}</span>
          <span className="mx-1.5">·</span>
          <span>{formData.budgetRange}</span>
        </div>
      )}
    </div>
  );
};

export default BrandAnalysisForm;
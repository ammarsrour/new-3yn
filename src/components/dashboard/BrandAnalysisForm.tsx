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
    'Conversion / Sales',
    'Brand Building'
  ];

  const budgetRanges = [
    'Under $5K',
    '$5K-15K',
    '$15K-50K',
    '$50K+'
  ];

  return (
    <fieldset>
      <legend className="text-sm font-semibold text-navy-950 mb-4">Brand Analysis</legend>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Brand Category */}
        <div>
          <label htmlFor="brand-category" className="block text-xs text-secondary mb-1.5">
            Brand Category
          </label>
          <select
            id="brand-category"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors min-h-[44px]"
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
          <label htmlFor="target-age" className="block text-xs text-secondary mb-1.5">
            Target Age
          </label>
          <select
            id="target-age"
            value={formData.targetAge}
            onChange={(e) => handleChange('targetAge', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors min-h-[44px]"
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
          <label htmlFor="campaign-goal" className="block text-xs text-secondary mb-1.5">
            Campaign Goal
          </label>
          <select
            id="campaign-goal"
            value={formData.campaignGoal}
            onChange={(e) => handleChange('campaignGoal', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors min-h-[44px]"
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
          <label htmlFor="budget-range" className="block text-xs text-secondary mb-1.5">
            Budget Range
          </label>
          <select
            id="budget-range"
            value={formData.budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full px-3 py-2 text-sm border border-surface-200 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-colors min-h-[44px]"
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
        <div className="mt-4 pt-4 border-t border-surface-200 text-sm text-secondary" role="status" aria-live="polite">
          <span className="sr-only">Selected options: </span>
          <span className="font-medium text-navy-700">{formData.category}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{formData.targetAge}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{formData.campaignGoal}</span>
          <span className="mx-1.5" aria-hidden="true">·</span>
          <span>{formData.budgetRange}</span>
        </div>
      )}
    </fieldset>
  );
};

export default BrandAnalysisForm;
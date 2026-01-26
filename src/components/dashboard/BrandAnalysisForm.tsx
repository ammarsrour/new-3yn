import React, { useState } from 'react';
import { Building2, Users, Target, DollarSign, TrendingUp } from 'lucide-react';

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
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
        <Building2 className="w-5 h-5 mr-2" />
        Brand Analysis
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Brand Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Target className="w-4 h-4 inline mr-2" />
            Brand Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select category...</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Target Age Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Users className="w-4 h-4 inline mr-2" />
            Target Age Group
          </label>
          <select
            value={formData.targetAge}
            onChange={(e) => handleChange('targetAge', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select age group...</option>
            {ageGroups.map((age) => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* Campaign Goal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Campaign Goal
          </label>
          <select
            value={formData.campaignGoal}
            onChange={(e) => handleChange('campaignGoal', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select goal...</option>
            {campaignGoals.map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <DollarSign className="w-4 h-4 inline mr-2" />
            Budget Range
          </label>
          <select
            value={formData.budgetRange}
            onChange={(e) => handleChange('budgetRange', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">Select budget...</option>
            {budgetRanges.map((budget) => (
              <option key={budget} value={budget}>
                {budget}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Analysis Summary */}
      {formData.category && formData.targetAge && formData.campaignGoal && formData.budgetRange && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Brand Profile Summary</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-blue-700">Category:</span>
              <span className="text-blue-800 ml-2">{formData.category}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Target Age:</span>
              <span className="text-blue-800 ml-2">{formData.targetAge}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Goal:</span>
              <span className="text-blue-800 ml-2">{formData.campaignGoal}</span>
            </div>
            <div>
              <span className="font-medium text-blue-700">Budget:</span>
              <span className="text-blue-800 ml-2">{formData.budgetRange}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandAnalysisForm;
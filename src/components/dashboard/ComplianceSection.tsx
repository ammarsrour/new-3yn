import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

interface ComplianceSectionProps {
  score: number;
  arabicTextDetected?: boolean;
  culturalCompliance?: string;
  location: string;
}

const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  score,
  arabicTextDetected,
  culturalCompliance,
  location
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const complianceChecks = [
    {
      id: 'mtcit',
      title: t('compliance.mtcit'),
      status: arabicTextDetected ? 'passed' : 'warning',
      description: arabicTextDetected
        ? 'Arabic text detected and analyzed for MTCIT compliance'
        : 'No Arabic text detected - may require Arabic content per MTCIT guidelines'
    },
    {
      id: 'tra',
      title: t('compliance.tra'),
      status: score >= 70 ? 'passed' : 'warning',
      description: score >= 70
        ? 'Billboard meets TRA readability standards'
        : 'Billboard may not meet TRA minimum readability requirements'
    },
    {
      id: 'cultural',
      title: t('compliance.arabicContent'),
      status: culturalCompliance === 'appropriate' ? 'passed' : 'review',
      description: culturalCompliance === 'appropriate'
        ? 'Content reviewed and deemed culturally appropriate'
        : 'Content requires cultural sensitivity review'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'review':
        return <FileText className="w-5 h-5 text-info-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-navy-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-success-50 border-l-4 border-success-500';
      case 'warning':
        return 'bg-warning-50 border-l-4 border-warning-500';
      case 'review':
        return 'bg-info-50 border-l-4 border-info-500';
      default:
        return 'bg-surface-50 border-l-4 border-surface-300';
    }
  };

  return (
    <div className="bg-white border-l-4 border-navy-950 p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Shield className="w-6 h-6 text-info-500" />
        <h3 className="text-xl font-semibold text-navy-950 tracking-tight">
          {t('compliance.title')}
        </h3>
      </div>

      <div className="space-y-4">
        {complianceChecks.map((check) => (
          <div
            key={check.id}
            className={`p-4 ${getStatusColor(check.status)}`}
          >
            <div className="flex items-start space-x-3">
              {getStatusIcon(check.status)}
              <div className="flex-1">
                <h4 className="font-semibold text-navy-950 mb-1">
                  {check.title}
                </h4>
                <p className="text-sm text-secondary">
                  {check.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MENA-Specific Recommendations */}
      <div className="mt-6 bg-surface-50 border-l-4 border-success-500 p-4">
        <h4 className="font-semibold text-navy-950 mb-3">
          {isArabic ? 'توصيات خاصة بسوق عُمان' : 'Oman Market Recommendations'}
        </h4>
        <ul className="space-y-2 text-sm text-navy-700">
          <li className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-success-500 mt-2 flex-shrink-0"></span>
            <span>{t('compliance.recommendations.arabicPercentage')}</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-info-500 mt-2 flex-shrink-0"></span>
            <span>{t('compliance.recommendations.trademark')}</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="w-1.5 h-1.5 bg-navy-500 mt-2 flex-shrink-0"></span>
            <span>{t('compliance.recommendations.culturalSensitivity')}</span>
          </li>
        </ul>
      </div>

      {/* Regional Badge */}
      {location.includes('Oman') || location.includes('عُمان') || location.includes('مسقط') && (
        <div className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium bg-success-100 text-success-800">
          <span className="mr-2">🇴🇲</span>
          {isArabic ? 'متخصص في السوق العُماني' : 'Oman Market Specialist'}
        </div>
      )}
    </div>
  );
};

export default ComplianceSection;

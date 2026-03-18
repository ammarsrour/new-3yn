import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Target, FileText, MapPin } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const features = [
    {
      icon: Zap,
      title: t('features.instant.title'),
      description: t('features.instant.description'),
      stat: '30s',
      statLabel: 'Average analysis time'
    },
    {
      icon: Target,
      title: t('features.distance.title'),
      description: t('features.distance.description'),
      stat: '50-150m',
      statLabel: 'Distance simulation'
    },
    {
      icon: FileText,
      title: t('features.reports.title'),
      description: t('features.reports.description'),
      stat: 'PDF',
      statLabel: 'Export ready'
    },
    {
      icon: MapPin,
      title: t('features.location.title'),
      description: t('features.location.description'),
      stat: '100+',
      statLabel: 'Oman locations'
    }
  ];

  return (
    <section id="features" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header - left aligned for confidence */}
        <div className={`max-w-3xl mb-24 ${isArabic ? 'mr-0 ml-auto text-right' : ''}`}>
          <p className="text-label text-success-600 mb-4">
            Capabilities
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-950 tracking-tight leading-tight mb-6">
            {t('features.titleHighlight')}
            <br />
            <span className="text-success-600">Intelligent Analysis</span>
          </h2>
          <p className="text-lead">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Asymmetric feature layout - break the grid */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Hero feature - takes more space */}
          <div className={`lg:col-span-7 bg-navy-950 p-10 lg:p-14 border-l-4 border-success-500 ${isArabic ? 'text-right' : ''}`}>
            <div className="flex items-start justify-between mb-8">
              <Zap className={`w-10 h-10 text-success-400 ${isArabic ? 'order-2' : ''}`} />
              <span className="text-success-400 text-6xl lg:text-7xl text-stat tabular-nums">{features[0].stat}</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">{features[0].title}</h3>
            <p className="text-slate-300 text-lg leading-relaxed mb-4 max-w-none">{features[0].description}</p>
            <p className="text-label text-slate-500">{features[0].statLabel}</p>
          </div>

          {/* Secondary feature */}
          <div className={`lg:col-span-5 bg-surface-100 p-10 lg:p-14 border-l-4 border-info-500 ${isArabic ? 'text-right' : ''}`}>
            <div className="flex items-start justify-between mb-8">
              <Target className={`w-8 h-8 text-info-600 ${isArabic ? 'order-2' : ''}`} />
              <span className="text-info-600 text-5xl text-stat tabular-nums">{features[1].stat}</span>
            </div>
            <h3 className="text-xl lg:text-2xl font-bold text-navy-950 mb-3 tracking-tight">{features[1].title}</h3>
            <p className="text-body mb-3 max-w-none">{features[1].description}</p>
            <p className="text-label text-slate-500">{features[1].statLabel}</p>
          </div>

          {/* Bottom row - two equal columns */}
          <div className={`lg:col-span-5 bg-white border-l-4 border-warning-500 p-10 ${isArabic ? 'text-right' : ''}`}>
            <div className="flex items-start justify-between mb-6">
              <FileText className={`w-8 h-8 text-warning-600 ${isArabic ? 'order-2' : ''}`} />
              <span className="text-warning-600 text-4xl text-stat tabular-nums">{features[2].stat}</span>
            </div>
            <h3 className="text-xl font-bold text-navy-950 mb-3 tracking-tight">{features[2].title}</h3>
            <p className="text-body mb-3 max-w-none">{features[2].description}</p>
            <p className="text-label text-slate-500">{features[2].statLabel}</p>
          </div>

          <div className={`lg:col-span-7 bg-white border-l-4 border-success-500 p-10 ${isArabic ? 'text-right' : ''}`}>
            <div className="flex items-start justify-between mb-6">
              <MapPin className={`w-8 h-8 text-success-600 ${isArabic ? 'order-2' : ''}`} />
              <span className="text-success-600 text-4xl text-stat tabular-nums">{features[3].stat}</span>
            </div>
            <h3 className="text-xl font-bold text-navy-950 mb-3 tracking-tight">{features[3].title}</h3>
            <p className="text-body mb-3 max-w-none">{features[3].description}</p>
            <p className="text-label text-slate-500">{features[3].statLabel}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

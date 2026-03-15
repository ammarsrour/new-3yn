import React from 'react';
import { useTranslation } from 'react-i18next';
import { Zap, Target, FileText, MapPin } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Zap,
      title: t('features.instant.title'),
      description: t('features.instant.description')
    },
    {
      icon: Target,
      title: t('features.distance.title'),
      description: t('features.distance.description')
    },
    {
      icon: FileText,
      title: t('features.reports.title'),
      description: t('features.reports.description')
    },
    {
      icon: MapPin,
      title: t('features.location.title'),
      description: t('features.location.description')
    }
  ];

  return (
    <section id="features" className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 tracking-tight">
            {t('features.titleHighlight')}
            <span className="text-emerald-500"> Intelligent Optimisation</span>
          </h2>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-emerald-200 transition-all duration-300 group hover:shadow-lg hover:shadow-emerald-500/5"
            >
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gray-800 transition-colors duration-300">
                <feature.icon className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ArrowRight } from 'lucide-react';
import { toArabicNumerals } from '../../utils/arabicNumbers';

interface PricingSectionProps {
  onGetStarted: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({ onGetStarted }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const plans = [
    {
      name: t('pricing.starter.name'),
      price: t('pricing.starter.price'),
      description: t('pricing.starter.description'),
      features: t('pricing.starter.features', { returnObjects: true }) as string[],
      popular: false
    },
    {
      name: t('pricing.professional.name'),
      price: t('pricing.professional.price'),
      description: t('pricing.professional.description'),
      features: t('pricing.professional.features', { returnObjects: true }) as string[],
      popular: true
    },
    {
      name: t('pricing.enterprise.name'),
      price: t('pricing.enterprise.price'),
      description: t('pricing.enterprise.description'),
      features: t('pricing.enterprise.features', { returnObjects: true }) as string[],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#0f2942]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className={`max-w-2xl mb-20 ${isArabic ? 'mr-0 ml-auto text-right' : ''}`}>
          <p className="text-label text-success-400 mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed max-w-none">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing grid - clean 3-column layout */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className={`bg-navy-800 p-8 flex flex-col ${isArabic ? 'text-right' : ''}`}>
            <h3 className="text-base font-semibold text-slate-400 mb-4">{plans[0].name}</h3>
            <div className="mb-6">
              <span className="text-4xl text-stat text-white tabular-nums">
                {isArabic ? toArabicNumerals(plans[0].price) : plans[0].price}
              </span>
              <span className="text-slate-500 text-sm ml-1">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8">{plans[0].description}</p>
            <ul className="space-y-3 mb-8 flex-grow">
              {plans[0].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-sm text-slate-300`}>
                  <Check className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors mt-auto"
            >
              {t('pricing.getStarted')}
            </button>
          </div>

          {/* Professional - featured */}
          <div className={`bg-white p-8 flex flex-col relative ring-2 ring-success-500 ${isArabic ? 'text-right' : ''}`}>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="bg-success-500 text-white text-xs font-semibold px-4 py-1.5 uppercase tracking-wide">
                {t('pricing.popular')}
              </span>
            </div>
            <h3 className="text-base font-semibold text-success-600 mb-4 mt-2">{plans[1].name}</h3>
            <div className="mb-6">
              <span className="text-5xl text-stat text-navy-950 tabular-nums">
                {isArabic ? toArabicNumerals(plans[1].price) : plans[1].price}
              </span>
              <span className="text-slate-500 ml-1">/mo</span>
            </div>
            <p className="text-sm text-slate-600 mb-8">{plans[1].description}</p>
            <ul className="space-y-3 mb-8 flex-grow">
              {plans[1].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-sm text-navy-950`}>
                  <Check className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className={`w-full py-3 bg-navy-950 text-white font-semibold hover:bg-navy-800 transition-colors flex items-center justify-center ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 group mt-auto`}
            >
              <span>{t('pricing.getStarted')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Enterprise */}
          <div className={`bg-navy-800 p-8 flex flex-col ${isArabic ? 'text-right' : ''}`}>
            <h3 className="text-base font-semibold text-slate-400 mb-4">{plans[2].name}</h3>
            <div className="mb-6">
              <span className="text-4xl text-stat text-white tabular-nums">
                {isArabic ? toArabicNumerals(plans[2].price) : plans[2].price}
              </span>
              <span className="text-slate-500 text-sm ml-1">/mo</span>
            </div>
            <p className="text-sm text-slate-400 mb-8">{plans[2].description}</p>
            <ul className="space-y-3 mb-8 flex-grow">
              {plans[2].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-sm text-slate-300`}>
                  <Check className="w-4 h-4 text-success-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors mt-auto"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

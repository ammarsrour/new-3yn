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
          <p className="text-label text-emerald-400 mb-4">
            Pricing
          </p>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-slate-400 leading-relaxed max-w-none">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing grid - popular plan is larger */}
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-0 items-end">
          {/* Starter - compact */}
          <div className={`lg:col-span-3 bg-navy-800 p-8 lg:p-10 ${isArabic ? 'text-right' : ''}`}>
            <h3 className="text-base font-semibold text-slate-400 mb-4">{plans[0].name}</h3>
            <div className="mb-6">
              <span className="text-4xl text-stat text-white tabular-nums">
                {isArabic ? toArabicNumerals(plans[0].price) : plans[0].price}
              </span>
              <span className="text-slate-500 text-sm ml-1">/mo</span>
            </div>
            <p className="text-secondary text-slate-400 mb-8 max-w-none">{plans[0].description}</p>
            <ul className="space-y-3 mb-8">
              {plans[0].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-sm text-slate-300`}>
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
            >
              {t('pricing.getStarted')}
            </button>
          </div>

          {/* Professional - hero pricing */}
          <div className={`lg:col-span-6 bg-white p-10 lg:p-14 lg:-my-8 relative z-10 ${isArabic ? 'text-right' : ''}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-label text-emerald-600">{plans[1].name}</h3>
              <span className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1 uppercase tracking-wide">
                {t('pricing.popular')}
              </span>
            </div>
            <div className="mb-6">
              <span className="text-6xl lg:text-7xl text-stat text-navy-950 tabular-nums">
                {isArabic ? toArabicNumerals(plans[1].price) : plans[1].price}
              </span>
              <span className="text-slate-500 ml-2">/mo</span>
            </div>
            <p className="text-lg text-body mb-10 max-w-none">{plans[1].description}</p>
            <ul className="space-y-4 mb-10">
              {plans[1].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-3 text-navy-950`}>
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className={`w-full py-4 bg-navy-950 text-white font-semibold hover:bg-navy-800 transition-colors flex items-center justify-center ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 group`}
            >
              <span>{t('pricing.getStarted')}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Enterprise - compact */}
          <div className={`lg:col-span-3 bg-navy-800 p-8 lg:p-10 ${isArabic ? 'text-right' : ''}`}>
            <h3 className="text-base font-semibold text-slate-400 mb-4">{plans[2].name}</h3>
            <div className="mb-6">
              <span className="text-4xl text-stat text-white tabular-nums">
                {isArabic ? toArabicNumerals(plans[2].price) : plans[2].price}
              </span>
              <span className="text-slate-500 text-sm ml-1">/mo</span>
            </div>
            <p className="text-secondary text-slate-400 mb-8 max-w-none">{plans[2].description}</p>
            <ul className="space-y-3 mb-8">
              {plans[2].features.map((feature, idx) => (
                <li key={idx} className={`flex items-start ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-2 text-sm text-slate-300`}>
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onGetStarted}
              className="w-full py-3 border border-slate-600 text-slate-300 font-medium hover:bg-slate-700 hover:text-white transition-colors"
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

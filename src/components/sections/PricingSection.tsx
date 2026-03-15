import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Star } from 'lucide-react';
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
    <section id="pricing" className="relative py-24 bg-gray-950 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 tracking-tight">
            {t('pricing.title')}
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border transition-all duration-300 overflow-hidden ${
                plan.popular
                  ? 'ring-2 ring-emerald-500 border-emerald-500/50 scale-105'
                  : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className={`bg-emerald-500 text-gray-950 text-center py-3 font-bold text-sm flex items-center justify-center ${isArabic ? 'space-x-reverse' : ''} space-x-2`}>
                  <Star className="w-4 h-4" />
                  <span>{t('pricing.popular')}</span>
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>

                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">
                    {isArabic ? toArabicNumerals(plan.price) : plan.price}
                  </span>
                  <span className="text-gray-400 mx-2">
                    {isArabic ? 'ر.ع' : '$'}
                  </span>
                  <span className="text-gray-500">{t('')}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className={`flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-3`}>
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onGetStarted}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-emerald-500 text-gray-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20'
                      : 'border border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {t('pricing.getStarted')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

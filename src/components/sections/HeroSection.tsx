import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <section className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 py-32 overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-100"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px'
        }}
      />

      {/* Subtle emerald glow behind heading */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Tagline pill */}
          <div className="inline-flex items-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full mb-8">
            <span className="text-emerald-400 text-sm font-medium">
              {t('hero.tagline')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            {t('hero.title')}
            <span className="text-emerald-400 block mt-2">
              {t('hero.titleHighlight')}
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 ${isArabic ? 'sm:space-x-reverse' : ''} sm:space-x-4`}>
            <button
              onClick={onGetStarted}
              className={`bg-emerald-500 hover:bg-emerald-400 text-gray-950 px-8 py-4 rounded-xl transition-all duration-200 font-bold text-lg flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-2 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transform hover:-translate-y-0.5`}
            >
              <span>{t('hero.uploadButton')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;

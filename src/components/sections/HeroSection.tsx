import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { toArabicNumerals } from '../../utils/arabicNumbers';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {t('hero.title')}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent block">
              {t('hero.titleHighlight')}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="bg-purple-50 px-8 py-4 rounded-xl inline-block mb-12">
            <p className="text-gray-800 font-bold text-lg">
              {t('hero.tagline')}
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 ${isArabic ? 'sm:space-x-reverse' : ''} sm:space-x-4`}>
            <button
              onClick={onGetStarted}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-semibold text-lg flex items-center ${isArabic ? 'space-x-reverse' : ''} space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
            >
              <span>{t('hero.uploadButton')}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            
          </div>
        </div>
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </section>
  );
};

export default HeroSection;
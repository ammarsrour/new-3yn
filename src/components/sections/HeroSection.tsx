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
    <section className="relative bg-slate-50 min-h-[90vh] flex items-center overflow-hidden">
      {/* Dramatic navy accent block - asymmetric */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#0f2942] hidden lg:block" />

      {/* Subtle grid for texture - not the AI slop version */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230f2942' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 lg:py-0">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left content - takes 7 columns */}
          <div className={`lg:col-span-7 ${isArabic ? 'lg:order-2 text-right' : ''}`}>
            {/* Tagline - label style */}
            <p className="text-label text-navy-950 mb-6">
              {t('hero.tagline')}
            </p>

            {/* Display headline - fluid sizing for marketing page */}
            <h1 className="text-navy-950 mb-8">
              <span className="block text-display tracking-tighter">
                {t('hero.title')}
              </span>
              <span className="block text-display tracking-tighter text-emerald-600 mt-1">
                {t('hero.titleHighlight')}
              </span>
            </h1>

            {/* Lead text */}
            <p className="text-lead mb-12 max-w-xl">
              {t('hero.subtitle')}
            </p>

            {/* CTA button */}
            <button
              onClick={onGetStarted}
              className={`group inline-flex items-center bg-navy-950 text-white px-10 py-5 transition-colors duration-300 font-semibold text-lg hover:bg-navy-800 ${isArabic ? 'flex-row-reverse space-x-reverse' : ''} space-x-3`}
            >
              <span>{t('hero.uploadButton')}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            {/* Trust signal */}
            <p className="mt-8 text-secondary">
              Trusted by leading agencies across the GCC
            </p>
          </div>

          {/* Right side - visual element on navy background (desktop) */}
          <div className={`lg:col-span-5 hidden lg:flex items-center justify-center relative z-10 ${isArabic ? 'lg:order-1' : ''}`}>
            {/* The eye logo as a bold graphic element */}
            <div className="relative">
              <img
                src="/3yn eye.png"
                alt="3YN"
                className="w-48 h-48 xl:w-64 xl:h-64 object-contain filter invert opacity-90"
              />
              {/* Score preview - stat typography */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 shadow-2xl">
                <p className="text-label mb-1">Readability Score</p>
                <p className="text-5xl text-stat text-emerald-600 tabular-nums">87</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

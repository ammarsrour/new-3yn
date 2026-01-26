import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
    
    // Update document direction and font
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    
    // Apply Arabic font family
    if (newLang === 'ar') {
      document.body.style.fontFamily = '"Cairo", "Tajawal", "Amiri", "Noto Sans Arabic", sans-serif';
    } else {
      document.body.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    }
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 border border-gray-200"
      title={i18n.language === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
    >
      <Languages className="w-4 h-4" />
      <span className="font-semibold">
        {i18n.language === 'ar' ? (
          <span className="ltr-numbers">English</span>
        ) : (
          <span>العربية</span>
        )}
      </span>
    </button>
  );
};

export default LanguageToggle;
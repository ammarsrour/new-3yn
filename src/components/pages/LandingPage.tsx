import React from 'react';
import HeroSection from '../sections/HeroSection';
import FeaturesSection from '../sections/FeaturesSection';
import PricingSection from '../sections/PricingSection';
import ContactSection from '../sections/ContactSection';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={onGetStarted} />
      <FeaturesSection />
      <PricingSection onGetStarted={onGetStarted} />
      <ContactSection />
    </div>
  );
};

export default LandingPage;
import React from 'react';
import LandingNavbar from '../components/Landing/LandingNavbar';
import HeroSection from '../components/Landing/HeroSection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import WorkflowSection from '../components/Landing/WorkflowSection';
import HowItWorks from '../components/Landing/HowItWorks';
import BenefitsSection from '../components/Landing/BenefitsSection';
import CTASection from '../components/Landing/CTASection';
import ContactSection from '../components/Landing/ContactSection';
import LandingFooter from '../components/Landing/LandingFooter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <LandingNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <WorkflowSection />
        <HowItWorks />
        <BenefitsSection />
        <CTASection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Home;

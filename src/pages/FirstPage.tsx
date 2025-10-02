// import React from 'react';
import Header from '../components/FirstPage/Header';
import Hero from '../components/FirstPage/Hero';
import QuickStats from '../components/FirstPage/QuickStats';
import InsuranceProducts from '../components/FirstPage/InsuranceProducts';
import BranchNetwork from '../components/FirstPage/BranchNetwork';
import AboutSection from '../components/FirstPage/AboutSection';
import BoardOfDirectors from '../components/FirstPage/BoardOfDirectors';
import ExecutiveManagement from '../components/FirstPage/ExecutiveManagement';
import ServicesFeatures from '../components/FirstPage/ServicesFeatures';
import ContactSection from '../components/FirstPage/ContactSection';
import Footer from '../components/FirstPage/Footer';

function FirstPage() {
  return (
    <div className="bg-white">
      <Header />
      <Hero />
      <QuickStats />
      <InsuranceProducts />
      <BranchNetwork />
      <AboutSection />
      <BoardOfDirectors />
      <ExecutiveManagement />
      <ServicesFeatures />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default FirstPage;
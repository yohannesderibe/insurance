import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="hero-bg relative min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent"></div>
      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Protecting Your Future with
              <span className="text-primary"> Trusted Insurance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              For over 25 years, NIB Insurance has been Ethiopia's leading
              insurance provider, offering comprehensive coverage for
              individuals and businesses across the nation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-8 py-4 rounded-button whitespace-nowrap text-lg font-semibold hover:bg-blue-700 transition-colors">
                Get Insurance Quote
              </button>
              <button className="border-2 border-primary text-primary px-8 py-4 rounded-button whitespace-nowrap text-lg font-semibold hover:bg-primary hover:text-white transition-colors">
                Find Nearest Branch
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { AccessTime, Support, Smartphone, Security, Place } from '@mui/icons-material';

interface Feature {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

const ServicesFeatures: React.FC = () => {
  const features: Feature[] = [
    {
      icon: <AccessTime fontSize="large" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-primary',
      title: 'Quick Claims Processing',
      description: 'Fast and efficient claims settlement with our streamlined digital process'
    },
    {
      icon: <Support fontSize="large" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      title: '24/7 Customer Support',
      description: 'Round-the-clock customer service through multiple channels'
    },
    {
      icon: <Smartphone fontSize="large" />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      title: 'Digital Services',
      description: 'Manage your policies online with our user-friendly digital platform'
    },
    {
      icon: <Security fontSize="large" />,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Comprehensive Coverage',
      description: 'Wide range of insurance products to meet all your protection needs'
    },
    {
      icon: <Place fontSize="large" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Nationwide Network',
      description: '85+ branches across Ethiopia for convenient access to our services'
    },
    // {
    //   icon: <Award fontSize="large" />,
    //   bgColor: 'bg-indigo-100',
    //   iconColor: 'text-indigo-600',
    //   title: 'Award Winning',
    //   description: 'Recognized for excellence in insurance services and customer satisfaction'
    // }
  ];

  return (
    <section className="py-20 bg-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose NIB Insurance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the difference with our comprehensive services and customer-first approach
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <div className={feature.iconColor}>
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesFeatures;
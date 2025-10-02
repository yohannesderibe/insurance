import React from 'react';
import { Check } from '@mui/icons-material';

interface Feature {
  title: string;
  description: string;
}

const AboutSection: React.FC = () => {
  const features: Feature[] = [
    {
      title: 'Licensed & Regulated',
      description: 'Fully licensed by the National Bank of Ethiopia'
    },
    {
      title: 'Financial Strength',
      description: 'Strong capital base and excellent solvency ratio'
    },
    {
      title: 'Customer Focus',
      description: '98% customer satisfaction and claims settlement rate'
    }
  ];

  return (
    <section className="py-20" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About NIB Insurance
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Established in 1999, NIB Insurance Company S.C. has grown to
              become one of Ethiopia's most trusted insurance providers. We are
              committed to providing innovative insurance solutions that protect
              what matters most to our customers.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              With our extensive branch network and dedicated team of
              professionals, we serve over 500,000 customers across Ethiopia,
              offering comprehensive coverage and exceptional customer service.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-6 h-6 flex items-center justify-center mt-1 mr-3">
                    <Check className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://readdy.ai/api/search-image?query=Professional%20Ethiopian%20insurance%20office%20interior%20with%20modern%20glass%20architecture%2C%20diverse%20team%20of%20insurance%20professionals%20working%20together%2C%20natural%20lighting%20through%20large%20windows%2C%20contemporary%20furniture%20and%20technology%2C%20welcoming%20customer%20service%20area%2C%20corporate%20atmosphere%20with%20Ethiopian%20cultural%20elements&width=600&height=400&seq=about-001&orientation=landscape"
              alt="NIB Insurance Office"
              className="rounded-xl shadow-lg object-cover w-full h-96"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
import React from 'react';
import { DirectionsCar, Favorite, LocalHospital, Business } from '@mui/icons-material';

interface Product {
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  title: string;
  description: string;
}

const InsuranceProducts: React.FC = () => {
  const products: Product[] = [
    {
      icon: <DirectionsCar fontSize="large" />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-primary',
      title: 'Motor Insurance',
      description: 'Comprehensive coverage for your vehicles including third party, comprehensive, and commercial vehicle insurance.'
    },
    {
      icon: <Favorite fontSize="large" />,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      title: 'Life Insurance',
      description: 'Secure your family\'s future with our comprehensive life insurance policies and investment plans.'
    },
    {
      icon: <LocalHospital fontSize="large" />,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      title: 'Health Insurance',
      description: 'Quality healthcare coverage for individuals and families with extensive hospital network.'
    },
    {
      icon: <Business fontSize="large" />,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      title: 'Property Insurance',
      description: 'Protect your home, office, and business assets against fire, theft, and natural disasters.'
    }
  ];

  return (
    <section className="py-20" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Insurance Products
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive insurance solutions tailored to meet your personal and business needs
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 border border-gray-100">
              <div className={`w-16 h-16 ${product.bgColor} rounded-lg flex items-center justify-center mb-6`}>
                <div className={product.iconColor}>
                  {product.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{product.title}</h3>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <button className="text-primary font-semibold hover:text-blue-700 transition-colors">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InsuranceProducts;
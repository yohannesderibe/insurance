import React from 'react';
import { Facebook, Twitter, LinkedIn, Instagram, Send, Place, Phone, Email } from '@mui/icons-material';

const Footer: React.FC = () => {
  const products = [
    'Motor Insurance',
    'Life Insurance',
    'Health Insurance',
    'Property Insurance',
    'Travel Insurance',
    'Marine Insurance'
  ];

  const services = [
    'Claims Processing',
    'Policy Management',
    'Customer Portal',
    'Branch Locator',
    'FAQ',
    'Download Forms'
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="font-['Pacifico'] text-2xl text-white font-bold mb-4">
              NIB Insurance
            </div>
            <p className="text-gray-300 mb-6">
              Ethiopia's trusted insurance partner for over 25 years, protecting
              what matters most to you.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Facebook className="text-lg" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Twitter className="text-lg" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <LinkedIn className="text-lg" />
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <Instagram className="text-lg" />
              </div>
            </div>
          </div>
          
          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Insurance Products</h3>
            <ul className="space-y-3">
              {products.map((product, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <Place className="w-5 h-5 mt-1 mr-3 text-gray-400" />
                <p className="text-gray-300 text-sm">
                  Kirkos Sub City, Woreda 08, House No. 613, Addis Ababa
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <p className="text-gray-300 text-sm">+251-11-551-5747</p>
              </div>
              <div className="flex items-center">
                <Email className="w-5 h-5 mr-3 text-gray-400" />
                <p className="text-gray-300 text-sm">info@nibinsurance.com.et</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="bg-primary px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 NIB Insurance Company S.C. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Regulatory Information</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
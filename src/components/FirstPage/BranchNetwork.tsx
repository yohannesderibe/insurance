import React from 'react';
import { Search, Phone } from '@mui/icons-material';

interface Branch {
  name: string;
  address: string;
  phone: string;
}

const BranchNetwork: React.FC = () => {
  const branches: Branch[] = [
    {
      name: 'Head Office - Addis Ababa',
      address: 'Kirkos Sub City, Woreda 08, House No. 613',
      phone: '+251-11-551-5747'
    },
    {
      name: 'Bole Branch',
      address: 'Bole Sub City, Near Bole International Airport',
      phone: '+251-11-618-2345'
    },
    {
      name: 'Bahir Dar Branch',
      address: 'Bahir Dar City, Near Blue Nile Falls Hotel',
      phone: '+251-58-220-1234'
    },
    {
      name: 'Hawassa Branch',
      address: 'Hawassa City, Tabor Sub City',
      phone: '+251-46-220-5678'
    },
    {
      name: 'Mekelle Branch',
      address: 'Mekelle City, Adi Haki Sub City',
      phone: '+251-34-440-9876'
    }
  ];

  return (
    <section className="py-20 bg-gray-50" id="branches">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Branch Network
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the nearest NIB Insurance branch to you across Ethiopia
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Map */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div 
              className="h-96 bg-cover bg-center"
              style={{ backgroundImage: 'url("https://public.readdy.ai/gen_page/map_placeholder_1280x720.png")' }}
            ></div>
          </div>
          
          {/* Branch List */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Search branches..."
                />
              </div>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {branches.map((branch, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">{branch.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{branch.address}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Phone className="w-4 h-4 mr-1" />
                    {branch.phone}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-primary text-white py-3 rounded-button whitespace-nowrap font-semibold hover:bg-blue-700 transition-colors">
              View All Branches
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BranchNetwork;
import React from 'react';
import { ArrowDropDown, Language, Login, RequestQuote } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import beeLogo from '../../assets/bee-logo.png';
const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={beeLogo} alt="NIB Insurance" className="h-8 w-auto" />
            <div className="font-['Pacifico'] text-xl text-primary font-bold">
              NIB Insurance
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-primary transition-colors">
                Products
                <ArrowDropDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Motor Insurance</a>
                <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Life Insurance</a>
                <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Health Insurance</a>
                <a href="#" className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">Property Insurance</a>
              </div>
            </div>
            <a href="#branches" className="text-gray-700 hover:text-primary transition-colors">Branches</a>
            <a href="#about" className="text-gray-700 hover:text-primary transition-colors">About</a>
            <a href="#contact" className="text-gray-700 hover:text-primary transition-colors">Contact</a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center text-sm text-gray-700 hover:text-primary">
                <Language className="w-4 h-4 mr-1" />
                EN
              </button>
            </div>
            <button className="bg-primary text-white p-2 rounded-full hover:bg-blue-700 transition-colors" title="Get Quote">
              <RequestQuote />
            </button>
            <button
              onClick={() => { navigate('/login') }}
              className="border border-primary text-primary p-2 rounded-full hover:bg-primary hover:text-white transition-colors" title="Login">
              <Login />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
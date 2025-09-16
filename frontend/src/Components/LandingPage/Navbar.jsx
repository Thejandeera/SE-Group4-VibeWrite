import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50 text-white px-4 sm:px-6 lg:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 via-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all duration-300 group-hover:scale-105">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M14.5 2c1.38 0 2.5 1.12 2.5 2.5v15c0 1.38-1.12 2.5-2.5 2.5h-5C8.12 22 7 20.88 7 19.5v-15C7 3.12 8.12 2 9.5 2h5zm-5 2C8.67 4 8 4.67 8 5.5v13c0 .83.67 1.5 1.5 1.5h5c.83 0 1.5-.67 1.5-1.5v-13c0-.83-.67-1.5-1.5-1.5h-5zm1.5 2h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5zm0 2h3c.28 0 .5.22.5.5s-.22.5-.5.5h-3c-.28 0-.5-.22-.5-.5s.22-.5.5-.5z"/>
              </svg>
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">WriteAI</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNav('/features')}
              className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
            >
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => handleNav('/pricing')}
              className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button 
              onClick={() => handleNav('/reviews')}
              className="relative text-gray-300 hover:text-white transition-all duration-300 font-medium group"
            >
              Reviews
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-300 hover:text-white transition-all duration-300 font-medium relative group" onClick={() => handleNav('/signin')}>
              Sign In
              <span className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300 -z-10"></span>
            </button>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 transform" onClick={() => handleNav('/get-started')}>
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="relative w-10 h-10 text-gray-300 hover:text-white transition-all duration-300 focus:outline-none group"
            >
              <div className="absolute inset-0 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              {isMenuOpen ? (
                <X className="h-6 w-6 relative z-10 transform rotate-0 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-800/50 bg-black/60 backdrop-blur-sm">
            <button
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
              onClick={() => handleNav('/features')}
            >
              Features
            </button>
            <button
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
              onClick={() => handleNav('/pricing')}
            >
              Pricing
            </button>
            <button
              className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium"
              onClick={() => handleNav('/reviews')}
            >
              Reviews
            </button>
            <div className="px-3 py-2 space-y-3 border-t border-gray-800/50 mt-3 pt-4">
              <button className="block w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-300 font-medium" onClick={() => handleNav('/signin')}>
                Sign In
              </button>
              <button className="block w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 text-center transform hover:scale-[1.02]" onClick={() => handleNav('/get-started')}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
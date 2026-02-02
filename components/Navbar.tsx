import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { APP_NAME } from '../constants';
import logo from '../assets/logo_white.png';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'The Space', path: '/space' },
    { label: 'Events', path: '/events' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-ark-dark text-white border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex-shrink-0 cursor-pointer">
            <img
              src={logo}
              alt={APP_NAME}
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm tracking-widest uppercase hover:text-ark-gold transition-colors ${location.pathname === item.path ? 'text-ark-gold border-b border-ark-gold pb-1' : 'text-gray-300'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-ark-gold text-ark-dark px-6 py-2 uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-ark-gold">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-ark-dark absolute w-full border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/booking"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 text-base font-bold text-ark-gold hover:text-white hover:bg-white/10"
            >
              BOOK NOW
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
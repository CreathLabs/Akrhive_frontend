import React from 'react';
import { Instagram, Twitter, Linkedin, Mail, MapPin, Facebook } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APP_NAME, ADDRESS } from '../constants';
import logo from '../assets/logo_footer.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-ark-dark text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-1">
            <img
              src={logo}
              alt={APP_NAME}
              className="h-20 w-auto mb-6 object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Your Vision, Our Space. An upscale event infrastructure designed for clarity, elegance, and confidence.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-ark-goldlight">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>{ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} />
                <a href="mailto:hello@arkhive.com" className="hover:text-ark-gold">hello@arkhive.com</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-ark-goldlight">Explore</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/space" className="hover:text-ark-gold">The Space</Link></li>
              <li><Link to="/events" className="hover:text-ark-gold">Upcoming Events</Link></li>
              <li><a href="#" className="hover:text-ark-gold">Usage Guidelines</a></li>wha
              <li><a href="#" className="hover:text-ark-gold">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-4 text-ark-goldlight">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/arkhive.ng/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ark-gold transition-colors"><Instagram size={20} /></a>
              <a href="https://www.facebook.com/arkhiveng" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-ark-gold transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-ark-gold transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-ark-gold transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4 items-center">
            <p>Designed with intentionality.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
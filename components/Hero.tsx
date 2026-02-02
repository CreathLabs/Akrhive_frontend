import React from 'react';
import { Link } from 'react-router-dom';
import { APP_SLOGAN } from '../constants';
import heroImage from '../assets/creathImage-96.jpg';

const Hero: React.FC = () => {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center grayscale"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
      </div>

      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif font-bold mb-6 tracking-tight drop-shadow-lg">
          {APP_SLOGAN}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mb-10 tracking-wide">
          An upscale event infrastructure in Ikota, Lagos. Where premium experiences come to life.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Link
            to="/booking"
            className="px-8 py-4 bg-ark-gold text-ark-dark font-bold text-sm tracking-[0.2em] uppercase hover:bg-white transition-all duration-300"
          >
            Book The Space
          </Link>
          <Link
            to="/events"
            className="px-8 py-4 border border-white text-white font-bold text-sm tracking-[0.2em] uppercase hover:bg-white hover:text-ark-dark transition-all duration-300"
          >
            View Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
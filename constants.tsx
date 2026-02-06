import React from 'react';
import { Wifi, Mic2, Layout, Sun, Zap, Coffee, Car, User } from 'lucide-react';
import { EventItem, Amenity } from './types';

export const APP_NAME = "ArkHive";
export const APP_SLOGAN = "Your Vision, Our Space.";
export const ADDRESS = "Ikota, Lagos State";

export const FEATURED_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Lagos Art & Design Week',
    date: '2023-11-15',
    image: 'https://picsum.photos/800/600?random=1',
    category: 'Exhibition',
    description: 'A showcase of contemporary African art and design thinking.',
    link: "",
    price: 'Free RSVP'
  },
  {
    id: '2',
    title: 'Tech Founders Mixer',
    date: '2023-11-20',
    image: 'https://picsum.photos/800/600?random=2',
    category: 'Networking',
    description: 'Connect with the brightest minds in the Lagos tech ecosystem.',
    link: "",
    price: '₦5,000'
  },
  {
    id: '3',
    title: 'Wellness Yoga Session',
    date: '2023-11-22',
    image: 'https://picsum.photos/800/600?random=3',
    category: 'Wellness',
    description: 'Rejuvenate your mind and body in our serene atrium.',
    link: "",
    price: '₦3,000'
  }
];

export const AMENITIES: Amenity[] = [
  { icon: <Layout className="w-6 h-6" />, title: 'Versatile Layouts', description: 'Transformable space for 50-500 guests.' },
  { icon: <Zap className="w-6 h-6" />, title: 'Uninterrupted Power', description: '24/7 power supply with backup generators.' },
  { icon: <Sun className="w-6 h-6" />, title: 'Mood Lighting', description: 'Flexible lighting configurations.' },
  { icon: <Mic2 className="w-6 h-6" />, title: 'Premium AV', description: 'Professional audio-visual equipment.' },
  { icon: <Wifi className="w-6 h-6" />, title: 'High-Speed Wi-Fi', description: 'Dedicated fiber optic internet for seamless connectivity.' },
  { icon: <Coffee className="w-6 h-6" />, title: 'Catering Prep', description: 'Dedicated kitchenette and vendor staging area.' },
  { icon: <Car className="w-6 h-6" />, title: 'Ample Parking', description: 'Ample parking for guests and vendors.' },
  { icon: <User className="w-6 h-6" />, title: 'On-site Support', description: 'On-site support staff.' },
];
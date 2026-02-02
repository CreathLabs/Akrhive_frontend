import React from 'react';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  link: string;
  image: string;
  category: string;
  description: string;
  price?: string;
}

export interface BookingRequest {
  id: string;
  eventType: string;
  customEventType?: string;
  date: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'archived';
}

export interface Amenity {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
}
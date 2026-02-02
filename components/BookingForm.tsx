import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookingRequest } from '../types';
import { saveBooking } from '../services/storage';

const BookingForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialDate = searchParams.get('date');
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<BookingRequest>({
    name: '',
    email: '',
    phone: '',
    eventType: 'Corporate',
    customEventType: '',
    date: initialDate || '',
    guests: 0,
    notes: '',
    status: 'pending'
  });

  const [isCustomEvent, setIsCustomEvent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialDate) {
      setFormData(prev => ({ ...prev, date: initialDate }));
    }
  }, [initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'eventType') {
      if (value === 'Other') {
        setIsCustomEvent(true);
      } else {
        setIsCustomEvent(false);
      }
    }

    // Parse guests as number
    const finalValue = name === 'guests' ? parseInt(value, 10) || 0 : value;

    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the payload
    const newBooking: BookingRequest = {
      ...formData
    };

    try {
      await saveBooking(newBooking);
    }
    catch (error) {
      console.log(error)
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-stone-50 p-12 text-center rounded-sm shadow-sm border border-stone-200">
        <h3 className="font-serif text-2xl mb-4 text-ark-dark">Inquiry Received</h3>
        <p className="text-gray-600 mb-6">Thank you for considering ArkHive. Our booking team will review your request and contact you within 24 hours.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-ark-gold font-bold uppercase text-xs tracking-widest hover:underline"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 shadow-xl border-t-4 border-ark-gold">
      <h2 className="font-serif text-3xl text-ark-dark mb-2">Request Booking</h2>
      <p className="text-gray-500 text-sm mb-8">Fill out the form below to check availability and get a quote.</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Full Name</label>
            <input
              type="text" name="name" required
              value={formData.name} onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50"
              placeholder="John Doe"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Email Address</label>
            <input
              type="email" name="email" required
              value={formData.email} onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Event Type</label>
            <select
              name="eventType"
              value={formData.eventType} onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50"
            >
              <option value="Corporate">Corporate Event</option>
              <option value="Wedding">Wedding / Reception</option>
              <option value="Exhibition">Exhibition / Gallery</option>
              <option value="Private Party">Private Party</option>
              <option value="Photo/Video Shoot">Photo / Video Shoot</option>
              <option value="Other">Other (Custom)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Phone Number</label>
            <input
              type="tel" name="phone" required
              value={formData.phone} onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50"
              placeholder="+234..."
            />
          </div>
        </div>

        {/* Conditional Custom Event Input */}
        {isCustomEvent && (
          <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
            <label className="text-xs uppercase tracking-widest text-ark-gold font-semibold">Specify Event Type</label>
            <input
              type="text" name="customEventType" required
              value={formData.customEventType} onChange={handleChange}
              className="w-full border-b border-ark-gold py-2 focus:outline-none transition-colors bg-white/50"
              placeholder="e.g. Pop-up Market"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Preferred Date</label>
            <input
              type="date"
              name="date"
              required
              min={today}
              value={formData.date}
              isDisabled={true}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50 cursor-pointer"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Est. Guests</label>
            <input
              type="number" name="guests" required min="1"
              value={formData.guests} onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50"
              placeholder="150"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest text-gray-500 font-semibold">Additional Details / Requirements</label>
          <textarea
            name="notes" rows={4}
            value={formData.notes} onChange={handleChange}
            className="w-full border border-gray-300 p-3 mt-2 focus:outline-none focus:border-ark-gold transition-colors bg-white/50 text-sm"
            placeholder="Tell us more about your vision, setup needs, or special requests..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-ark-dark text-white py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-ark-gold hover:text-ark-dark transition-all duration-300"
        >
          Submit Inquiry
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
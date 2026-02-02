import { EventItem, BookingRequest, ContactMessage } from '../types';
import { FEATURED_EVENTS } from '../constants';

const EVENTS_KEY = 'arkhive_events';
const BOOKINGS_KEY = 'arkhive_bookings';
const CONTACTS_KEY = 'arkhive_contacts';

// Initialize with default data if empty
export const initStorage = () => {
  if (!localStorage.getItem(EVENTS_KEY)) {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(FEATURED_EVENTS));
  }
  if (!localStorage.getItem(BOOKINGS_KEY)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([]));
  }
};

// Events
export const getEvents = async (): Promise<EventItem[]> => {
  const data = await fetch('https://akrhivebackend-production.up.railway.app//api/event')
  const res = await data.json();
  return res ? res : [];
};

export const saveEvent = async (event: EventItem) => {
  const data = await fetch('https://akrhivebackend-production.up.railway.app//api/event/create_event', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })
  const res = await data.json();
  return res;
};

export const deleteEvent = async (id: string) => {
  const data = await fetch(`https://akrhivebackend-production.up.railway.app//api/event/delete_event/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const res = await data.json();
  return res;
};

// Bookings
export const getBookings = async (): Promise<BookingRequest[]> => {
  const data = await fetch('https://akrhivebackend-production.up.railway.app//api/booking')
  const res = await data.json();
  return res ? res : [];
};

export const saveBooking = async (booking: BookingRequest) => {
  const data = await fetch('https://akrhivebackend-production.up.railway.app//api/booking/create_booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  })
  const res = await data.json();
  return res;
};

export const deleteBooking = async (id: string) => {
  const data = await fetch(`https://akrhivebackend-production.up.railway.app//api/booking/delete_booking/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const res = await data.json();
  return res;
};

export const updateBooking = async (id: string, booking: BookingRequest) => {
  const data = await fetch(`https://akrhivebackend-production.up.railway.app//api/booking/update_booking/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(booking),
  })
  const res = await data.json();
  return res;
};

// Contacts
export const saveContact = (contact: ContactMessage) => {
  const contacts = localStorage.getItem(CONTACTS_KEY);
  const parsedContacts = contacts ? JSON.parse(contacts) : [];
  parsedContacts.push(contact);
  localStorage.setItem(CONTACTS_KEY, JSON.stringify(parsedContacts));
}

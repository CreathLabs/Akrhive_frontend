import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBookings, getEvents, saveEvent, deleteEvent, updateBooking } from '../services/storage';
import { uploadToCloudinary } from '../services/cloudinary';
import { BookingRequest, EventItem } from '../types';
import { Trash2, Plus, Calendar, List, LogOut, X, Check, Archive, Upload } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'bookings' | 'events'>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null);
  const [showModal, setShowModal] = useState(false);

  // New Event Form State
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<EventItem>>({
    title: '',
    date: '',
    category: '',
    description: '',
    price: '',
    image: 'https://picsum.photos/800/600?random=10'
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const bookings = await getBookings()
    const events = await getEvents()
    setBookings(bookings.reverse()); // Show newest first
    setEvents(events);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) return;

    setIsUploading(true);
    let imageUrl = newEvent.image || 'https://picsum.photos/800/600';

    try {
      // Upload image to Cloudinary if a file was selected
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      const eventToAdd: EventItem = {
        id: Date.now().toString(),
        title: newEvent.title!,
        date: newEvent.date!,
        category: newEvent.category || 'General',
        description: newEvent.description || '',
        link: newEvent.link || '',
        price: newEvent.price || 'TBD',
        image: imageUrl
      };

      await saveEvent(eventToAdd);
      setShowAddEvent(false);
      setNewEvent({ title: '', date: '', category: '', description: '', price: '', image: 'https://picsum.photos/800/600?random=11' });
      setImageFile(null);
      setImagePreview('');
      refreshData();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
      refreshData();
    }
  };

  const handleBookingClick = (booking: BookingRequest) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleApproveBooking = async () => {
    if (!selectedBooking) return;

    const updatedBooking = { ...selectedBooking, status: 'confirmed' as const };
    await updateBooking(selectedBooking.id, updatedBooking);
    handleCloseModal();
    refreshData();
  };

  const handleArchiveBooking = async () => {
    if (!selectedBooking) return;

    const updatedBooking = { ...selectedBooking, status: 'archived' as const };
    await updateBooking(selectedBooking.id, updatedBooking);
    handleCloseModal();
    refreshData();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Admin Nav */}
      <div className="bg-ark-dark text-white px-6 py-4 flex justify-between items-center shadow-md">
        <h1 className="font-serif text-xl tracking-wide">ArkHive <span className="text-ark-gold">Admin</span></h1>
        <button onClick={handleLogout} className="text-xs uppercase tracking-widest hover:text-ark-gold flex items-center gap-2">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'bookings' ? 'text-ark-gold border-b-2 border-ark-gold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className="flex items-center gap-2"><List size={16} /> Booking Inquiries</div>
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-3 px-2 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'events' ? 'text-ark-gold border-b-2 border-ark-gold' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className="flex items-center gap-2"><Calendar size={16} /> Manage Events</div>
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          <div className="bg-white shadow-sm rounded-sm overflow-hidden">
            {bookings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No booking inquiries found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-stone-100 text-gray-500 uppercase font-bold text-xs">
                    <tr>
                      <th className="p-4">Date Recv.</th>
                      <th className="p-4">Name</th>
                      <th className="p-4">Event Type</th>
                      <th className="p-4">Req. Date</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.map(b => (
                      <tr
                        key={b.id}
                        onClick={() => handleBookingClick(b)}
                        className="hover:bg-stone-50 transition-colors cursor-pointer"
                      >
                        <td className="p-4 text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-medium">{b.name}</td>
                        <td className="p-4">
                          <span className="bg-ark-gold/10 text-ark-dark px-2 py-1 rounded text-xs font-bold uppercase">
                            {b.eventType}
                          </span>
                        </td>
                        <td className="p-4">{b.date}</td>
                        <td className="p-4">{b.guests}</td>
                        <td className="p-4 text-xs text-gray-500">
                          {b.email}<br />{b.phone}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            b.status === 'archived' ? 'bg-gray-100 text-gray-600' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-xl">Current Events</h3>
              <button
                onClick={() => setShowAddEvent(true)}
                className="bg-ark-dark text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-ark-gold hover:text-ark-dark transition-colors flex items-center gap-2"
              >
                <Plus size={16} /> Add Event
              </button>
            </div>

            {showAddEvent && (
              <div className="bg-white p-6 mb-8 border-l-4 border-ark-gold shadow-md animate-in slide-in-from-top-2">
                <h4 className="font-bold mb-4 uppercase text-xs tracking-widest text-gray-500">New Event Details</h4>
                <form onSubmit={handleAddEvent} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="border p-2" placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                    <input className="border p-2" min={new Date().toISOString().split('T')[0]} type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} required />
                    <input className="border p-2" placeholder="Category (e.g. Art, Tech)" value={newEvent.category} onChange={e => setNewEvent({ ...newEvent, category: e.target.value })} />
                    <input className="border p-2" placeholder="Registration Link" value={newEvent.link} onChange={e => setNewEvent({ ...newEvent, link: e.target.value })} />
                    <input className="border p-2" placeholder="Price (e.g. Free, ₦5000)" value={newEvent.price} onChange={e => setNewEvent({ ...newEvent, price: e.target.value })} />
                  </div>

                  <textarea className="border p-2 w-full" placeholder="Description" rows={3} value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}></textarea>

                  {/* Image Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded p-4">
                    <label className="block text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">
                      Event Image
                    </label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="event-image-upload"
                        />
                        <label
                          htmlFor="event-image-upload"
                          className="cursor-pointer inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors"
                        >
                          <Upload size={16} />
                          {imageFile ? 'Change Image' : 'Upload Image'}
                        </label>
                        {imageFile && (
                          <p className="text-xs text-gray-600 mt-2">
                            Selected: {imageFile.name}
                          </p>
                        )}
                      </div>
                      {imagePreview && (
                        <div className="w-32 h-32 border border-gray-200 rounded overflow-hidden">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddEvent(false);
                        setImageFile(null);
                        setImagePreview('');
                      }}
                      className="px-4 py-2 text-xs uppercase font-bold text-gray-500 hover:text-gray-700"
                      disabled={isUploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-ark-gold text-ark-dark px-6 py-2 text-xs font-bold uppercase hover:bg-ark-dark hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Uploading...
                        </>
                      ) : (
                        'Save Event'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white border border-gray-200 relative group">
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="h-40 overflow-hidden bg-gray-100">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4">
                    <div className="text-ark-gold text-xs font-bold uppercase tracking-widest mb-1">{event.date}</div>
                    <h4 className="font-serif text-lg leading-tight mb-2">{event.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showModal && selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-sm shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-ark-dark text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="font-serif text-2xl mb-2">Booking Details</h3>
                <p className="text-ark-gold text-sm uppercase tracking-widest">
                  ID: {selectedBooking.id}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-ark-gold transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Status:</span>
                <span className={`px-3 py-1 rounded text-xs font-bold uppercase ${selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  selectedBooking.status === 'archived' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                  {selectedBooking.status}
                </span>
              </div>

              {/* Client Information */}
              <div className="border-l-4 border-ark-gold pl-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Client Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-ark-dark">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                    <p className="font-medium text-ark-dark">{selectedBooking.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="font-medium text-ark-dark">{selectedBooking.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                    <p className="font-medium text-ark-dark">{new Date(selectedBooking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="border-l-4 border-ark-gold pl-4">
                <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Event Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Event Type</p>
                    <p className="font-medium text-ark-dark">
                      {selectedBooking.eventType}
                      {selectedBooking.customEventType && ` - ${selectedBooking.customEventType}`}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requested Date</p>
                    <p className="font-medium text-ark-dark">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Expected Guests</p>
                    <p className="font-medium text-ark-dark">{selectedBooking.guests} guests</p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedBooking.notes && (
                <div className="border-l-4 border-ark-gold pl-4">
                  <h4 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-3">Additional Notes</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="bg-stone-50 p-6 flex gap-3 justify-end border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </button>
              {selectedBooking.status !== 'archived' && (
                <button
                  onClick={handleArchiveBooking}
                  className="px-6 py-3 bg-gray-500 text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <Archive size={16} />
                  Archive
                </button>
              )}
              {selectedBooking.status !== 'confirmed' && (
                <button
                  onClick={handleApproveBooking}
                  className="px-6 py-3 bg-ark-gold text-ark-dark text-xs font-bold uppercase tracking-widest hover:bg-ark-dark hover:text-white transition-colors flex items-center gap-2"
                >
                  <Check size={16} />
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
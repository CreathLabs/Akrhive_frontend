import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import BookingForm from './components/BookingForm';
import EventCalendar from './components/EventCalendar';
// import Concierge from './components/Concierge';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { AMENITIES, FEATURED_EVENTS } from './constants';
import { ArrowRight, MapPin, Download } from 'lucide-react';
import { initStorage, getEvents } from './services/storage';
import spaceImage from './assets/creathImage-104.jpg';
import { MapContainer, TileLayer, Marker, Popup,  useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Ensure Leaflet's default icon URLs are correct when bundled (Vite/webpack)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const App: React.FC = () => {
  const [eventsList, setEventsList] = useState(FEATURED_EVENTS);
  const location = useLocation();

  // Initialize simulated database
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await getEvents()
        setEventsList(events)
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEventsList(FEATURED_EVENTS)
      }
    }
    fetchEvents()
  }, [location.pathname]); // Reload when path changes

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith('/admin');
  // Contact map coordinates (update these to change the marker location)
  const CONTACT_LAT = 6.453293488988106
  const CONTACT_LON = 3.5555847825554556

  // Ensure Leaflet map sizes correctly on first mount and when the window resizes
  const MapResizeFix: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
    const map = useMap()
    React.useEffect(() => {
      const resize = () => {
        setTimeout(() => {
          try {
            map.invalidateSize()
            map.setView([lat, lon], map.getZoom())
          } catch (e) {
            // map might not be ready yet
          }
        }, 50)
      }

      resize()
      window.addEventListener('resize', resize)
      return () => window.removeEventListener('resize', resize)
    }, [map, lat, lon])

    return null
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 selection:bg-ark-gold selection:text-white">
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* HOME ROUTE */}
          <Route path="/" element={
            <>
              <Hero />

              {/* Introduction */}
              <section className="py-24 bg-white px-4">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="font-serif text-3xl md:text-4xl text-ark-dark mb-6">Not just a venue — an experience infrastructure.</h2>
                  <p className="text-gray-500 text-lg leading-relaxed mb-8">
                    ArkHive is a digital gateway for discovering space, checking availability, and booking events. We support both our own curated experiences and your private vision.
                  </p>
                  <Link to="/space" className="text-ark-gold font-bold uppercase text-xs tracking-widest hover:text-ark-dark transition-colors">
                    Explore the space &rarr;
                  </Link>
                </div>
              </section>

              {/* Video Section */}
              <section className="bg-black py-20">
                <div className="max-w-5xl mx-auto px-4">
                  <h2 className="text-white text-center font-serif text-2xl mb-8">Experience ArkHive</h2>
                  <div className="relative w-full pb-[56.25%]">
                    <iframe
                      className="absolute top-0 left-0 w-full h-full border-0"
                      src="https://www.youtube.com/embed/aE_5XVBbKjY?si=0W8LUGBuyNK2clec"
                      title="ArkHive Experience"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <iframe className="absolute top-0 left-0 w-full h-full border-0" src="https://www.youtube.com/embed/aE_5XVBbKjY?si=0W8LUGBuyNK2clec" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                  </div>
                </div>
              </section>

              {/* Featured Section */}
              <section className="py-20 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <div className="text-ark-gold text-xs font-bold uppercase tracking-widest mb-2">What's On</div>
                      <h2 className="font-serif text-3xl md:text-4xl text-ark-dark">Upcoming Experiences</h2>
                    </div>
                    <Link to="/events" className="hidden md:block text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-ark-gold hover:border-ark-gold transition-colors">View All Events</Link>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    {eventsList.slice(0, 3).map(event => (
                      <div key={event.id} className="group cursor-pointer">
                        <div className="h-80 overflow-hidden mb-6 relative">
                          <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        </div>
                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{event.date}</div>
                        <h3 className="font-serif text-xl mb-2 group-hover:text-ark-gold transition-colors">{event.title}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="py-24 bg-ark-dark text-white text-center px-4">
                <h2 className="font-serif text-3xl md:text-5xl mb-6">Ready to host your event?</h2>
                <p className="text-gray-400 mb-10 max-w-xl mx-auto">Check availability instantly or get in touch with our team for a personalized tour.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/booking" className="bg-ark-gold text-ark-dark px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-white transition-colors">
                    Book The Space
                  </Link>
                  <Link to="/contact" className="border border-white text-white px-8 py-4 uppercase text-xs font-bold tracking-widest hover:bg-white hover:text-ark-dark transition-colors">
                    Contact Us
                  </Link>
                </div>
              </section>
            </>
          } />

          {/* SPACE ROUTE */}
          <Route path="/space" element={
            <div className="min-h-screen bg-stone-50">
              {/* Space Hero */}
              <div className="h-[50vh] bg-ark-dark relative flex items-center justify-center">
                <div className={`absolute inset-0 bg-cover bg-center opacity-40 grayscale`}
                  style={{ backgroundImage: `url(${spaceImage})` }}
                ></div>
                <div className="relative z-10 text-center text-white px-4">
                  <h1 className="font-serif text-5xl mb-4">The Space</h1>
                  <p className="text-xl font-light tracking-wide max-w-2xl mx-auto">Designed for comfort, performance, and flexibility.</p>
                </div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Specs Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20 text-center">
                  <div className="p-8 bg-white border border-gray-100">
                    <h3 className="text-ark-gold text-4xl font-serif mb-2">750</h3>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Square Meters</p>
                  </div>
                  <div className="p-8 bg-white border border-gray-100">
                    <h3 className="text-ark-gold text-4xl font-serif mb-2">300+</h3>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Seating Capacity</p>
                  </div>
                  <div className="p-8 bg-white border border-gray-100">
                    <h3 className="text-ark-gold text-4xl font-serif mb-2">Custom</h3>
                    <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Event setup option</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-20">
                  <h2 className="font-serif text-3xl mb-12 text-center">Premium Amenities</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12">
                    {AMENITIES.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="text-ark-gold bg-stone-100 p-3 rounded-full">{item.icon}</div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floor Plan CTA */}
                <div className="bg-ark-dark text-white p-12 text-center rounded-sm">
                  <h2 className="font-serif text-3xl mb-4">Plan Your Layout</h2>
                  <p className="text-gray-400 mb-8 max-w-xl mx-auto">Download our detailed floor plan and technical specifications to share with your event planner.</p>
                  <button className="inline-flex items-center gap-2 border border-ark-gold text-ark-gold px-6 py-3 uppercase text-xs font-bold tracking-widest hover:bg-ark-gold hover:text-ark-dark transition-colors">
                    <Download size={16} /> Download Floor Plan
                  </button>
                </div>
              </div>
            </div>
          } />

          {/* EVENTS ROUTE */}
          <Route path="/events" element={
            <div className="min-h-screen bg-stone-50 py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="font-serif text-4xl text-ark-dark mb-12 text-center">Upcoming Events</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                  {eventsList.map(event => (
                    <div key={event.id} className="bg-white group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
                      <div className="h-64 overflow-hidden relative">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-widest">
                          {event.category}
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="text-ark-gold font-bold text-xs uppercase tracking-widest mb-2">{event.date}</div>
                        <h3 className="font-serif text-2xl mb-3 group-hover:text-ark-gold transition-colors">{event.title}</h3>
                        <p className="text-gray-500 mb-6 text-sm leading-relaxed">{event.description}</p>
                        <div className="flex justify-between items-center border-t border-gray-100 pt-4">
                          <span className="font-bold text-sm">{event.price}</span>
                          <button className="text-xs uppercase tracking-widest font-bold flex items-center gap-2 hover:text-ark-gold transition-colors" onClick={() => {
                            window.open(event.link, "_blank")
                          }}>
                            Register <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-12 text-center border border-gray-200">
                  <h2 className="font-serif text-3xl mb-4">Calendar of Events</h2>
                  <p className="text-gray-500 mb-8">View availability and public events.</p>
                  <div className="max-w-3xl mx-auto">
                    <EventCalendar />
                  </div>
                </div>
              </div>
            </div>
          } />

          {/* BOOKING ROUTE */}
          <Route path="/booking" element={
            <div className="min-h-screen bg-stone-50 py-12 md:py-20 px-4">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                  <h1 className="font-serif text-4xl text-ark-dark mb-4">Start Your Journey</h1>
                  <p className="text-gray-600">We invite you to bring your vision to life at ArkHive.</p>
                </div>
                <EventCalendar />
                <BookingForm />
              </div>
            </div>
          } />

          {/* CONTACT ROUTE */}
          <Route path="/contact" element={
            <div className="min-h-screen bg-stone-50 py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 gap-12 bg-white shadow-xl overflow-hidden">
                  <div className="p-12 bg-ark-dark text-white">
                    <h2 className="font-serif text-3xl mb-8">Get in Touch</h2>
                    <div className="space-y-8">
                      <div>
                        <h4 className="text-ark-gold text-sm font-bold uppercase tracking-widest mb-2">Visit Us</h4>
                        <p className="text-gray-300 leading-relaxed">La Ciudad Mall<br />Km 12 Lekki-Epe Express Way,<br />Ikota, Lagos.</p>
                      </div>
                      <div>
                        <h4 className="text-ark-gold text-sm font-bold uppercase tracking-widest mb-2">Inquiries</h4>
                        <p className="text-gray-300"><a href="mailto:Info@arkhive.ng">Info@arkhive.ng</a><br />0814 836 9164, 0904 0942 800 </p>
                      </div>
                      <div>
                        <h4 className="text-ark-gold text-sm font-bold uppercase tracking-widest mb-2">Opening Hours</h4>
                        <p className="text-gray-300">Mon - Sat: 9:00 AM - 6:00 PM<br />Sun: By Appointment Only</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-200 min-h-[400px] relative overflow-hidden">
                    {/* Map fills the container; pin overlays centered */}
                    <MapContainer className="absolute inset-0 w-full h-full z-0" center={[CONTACT_LAT, CONTACT_LON]} zoom={13} scrollWheelZoom={false}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[CONTACT_LAT, CONTACT_LON]}>
                        <Popup>
                          <div className="bg-white text-ark-dark p-3 rounded-sm shadow-md w-56">
                            <h4 className="font-serif text-lg mb-1">ArkHive — Ikota</h4>
                            <p className="text-sm text-gray-500 mb-3">La Ciudad Mall, Km 12 Lekki-Epe Express Way</p>
                            <a
                              className="inline-block w-full text-center bg-black text-white px-3 py-2 text-xs font-bold uppercase rounded-sm hover:opacity-90"
                              href={`https://www.google.com/maps/search/?api=1&query=${CONTACT_LAT},${CONTACT_LON}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Open in Google Maps
                            </a>
                          </div>
                        </Popup>
                      </Marker>
                      <MapResizeFix lat={CONTACT_LAT} lon={CONTACT_LON} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          } />

          {/* ADMIN ROUTES */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

        </Routes>
      </main>

      {/* {!isAdminRoute && <Concierge />} */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default App;
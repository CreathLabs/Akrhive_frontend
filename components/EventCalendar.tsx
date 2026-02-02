import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBookings, getEvents } from '../services/storage';

const EventCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const bookings = await getBookings();
        const events = await getEvents();

        const filteredBookings = bookings.filter(b => b.status === 'confirmed');

        const bookingDates = filteredBookings.map(b => b.date);
        const eventDates = events.map(e => e.date);

        const allDates = Array.from(new Set([...bookingDates, ...eventDates]));
        setUnavailableDates(allDates);
      } catch (error) {
        console.error('Failed to fetch unavailable dates:', error);
        // Handle error appropriately
      }
    };

    fetchUnavailableDates();
  }, [currentMonth]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  const handleDateClick = (day: number) => {
    const year = currentMonth.getFullYear();
    const monthIndex = currentMonth.getMonth();

    // Check if date is in the past
    const clickedDate = new Date(year, monthIndex, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate < today) return;

    const month = (monthIndex + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    const dateStr = `${year}-${month}-${dayStr}`;

    if (!unavailableDates.includes(dateStr)) {
      navigate(`/booking?date=${dateStr}`);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Current date for comparison in render loop
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl font-medium">{monthName}</h3>
        <div className="flex gap-2">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <div key={day} className="text-xs font-bold text-gray-400">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-10"></div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const year = currentMonth.getFullYear();
          const monthIndex = currentMonth.getMonth();
          const month = (monthIndex + 1).toString().padStart(2, '0');
          const dayStr = day.toString().padStart(2, '0');
          const dateString = `${year}-${month}-${dayStr}`;

          const dateObj = new Date(year, monthIndex, day);
          const isPast = dateObj < today;
          const isUnavailable = unavailableDates.includes(dateString);
          const isDisabled = isPast || isUnavailable;

          return (
            <div
              key={day}
              onClick={() => !isDisabled && handleDateClick(day)}
              className={`h-10 flex items-center justify-center text-sm rounded-sm transition-colors
                ${isDisabled
                  ? 'bg-stone-200 text-stone-500 line-through decoration-stone-500 cursor-not-allowed'
                  : 'hover:bg-ark-gold hover:text-white cursor-pointer font-medium text-gray-700'
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-gray-300"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-stone-200"></div>
          <span className="text-gray-500">Unavailable / Past</span>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
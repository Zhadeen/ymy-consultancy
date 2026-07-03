import { createContext, useContext, useState } from 'react';
import * as bookingService from '../application/services/bookingService';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    guideId: null,
    guideName: '',
    date: '',
    tourType: 'full',
    guests: 1,
    totalPrice: 0,
    specialRequests: '',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState(null);

  const updateBooking = (updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const createPendingBooking = async (bookingData) => {
    return bookingService.createPendingBooking(bookingData);
  };

  const savePaidBooking = async (metadata) => {
    try {
      const finalBooking = await bookingService.savePaidBooking(metadata);
      setConfirmed(finalBooking);
      setError(null);
      return finalBooking;
    } catch (err) {
      console.error('Error saving paid booking:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetBooking = () => {
    setBooking({ guideId: null, guideName: '', date: '', tourType: 'full', guests: 1, totalPrice: 0, specialRequests: '' });
    setConfirmed(null);
  };

  return (
    <BookingContext.Provider value={{ booking, confirmed, error, updateBooking, createPendingBooking, savePaidBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}


export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

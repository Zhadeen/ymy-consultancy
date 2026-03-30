import { createContext, useContext, useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

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

  const createBookingRequest = async (bookingData) => {
    try {
      // Ensure numeric fields are numbers
      const finalBooking = {
        ...bookingData,
        guests: parseInt(bookingData.guests),
        totalPrice: parseFloat(bookingData.totalPrice),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), finalBooking);
      setConfirmed({ id: docRef.id, ...finalBooking });
      setError(null);
      return finalBooking;
    } catch (err) {
      console.error('Error creating booking request in Firestore:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetBooking = () => {
    setBooking({ guideId: null, guideName: '', date: '', tourType: 'full', guests: 1, totalPrice: 0, specialRequests: '' });
    setConfirmed(null);
  };

  return (
    <BookingContext.Provider value={{ booking, confirmed, error, updateBooking, createBookingRequest, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

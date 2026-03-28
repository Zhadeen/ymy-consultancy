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

  const confirmBooking = async (touristDetails) => {
    const ref = `YMY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const confirmation = {
      ...booking,
      ...touristDetails,
      reference: ref,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'bookings'), confirmation);
      setConfirmed(confirmation);
      setError(null);
      return confirmation;
    } catch (err) {
      console.error('Error saving booking to Firestore:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetBooking = () => {
    setBooking({ guideId: null, guideName: '', date: '', tourType: 'full', guests: 1, totalPrice: 0, specialRequests: '' });
    setConfirmed(null);
  };

  return (
    <BookingContext.Provider value={{ booking, confirmed, error, updateBooking, confirmBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

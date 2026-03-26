import { createContext, useContext, useState } from 'react';

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

  const updateBooking = (updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const confirmBooking = (touristDetails) => {
    const ref = `YMY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    const confirmation = {
      ...booking,
      ...touristDetails,
      reference: ref,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    };
    setConfirmed(confirmation);
    return confirmation;
  };

  const resetBooking = () => {
    setBooking({ guideId: null, guideName: '', date: '', tourType: 'full', guests: 1, totalPrice: 0, specialRequests: '' });
    setConfirmed(null);
  };

  return (
    <BookingContext.Provider value={{ booking, confirmed, updateBooking, confirmBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

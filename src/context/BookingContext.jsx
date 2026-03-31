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

  const generateReference = () => {
    return 'YMY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const createBookingRequest = async (bookingData) => {
    // In the new marketplace model, this step sends the visitor to Stripe.
    // We update the local state to prepare for payment.
    setBooking(prev => ({ ...prev, ...bookingData }));
  };

  const sendAutomatedBookingMessage = async (metadata) => {
    try {
      const { userId, guideId, visitorName, guideName, tourType, bookingDate, guidePhoto } = metadata;
      if (!userId || !guideId) return;

      const chatId = [userId, guideId].sort().join('_');
      const text = `Hi ${guideName}! I just booked you for a ${tourType} experience on ${new Date(bookingDate).toLocaleDateString()}. Looking forward to meeting you!`;

      // 1. Add the message to the subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: userId,
        timestamp: new Date(),
        read: false,
        isSystem: true // Mark as automated
      });

      // 2. Update the chat main document (metadata)
      await setDoc(doc(db, 'chats', chatId), {
        participants: [userId, guideId],
        lastMessage: text,
        updatedAt: new Date(),
        [userId]: { name: visitorName, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
        [guideId]: { name: guideName, photo: guidePhoto || '' }
      }, { merge: true });

      console.log(`[Notification] Automated message sent for chatId: ${chatId}`);
    } catch (err) {
      console.error('Error sending automated booking message:', err);
    }
  };

  const savePaidBooking = async (metadata) => {
    try {
      const reference = generateReference();
      const finalBooking = {
        guideId: metadata.guideId,
        guideName: metadata.guideName,
        guidePhoto: metadata.guidePhoto || '',
        visitorId: metadata.userId,
        visitorName: metadata.visitorName,
        visitorEmail: metadata.visitorEmail,
        date: metadata.bookingDate,
        tourType: metadata.tourType,
        guests: parseInt(metadata.guests),
        totalPrice: parseFloat(metadata.totalPrice),
        visitPurpose: metadata.visitPurpose || '',
        localExperience: metadata.localExperience || '',
        specialRequests: metadata.specialRequests || '',
        reference,
        status: 'upcoming',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), finalBooking);
      
      // Trigger automated notification to guide
      await sendAutomatedBookingMessage(metadata);

      setConfirmed({ id: docRef.id, ...finalBooking });
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
    <BookingContext.Provider value={{ booking, confirmed, error, updateBooking, createBookingRequest, savePaidBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}


export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
